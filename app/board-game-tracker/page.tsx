import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth'; // Ensure this path is correct

// Import your new Client Component
import BoardGameTrackerClientPage from './BoardGameTrackerClientPage'; // You'll create this file

export default async function BoardGameTrackerServerPage() {
  const session = await getServerSession(authOptions);
  const token = session?.idToken

  // Server-side redirects
  if (!session?.user?.email) {
    redirect('/');
  }

  if (!token) {
    redirect('/')
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',') ?? [];
  const isAdmin = adminEmails.includes(session.user.email);
  if (!isAdmin) {
    redirect('/');
  }

  // Pass necessary props to the Client Component
  return <BoardGameTrackerClientPage token={token} isAdmin={isAdmin} userEmail={session.user.email} />;
}