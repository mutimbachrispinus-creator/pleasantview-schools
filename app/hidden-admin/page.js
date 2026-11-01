import Panel, { LoginForm } from '@/components/AdminPanel';
import { getAdmin } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Staff Portal', robots: { index: false, follow: false } };
export default async function Admin({ searchParams }) {
  const a = await getAdmin();
  if (!a || a.scope !== 0) return <LoginForm title="Central Admin" />;
  return <Panel scope={0} edit={(await searchParams).edit} />;
}
