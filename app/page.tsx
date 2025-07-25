'use client';

import Link from 'next/link';
import { IconCheck } from '@tabler/icons-react';
import { Button, Container, Group, Image, List, Text, ThemeIcon, Title } from '@mantine/core';

import '../styles/global.css';

export default function HomePage() {
  return (
    <Container size="md">
      <div className="inner">
        <div className="content">
          <Title className="title">
            Hey there!
            <br /> My name is <span className="highlight">Owen</span>
          </Title>
          <Text c="dimmed" mt="md">
            I'm a software engineer and team lead at Tesla, where I've been working in the data,
            machine learning, and software space since 2019. These days, I lead a team of engineers
            building custom tools that power Tesla's residential energy business.
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck size={12} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <List.Item>
              <b>Natural tinkerer</b> - I'm happiest when I'm bringing ideas to life or figuring out
              how things work
            </List.Item>
            <List.Item>
              <b>Systems architect</b> - I enjoy creating the robust systems and tools that make
              technology run smoothly behind the scenes
            </List.Item>
            <List.Item>
              <b>Curious explorer</b> - I love exploring new areas and finding ways to apply my
              skills to solve problems
            </List.Item>
          </List>

          <Group mt={30}>
            <Button
              component={Link}
              href="/professional-experience"
              radius="xl"
              size="md"
              className="control"
            >
              My work
            </Button>
            <Button
              component="a"
              href="https://github.com/owen-crook/owencrook-dot-com"
              target="_blank"
              rel="noopener noreferrer"
              variant="default"
              radius="xl"
              size="md"
              className="control"
            >
              Source code
            </Button>
          </Group>
        </div>
        <Image src="avatar.png" className="image" />
      </div>
    </Container>
  );
}
