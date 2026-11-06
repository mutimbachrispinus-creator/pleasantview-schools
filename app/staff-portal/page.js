import Panel from '@/components/AdminPanel';
import LoginForm from '@/components/LoginForm';
import { getAdmin, endSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Staff Portal & Administrative Console',
  robots: { index: false, follow: false }
};

export default async function StaffPortalPage({ searchParams }) {
  let editSlug = '';
  try {
    const sp = await searchParams;
    editSlug = sp?.edit || '';
    if (sp?.logout === '1' || sp?.logout === 'true') {
      await endSession();
      return <LoginForm title="Staff & Central Administrative Console" />;
    }
  } catch {}

  let a = null;
  try {
    a = await getAdmin();
  } catch (err) {
    console.warn('[Staff Portal Session Check Note]:', err?.message);
  }

  // Not logged in -> Show luxury LoginForm
  if (!a) {
    return <LoginForm title="Staff & Central Administrative Console" />;
  }

  // Logged in -> Render Admin Management Panel for scope
  return <Panel scope={a.scope || 0} edit={editSlug} />;
}
