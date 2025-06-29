import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Box } from '@mantine/core';
import BoardGameTrackerUploadForm from '@/components/BoardgameTrackerUploadForm/BoardgameTrackerUploadForm';
import { authOptions } from '@/lib/auth';

export default async function BoardGameTrackerPage() {
  // TODO: make this redirect nicer
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect('/');
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',') ?? [];
  const isAdmin = adminEmails.includes(session.user.email);
  if (!isAdmin) {
    redirect('/');
  }

  return (
    <>
      <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          pl={{ base: 8, sm: 16, md: 24 }}
          pb={{ base: 8, sm: 16, md: 24 }}
          style={{ flex: '0 0 auto' }}
        >
          <h1>Board Game Tracker</h1>
          <p>Upload a photo from a supported game to parse its score!</p>
          <BoardGameTrackerUploadForm />
        </Box>
      </Box>
    </>
  );
}
