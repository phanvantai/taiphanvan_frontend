import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Game Note - PES Community App',
    description: 'Trải nghiệm ứng dụng cộng đồng bóng đá và esport PES đỉnh cao. Tạo các giải đấu, theo dõi số liệu thống kê và tham gia cộng đồng người chơi sôi động.',
};

export default function GameNoteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="game-note-layout">
            {children}
        </div>
    );
}