
import React from 'react';
import { Priority } from '../types';

interface PriorityChipProps {
  priority: Priority;
}

const PriorityChip: React.FC<PriorityChipProps> = ({ priority }) => {
  const getStyles = () => {
    switch (priority) {
      case Priority.HIGH:
        return 'bg-red-100 border-red-200';
      case Priority.MEDIUM:
        return 'bg-orange-100 border-orange-200';
      case Priority.LOW:
        return 'bg-blue-100 border-blue-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border text-black ${getStyles()}`}>
      {priority}
    </span>
  );
};

export default PriorityChip;
