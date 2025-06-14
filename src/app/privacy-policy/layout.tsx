import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Tai Phan Van',
    description: 'Our privacy policy explains how we collect, use, and protect your personal information, including our use of analytics and cookies.',
    robots: 'index, follow'
};

export default function PrivacyPolicyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
