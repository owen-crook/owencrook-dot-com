'use client'
import { Paper, Text } from "@mantine/core"
import { GameMetadata } from "./types"


interface BoardGameTrackerEditableGameDataProps {
  gameData: GameMetadata
  handleGameDataEdited: (edited: boolean, editedGameData: GameMetadata) => void
}

export default function BoardGameTrackerEditableGameData({ gameData, handleGameDataEdited }: BoardGameTrackerEditableGameDataProps) {
  return (
    <Paper w="100%" maw={750} shadow="lg" p="md" radius="md" withBorder>
      <Text size="md" fw={500} mb="sm">Game Metadata</Text>
      <Text>{gameData.id}</Text>
      <Text>{String(gameData.date)}</Text>
      <Text>{String(gameData.location)}</Text>
      <Text>{String(gameData.isCompleted)}</Text>
      <Text>{String(gameData.game)}</Text>
    </Paper>
  )
}