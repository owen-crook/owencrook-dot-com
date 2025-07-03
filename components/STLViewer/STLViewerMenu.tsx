'use client';

import React, { useState } from 'react';
import {
  IconCamera,
  IconChevronDown,
  IconCube,
  IconExternalLink,
  IconFileText,
  IconInfoCircle,
  IconPalette,
} from '@tabler/icons-react';
import {
  ActionIcon,
  ColorPicker,
  Group,
  Menu,
  Paper,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Select,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { modelData } from './constants';
import { STlViewerPhotoModal } from './STLViewerPhotoModal';
import { ThreeDimensionalModel } from './types';

type STLViewerMenuProps = {
  selectedModel: ThreeDimensionalModel;
  selectedModelDescription: string;
  selectedModelPhotoUrls: Array<string>;
  setSelectedModel: (model: ThreeDimensionalModel) => void;
  selectedMaterialColor: string;
  setSelectedMaterialColor: (color: string) => void;
};

export function STLViewerMenu({
  selectedModel,
  setSelectedModel,
  selectedModelDescription,
  selectedModelPhotoUrls,
  selectedMaterialColor,
  setSelectedMaterialColor,
}: STLViewerMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDescriptionPanel, setShowDescriptionPanel] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showLinksMenu, setShowLinksMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const modelDataAsSelectOptions = modelData.map((model) => {
    return { value: model.file, label: model.label };
  });

  const getThreeDimensionalModelByFile = (file: string) => {
    return modelData.find((model) => model.file === file);
  };

  const handleChangeSelectedModel = (model: string) => {
    setShowModelPicker(false);
    const m = getThreeDimensionalModelByFile(model);
    if (m) {
      setSelectedModel(m);
    }
  };

  const handleClickShowPhotos = () => {
    setIsExpanded(!isExpanded);
    setShowPhotoModal(!showPhotoModal);
  };

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setShowModelPicker(false);
      setShowColorPicker(false);
      setShowLinksMenu(false);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        zIndex: 1000,
      }}
    >
      <Group gap="xs" align="center" style={{ alignItems: 'center' }}>
        {/* Info Button */}
        <Popover
          opened={showInfo}
          onClose={() => setShowInfo(false)}
          onDismiss={() => setShowInfo(false)}
          position="bottom-start"
          withArrow
          width={300}
        >
          <Popover.Target>
            <Tooltip label={showInfo ? 'Hide info' : 'Show info'}>
              <ActionIcon
                variant="subtle"
                size="md"
                radius="md"
                onClick={() => setShowInfo(!showInfo)}
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <IconInfoCircle size={16} />
              </ActionIcon>
            </Tooltip>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                3D Modeling
              </Text>
              <Text size="xs" c="dimmed">
                Welcome to my 3D Model explorer! This page is built with ThreeJS to highlight models
                that I designed myself! Feel free to expand the menu to browse and learn about the
                various models that I've made!
              </Text>
              <Text size="xs" c="dimmed">
                I've always liked building stuff and figuring out how things work, so getting into
                CAD and 3D printing was kind of a natural fit for me. I took some CAD classes back
                in high school, but things really clicked in college when I started building racing
                drones and needed custom parts. That's when I got into 3D printing and started
                messing around with designs of my own.
              </Text>
              <Text size="xs" c="dimmed">
                These days, I use my Ender 3 S1 along with OnShape for design and Cura for slicing.
                Most of what I make is just random stuff to solve small everyday
                problems—organizers, mounts, quick fixes, that kind of thing. It's not something I
                do for work, but it's a fun way to scratch the engineering itch and build things
                that are actually useful.
              </Text>
            </Stack>
          </Popover.Dropdown>
        </Popover>

        {/* Main Menu Button */}
        <Tooltip label={isExpanded ? 'Collapse menu' : 'Expand menu'}>
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
          <Paper
            shadow="lg"
            p="xs"
            radius="md"
            style={{
              maxHeight: '28px', // Match button height
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Group gap="xs">
              {/* Model Selector */}
              <Popover
                opened={showModelPicker}
                onClose={() => setShowModelPicker(false)}
                onDismiss={() => setShowModelPicker(false)}
                position="bottom"
              >
                <PopoverTarget>
                  <Tooltip label="Change model">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => setShowModelPicker(!showModelPicker)}
                    >
                      <IconCube size={16} />
                    </ActionIcon>
                  </Tooltip>
                </PopoverTarget>
                <PopoverDropdown>
                  <Stack gap="sm">
                    <Text size="sm" fw={500}>
                      Select a model:
                    </Text>
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
                    <Text size="sm" fw={500}>
                      Select Color
                    </Text>
                    <ColorPicker
                      value={selectedMaterialColor}
                      onChange={setSelectedMaterialColor}
                      format="hexa"
                      withPicker
                    />
                  </Stack>
                </Popover.Dropdown>
              </Popover>

              {/* Description Panel */}
              <Popover
                opened={showDescriptionPanel}
                onClose={() => setShowDescriptionPanel(false)}
                onDismiss={() => setShowDescriptionPanel(false)}
                position="bottom"
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
                    <Text size="sm" fw={500}>
                      {selectedModel.label}.stl
                    </Text>
                    <Text size="xs" c="dimmed">
                      {selectedModelDescription}
                    </Text>
                  </Stack>
                </Popover.Dropdown>
              </Popover>

              {/* Photos Modal */}
              {selectedModelPhotoUrls.length > 0 && (
                <Tooltip label="View photos">
                  <ActionIcon variant="subtle" onClick={handleClickShowPhotos}>
                    <IconCamera size={16} />
                  </ActionIcon>
                </Tooltip>
              )}
              {selectedModel.urls && (
                <Menu
                  opened={showLinksMenu}
                  onClose={() => setShowLinksMenu(false)}
                  position="bottom"
                  withArrow
                >
                  <Menu.Target>
                    <Tooltip label="Show links">
                      <ActionIcon variant="subtle" onClick={() => setShowLinksMenu(!showLinksMenu)}>
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
                        component="a"
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div>
                          <Text size="sm">{link.label}</Text>
                          <Text size="xs" c="dimmed">
                            {link.description}
                          </Text>
                        </div>
                      </Menu.Item>
                    ))}
                  </Menu.Dropdown>
                </Menu>
              )}
            </Group>
          </Paper>
        )}
      </Group>

      <STlViewerPhotoModal
        imageUrls={selectedModelPhotoUrls}
        opened={showPhotoModal}
        onClose={() => {
          setShowPhotoModal(false);
        }}
      />
    </div>
  );
}
