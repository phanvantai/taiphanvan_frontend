import { Metadata } from 'next/types';
import RegisterForm from '@/components/RegisterForm';

export const metadata: Metadata = {
    title: 'Register | Tai Phan Van',
    description: 'Create an account to comment on posts and join our community.'
};

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-16 px-4">
            <RegisterForm />
        </div>
    );
}