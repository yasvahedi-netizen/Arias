
import React, { useState, useEffect, useMemo } from 'react';
import { Task, TaskStatus, Priority, FilterType, SortType } from './types';
import { taskService } from './services/taskService';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';

const App: React.FC = () => {
  // --- State ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [sortBy, setSortBy] = useState<SortType>('DUE_DATE');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Initialize ---
  useEffect(() => {
    const savedTasks = taskService.getAllTasks();
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    taskService.saveTasks(tasks);
  }, [tasks]);

  // --- Logic ---
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    if (filter === 'PENDING') {
      result = result.filter(t => t.status === TaskStatus.PENDING);
    } else if (filter === 'COMPLETED') {
      result = result.filter(t => t.status === TaskStatus.COMPLETED);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'DUE_DATE') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'PRIORITY') {
        const priorityMap = { [Priority.HIGH]: 3, [Priority.MEDIUM]: 2, [Priority.LOW]: 1 };
        return priorityMap[b.priority] - priorityMap[a.priority];
      }
      return b.createdAt - a.createdAt;
    });

    return result;
  }, [tasks, filter, sortBy, searchQuery]);

  const handleCreateOrUpdate = (taskData: any) => {
    if (editingTask) {
      const updated = { ...editingTask, ...taskData };
      setTasks(prev => taskService.updateTask(prev, updated));
    } else {
      const created = taskService.createTask(
        taskData.title,
        taskData.description,
        taskData.dueDate,
        taskData.priority
      );
      setTasks(prev => [created, ...prev]);
    }
    closeForm();
  };

  const handleToggle = (id: string) => {
    setTasks(prev => taskService.toggleStatus(prev, id));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this task?')) {
      setTasks(prev => taskService.deleteTask(prev, id));
    }
  };

  const openForm = (task: Task | null = null) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingTask(null);
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FEF7FF] flex justify-center">
      <div className="w-full max-w-md bg-[#FEF7FF] min-h-screen relative flex flex-col shadow-xl">
        
        {/* Top App Bar */}
        <header className="sticky top-0 z-30 bg-[#FEF7FF]/90 backdrop-blur-md px-4 pt-6 pb-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-black">LeilaTask AI</h1>
            <div className="bg-black p-2 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center">
              <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3EDF7] border-2 border-black rounded-full py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-black outline-none transition-all text-black placeholder-black"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {(['ALL', 'PENDING', 'COMPLETED'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2
                  ${filter === f 
                    ? 'bg-black text-white border-black md3-shadow' 
                    : 'bg-white border-black text-black'}`}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          
          {/* Sort Selector */}
          <div className="mt-4 flex items-center text-xs text-black font-bold gap-2">
            <span>Sort by:</span>
            <select 
              className="bg-transparent border-none outline-none font-black text-black cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
            >
              <option value="DUE_DATE">Due Date</option>
              <option value="PRIORITY">Priority</option>
              <option value="CREATED_AT">Newest First</option>
            </select>
          </div>
        </header>

        {/* Task List */}
        <main className="flex-grow px-4 pb-24 overflow-y-auto">
          {filteredAndSortedTasks.length > 0 ? (
            filteredAndSortedTasks.map((task) => (
              <TaskCard 
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={openForm}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-black">
              <svg className="w-20 h-20 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <p className="text-lg font-bold">No tasks found</p>
              <p className="text-sm font-medium">Try changing filters or adding a new task</p>
            </div>
          )}
        </main>

        {/* FAB */}
        <button 
          onClick={() => openForm()}
          className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center md3-shadow-lg active:scale-95 transition-transform z-40 hover:bg-gray-800"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        {isFormOpen && (
          <TaskForm 
            task={editingTask}
            onSave={handleCreateOrUpdate}
            onCancel={closeForm}
          />
        )}
      </div>
    </div>
  );
};

export default App;
