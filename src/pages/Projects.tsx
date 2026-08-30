import { useState, useEffect } from 'react';
import { Plus, FolderOpen, Trash2, Edit3, Calendar, CheckCircle2, Circle, ArrowLeft, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import ProgressRing from '@/components/ProgressRing';
import type { Project, ProjectStatus } from '@/lib/types';

const statuses: ProjectStatus[] = ['Planning', 'In Progress', 'On Hold', 'Completed'];

const statusColors: Record<ProjectStatus, string> = {
  'Planning': '#9d83ba',
  'In Progress': '#5f8a52',
  'On Hold': '#cf8888',
  'Completed': '#82a874',
};

export default function Projects() {
  const { data, addProject, updateProject, deleteProject, toggleProjectTask, addProjectTask } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Planning');
  const [deadline, setDeadline] = useState('');

  const openCreate = () => {
    setEditProject(null);
    setName(''); setDescription(''); setStatus('Planning'); setDeadline('');
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditProject(project);
    setName(project.name); setDescription(project.description);
    setStatus(project.status); setDeadline(project.deadline);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editProject) {
      updateProject(editProject.id, { name, description, status, deadline });
    } else {
      addProject({ name, description, status, deadline });
    }
    setModalOpen(false);
  };

  const handleAddTask = (projectId: string) => {
    if (!newTaskTitle.trim()) return;
    addProjectTask(projectId, newTaskTitle.trim());
    setNewTaskTitle('');
  };

  const currentProject = openProject ? data.projects.find(p => p.id === openProject) : null;

  // Project workspace view
  if (currentProject) {
    return (
      <div className="p-4 md:p-8 space-y-6 animate-page-enter pb-24 md:pb-8">
        <button onClick={() => setOpenProject(null)} className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={18} /> Back to Projects
        </button>

        <div className="card-surface p-6">
          <div className="flex items-start gap-4">
            <ProgressRing
              progress={currentProject.progress}
              size={72}
              strokeWidth={7}
              color={statusColors[currentProject.status]}
              label={`${currentProject.progress}%`}
            />
            <div className="flex-1">
              <h2 className="font-serif text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>{currentProject.name}</h2>
              <p className="text-sm text-secondary mt-1">{currentProject.description}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: statusColors[currentProject.status] + '20', color: statusColors[currentProject.status] }}>
                  {currentProject.status}
                </span>
                {currentProject.deadline && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-secondary-surface text-muted font-medium flex items-center gap-1">
                    <Calendar size={11} /> {new Date(currentProject.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => openEdit(currentProject)} className="p-2 rounded-lg hover:bg-secondary-surface text-muted hover:text-secondary transition-colors">
              <Edit3 size={18} />
            </button>
          </div>
        </div>

        {/* Tasks */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-4">Tasks</h3>
          <div className="space-y-2 mb-4">
            {currentProject.tasks.map(task => (
              <button
                key={task.id}
                onClick={() => toggleProjectTask(currentProject.id, task.id)}
                className="flex items-center gap-3 w-full text-left p-2.5 rounded-lg hover:bg-secondary-surface/50 transition-colors"
              >
                {task.completed
                  ? <CheckCircle2 size={18} className="text-sage-500" />
                  : <Circle size={18} className="text-muted" />}
                <span className={`text-sm ${task.completed ? 'line-through text-muted' : 'text-secondary'}`}>{task.title}</span>
              </button>
            ))}
            {currentProject.tasks.length === 0 && <p className="text-sm text-muted py-2">No tasks yet.</p>}
          </div>
          <div className="flex gap-2">
            <input
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTask(currentProject.id); } }}
              placeholder="Add a task..."
              className="input-field text-sm"
            />
            <button onClick={() => handleAddTask(currentProject.id)} className="btn-secondary text-sm px-4">Add</button>
          </div>
        </div>

        {/* Notes */}
        <div className="card-surface p-5">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">Notes</h3>
          <textarea
            value={currentProject.notes}
            onChange={e => updateProject(currentProject.id, { notes: e.target.value })}
            placeholder="Write project notes..."
            className="input-field min-h-[100px] resize-none text-sm"
          />
        </div>
      </div>
    );
  }

  // Project list view
  return (
    <div className="p-4 md:p-8 space-y-6 animate-page-enter pb-24 md:pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Projects</h2>
          <p className="text-sm text-muted mt-1">{data.projects.length} projects</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> New Project
        </button>
      </div>

      {data.projects.length === 0 ? (
        <EmptyState
          title="No projects yet."
          message="Give your ideas a place to grow."
          actionLabel="Create Project"
          onAction={openCreate}
          icon={<FolderOpen size={32} className="text-sage-400" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.projects.map(project => (
            <div
              key={project.id}
              className="card-surface card-hover p-5 cursor-pointer"
              onClick={() => setOpenProject(project.id)}
            >
              <div className="flex items-start gap-4">
                <ProgressRing
                  progress={project.progress}
                  size={60}
                  strokeWidth={6}
                  color={statusColors[project.status]}
                  label={`${project.progress}%`}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>{project.name}</h3>
                  <p className="text-xs text-secondary mt-0.5 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: statusColors[project.status] + '20', color: statusColors[project.status] }}>
                      {project.status}
                    </span>
                    <span className="text-[10px] text-muted">{project.tasks.filter(t => t.completed).length}/{project.tasks.length} tasks</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                  <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg hover:bg-secondary-surface text-muted hover:text-secondary transition-colors">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => deleteProject(project.id)} className="p-1.5 rounded-lg hover:bg-blush-100 dark:hover:bg-blush-500/20 text-muted hover:text-blush-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editProject ? 'Edit Project' : 'New Project'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5 text-secondary">Project Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="What are you building?" className="input-field" autoFocus />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5 text-secondary">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief overview..." className="input-field min-h-[80px] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5 text-secondary">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value as ProjectStatus)} className="input-field">
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5 text-secondary">Deadline</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editProject ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
