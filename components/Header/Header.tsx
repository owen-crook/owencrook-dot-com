import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconChevronDown, IconLock, IconUser } from '@tabler/icons-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { ActionIcon, Avatar, Burger, Center, Container, Group, Menu, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';

interface LinkItem {
  link: string;
  label: string;
  links?: LinkItem[];
  adminOnly?: boolean;
}

const links: LinkItem[] = [
  { link: '/', label: 'Home' },
  { link: '/professional-experience', label: 'Professional Experience' },
  {
    link: '/hobbies',
    label: 'Hobbies',
    links: [{ link: '/3d-modeling', label: '3D Modeling' }],
  },
  {
    link: '/tools',
    label: 'Tools',
    links: [{ link: '/board-game-tracker', label: 'Board Game Tracker', adminOnly: true }],
  },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  const isAdmin = session?.user?.email && adminEmails.includes(session.user.email);

  const renderLink = (linkObj: LinkItem) => {
    const locked = linkObj.adminOnly && !isAdmin;
    const content = (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {linkObj.label}
        {locked && <IconLock size={14} style={{ marginLeft: 2 }} />}
      </span>
    );
    if (locked) {
      return (
        <span
          key={linkObj.label}
          className={classes.link}
          style={{ opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' }}
          title="Admin only"
        >
          {content}
        </span>
      );
    }
    return (
      <Link
        key={linkObj.label}
        href={linkObj.link}
        className={classes.link}
        data-active={pathname === linkObj.link || undefined}
      >
        {content}
      </Link>
    );
  };

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.label}>{renderLink(item)}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size={14} stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }
    return renderLink(link);
  });

  const authButton = (
    <Menu width={150} shadow="md" position="bottom-end" withArrow>
      <Menu.Target>
        <Tooltip label={session ? 'Account' : 'Sign in'}>
          <ActionIcon variant="subtle" radius="xl" size="lg">
            {session?.user?.image ? (
              <Avatar src={session.user.image} radius="xl" size="sm" />
            ) : (
              <IconUser size={20} />
            )}
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        {session ? (
          <>
            <Menu.Label>{session.user?.name}</Menu.Label>
            <Menu.Item onClick={() => signOut({ callbackUrl: '/' })}>Sign out</Menu.Item>
          </>
        ) : (
          <Menu.Item onClick={() => signIn('google')}>Sign in with Google</Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group justify="space-between" align="center" h={56} style={{ width: '100%' }}>
          <Group gap={5} align="center">
            <Group gap={5} visibleFrom="sm" align="center">
              {items}
            </Group>
            {/* TODO (OC-): add in mobile menu*/}
            <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          </Group>
          {authButton}
        </Group>
      </Container>
    </header>
  );
}
