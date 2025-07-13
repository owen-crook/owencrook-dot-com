'use client'

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { useEffect, useState } from "react"
import { ActionIcon, Collapse, Group, NativeSelect, Paper, Switch, Text, TextInput, Tooltip } from "@mantine/core"
import { DatePickerInput } from '@mantine/dates';
import { IconChevronDown, IconEdit } from '@tabler/icons-react';
import { GameMetadata, SupportedGames } from "./types"

interface BoardGameTrackerEditableGameDataProps {
  gameData: GameMetadata
  handleGameDataEdited: (edited: boolean, editedGameData: GameMetadata) => void
}

export default function BoardGameTrackerEditableGameData({ gameData, handleGameDataEdited }: BoardGameTrackerEditableGameDataProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [editableGameData, setEditableGameData] = useState<GameMetadata>(gameData);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState<string | null>(gameData.location || null)

  useEffect(() => {
    setEditableGameData(gameData)
  }, [gameData])

  useEffect(() => {
    handleGameDataEdited(true, editableGameData)
  }, [editableGameData, handleGameDataEdited])

  const toggleCollapse = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleGameEdited = (value: any) => {
    const isValid = Object.values(SupportedGames).find((gm) => {
      return gm.toLowerCase() === String(value).toLowerCase()
    })
    if (isValid) {
      setEditableGameData(prev => ({ ...prev, game: isValid }));
    }
  }

  const handleDateEdited = (value: any) => {
    setEditableGameData(prev => ({ ...prev, date: value }))
  }

  const handleLocationEdited = (value: any) => {
    setEditableGameData(prev => ({ ...prev, location: value }))
  }

  const handleIsCompletedEdited = (value: boolean) => {
    setEditableGameData(prev => ({ ...prev, isCompleted: value }))
  }

  return (
    <Paper w="100%" maw={750} shadow="lg" p="md" radius="md" withBorder>
      <Group justify="space-between" align="center" mb="sm">
        <Text size="lg" fw={500}>Game Metadata</Text>
        <Tooltip label={isExpanded ? 'Collapse metadata' : 'Expand metadata'}>
          <ActionIcon
            variant="subtle"
            size="md"
            radius="md"
            onClick={toggleCollapse}
          >
            <IconChevronDown
              size={16}
              style={{
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Collapse in={isExpanded}>
        {/* uneditable id field */}
        <Group wrap="nowrap" align="center" gap="xs" mb="sm">
          <Text size="sm" fw={500} style={{ minWidth: '80px' }}>ID:</Text>
          <Text size="sm" style={{ flexGrow: 1 }}>{String(gameData.id)}</Text>
        </Group>
        {/* editable game field, drop down */}
        <Group wrap="nowrap" align="center" gap="xs" mb="sm">
          <Text size="sm" fw={500} style={{ minWidth: '80px' }}>Game:</Text>
          <NativeSelect
            label=""
            data={Object.values(SupportedGames)}
            value={editableGameData.game || ''}
            onChange={(e) => {
              const _value = e.currentTarget.value;
              handleGameEdited(_value)
            }}
            variant="filled"
            size="sm"
          />
        </Group>
        {/* editable date field */}
        <Group wrap="nowrap" align="center" gap="xs" mb="sm">
          <Text size="sm" fw={500} style={{ minWidth: '80px' }}>Date Played:</Text>
          <DatePickerInput
            label=""
            value={editableGameData.date}
            onChange={(value) => handleDateEdited(value ? new Date(value) : null)}
            valueFormat="YYYY-MM-DD"
            firstDayOfWeek={0}
            maxDate={new Date()}
            popoverProps={{ position: 'bottom' }}
            hideOutsideDates
            required
          />
        </Group>
        {/* editable location field */}
        <Group wrap="nowrap" align="center" gap="xs" mb="sm">
          <Text size="sm" fw={500} style={{ minWidth: '80px' }}>Location:</Text>
          {isEditingLocation ? (
            <TextInput
              value={tempLocation !== undefined ? String(tempLocation) : ''}
              onChange={(e) => {
                setTempLocation(e.currentTarget.value)
              }}
              onBlur={() => {
                handleLocationEdited(tempLocation); // Use dedicated handler on blur
                setIsEditingLocation(false); // Exit editing mode
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleLocationEdited(tempLocation); // Use dedicated handler on Enter
                  setIsEditingLocation(false); // Exit editing mode
                }
              }}
              autoFocus
              variant="filled"
              size="sm"
            />
          ) : (
            <Group align="center" gap="xs">
              <Text size="sm" style={{ flexGrow: 1 }}>{editableGameData.location !== undefined ? String(editableGameData.location) : 'N/A'}</Text>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setIsEditingLocation(true)}
                size="sm"
                aria-label="Edit location"
              >
                <IconEdit style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
            </Group>
          )}
        </Group>
        {/* editable complete field */}
        <Group wrap="nowrap" align="center" gap="xs" mb="sm">
          <Text size="sm" fw={500} style={{ minWidth: '80px' }}>Completed:</Text>
          <Switch
            checked={editableGameData.isCompleted || false}
            onChange={(e) => handleIsCompletedEdited(e.currentTarget.checked)}
          />
        </Group>
      </Collapse>
    </Paper>
  )
}