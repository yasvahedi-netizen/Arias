
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  createdAt: number;
}

export type FilterType = 'ALL' | 'PENDING' | 'COMPLETED';
export type SortType = 'DUE_DATE' | 'PRIORITY' | 'CREATED_AT';

export interface AppState {
  tasks: Task[];
  filter: FilterType;
  sortBy: SortType;
}
