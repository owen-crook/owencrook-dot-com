"use client"
import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { Group, Menu, UnstyledButton, Text, Box } from '@mantine/core';
import classes from './ThreeDimensionalModelPicker.module.css';
import { FloatingColorPicker } from '../FloatingColorPicker/FloatingColorPicker';

export type ThreeDimensionalModel = {
  label: string;
  file: string;
  urls?: string[];
  photoPaths?: string[];
}

export const DefaultThreeDimensionalModel: ThreeDimensionalModel = { label: 'Benchy', file: 'benchy', urls: ['https://www.3dbenchy.com/about/'] };

const modelData: ThreeDimensionalModel[] = [
  DefaultThreeDimensionalModel,
  { label: 'TAG Graded Card Stand', file: 'tag-graded-card-holder' },
  { label: 'MacBook Pro Cable Holder', file: 'macbook-cable-holder' },
];

type ThreeDimensionalModelPickerProps = {
  initialColor: string
  onSelectModel: (model: ThreeDimensionalModel) => void
  onSelectMaterial: (materialColor: string) => void
  onResetView?: () => void
}

export function ThreeDimensionalModelPicker({ initialColor, onSelectModel, onSelectMaterial }: ThreeDimensionalModelPickerProps) {
  const [modelOpened, setModelOpened] = useState(false);
  const [selectedModel, setSelectedModel] = useState(DefaultThreeDimensionalModel);

  // Setup menu items
  const modelItems = modelData.map((item) => (
    <Menu.Item
      onClick={() => {
        setSelectedModel(item)
        onSelectModel(item)
      }}
      key={item.label}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Group wrap="nowrap">
      {/* Model selection drop down */}
      <Box>
        <Text size="sm" fw={500} mb={4}>Select a model:</Text>
        <Menu
          onOpen={() => setModelOpened(true)}
          onClose={() => setModelOpened(false)}
          radius="md"
          width="target"
          withinPortal
        >
          <Menu.Target>
            <UnstyledButton className={classes.control} data-expanded={modelOpened || undefined}>
              <Group gap="xs">
                <span className={classes.label}>{selectedModel.label}</span>
              </Group>
              <IconChevronDown size={16} className={classes.icon} stroke={1.5} />
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>{modelItems}</Menu.Dropdown>
        </Menu>
      </Box>

      {/* Color selection dropdown */}
      <Box>
        <Text size="sm" fw={500} mb={4}>Select a color:</Text>
        <FloatingColorPicker
          color={initialColor}
          onChange={(color) => {
            onSelectMaterial(color)
          }}
        />
      </Box>

    </Group>
  );
}