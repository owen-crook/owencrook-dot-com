'use client';

import '@mantine/core/styles.css';

import React from 'react';
import { SessionProvider } from "next-auth/react";
import { AppShell, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Header } from '@/components/Header/Header';
import { NavbarMinimal } from '@/components/NavbarMinimal/NavbarMinimal';
import { theme } from '../theme';

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <body>
        <SessionProvider>
          <MantineProvider theme={theme}>
            <AppShell
              header={{ height: 56 }} // needs to match the components
              navbar={{ width: 80, breakpoint: 'sm' }} // needs to match the components
              styles={{
                root: { height: '100vh', overflow: 'hidden' },
                main: {
                  height: 'calc(100vh - 56px)', // subtract the header height
                },
              }}
            >
              <AppShell.Header>
                <link rel="shortcut icon" href="/avatar.png" />
                <Header />
              </AppShell.Header>

              <AppShell.Navbar>
                <NavbarMinimal />
              </AppShell.Navbar>

              <AppShell.Main>{children}</AppShell.Main>
            </AppShell>
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
