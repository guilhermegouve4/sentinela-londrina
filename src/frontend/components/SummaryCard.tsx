// components/SummaryCard.tsx
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
}

export function SummaryCard({ title, value, icon: Icon, color, bgColor }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className={`text-3xl font-semibold ${color}`}>{value}</p>
      </div>
      <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}>
        <Icon size={20} className={color} />
      </div>
    </div>
  );
}