"use client"
import React, { useState } from 'react';
import {
  ActionIcon,
  Group,
  Popover,
  ColorPicker,
  Modal,
  Drawer,
  Menu,
  Text,
  Stack,
  Grid,
  Image,
  List,
  Paper,
  Select,
  CloseButton,
  Tooltip,
  PopoverTarget,
  PopoverDropdown,
} from '@mantine/core';
import {
  IconChevronDown,
  IconPalette,
  IconFileText,
  IconCamera,
  IconExternalLink,
  IconCube
} from '@tabler/icons-react';

import { ThreeDimensionalModel } from './types';
import { modelData } from './constants'


type STLViewerMenuProps = {
  selectedModel: ThreeDimensionalModel
  selectedModelDescription: string
  setSelectedModel: (model: ThreeDimensionalModel) => void
  selectedMaterialColor: string
  setSelectedMaterialColor: (color: string) => void
}

export function STLViewerMenu({ selectedModel, setSelectedModel, selectedModelDescription, selectedMaterialColor, setSelectedMaterialColor }: STLViewerMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [showModelPicker, setShowModelPicker] = useState(false)

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDescriptionPanel, setShowDescriptionPanel] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showLinksMenu, setShowLinksMenu] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Sample data
  const samplePhotos = [
    'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=300&fit=crop'
  ];

  const sampleLinks = [
    { title: 'Documentation', url: '#', description: 'Technical specifications' },
    { title: 'Download STL', url: '#', description: 'Get the 3D model file' },
    { title: 'Related Models', url: '#', description: 'Similar designs' },
    { title: 'Designer Profile', url: '#', description: 'View creator\'s work' }
  ];

  const modelDataAsSelectOptions = modelData.map((model) => {
    return { 'value': model.file, 'label': model.label }
  })

  const getThreeDimensionalModelByFile = (file: string) => {
    return modelData.find(model => model.file === file)
  }

  const handleChangeSelectedModel = (model: string) => {
    setShowModelPicker(false)
    var m = getThreeDimensionalModelByFile(model)
    if (m) {
      setSelectedModel(m)
    }
  }

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setShowModelPicker(false)
      setShowColorPicker(false);
      setShowLinksMenu(false);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '1rem',
      left: '1rem',
      zIndex: 1000
    }}>
      <Group gap="xs" align="center" style={{ alignItems: 'center' }}>
        {/* Main Menu Button */}
        <Tooltip label={isExpanded ? "Collapse menu" : "Expand menu"}>
          <ActionIcon
            variant="subtle"
            size="md"
            radius="md"
            onClick={toggleMenu}
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            <IconChevronDown
              size={16}
              style={{
                transform: isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </ActionIcon>
        </Tooltip>

        {/* Expanded Menu Items */}
        {isExpanded && (
          <Paper shadow="lg" p="xs" radius="md" style={{
            maxHeight: '28px', // Match button height
            display: 'flex',
            alignItems: 'center'
          }}>
            <Group gap="xs">
              {/* TODO: general info icon with welcome page to trigger modal */}

              {/* Model Selector */}
              <Popover
                opened={showModelPicker}
                onClose={() => setShowModelPicker(false)}
                onDismiss={() => setShowModelPicker(false)}
                position='bottom'
              >
                <PopoverTarget>
                  <Tooltip label="Change model">
                    <ActionIcon
                      variant='subtle'
                      onClick={() => setShowModelPicker(!showModelPicker)}
                    >
                      <IconCube size={16} />
                    </ActionIcon>
                  </Tooltip>
                </PopoverTarget>
                <PopoverDropdown>
                  <Stack gap="sm">
                    <Text size="sm" fw={500}>Select a model:</Text>
                    <Select
                      data={modelDataAsSelectOptions}
                      value={selectedModel.file}
                      onChange={(_value) => {
                        if (_value !== null) {
                          handleChangeSelectedModel(_value);
                        }
                      }}
                    />
                  </Stack>
                </PopoverDropdown>
              </Popover>


              {/* Color Picker */}
              <Popover
                opened={showColorPicker}
                onDismiss={() => setShowColorPicker(false)}
                onClose={() => setShowColorPicker(false)}
                position="bottom"
                withArrow
              >
                <Popover.Target>
                  <Tooltip label="Change color">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                      <IconPalette size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Popover.Target>
                <Popover.Dropdown>
                  <Stack gap="sm">
                    <Text size="sm" fw={500}>Select Color</Text>
                    <ColorPicker value={selectedMaterialColor} onChange={setSelectedMaterialColor} format="hexa" withPicker />

                  </Stack>
                </Popover.Dropdown>
              </Popover>

              {/* Description Panel */}
              <Popover
                opened={showDescriptionPanel}
                onClose={() => setShowDescriptionPanel(false)}
                onDismiss={() => setShowDescriptionPanel(false)}
                position='bottom'
                withArrow
                width={250}
              >
                <Popover.Target>
                  <Tooltip label="Show description">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => setShowDescriptionPanel(!showDescriptionPanel)}
                    >
                      <IconFileText size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Popover.Target>
                <Popover.Dropdown>
                  <Stack gap="sm">
                    <Text size="sm" fw={500}>{selectedModel.label}.stl</Text>
                    <Text size="xs" c="dimmed">{selectedModelDescription}</Text>
                  </Stack>
                </Popover.Dropdown>
              </Popover>


              {/* Photos Modal */}
              <Tooltip label="View photos">
                <ActionIcon
                  variant="subtle"
                  onClick={() => setShowPhotoModal(true)}
                >
                  <IconCamera size={16} />
                </ActionIcon>
              </Tooltip>

              {
                selectedModel.urls && (
                  <Menu
                    opened={showLinksMenu}
                    onClose={() => setShowLinksMenu(false)}
                    position="bottom"
                    withArrow
                  >
                    <Menu.Target>
                      <Tooltip label="Show links">
                        <ActionIcon
                          variant="subtle"
                          onClick={() => setShowLinksMenu(!showLinksMenu)}
                        >
                          <IconExternalLink size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Label>Quick Links</Menu.Label>
                      {selectedModel.urls.map((link, index) => (
                        <Menu.Item
                          key={index}
                          leftSection={<IconExternalLink size={14} />}
                          component="a" href={link.url} target="_blank" rel="noopener noreferrer"
                        >
                          <div>
                            <Text size="sm">{link.label}</Text>
                            <Text size="xs" c="dimmed">{link.description}</Text>
                          </div>
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                )
              }
            </Group>
          </Paper>
        )}
      </Group>

      {/* TODO: remap Photo Modal */}
      <Modal
        opened={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        title="3D Model Photos"
        size="lg"
        centered
      >
        <Grid>
          {samplePhotos.map((photo, index) => (
            <Grid.Col key={index} span={6}>
              <Image
                src={photo}
                alt={`3D Model Photo ${index + 1}`}
                radius="md"
                style={{ cursor: 'pointer' }}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Modal>

      {/* TODO: change instructions to a more welcome message and position correctly*/}
      {showInstructions && (
        <Paper
          shadow="md"
          p="sm"
          radius="md"
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            maxWidth: '280px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Group justify="space-between" mb="xs">
            <Text fw={600} size="sm">Try the Menu!</Text>
            <CloseButton size="sm" onClick={() => setShowInstructions(false)} />
          </Group>
          <Text size="xs" c="dimmed" mb="xs">
            Click the menu button in the top-left corner:
          </Text>
          <List size="xs" spacing="xs">
            <List.Item>🎨 Color picker with presets</List.Item>
            <List.Item>📄 Description panel</List.Item>
            <List.Item>📷 Photo modal</List.Item>
            <List.Item>🔗 Links dropdown</List.Item>
          </List>
        </Paper>
      )}
    </div>
  )
}