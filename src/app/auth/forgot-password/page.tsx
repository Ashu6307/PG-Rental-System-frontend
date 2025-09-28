import ForgotPasswordForm from '../components/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | PG & Room Rental',
  description: 'Reset your account password for PG and room rental services',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
