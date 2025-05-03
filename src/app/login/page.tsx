import { Metadata } from 'next/types';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
    title: 'Login | Tai Phan Van',
    description: 'Sign in to your account to post comments and interact with the community.'
};

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-16 px-4">
            <LoginForm />
        </div>
    );
}