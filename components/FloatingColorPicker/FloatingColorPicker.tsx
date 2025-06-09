'use client';

import { useState } from 'react';
import { IconPalette } from '@tabler/icons-react';
import { ColorPicker, Group, Popover, UnstyledButton } from '@mantine/core';
import classes from './FloatingColorPicker.module.css';

type FloatingColorPickerProps = {
  color: string;
  onChange: (val: string) => void;
};

export function FloatingColorPicker({ color, onChange }: FloatingColorPickerProps) {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      width={'auto'}
      position="bottom-start"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <UnstyledButton
          className={classes.control}
          variant="light"
          size="xs"
          onClick={() => setOpened((o) => !o)}
        >
          <Group gap={'xs'}>
            <span className={classes.label}>Show Color Picker</span>
          </Group>
          <IconPalette size={16} className={classes.icon} stroke={1.5} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <ColorPicker value={color} onChange={onChange} format="hexa" withPicker />
      </Popover.Dropdown>
    </Popover>
  );
}
