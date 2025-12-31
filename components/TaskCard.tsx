
import React from 'react';
import { Task, TaskStatus, Priority } from '../types';
import PriorityChip from './PriorityChip';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onEdit, onDelete }) => {
  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <div className={`relative mb-3 bg-white rounded-2xl p-4 transition-all duration-200 md3-shadow ${isCompleted ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Checkbox Area */}
        <button 
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 transition-colors flex items-center justify-center
            ${isCompleted ? 'bg-[#6750A4] border-[#6750A4]' : 'border-black'}`}
        >
          {isCompleted && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content Area */}
        <div className="flex-grow min-w-0" onClick={() => onEdit(task)}>
          <div className="flex justify-between items-start">
            <h3 className={`font-bold text-lg leading-tight truncate text-black ${isCompleted ? 'line-through opacity-50' : ''}`}>
              {task.title}
            </h3>
          </div>
          <p className="text-sm text-black line-clamp-2 mt-1 mb-2 font-medium">
            {task.description || 'No description'}
          </p>
          
          <div className="flex flex-wrap items-center gap-2">
            <PriorityChip priority={task.priority} />
            <div className="flex items-center text-[12px] text-black font-semibold bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Delete button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="flex-shrink-0 text-black hover:text-red-500 p-1 opacity-50 hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
