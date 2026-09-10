import { getCurrentOperator } from '@/lib/auth';
import AdminShell from './AdminShell';
import './admin.css';

export const metadata = {
  title: 'Operations Command Center | Kimoksha Telecom Admin',
  description: 'Mission-critical administration console for wholesale SMS/Voice interconnect, rate decks, and lead CRM.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }) {
  const operator = await getCurrentOperator();

  return (
    <AdminShell operator={operator}>
      {children}
    </AdminShell>
  );
}
