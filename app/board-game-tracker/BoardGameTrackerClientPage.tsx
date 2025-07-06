'use client';

import { useState, useEffect } from 'react';
import { Box, Loader, Stack, Title } from '@mantine/core';
import { SupportedGames, PlayerScore } from '@/components/BoardGameTrackerScoreCardUpload/types';
import BoardGameTrackerImageUploadForm from '@/components/BoardGameTrackerScoreCardUpload/BoardGameTrackerImageUploadForm';
import BoardGameTrackerEditableTable from '@/components/BoardGameTrackerScoreCardUpload/BoardGameTrackerEditableTable';
import { postBoardGameTrackerParseScoreCard } from '@/lib/actions/board-game-tracker';

interface BoardGameTrackerClientPageProps {
  token: string;
  isAdmin: boolean;
  userEmail: string; // Or other user data you need on the client
}

export default function BoardGameTrackerClientPage({ token }: BoardGameTrackerClientPageProps) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [parsedScorecardResults, setParsedScorecardresults] = useState<any>(null)
  const [parsedScorecardResultsAsPlayerScores, setParsedScorecardResultsAsPlayerScores] = useState<PlayerScore[]>([])

  useEffect(() => {
    if (typeof parsedScorecardResults === "object" &&
      parsedScorecardResults !== null &&
      'player_scores' in parsedScorecardResults &&
      Array.isArray(parsedScorecardResults['player_scores'])) {
      setParsedScorecardResultsAsPlayerScores(
        parsedScorecardResults['player_scores'].map((item) => {
          return item as PlayerScore
        })
      )
    }

  }, [parsedScorecardResults])


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
          playerScores={parsedScorecardResultsAsPlayerScores}
        />
      )}
      {loading && (<Loader size="lg" />)}
    </Box>
  );
}