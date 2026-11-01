import { notFound } from 'next/navigation';
import Panel, { LoginForm } from '@/components/AdminPanel';
import { q } from '@/lib/db';
import { getAdmin } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Staff Portal', robots: { index: false, follow: false } };
export default async function SchoolAdmin({ params }) {
  const key = (await params).key, [s] = await q('SELECT id,name FROM schools WHERE admin_key=?', [key]);
  if (!s) notFound();
  const a = await getAdmin();
  if (!a || a.scope !== s.id) return <LoginForm k={key} title={s.name + ' Staff Login'} />;
  return <Panel scope={s.id} />;
}
