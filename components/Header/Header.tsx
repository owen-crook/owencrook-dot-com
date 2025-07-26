import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconChevronDown, IconLock, IconUser, IconX } from '@tabler/icons-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import {
  ActionIcon,
  Avatar,
  Box,
  Burger,
  Center,
  Collapse,
  Container,
  Divider,
  Drawer,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

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
  const [opened, { toggle, close }] = useDisclosure(false);
  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);
  const pathname = usePathname();
  const { data: session } = useSession();

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
  const isAdmin = session?.user?.email && adminEmails.includes(session.user.email);

  const linkStyles = {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: 'var(--mantine-radius-sm)',
    textDecoration: 'none',
    color: 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-0))',
    fontSize: 'var(--mantine-font-size-sm)',
    fontWeight: 500,
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
    },
  };

  const activeLinkStyles = {
    backgroundColor: 'var(--mantine-color-blue-filled)',
    color: 'var(--mantine-color-white)',
    '&:hover': {
      backgroundColor: 'var(--mantine-color-blue-filled)',
    },
  };

  const renderLink = (linkObj: LinkItem, isMobile = false) => {
    const locked = linkObj.adminOnly && !isAdmin;
    const isActive = pathname === linkObj.link;

    const content = (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {linkObj.label}
        {locked && <IconLock size={14} style={{ marginLeft: 2 }} />}
      </span>
    );

    // Mobile-specific styles - just better padding and contained width
    const mobileStyles = isMobile
      ? {
          padding: '12px 16px',
          borderRadius: 'var(--mantine-radius-md)',
          width: '100%',
          maxWidth: '280px',
        }
      : {};

    if (locked) {
      return (
        <Box
          key={linkObj.label}
          component="span"
          style={{
            ...linkStyles,
            ...mobileStyles,
            opacity: 0.5,
            cursor: 'not-allowed',
            pointerEvents: 'none',
          }}
          title="Admin only"
        >
          {content}
        </Box>
      );
    }

    return (
      <Box
        key={linkObj.label}
        component={Link}
        href={linkObj.link}
        style={{
          ...linkStyles,
          ...mobileStyles,
          ...(isActive && activeLinkStyles),
        }}
        onClick={isMobile ? close : undefined}
      >
        {content}
      </Box>
    );
  };

  const renderMobileSubMenu = (parentLink: LinkItem) => {
    const isExpanded = expandedMenu === parentLink.label;

    return (
      <Box key={parentLink.label}>
        <Box
          component="button"
          style={{
            ...linkStyles,
            padding: '12px 16px',
            borderRadius: 'var(--mantine-radius-md)',
            background: 'none',
            border: 'none',
            width: '100%',
            maxWidth: '280px',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onClick={() => setExpandedMenu(isExpanded ? null : parentLink.label)}
        >
          <span>{parentLink.label}</span>
          <IconChevronDown
            size={14}
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </Box>
        <Collapse in={isExpanded}>
          <Stack gap="xs" pl="xl">
            {parentLink.links?.map((item) => renderLink(item, true))}
          </Stack>
        </Collapse>
      </Box>
    );
  };

  // Desktop menu items
  const desktopItems = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.label} p={0}>
        {renderLink(item)}
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <Box
              component="a"
              href={link.link}
              style={linkStyles}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span>{link.label}</span>
                <IconChevronDown size={14} stroke={1.5} />
              </Center>
            </Box>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }
    return renderLink(link);
  });

  // Mobile menu items
  const mobileItems = links.map((link) => {
    if (link.links) {
      return renderMobileSubMenu(link);
    }
    return renderLink(link, true);
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
    <>
      <Box
        component="header"
        style={{
          height: 56,
          marginBottom: 120,
          backgroundColor: 'var(--mantine-color-body)',
          borderBottom:
            '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
        }}
      >
        <Container size="md" h={56}>
          <Group justify="space-between" align="center" h="100%">
            <Group gap={5} align="center">
              <Group gap={5} visibleFrom="sm" align="center">
                {desktopItems}
              </Group>
              <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
            </Group>

            {/* Logo/Initials - visible on mobile only */}
            <Group gap={1} align="center" hiddenFrom="sm">
              <Text size="xl" fw={500} c="dark.9">
                O
              </Text>
              <Text size="xl" fw={300} c="gray.6" style={{ lineHeight: 1 }}>
                |
              </Text>{' '}
              {/* Slim, light separator */}
              <Text size="xl" fw={500} c="dark.9">
                C
              </Text>
            </Group>
            {authButton}
          </Group>
        </Container>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="xs"
        padding="md"
        hiddenFrom="sm"
        position="left"
        zIndex={1000}
        title={
          <Text size="lg" fw={600}>
            Navigation
          </Text>
        }
        closeButtonProps={{
          icon: <IconX size={18} />,
        }}
      >
        <Stack gap="xs">
          {mobileItems}
          <Divider my="md" />
          <Box>
            {session ? (
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  Signed in as {session.user?.name}
                </Text>
                <Box
                  component="button"
                  style={{
                    ...linkStyles,
                    padding: '12px 16px',
                    borderRadius: 'var(--mantine-radius-md)',
                    background: 'none',
                    border: 'none',
                    width: '100%',
                    maxWidth: '280px',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    close();
                  }}
                >
                  Sign out
                </Box>
              </Stack>
            ) : (
              <Box
                component="button"
                style={{
                  ...linkStyles,
                  padding: '12px 16px',
                  borderRadius: 'var(--mantine-radius-md)',
                  background: 'none',
                  border: 'none',
                  width: '100%',
                  maxWidth: '280px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  signIn('google');
                  close();
                }}
              >
                Sign in with Google
              </Box>
            )}
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}
