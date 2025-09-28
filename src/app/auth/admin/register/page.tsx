import RegisterForm from '../../components/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Registration | PG & Room Rental',
  description: 'Create a new admin account for PG and room rental management',
};

export default function AdminRegisterPage() {
  return <RegisterForm />;
}
