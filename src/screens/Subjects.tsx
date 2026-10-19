import { useState } from 'react';
import { motion } from 'motion/react';
import { Pencil, Plus, Star, Trash2, Check, X } from 'lucide-react';
import { Subject } from '../types';

interface SubjectsProps {
  subjects: Subject[];
  onUpdate: (subjects: Subject[]) => void;
}

function getColor(score: number) {
  if (score >= 3.5) return 'bg-primary-container';
  if (score >= 3.0) return 'bg-tertiary-container';
  return 'bg-error-container';
}

export default function Subjects({ subjects, onUpdate }: SubjectsProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editScore, setEditScore] = useState('');
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newScore, setNewScore] = useState('');

  const avg = subjects.length > 0
    ? subjects.reduce((a, s) => a + s.score, 0) / subjects.length
    : 0;

  const startEdit = (s: Subject) => {
    setEditing(s.id);
    setEditName(s.name);
    setEditScore(String(s.score));
  };

  const saveEdit = () => {
    const score = parseFloat(editScore);
    if (!editName || isNaN(score) || score < 0 || score > 5) return;
    onUpdate(subjects.map(s => s.id === editing ? { ...s, name: editName, score } : s));
    setEditing(null);
  };

  const deleteSubject = (id: string) => onUpdate(subjects.filter(s => s.id !== id));

  const addSubject = () => {
    const score = parseFloat(newScore);
    if (!newName || isNaN(score) || score < 0 || score > 5) return;
    // Id temporal solo para la actualización optimista en pantalla; el backend
    // asigna el id real al guardar (ver handleUpdateSubjects en App.tsx).
    onUpdate([...subjects, { id: crypto.randomUUID(), name: newName, score }]);
    setNewName('');
    setNewScore('');
    setAdding(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <section className="space-y-1 pl-2">
        <h2 className="text-3xl font-extrabold text-on-surface tracking-tight leading-none">Mis Materias</h2>
        <p className="text-on-surface/60 text-sm font-medium">Seguimiento académico actual</p>
      </section>

      <div className="space-y-4">
        {subjects.map((subject, idx) => (
          <motion.div key={subject.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-on-surface/5">
            {editing === subject.id ? (
              <div className="space-y-3">
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2 text-sm font-semibold text-on-surface outline-none" placeholder="Nombre de la materia" />
                <input value={editScore} onChange={e => setEditScore(e.target.value.replace(',', '.'))} type="number" min="0" max="5" step="0.1"
                  className="w-full bg-surface-container-low rounded-xl px-4 py-2 text-sm font-semibold text-on-surface outline-none" placeholder="Nota (0.0 - 5.0)" />
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="flex-1 bg-primary text-on-primary py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Guardar</button>
                  <button onClick={() => setEditing(null)} className="flex-1 bg-surface-container-low text-on-surface py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><X className="w-4 h-4" /> Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-1.5 h-12 ${getColor(subject.score)} rounded-full`} />
                  <div>
                    <h3 className="font-bold text-on-surface text-sm uppercase tracking-wide">{subject.name}</h3>
                    <span className="text-2xl font-black text-on-surface tracking-tighter">{subject.score.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(subject)} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteSubject(subject.id)} className="w-10 h-10 flex items-center justify-center rounded-full bg-error-container/30 text-red-500 hover:bg-error-container/60 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {adding && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-primary/20 space-y-3">
            <input value={newName} onChange={e => setNewName(e.target.value)}
              className="w-full bg-surface-container-low rounded-xl px-4 py-2 text-sm font-semibold text-on-surface outline-none" placeholder="Nombre de la materia" />
            <input value={newScore} onChange={e => setNewScore(e.target.value.replace(',', '.'))} type="number" min="0" max="5" step="0.1"
              className="w-full bg-surface-container-low rounded-xl px-4 py-2 text-sm font-semibold text-on-surface outline-none" placeholder="Nota (0.0 - 5.0)" />
            <div className="flex gap-2">
              <button onClick={addSubject} className="flex-1 bg-primary text-on-primary py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><Check className="w-4 h-4" /> Agregar</button>
              <button onClick={() => setAdding(false)} className="flex-1 bg-surface-container-low text-on-surface py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><X className="w-4 h-4" /> Cancelar</button>
            </div>
          </motion.div>
        )}
      </div>

      {subjects.length > 0 && (
        <div className="bg-primary-container/20 border border-primary-container/30 p-8 rounded-xl flex flex-col items-center justify-center gap-2 mt-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/10 blur-2xl rounded-full -mr-16 -mt-16" />
          <span className="text-on-primary-container font-black text-[10px] uppercase tracking-widest relative z-10">Promedio General</span>
          <div className="flex items-center gap-3 relative z-10">
            <span className="text-5xl font-black text-primary tracking-tighter">{avg.toFixed(2)}</span>
            <div className="bg-primary p-1.5 rounded-full shadow-lg">
              <Star className="w-5 h-5 text-on-primary fill-current" />
            </div>
          </div>
        </div>
      )}

      {subjects.length === 0 && !adding && (
        <div className="text-center py-10 text-on-surface-variant/50 text-sm font-semibold">
          No tienes materias registradas aún.
        </div>
      )}

      <button onClick={() => setAdding(true)}
        className="fixed bottom-32 right-8 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-90 z-40 border-4 border-white">
        <Plus className="w-8 h-8" />
      </button>
    </motion.div>
  );
}
