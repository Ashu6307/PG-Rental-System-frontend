import ForgotPasswordForm from '../../components/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Forgot Password | PG & Room Rental',
  description: 'Reset your user account password for PG and room rental services',
};

export default function UserForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
