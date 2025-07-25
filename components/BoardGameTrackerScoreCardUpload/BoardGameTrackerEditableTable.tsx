'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconEdit } from '@tabler/icons-react';
import {
  ActionIcon,
  Group,
  NumberInput,
  Paper,
  ScrollArea,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { PlayerScore } from './types';

interface BoardGameTrackerEditableTableProps {
  playerScores: PlayerScore[];
  handlePlayerScoresEdited: (edited: boolean, editedPlayerScores: PlayerScore[]) => void;
}

export default function BoardGameTrackerEditableTable({
  playerScores,
  handlePlayerScoresEdited,
}: BoardGameTrackerEditableTableProps) {
  const [editablePlayerScores, setEditablePlayerScores] = useState<PlayerScore[]>(playerScores);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [tempColumnName, setTempColumnName] = useState<string>('');

  // dynamic styling vars
  const tableMaxWidth = 750;
  const columnMaxWidth = 125;
  const columnMinWidth = 100;

  // parse out core items for dynamic table generation
  const playerCols = useMemo(
    () =>
      editablePlayerScores.map((item, index) => ({ id: item.id, name: item.name || `P${index}` })),
    [editablePlayerScores]
  );
  const categoryRows = useMemo(() => {
    if (editablePlayerScores.length === 0) return [];
    const allKeys = Object.keys(editablePlayerScores[0]);
    return allKeys.filter((key) => key !== 'id' && key !== 'name' && key !== 'total');
  }, [editablePlayerScores]);

  useEffect(() => {
    setEditablePlayerScores(playerScores);
  }, [playerScores]);

  useEffect(() => {
    handlePlayerScoresEdited(true, editablePlayerScores);
  }, [handlePlayerScoresEdited, editablePlayerScores]);

  useEffect(() => {
    // Compute new scores with updated totals
    const newScores = editablePlayerScores.map((player) => {
      let total = 0;
      categoryRows.forEach((category) => {
        const value = player[category];
        if (typeof value === 'number') {
          total += value;
        }
      });
      if (player.total !== total) {
        return { ...player, total };
      }
      return player;
    });

    // Only update state if something actually changed
    const changed =
      newScores.length !== editablePlayerScores.length ||
      newScores.some((p, i) => p.total !== editablePlayerScores[i].total);

    if (changed) {
      setEditablePlayerScores(newScores);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryRows, editablePlayerScores]);

  const handlePlayerNameChange = useCallback((playerId: string, newName: string) => {
    // handle empty string
    if (newName.trim() === '') {
      setTempColumnName('');
      setEditingColumnId(null);
      return;
    }

    setEditablePlayerScores((prevPlayerScores) =>
      prevPlayerScores.map((prevPlayerScore) => {
        if (prevPlayerScore.id === playerId) {
          if (prevPlayerScore.name !== newName) {
            return { ...prevPlayerScore, name: newName };
          }
        }
        return prevPlayerScore;
      })
    );
    setEditingColumnId(null);
  }, []);

  const handleScoreChange = useCallback(
    (playerId: string, category: string, newValue: number | string) => {
      const parsedValue = typeof newValue === 'number' ? newValue : parseFloat(newValue || '0');
      setEditablePlayerScores((prevPlayerScores) =>
        prevPlayerScores.map((prevPlayerScore) => {
          if (prevPlayerScore.id === playerId) {
            // Only update if the value has actually changed to avoid unnecessary re-renders
            if (prevPlayerScore[category] !== parsedValue) {
              return {
                ...prevPlayerScore,
                [category]: parsedValue,
              };
            }
          }
          return prevPlayerScore;
        })
      );
    },
    []
  );

  const calculatedColumnTotals = useMemo(() => {
    const totals: { [key: string]: number } = {}; // Use name as key for totals object for display
    playerCols.forEach((playerCol) => {
      // Iterate over columnInfos
      const playerData = editablePlayerScores.find(
        (playerScore) => playerScore.id === playerCol.id
      );
      let currentTotal = 0;
      if (playerData) {
        categoryRows.forEach((category) => {
          const value = playerData[category];
          // Only sum if the value is a number
          if (typeof value === 'number') {
            currentTotal += value;
          }
        });
      }
      totals[playerCol.id] = currentTotal;
    });
    return totals;
  }, [editablePlayerScores, playerCols, categoryRows]);

  // generate the table headers
  const tableHeaders = (
    <Table.Tr>
      <Table.Th
        pos="sticky"
        left={0}
        maw={columnMaxWidth}
        miw={columnMinWidth}
        style={{
          zIndex: 10,
          backgroundColor: 'var(--mantine-color-body)',
        }}
      />
      {playerCols.map((playerCol, index) => {
        return (
          <Table.Th key={playerCol.id} maw={columnMaxWidth} miw={columnMinWidth} align="center">
            {editingColumnId === playerCol.id ? (
              <TextInput
                value={tempColumnName} // Bind to temporary state
                onChange={(event) => setTempColumnName(event.currentTarget.value)} // Update temporary state
                onBlur={(event) => handlePlayerNameChange(playerCol.id, event.currentTarget.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    handlePlayerNameChange(playerCol.id, event.currentTarget.value);
                  }
                }}
                autoFocus
                variant="filled"
                size="sm"
              />
            ) : (
              <Group
                gap={4}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'nowrap', // Prevent wrapping of text and icon
                  width: '100%', // Ensure group takes full available width
                }}
              >
                <Text
                  style={{
                    whiteSpace: 'nowrap', // Prevent text from wrapping
                    overflow: 'hidden', // Hide overflowing content
                    textOverflow: 'ellipsis', // Show ellipsis for truncated text
                    flexGrow: 1, // Allow text to grow and take space
                    flexShrink: 1, // Allow text to shrink
                    minWidth: 0, // Important for flex items with overflow: hidden
                  }}
                >
                  {playerCol.name}
                </Text>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={() => {
                    setEditingColumnId(playerCol.id);
                    setTempColumnName(playerCol.name); // Initialize temporary state with current name
                  }}
                  aria-label={`Edit ${playerCol.name}`}
                >
                  <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
              </Group>
            )}
          </Table.Th>
        );
      })}
    </Table.Tr>
  );

  // generate the table rows
  const tableRows = categoryRows.map((category, rowIndex) => {
    return (
      <Table.Tr key={category}>
        <Table.Td
          pos="sticky"
          left={0}
          maw={columnMaxWidth}
          miw={columnMinWidth}
          style={{
            zIndex: 10,
            backgroundColor:
              rowIndex % 2 === 0 ? 'var(--mantine-color-body)' : 'var(--mantine-color-gray-0)',
          }}
        >
          {category}
        </Table.Td>
        {playerCols.map((playerCol) => {
          const playerData = editablePlayerScores.find((player) => player.id === playerCol.id);
          const value = playerData ? (playerData[category] as number) : 0;
          return (
            <Table.Td
              key={`${category}-${playerCol.id}`}
              maw={columnMaxWidth}
              miw={columnMinWidth}
              style={{
                backgroundColor:
                  rowIndex % 2 === 0 ? 'var(--mantine-color-body)' : 'var(--mantine-color-gray-0)',
              }}
            >
              <NumberInput
                value={value}
                onChange={(val) => handleScoreChange(playerCol.id, category, val)}
                min={0}
                step={1}
              />
            </Table.Td>
          );
        })}
      </Table.Tr>
    );
  });

  // generate the total row
  const tableTotalRow = (
    <Table.Tr>
      <Table.Th
        pos="sticky"
        left={0}
        maw={columnMaxWidth}
        miw={columnMinWidth}
        style={{
          zIndex: 10,
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        total
      </Table.Th>
      {playerCols.map((playerCol) => {
        return (
          <Table.Th key={`total-${playerCol.id}`} maw={columnMaxWidth} miw={columnMinWidth}>
            {calculatedColumnTotals[playerCol.id]}
          </Table.Th>
        );
      })}
    </Table.Tr>
  );

  return (
    <Paper w="100%" maw={tableMaxWidth} shadow="lg" p="md" radius="md" withBorder>
      <Text size="lg" fw={500} mb="sm">Scorecard</Text>
      <ScrollArea w="100%" mah="100%" type="auto" offsetScrollbars>
        <Table striped highlightOnHover withTableBorder withColumnBorders verticalSpacing="sm">
          <Table.Thead>{tableHeaders}</Table.Thead>
          <Table.Tbody>{tableRows}</Table.Tbody>
          <Table.Tfoot>{tableTotalRow}</Table.Tfoot>
        </Table>
      </ScrollArea>
    </Paper>
  );
}
