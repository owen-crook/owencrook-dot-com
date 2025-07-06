"use client"

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { useState } from "react";
import { Button, Collapse, FileInput, Paper, NativeSelect, Stack, Title } from "@mantine/core";
import { DatePickerInput } from '@mantine/dates';
import { SupportedGames } from "./types"

interface BoardGameTrackerImageUploadFormProps {
  showForm: boolean
  loading: boolean
  onFormSubmission: (file: File, date: Date, game: SupportedGames) => void
}

export default function BoardGameTrackerImageUploadForm({ showForm, onFormSubmission, loading }: BoardGameTrackerImageUploadFormProps) {
  const [selectedGame, setSelectedGame] = useState<SupportedGames>(SupportedGames.WYRMSPAN);
  const [date, setDate] = useState<Date | null>(new Date());
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file || !date || !selectedGame) {
      return;
    }
    onFormSubmission(file, date, selectedGame)
  }

  return (
    <Collapse in={showForm}>
      <Paper maw={300} shadow="lg" p="md" radius="md" withBorder >
        <Stack gap="lg">
          <Title order={3}>Upload Scorecard</Title>
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              {/* Game Selection */}
              <NativeSelect
                label="Select a game"
                data={Object.values(SupportedGames)}
                value={selectedGame}
                onChange={e => {
                  const _value = e.currentTarget.value
                  if (_value != null) {
                    setSelectedGame(_value as SupportedGames)
                  }
                }}
              />

              {/* Date Picker */}
              <DatePickerInput
                label="Game date"
                value={date}
                onChange={value => setDate(value ? new Date(value) : null)}
                valueFormat="YYYY-MM-DD"
                firstDayOfWeek={0}
                maxDate={new Date()}
                popoverProps={{ position: 'bottom' }}
                hideOutsideDates
                required
              />

              {/* File Input */}
              <FileInput
                label="Scorecard image"
                placeholder="Click to upload image"
                accept="image/png,image/jpeg"
                value={file}
                onChange={setFile}
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!file || !date || !selectedGame || loading}
                loading={loading}
              >
                Parse Scorecard
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Collapse>
  )
}