
import React, { useState, useEffect } from 'react';
import { Task, Priority, TaskStatus } from '../types';

interface TaskFormProps {
  task?: Task | null;
  onSave: (taskData: any) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate);
      setPriority(task.priority);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setDueDate(today);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, description, dueDate, priority });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FEF7FF] flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 h-16 border-b border-gray-100">
        <button onClick={onCancel} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="ml-2 text-xl font-bold text-black">
          {task ? 'Edit Task' : 'New Task'}
        </h2>
        <button 
          onClick={handleSubmit}
          className="ml-auto bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors"
        >
          Save
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-grow p-6 overflow-y-auto">
        <form className="space-y-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wider">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-white border-b-2 border-black p-3 text-lg outline-none transition-colors text-black font-medium placeholder-gray-400"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={4}
              className="w-full bg-white border-2 border-black rounded-xl p-3 outline-none transition-colors resize-none text-black font-medium placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wider">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-xl p-3 outline-none transition-colors text-black font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wider">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-white border-2 border-black rounded-xl p-3 outline-none transition-colors appearance-none text-black font-bold"
              >
                <option value={Priority.LOW}>Low</option>
                <option value={Priority.MEDIUM}>Medium</option>
                <option value={Priority.HIGH}>High</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
