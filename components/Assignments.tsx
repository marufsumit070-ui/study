import React, { useState } from 'react';
import { Assignment, Subject } from '../types';
import Modal from './Modal';
import { Icon } from './Icons';

interface AssignmentsProps {
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  subjects: Subject[];
}

const AssignmentForm: React.FC<{ 
    onSubmit: (title: string, dueDate: string, subjectId: string) => void; 
    subjects: Subject[];
    assignment?: Assignment | null;
}> = ({ onSubmit, subjects, assignment }) => {
  const [title, setTitle] = useState(assignment?.title || '');
  const [dueDate, setDueDate] = useState(assignment?.dueDate || '');
  const [subjectId, setSubjectId] = useState(assignment?.subjectId || (subjects.length > 0 ? subjects[0].id : ''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && dueDate && subjectId) {
      onSubmit(title.trim(), dueDate, subjectId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
       <div>
            <label htmlFor="assignment-title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
            <input type="text" id="assignment-title" value={title} onChange={e => setTitle(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required/>
        </div>
        <div>
            <label htmlFor="assignment-due-date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Due Date</label>
            <input type="date" id="assignment-due-date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" required/>
        </div>
        <div>
            <label htmlFor="assignment-subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Subject</label>
            <select id="assignment-subject" value={subjectId} onChange={e => setSubjectId(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" required>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
        </div>
      <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        {assignment ? 'Update Assignment' : 'Add Assignment'}
      </button>
    </form>
  );
};


const Assignments: React.FC<AssignmentsProps> = ({ assignments, setAssignments, subjects }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  const handleAdd = (title: string, dueDate: string, subjectId: string) => {
    const newAssignment: Assignment = { id: crypto.randomUUID(), title, dueDate, subjectId, completed: false };
    setAssignments([...assignments, newAssignment]);
    setIsModalOpen(false);
  };
  
  const handleEdit = (title: string, dueDate: string, subjectId: string) => {
    if (editingAssignment) {
      setAssignments(assignments.map(a => a.id === editingAssignment.id ? { ...a, title, dueDate, subjectId } : a));
    }
    setEditingAssignment(null);
    setIsModalOpen(false);
  };
  
  const handleDelete = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };
  
  const toggleComplete = (id: string) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const openAddModal = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };
  
  const openEditModal = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const sortedAssignments = [...assignments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
        {subjects.length > 0 && (
            <button
            onClick={openAddModal}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
            <Icon name="add" className="w-5 h-5 mr-2" />
            Add Assignment
            </button>
        )}
      </div>
      {subjects.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Please add subjects before adding assignments.</p>
      ) : assignments.length === 0 ? (
        <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <Icon name="assignments" className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No assignments</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first assignment.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedAssignments.map(assignment => {
              const subject = getSubject(assignment.subjectId);
              return (
                <li key={assignment.id} className={`p-4 flex items-center justify-between transition-colors ${assignment.completed ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
                  <div className="flex items-center">
                    <input type="checkbox" checked={assignment.completed} onChange={() => toggleComplete(assignment.id)} className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-4"/>
                    <span className="w-2.5 h-2.5 rounded-full mr-3" style={{ backgroundColor: subject?.color || '#ccc' }}></span>
                    <div>
                      <p className={`font-medium ${assignment.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{assignment.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Due: {new Date(assignment.dueDate).toLocaleDateString()} - {subject?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => openEditModal(assignment)} className="text-gray-400 hover:text-primary-500"><Icon name="edit" className="w-5 h-5"/></button>
                    <button onClick={() => handleDelete(assignment.id)} className="text-gray-400 hover:text-red-500"><Icon name="delete" className="w-5 h-5"/></button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}>
        <AssignmentForm onSubmit={editingAssignment ? handleEdit : handleAdd} subjects={subjects} assignment={editingAssignment} />
      </Modal>
    </div>
  );
};

export default Assignments;
