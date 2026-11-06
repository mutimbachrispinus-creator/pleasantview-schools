import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function LegacyAdminRedirect() {
  redirect('/staff-portal');
}
