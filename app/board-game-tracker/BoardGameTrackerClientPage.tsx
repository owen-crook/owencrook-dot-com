'use client';

import { useState, useEffect } from 'react';
import { Box, Loader, Stack, Title } from '@mantine/core';
import isEqual from 'lodash/isEqual';
import { SupportedGames, PlayerScore } from '@/components/BoardGameTrackerScoreCardUpload/types';
import BoardGameTrackerImageUploadForm from '@/components/BoardGameTrackerScoreCardUpload/BoardGameTrackerImageUploadForm';
import BoardGameTrackerEditableTable from '@/components/BoardGameTrackerScoreCardUpload/BoardGameTrackerEditableTable';
import { postBoardGameTrackerParseScoreCard, patchBoardGameTrackerUpdateScoreCard } from '@/lib/actions/board-game-tracker';

interface BoardGameTrackerClientPageProps {
  token: string;
  isAdmin: boolean;
  userEmail: string;
}

export default function BoardGameTrackerClientPage({ token }: BoardGameTrackerClientPageProps) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [parsedScorecardResults, setParsedScorecardresults] = useState<any>(null)
  const [parsedPlayerScores, setParsedPlayerScores] = useState<PlayerScore[]>([])
  const [gameDataEdited, setGameDataEdited] = useState(false)
  const [playerScoresEdited, setPlayerScoresEdited] = useState(false)
  const [updatedPlayerScores, setUpdatedPlayerScores] = useState<PlayerScore[]>([])
  const [showSaveButton, setShowSaveButton] = useState(false)
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false)

  // make sure upon getting data from the API we correctly convert the scores to valid objects
  useEffect(() => {
    if (typeof parsedScorecardResults === "object" &&
      parsedScorecardResults !== null &&
      'player_scores' in parsedScorecardResults &&
      Array.isArray(parsedScorecardResults['player_scores'])) {
      setParsedPlayerScores(
        parsedScorecardResults['player_scores'].map((item) => {
          return item as PlayerScore
        })
      )
    }

  }, [parsedScorecardResults])

  // make sure that if either game or player data is edited, the save button state is updated
  useEffect(() => {
    if (gameDataEdited || playerScoresEdited) {
      setSaveButtonEnabled(true)
    } else {
      setSaveButtonEnabled(false)
    }
  }, [gameDataEdited, playerScoresEdited])

  const handleGameDataEdited = (edited: boolean, data: any) => { }

  const handlePlayerScoresEdited = (edited: boolean, editedPlayerScores: PlayerScore[]) => {
    if (!edited || isEqual(editedPlayerScores, parsedPlayerScores) || editedPlayerScores.length === 0) {
      return
    }
    setUpdatedPlayerScores(editedPlayerScores)
    setPlayerScoresEdited(true)
  }

  const onFormSubmission = async (file: File, date: Date, game: SupportedGames) => {
    setShowForm(false)
    setLoading(true)
    const data = await postBoardGameTrackerParseScoreCard({ token: token, file: file, date: date, game: game.valueOf().toLowerCase() })
    if (data.success) {
      setParsedScorecardresults(data.data)
      console.log(data.data)
    } else {
      // TODO: better hanle these errors
      console.error(data.error)
    }
    setLoading(false)
  };

  const onClickSave = async () => {

  }

  // need to display the main game metadata and allow relevant parts to be edited
  // need to know when the data has been edited / have a handle for that -> things can be edited either at the game metadata or at the player score layer
  // need to submit the edits to the API -> server side function



  return (
    <Box
      p={{ base: 8, sm: 16, md: 24 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center'
      }}
    >
      <Title
        order={2}
        pb={{ base: 8, sm: 16, md: 24 }}
      >
        Board Game Score Tracker
      </Title>
      <Stack align='center'>
        <BoardGameTrackerImageUploadForm
          loading={loading}
          showForm={showForm}
          onFormSubmission={onFormSubmission}
        />
      </Stack>
      {parsedScorecardResults && (
        <BoardGameTrackerEditableTable
          playerScores={parsedPlayerScores}
          handlePlayerScoresEdited={handlePlayerScoresEdited}
        />
      )}
      {loading && (<Loader size="lg" />)}
    </Box>
  );
}