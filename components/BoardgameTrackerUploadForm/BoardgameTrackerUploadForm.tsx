'use client';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import dayjs from 'dayjs';
import { useState } from 'react';
import { getSession } from 'next-auth/react';
import { Box, Button, Code, FileInput, Group, Loader, Select, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

enum SupportedGames {
  WYRMSPAN = 'Wyrmspan',
  WINGSPAN = 'Wingspan',
}

export default function BoardGameTrackerUploadForm() {
  const [selectedGame, setSelectedGame] = useState<SupportedGames>(SupportedGames.WYRMSPAN);
  const [date, setDate] = useState<string | Date | null>(new Date());
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [parsedResult, setParsedResult] = useState<any>(null); // State to store parsed JSON
  const [errorWhileParsing, setErrorWhileParsing] = useState<string | null>(null); // State for error messages

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || !date || !selectedGame) {
      return;
    }

    setLoading(true);
    try {
      const session = await getSession();
      const token = (session as { idToken?: string })?.idToken;

      if (!token) {
        return;
      }

      const game = selectedGame.valueOf().toLowerCase();

      const formData = new FormData();
      formData.append('date', dayjs(date).format('YYYY-MM-DD'));
      formData.append('image', file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/board-game-tracker/parse-score-card/${game}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`, // 🔐 secure your Go API with this
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setParsedResult(data); // Store the successful data
        console.log(data);
      } else {
        const err = await response.json();
        const errorMessage = `Error: ${err.error || 'Unknown'}`;
        console.error('Upload failed:', errorMessage, err);
        setErrorWhileParsing(errorMessage); // Store the error message
      }
    } catch (err) {
      console.error('Error during upload:', err);
      setErrorWhileParsing('Something went wrong during the upload. Check console for details.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Group wrap="nowrap">
          {/* Select */}
          <Select
            label="Select a game"
            data={Object.values(SupportedGames)}
            value={selectedGame}
            onChange={(value) => setSelectedGame(value as SupportedGames)}
            required
          />

          {/* Date Picker */}
          <DatePickerInput
            label="Select a date"
            value={date}
            onChange={setDate}
            valueFormat="YYYY-MM-DD"
            firstDayOfWeek={0}
            defaultChecked
            maxDate={new Date()}
            hideOutsideDates
            required
          />

          {/* File Input */}
          <FileInput
            label="Upload an image"
            placeholder="Click to upload"
            accept="image/png,image/jpeg"
            value={file}
            onChange={setFile}
            required
          />
        </Group>
        {/* Submit Button */}
        <Group mt="md">
          <Button type="submit" disabled={!file || !date || !selectedGame}>
            Submit
          </Button>
        </Group>
        {/* Display Loader Centered */}
        {loading && (
          <Group justify="center" mt="xl">
            <Loader size="lg" />
            <Text>Processing image...</Text>
          </Group>
        )}

        {/* Display Error Message */}
        {errorWhileParsing && (
          <Box mt="xl" p="md" style={{ border: '1px solid red', borderRadius: '4px' }}>
            <Text c="red" fw={700}>
              Upload Error:
            </Text>
            <Text c="red">{errorWhileParsing}</Text>
          </Box>
        )}

        {/* Display Parsed Results as JSON */}
        {parsedResult && (
          <Box mt="xl">
            <Text fw={700}>Parsed Results:</Text>
            <Code block style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(parsedResult, null, 2)}
            </Code>
          </Box>
        )}
      </Stack>
    </form>
  );
}
