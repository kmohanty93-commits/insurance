'use client';

import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Plus,
  Calendar,
  Building,
  User,
  ChevronRight,
  Filter,
  Search,
  Edit2,
  Trash2,
  X,
  Send,
  MessageSquare
} from 'lucide-react';

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
type TaskPriority = 'low' | 'medium' | 'high';

interface Task {
  id: string;
  claim_id: string;
  claim_number: string;
  title: string;
  description: string;
  assigned_department: string;
  assigned_to: string | null;
  due_date: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_by: string;
  created_at: string;
  completed_at: string | null;
  comments: { user: string; message: string; created_at: string }[];
}

const mockTasks: Task[] = [
  {
    id: '1',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    title: 'Collect fire damage photographs',
    description: 'Take comprehensive photographs of all damaged areas in Plant A building',
    assigned_department: 'production',
    assigned_to: 'John Handler',
    due_date: '2024-01-20',
    status: 'completed',
    priority: 'high',
    created_by: 'Admin User',
    created_at: '2024-01-16T10:00:00Z',
    completed_at: '2024-01-18T15:30:00Z',
    comments: [
      { user: 'John Handler', message: 'Started collecting photos from building exterior', created_at: '2024-01-17T09:00:00Z' },
      { user: 'John Handler', message: 'Completed. 150+ photos collected and uploaded', created_at: '2024-01-18T15:30:00Z' },
    ],
  },
  {
    id: '2',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    title: 'Obtain repair quotations',
    description: 'Get repair quotations from at least 3 approved vendors',
    assigned_department: 'finance',
    assigned_to: 'Jane Finance',
    due_date: '2024-01-25',
    status: 'in_progress',
    priority: 'high',
    created_by: 'Admin User',
    created_at: '2024-01-18T09:00:00Z',
    completed_at: null,
    comments: [
      { user: 'Jane Finance', message: 'Contacted ABC Construction and XYZ Builders', created_at: '2024-01-19T10:00:00Z' },
    ],
  },
  {
    id: '3',
    claim_id: '1',
    claim_number: 'PRO-24-00001',
    title: 'Legal review of insurance policy',
    description: 'Review policy terms and conditions for fire damage coverage',
    assigned_department: 'legal',
    assigned_to: 'Bob Legal',
    due_date: '2024-01-22',
    status: 'pending',
    priority: 'medium',
    created_by: 'Admin User',
    created_at: '2024-01-18T09:00:00Z',
    completed_at: null,
    comments: [],
  },
  {
    id: '4',
    claim_id: '2',
    claim_number: 'MAR-24-00001',
    title: 'Obtain Bill of Lading',
    description: 'Get original Bill of Lading from shipping company',
    assigned_department: 'logistics',
    assigned_to: 'Sarah Head',
    due_date: '2024-01-15',
    status: 'overdue',
    priority: 'high',
    created_by: 'Admin User',
    created_at: '2024-01-12T09:00:00Z',
    completed_at: null,
    comments: [
      { user: 'Sarah Head', message: 'Waiting for response from shipping company', created_at: '2024-01-14T11:00:00Z' },
    ],
  },
  {
    id: '5',
    claim_id: '2',
    claim_number: 'MAR-24-00001',
    title: 'Cargo inspection report',
    description: 'Complete inspection of damaged cargo and document findings',
    assigned_department: 'quality',
    assigned_to: null,
    due_date: '2024-01-20',
    status: 'pending',
    priority: 'medium',
    created_by: 'Admin User',
    created_at: '2024-01-14T09:00:00Z',
    completed_at: null,
    comments: [],
  },
  {
    id: '6',
    claim_id: '3',
    claim_number: 'CYB-24-00001',
    title: 'IT forensics analysis',
    description: 'Complete forensics analysis of affected systems',
    assigned_department: 'it',
    assigned_to: 'Mike Auditor',
    due_date: '2024-01-25',
    status: 'in_progress',
    priority: 'high',
    created_by: 'Admin User',
    created_at: '2024-01-20T17:00:00Z',
    completed_at: null,
    comments: [
      { user: 'Mike Auditor', message: 'Started analysis on affected servers', created_at: '2024-01-21T08:00:00Z' },
    ],
  },
];

const departments = [
  { id: 'production', name: 'Production', color: 'bg-blue-100 text-blue-700' },
  { id: 'quality', name: 'Quality', color: 'bg-green-100 text-green-700' },
  { id: 'finance', name: 'Finance', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'legal', name: 'Legal', color: 'bg-red-100 text-red-700' },
  { id: 'hr', name: 'HR', color: 'bg-purple-100 text-purple-700' },
  { id: 'logistics', name: 'Logistics', color: 'bg-orange-100 text-orange-700' },
  { id: 'it', name: 'IT', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'management', name: 'Management', color: 'bg-pink-100 text-pink-700' },
];

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-gray-100 text-gray-700', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700', icon: Clock },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
};

const priorityConfig: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-600' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  high: { label: 'High', color: 'bg-red-100 text-red-700' },
};

export function WorkflowManager() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.claim_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesDept = departmentFilter === 'all' || task.assigned_department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const tasksByStatus = {
    pending: filteredTasks.filter(t => t.status === 'pending'),
    in_progress: filteredTasks.filter(t => t.status === 'in_progress'),
    completed: filteredTasks.filter(t => t.status === 'completed'),
    overdue: filteredTasks.filter(t => t.status === 'overdue'),
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: newStatus,
            completed_at: newStatus === 'completed' ? new Date().toISOString() : null
          }
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };

  const getDepartmentColor = (deptId: string) => {
    return departments.find(d => d.id === deptId)?.color || 'bg-gray-100 text-gray-700';
  };

  const getDepartmentName = (deptId: string) => {
    return departments.find(d => d.id === deptId)?.name || deptId;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-blue-600" />
            Inter-Department Workflow
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track tasks across departments with real-time collaboration
          </p>
        </div>
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-xl font-bold text-gray-900">{tasksByStatus.pending.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-xl font-bold text-gray-900">{tasksByStatus.in_progress.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-xl font-bold text-gray-900">{tasksByStatus.overdue.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-bold text-gray-900">{tasksByStatus.completed.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-2 text-sm ${viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                Kanban
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
            const config = statusConfig[status as TaskStatus];
            const StatusIcon = config.icon;

            return (
              <div key={status} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{config.label}</h3>
                  </div>
                  <span className="px-2 py-1 bg-white rounded-full text-sm font-medium text-gray-600">
                    {statusTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {statusTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onClick={() => setSelectedTask(task)}
                      getDepartmentColor={getDepartmentColor}
                      getDepartmentName={getDepartmentName}
                    />
                  ))}
                  {statusTasks.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Task
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Claim
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTasks.map(task => {
                const statusCfg = statusConfig[task.status];
                const priorityCfg = priorityConfig[task.priority];
                const StatusIcon = statusCfg.icon;

                return (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{task.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{task.claim_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(task.assigned_department)}`}>
                        {getDepartmentName(task.assigned_department)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusCfg.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className={task.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-700'}>
                          {new Date(task.due_date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tasks found</p>
            </div>
          )}
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <NewTaskModal
          onClose={() => setShowNewTaskModal(false)}
          onSave={(task) => {
            setTasks([task, ...tasks]);
            setShowNewTaskModal(false);
          }}
          departments={departments}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={handleStatusChange}
          onAddComment={(taskId, comment) => {
            setTasks(tasks.map(t => 
              t.id === taskId 
                ? { ...t, comments: [...t.comments, comment] }
                : t
            ));
            setSelectedTask({
              ...selectedTask,
              comments: [...selectedTask.comments, comment]
            });
          }}
          getDepartmentColor={getDepartmentColor}
          getDepartmentName={getDepartmentName}
        />
      )}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onClick: () => void;
  getDepartmentColor: (deptId: string) => string;
  getDepartmentName: (deptId: string) => string;
}

function TaskCard({ task, onStatusChange, onClick, getDepartmentColor, getDepartmentName }: TaskCardProps) {
  const priorityCfg = priorityConfig[task.priority];
  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs text-gray-500">{task.claim_number}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityCfg.color}`}>
          {priorityCfg.label}
        </span>
      </div>
      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{task.title}</h4>
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(task.assigned_department)}`}>
          {getDepartmentName(task.assigned_department)}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
          <Calendar className="w-3 h-3" />
          {new Date(task.due_date).toLocaleDateString('en-IN')}
        </div>
        {task.assigned_to && (
          <div className="flex items-center gap-1 text-gray-500">
            <User className="w-3 h-3" />
            {task.assigned_to.split(' ')[0]}
          </div>
        )}
      </div>
      {task.comments.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1 text-xs text-gray-500">
          <MessageSquare className="w-3 h-3" />
          {task.comments.length} comment{task.comments.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

interface NewTaskModalProps {
  onClose: () => void;
  onSave: (task: Task) => void;
  departments: { id: string; name: string; color: string }[];
}

function NewTaskModal({ onClose, onSave, departments }: NewTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    claim_number: 'PRO-24-00001',
    assigned_department: 'production',
    assigned_to: '',
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium' as TaskPriority,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: Date.now().toString(),
      claim_id: '1',
      ...formData,
      assigned_to: formData.assigned_to || null,
      status: 'pending',
      created_by: 'Current User',
      created_at: new Date().toISOString(),
      completed_at: null,
      comments: [],
    };
    onSave(newTask);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to Department <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.assigned_department}
                onChange={(e) => setFormData({ ...formData, assigned_department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To (Optional)
              </label>
              <input
                type="text"
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Person name"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onAddComment: (taskId: string, comment: { user: string; message: string; created_at: string }) => void;
  getDepartmentColor: (deptId: string) => string;
  getDepartmentName: (deptId: string) => string;
}

function TaskDetailModal({ task, onClose, onStatusChange, onAddComment, getDepartmentColor, getDepartmentName }: TaskDetailModalProps) {
  const [newComment, setNewComment] = useState('');
  const statusCfg = statusConfig[task.status];
  const priorityCfg = priorityConfig[task.priority];
  const StatusIcon = statusCfg.icon;

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(task.id, {
        user: 'Current User',
        message: newComment.trim(),
        created_at: new Date().toISOString(),
      });
      setNewComment('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">{task.claim_number}</span>
            <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Status and Actions */}
          <div className="flex items-center gap-4 mb-6">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusCfg.color}`}>
              <StatusIcon className="w-4 h-4" />
              {statusCfg.label}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityCfg.color}`}>
              {priorityCfg.label} Priority
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDepartmentColor(task.assigned_department)}`}>
              {getDepartmentName(task.assigned_department)}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{task.description}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Due Date</span>
              </div>
              <p className="font-medium text-gray-900">
                {new Date(task.due_date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <User className="w-4 h-4" />
                <span className="text-sm">Assigned To</span>
              </div>
              <p className="font-medium text-gray-900">{task.assigned_to || 'Unassigned'}</p>
            </div>
          </div>

          {/* Status Change */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Update Status</h3>
            <div className="flex gap-2">
              {(['pending', 'in_progress', 'completed'] as TaskStatus[]).map(status => {
                const cfg = statusConfig[status];
                return (
                  <button
                    key={status}
                    onClick={() => onStatusChange(task.id, status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      task.status === status
                        ? cfg.color
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comments */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Comments ({task.comments.length})</h3>
            <div className="space-y-3 mb-4">
              {task.comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">{comment.user}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{comment.message}</p>
                </div>
              ))}
              {task.comments.length === 0 && (
                <p className="text-gray-500 text-sm">No comments yet</p>
              )}
            </div>

            {/* Add Comment */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
