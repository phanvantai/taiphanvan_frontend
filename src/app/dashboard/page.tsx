"use client";

import { redirect } from 'next/navigation';

// Main dashboard page - redirects to overview
export default function DashboardPage() {
    // Redirect immediately to overview
    redirect('/dashboard/overview');
}