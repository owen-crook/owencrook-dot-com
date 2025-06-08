"use client"
import { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { Group, Menu, UnstyledButton, Text, Box } from '@mantine/core';
import classes from './ThreeDimensionalModelPicker.module.css';
import { FloatingColorPicker } from '../FloatingColorPicker/FloatingColorPicker';

export type ThreeDimensionalModelUrl = {
  url: string;
  label?: string
}

export type ThreeDimensionalModel = {
  label: string;
  file: string;
  urls?: ThreeDimensionalModelUrl[];
  numberOfPhotos?: number; // Number of photos associated with the model
}

export const DefaultThreeDimensionalModel: ThreeDimensionalModel = { label: 'Benchy', file: 'benchy', urls: [{ url: 'https://www.3dbenchy.com/about/', label: 'www.3dbenchy.com' }] };

const modelData: ThreeDimensionalModel[] = [
  DefaultThreeDimensionalModel,
  {
    label: 'TAG Graded Card Stand', file: 'tag-graded-card-holder', numberOfPhotos: 2, urls: [
      {
        url: 'https://cad.onshape.com/documents/a40a6674b4066734936b17d0/w/122311ecbcadd44915ea1830/e/7a5ea9d34e1a60f42379e970?renderMode=0&uiState=68451d1a2185da1fe3f3daf6',
        label: 'OnShape CAD Model'
      },
      {
        url: 'https://my.taggrading.com/card/Q7032613',
        label: 'Mint 10 Snorlax'
      }
    ]
  },
  {
    label: 'MacBook Pro Cable Holder', file: 'macbook-cable-holder', numberOfPhotos: 4, urls: [
      {
        url: 'https://cad.onshape.com/documents/db9752962b3e6c6fcb5759e8/w/0df4c88664c67aac8d8fa61f/e/3b6d5131e7c2100055bd242a',
        label: 'OnShape CAD Model'
      },
      {
        url: 'https://en.wikipedia.org/wiki/MacBook_Pro_(Apple_silicon)#Technical_specifications_2',
        label: 'Technical Specs'
      }]
  },
  // TODO: add more of my models
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
              {/* TODO: ensure long text doesn't increase height of dropdown input */}
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