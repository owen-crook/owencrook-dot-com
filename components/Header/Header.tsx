import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
  Container,
  Group,
  Menu,
  Burger,
  Center,
  Avatar,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { IconChevronDown, IconUser } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import classes from './Header.module.css';

const links = [
  { link: '/', label: 'Home' },
  { link: '/professional-experience', label: 'Professional Experience' },
  {
    link: '/hobbies', label: 'Hobbies', links: [
      { link: '/3d-modeling', label: '3D Modeling' },
    ]
  },
  {
    link: '/tools', label: 'Tools', links: [
      { link: '/board-game-tracker', label: 'Board Game Tracker' },
    ]
  },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item>
        <Link
          key={item.label}
          href={item.link}
          className={classes.link}
          data-active={pathname === item.link || undefined}
        >
          {item.label}
        </Link>
      </Menu.Item>
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

    return (
      <Link
        key={link.label}
        href={link.link}
        className={classes.link}
        data-active={pathname === link.link || undefined}
      >
        {link.label}
      </Link>
    );
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
      <Container size="md">
        <div className={classes.inner}>
          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>
          <Group gap="xs">
            {authButton}
            <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          </Group>
        </div>
      </Container>
    </header>
  );
}