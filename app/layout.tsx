'use client';

import '@mantine/core/styles.css';

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { AppShell, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { Header } from '@/components/Header/Header';
import { theme } from '../theme';

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <body>
        <SessionProvider>
          <MantineProvider theme={theme}>
            <AppShell
              header={{ height: 56 }} // needs to match the components
              styles={{
                root: {},
                main: {
                  overflowY: 'auto',
                },
              }}
            >
              <AppShell.Header>
                <link rel="shortcut icon" href="/avatar.png" />
                <Header />
              </AppShell.Header>

              <AppShell.Main style={{ position: 'relative', height: '100vh', }}>{children}</AppShell.Main>
            </AppShell>
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
