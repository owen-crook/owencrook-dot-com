'use client';

import { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { Box, Button, Loader, Stack, Title } from '@mantine/core';
import BoardGameTrackerEditableGameData from '@/components/BoardGameTrackerScoreCardUpload/BoardGameTrackerEditableGameMetadata';
import BoardGameTrackerEditableTable from '@/components/BoardGameTrackerScoreCardUpload/BoardGameTrackerEditableTable';
import BoardGameTrackerImageUploadForm from '@/components/BoardGameTrackerScoreCardUpload/BoardGameTrackerImageUploadForm';
import {
  GameMetadata,
  PlayerScore,
  SupportedGames,
} from '@/components/BoardGameTrackerScoreCardUpload/types';
import {
  patchBoardGameTrackerUpdateScoreCard,
  postBoardGameTrackerParseScoreCard,
  UpdateScoreCardProps,
} from '@/lib/actions/board-game-tracker';

interface BoardGameTrackerClientPageProps {
  token: string;
  isAdmin: boolean;
  userEmail: string;
}

export default function BoardGameTrackerClientPage({ token }: BoardGameTrackerClientPageProps) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [parsedScorecardResults, setParsedScorecardresults] = useState<any>(null);
  const [parsedGameData, setParsedGameData] = useState<GameMetadata | undefined>(undefined);
  const [parsedPlayerScores, setParsedPlayerScores] = useState<PlayerScore[]>([]);
  const [gameDataEdited, setGameDataEdited] = useState(false);
  const [updatedGameData, setUpdatedGameData] = useState<GameMetadata | undefined>(undefined);
  const [playerScoresEdited, setPlayerScoresEdited] = useState(false);
  const [updatedPlayerScores, setUpdatedPlayerScores] = useState<PlayerScore[]>([]);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

  // make sure upon getting data from the API we correctly convert the scores to valid objects
  useEffect(() => {
    if (typeof parsedScorecardResults !== 'object' || parsedScorecardResults === null) {
      return;
    }
    //handle game data
    var gameData: GameMetadata | undefined;
    // id should be a uuid and always present, not rendered
    if ('id' in parsedScorecardResults) {
      gameData = {
        id: String(parsedScorecardResults['id']),
      };
      // game should be a lowercase SupportedGame, will be rendered as drop down
      if ('game' in parsedScorecardResults) {
        const supportedGameType = Object.values(SupportedGames).find((enumValue) => {
          return enumValue.toLowerCase() === parsedScorecardResults['game'].toLowerCase();
        });
        if (supportedGameType) {
          gameData['game'] = supportedGameType;
        }
      }
      // date should be a string with the format 2025-07-12T00:00:00Z, will be rendered as datepicker
      if ('date' in parsedScorecardResults) {
        // lazily assume API is right format, but still make sure valid date
        const parsedDate = new Date(parsedScorecardResults['date']);
        if (!isNaN(parsedDate.getTime())) {
          gameData['date'] = parsedDate;
        }
      }
      // is_completed should be a boolean, will be rendered as a slider
      if ('is_completed' in parsedScorecardResults) {
        if (typeof parsedScorecardResults['is_completed'] === 'boolean') {
          gameData['isCompleted'] = parsedScorecardResults['is_completed'];
        }
      }
      // location should be a string, will be rendered as text input
      if ('location' in parsedScorecardResults) {
        gameData['location'] = parsedScorecardResults['location'];
      }
    } else {
      gameData = undefined;
    }
    setParsedGameData(gameData);
    setUpdatedGameData(gameData);
    // handle player scores
    if (
      'player_scores' in parsedScorecardResults &&
      Array.isArray(parsedScorecardResults['player_scores'])
    ) {
      setParsedPlayerScores(
        parsedScorecardResults['player_scores'].map((item) => {
          return item as PlayerScore;
        })
      );
    }
  }, [parsedScorecardResults]);

  // make sure that if either game or player data is edited, the save button state is updated
  useEffect(() => {
    if (gameDataEdited || playerScoresEdited) {
      setSaveButtonEnabled(true);
    } else {
      setSaveButtonEnabled(false);
    }
  }, [gameDataEdited, playerScoresEdited]);

  const handleGameDataEdited = (edited: boolean, editedGameData: GameMetadata) => {
    if (!edited || isEqual(editedGameData, parsedGameData)) {
      setGameDataEdited(false);
      return;
    }
    setUpdatedGameData(editedGameData);
    setGameDataEdited(true);
  };

  const handlePlayerScoresEdited = (edited: boolean, editedPlayerScores: PlayerScore[]) => {
    if (
      !edited ||
      isEqual(editedPlayerScores, parsedPlayerScores) ||
      editedPlayerScores.length === 0
    ) {
      setPlayerScoresEdited(false);
      return;
    }
    setUpdatedPlayerScores(editedPlayerScores);
    setPlayerScoresEdited(true);
  };

  const onFormSubmission = async (file: File, date: Date, game: SupportedGames) => {
    setShowForm(false);
    setLoading(true);
    const data = await postBoardGameTrackerParseScoreCard({
      token: token,
      file: file,
      date: date,
      game: game.valueOf().toLowerCase(),
    });
    if (data.success) {
      setParsedScorecardresults(data.data);
    } else {
      // TODO: better hanle these errors
      console.error(data.error);
    }
    setLoading(false);
  };

  const onClickSave = async () => {
    setLoading(true);
    if (!updatedGameData || updatedGameData.id === 'unknown') {
      console.error('No valid game data to save');
      setLoading(false);
      return;
    }
    if (!parsedGameData || parsedGameData.id === 'unknown') {
      console.error('No valid parsed game data to compare against');
      setLoading(false);
      return;
    }
    var edited = false;
    var d: UpdateScoreCardProps = {
      token: token,
      documentId: updatedGameData.id,
    };
    if (updatedGameData.game !== undefined && updatedGameData.game !== parsedGameData.game) {
      d['game'] = updatedGameData.game;
      edited = true;
    }
    if (updatedGameData.date !== undefined && updatedGameData.date !== parsedGameData.date) {
      d['date'] = updatedGameData.date;
      edited = true;
    }
    if (
      updatedGameData.isCompleted !== undefined &&
      updatedGameData.isCompleted !== parsedGameData.isCompleted
    ) {
      d['isCompleted'] = updatedGameData.isCompleted;
      edited = true;
    }
    if (
      updatedGameData.location !== undefined &&
      updatedGameData.location !== parsedGameData.location
    ) {
      d['location'] = updatedGameData.location;
      edited = true;
    }
    if (
      updatedPlayerScores !== undefined &&
      updatedPlayerScores.length > 0 &&
      !isEqual(updatedPlayerScores, parsedPlayerScores)
    ) {
      d['playerScores'] = updatedPlayerScores;
      edited = true;
    }

    if (!edited) {
      setLoading(false);
      return;
    }

    const data = await patchBoardGameTrackerUpdateScoreCard(d);
    if (!data.success) {
      // TODO: better hanle these errors
      console.error(data.error);
    } else {
      // update state to reflect the newly saved data
      var newParsedScorecardResults = {
        ...updatedGameData,
        is_completed: updatedGameData.isCompleted || false,
        player_scores:
          updatedPlayerScores && updatedPlayerScores.length > 0
            ? updatedPlayerScores
            : parsedPlayerScores,
      };
      setParsedScorecardresults(newParsedScorecardResults);
      // reset the edited state
      setGameDataEdited(false);
      setPlayerScoresEdited(false);
    }
    setLoading(false);
  };

  return (
    <Box
      p={{ base: 8, sm: 16, md: 24 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
      }}
    >
      <Title order={2} pb={{ base: 8, sm: 16, md: 24 }}>
        Board Game Score Tracker
      </Title>
      <Stack align="center">
        <BoardGameTrackerImageUploadForm
          loading={loading}
          showForm={showForm}
          onFormSubmission={onFormSubmission}
        />
      </Stack>
      {parsedScorecardResults && parsedGameData && (
        <Stack align="center" w="100%" maw={750} pb={{ base: 8, sm: 16, md: 24 }}>
          <BoardGameTrackerEditableGameData
            gameData={parsedGameData}
            handleGameDataEdited={handleGameDataEdited}
          />
          <BoardGameTrackerEditableTable
            playerScores={parsedPlayerScores}
            handlePlayerScoresEdited={handlePlayerScoresEdited}
          />
          <Button disabled={!saveButtonEnabled} onClick={onClickSave}>
            Save Changes
          </Button>
        </Stack>
      )}
      {loading && <Loader size="lg" />}
    </Box>
  );
}
