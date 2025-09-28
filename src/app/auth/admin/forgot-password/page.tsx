import ForgotPasswordForm from '../../components/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Forgot Password - PG Rental',
  description: 'Reset your admin account password',
};

export default function AdminForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
