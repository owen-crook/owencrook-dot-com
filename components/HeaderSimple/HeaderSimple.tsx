import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, Group } from '@mantine/core';
import classes from './HeaderSimple.module.css';

const links = [
  { link: '/', label: 'Home' },
  { link: '/professional-experience', label: 'Professional Experience' },
  { link: '/3d-modeling', label: '3D Modeling' },
];

export function HeaderSimple() {
  const pathname = usePathname();
  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={pathname === link.link || undefined}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
      </Container>
    </header>
  );
}
