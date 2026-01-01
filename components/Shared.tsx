import React from 'react';
import { Star } from 'lucide-react';
import { NAV } from '../styles/layout';
import { COMMON } from '../styles/common';

export const NavButton: React.FC<{ 
  active: boolean; 
  icon: React.ReactNode; 
  label: string; 
  onClick: () => void 
}> = ({ active, icon, label, onClick }) => (
  <NAV.BUTTON $active={active} onClick={onClick}>
    {icon}
    <span className="font-medium">{label}</span>
  </NAV.BUTTON>
);

export const StarRating: React.FC<{ rating: number; onChange?: (r: number) => void }> = ({ rating, onChange }) => (
  <COMMON.STAR.CONTAINER>
    {[1, 2, 3].map((star) => (
      <Star
        key={star}
        size={14}
        className={COMMON.STAR.ICON(star <= rating)}
        onClick={(e) => {
          e.stopPropagation();
          if (onChange) onChange(star === rating ? 0 : star);
        }}
      />
    ))}
  </COMMON.STAR.CONTAINER>
);