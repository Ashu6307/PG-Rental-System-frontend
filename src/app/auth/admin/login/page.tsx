import AdminLoginForm from '../../components/AdminLoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | PG & Room Rental',
  description: 'Admin portal login for PG & Room Rental management system',
  keywords: ['admin', 'login', 'pg rental', 'room rental', 'management', 'portal', 'flat'],
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
