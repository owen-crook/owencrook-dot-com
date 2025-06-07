"use client"
import '@mantine/core/styles.css';

import React from 'react';
import { mantineHtmlProps, MantineProvider, AppShell } from '@mantine/core';
import { HeaderSimple } from '@/components/HeaderSimple/HeaderSimple';
import { theme } from '../theme';
import { NavbarMinimal } from '@/components/NavbarMinimal/NavbarMinimal';

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <body>
        <MantineProvider theme={theme}>
          <AppShell
            header={{ height: 56 }} // needs to match the components
            navbar={{ width: 80, breakpoint: 'sm' }} // needs to match the components
            styles={{
              root: { height: '100vh', overflow: 'hidden' },
              main: {
                height: 'calc(100vh - 56px)', // subtract the header height

              }
            }}
          >
            <AppShell.Header>
              <link rel="shortcut icon" href="/avatar.png" />
              <HeaderSimple />
            </AppShell.Header>

            <AppShell.Navbar>
              <NavbarMinimal />
            </AppShell.Navbar>

            <AppShell.Main>
              {children}
            </AppShell.Main>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
