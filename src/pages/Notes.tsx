import { useState, useEffect } from 'react';
import { Plus, Pin, Search, Trash2, Edit3 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import type { Note, NoteCategory } from '@/lib/types';

interface NotesProps {
  quickAction?: string | null;
  clearQuickAction?: () => void;
}

const categories: NoteCategory[] = ['Ideas', 'Study', 'Work', 'Personal', 'Projects'];

const categoryColors: Record<NoteCategory, string> = {
  'Ideas': '#9d83ba',
  'Study': '#5f8a52',
  'Work': '#5a8a76',
  'Personal': '#cf8888',
  'Projects': '#82a874',
};

export default function Notes({ quickAction, clearQuickAction }: NotesProps) {
  const { data, addNote, updateNote, deleteNote } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<NoteCategory | 'All'>('All');

  // Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('Ideas');

  useEffect(() => {
    if (quickAction === 'new-note') {
      openCreate();
      clearQuickAction?.();
    }
  }, [quickAction, clearQuickAction]);

  const openCreate = () => {
    setEditNote(null);
    setTitle(''); setContent(''); setCategory('Ideas');
    setModalOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditNote(note);
    setTitle(note.title); setContent(note.content); setCategory(note.category);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    if (editNote) {
      updateNote(editNote.id, { title, content, category });
    } else {
      addNote({ title: title || 'Untitled', content, category });
    }
    setModalOpen(false);
  };

  let notes = data.notes;
  if (filter !== 'All') notes = notes.filter(n => n.category === filter);
  if (search.trim()) {
    const q = search.toLowerCase();
    notes = notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }
  notes = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  return (
    <div className="p-4 md:p-8 space-y-6 animate-page-enter pb-24 md:pb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>Notes</h2>
          <p className="text-sm text-muted mt-1">{data.notes.length} notes</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={18} /> New Note
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="input-field pl-10 text-sm"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter('All')}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${filter === 'All' ? 'bg-secondary-surface font-medium' : 'text-muted hover:text-secondary'}`}
            style={filter === 'All' ? { color: 'var(--accent-sage)' } : {}}
          >
            All
          </button>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${filter === c ? 'bg-secondary-surface font-medium' : 'text-muted hover:text-secondary'}`}
              style={filter === c ? { color: categoryColors[c] } : {}}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          title="No notes yet."
          message="Jot down a thought, an idea, a moment."
          actionLabel="New Note"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <div
              key={note.id}
              className="card-surface card-hover p-5 cursor-pointer relative"
              onClick={() => openEdit(note)}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: categoryColors[note.category] + '20', color: categoryColors[note.category] }}
                >
                  {note.category}
                </span>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => updateNote(note.id, { pinned: !note.pinned })}
                    className={`p-1 rounded transition-colors ${note.pinned ? 'text-sage-500' : 'text-muted hover:text-secondary'}`}
                  >
                    <Pin size={14} fill={note.pinned ? 'currentColor' : 'none'} />
                  </button>
                  <button onClick={() => deleteNote(note.id)} className="p-1 rounded text-muted hover:text-blush-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                {note.pinned && <Pin size={12} className="inline mr-1 text-sage-500" fill="currentColor" />}
                {note.title}
              </h3>
              <p className="text-xs text-secondary line-clamp-4 leading-relaxed">{note.content}</p>
              <p className="text-[10px] text-muted mt-3">{new Date(note.updatedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editNote ? 'Edit Note' : 'New Note'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5 text-secondary">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Note title..." className="input-field" autoFocus />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5 text-secondary">Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your thoughts..." className="input-field min-h-[160px] resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5 text-secondary">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as NoteCategory)} className="input-field">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">{editNote ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
