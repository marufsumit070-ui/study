import React, { useState } from 'react';
import { Subject } from '../types';
import Modal from './Modal';
import { Icon } from './Icons';

interface SubjectsProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', 
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', 
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
];

const SubjectForm: React.FC<{ onSubmit: (name: string, color: string) => void; subject?: Subject | null }> = ({ onSubmit, subject }) => {
  const [name, setName] = useState(subject?.name || '');
  const [color, setColor] = useState(subject?.color || COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), color);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="subject-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subject Name</label>
        <input
          type="text"
          id="subject-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder="e.g. Quantum Physics"
          required
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Color</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full transition-transform transform ${color === c ? 'ring-2 ring-primary-500 scale-110' : ''}`}
              style={{ backgroundColor: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>
      <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        {subject ? 'Update Subject' : 'Add Subject'}
      </button>
    </form>
  );
};

const Subjects: React.FC<SubjectsProps> = ({ subjects, setSubjects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleAddSubject = (name: string, color: string) => {
    const newSubject: Subject = { id: crypto.randomUUID(), name, color };
    setSubjects([...subjects, newSubject]);
    setIsModalOpen(false);
  };

  const handleEditSubject = (name: string, color: string) => {
    if (editingSubject) {
      setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...s, name, color } : s));
    }
    setEditingSubject(null);
    setIsModalOpen(false);
  };
  
  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const deleteSubject = (id: string) => {
    if(window.confirm('Are you sure you want to delete this subject? This action cannot be undone.')) {
        setSubjects(subjects.filter(s => s.id !== id));
        // Note: In a real app, you would also delete related items (exams, notes, etc.)
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subjects</h1>
        <button
          onClick={openAddModal}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Icon name="add" className="w-5 h-5 mr-2" />
          Add Subject
        </button>
      </div>

      {subjects.length === 0 ? (
         <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No subjects</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first subject.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: subject.color }}></span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{subject.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => openEditModal(subject)} className="text-gray-400 hover:text-primary-500"><Icon name="edit" className="w-5 h-5"/></button>
              <button onClick={() => deleteSubject(subject.id)} className="text-gray-400 hover:text-red-500"><Icon name="delete" className="w-5 h-5"/></button>
            </div>
          </div>
        ))}
      </div>
      )}
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSubject ? 'Edit Subject' : 'Add New Subject'}>
        <SubjectForm onSubmit={editingSubject ? handleEditSubject : handleAddSubject} subject={editingSubject} />
      </Modal>
    </div>
  );
};

export default Subjects;
