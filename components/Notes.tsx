import React, { useState, useEffect } from 'react';
import { Note, Subject, AidType } from '../types';
import { generateStudyAids } from '../services/geminiService';
import Modal from './Modal';
import { Icon } from './Icons';
import {marked} from 'marked';

interface NotesProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  subjects: Subject[];
}

const Notes: React.FC<NotesProps> = ({ notes, setNotes, subjects }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(subjects.length > 0 ? subjects[0].id : null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiContent, setAiContent] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if(selectedSubjectId) {
        const firstNoteOfSubject = notes.filter(n => n.subjectId === selectedSubjectId).sort((a,b) => b.lastModified - a.lastModified)[0];
        setSelectedNote(firstNoteOfSubject || null);
    } else {
        setSelectedNote(null);
    }
  }, [selectedSubjectId, notes]);

  useEffect(() => {
    if (selectedNote) {
      setNoteTitle(selectedNote.title);
      setNoteContent(selectedNote.content);
    } else {
      setNoteTitle('');
      setNoteContent('');
    }
  }, [selectedNote]);

  const handleSaveNote = () => {
    if (!selectedNote || !selectedSubjectId) return;
    const updatedNote = { ...selectedNote, title: noteTitle, content: noteContent, lastModified: Date.now() };
    setNotes(notes.map(n => n.id === selectedNote.id ? updatedNote : n));
  };

  const handleCreateNote = () => {
    if (!selectedSubjectId) return;
    const newNote: Note = {
      id: crypto.randomUUID(),
      subjectId: selectedSubjectId,
      title: 'New Note',
      content: '',
      lastModified: Date.now()
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
  };
  
  const handleDeleteNote = () => {
    if(!selectedNote) return;
    if(window.confirm('Are you sure you want to delete this note?')) {
        setNotes(notes.filter(n => n.id !== selectedNote.id));
        setSelectedNote(null);
    }
  };
  
  const handleGenerateAid = async (type: AidType) => {
      if(!selectedNote || !selectedNote.content) return;
      setIsAiLoading(true);
      setIsAiModalOpen(true);
      const result = await generateStudyAids(selectedNote.content, type);
      const htmlResult = marked.parse(result) as string;
      setAiContent(htmlResult);
      setIsAiLoading(false);
  }

  const subjectNotes = notes
    .filter(n => n.subjectId === selectedSubjectId)
    .sort((a, b) => b.lastModified - a.lastModified);

  return (
    <div className="flex h-full flex-col animate-fade-in-up">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notes</h1>
            {subjects.length > 0 && (
                 <select
                    value={selectedSubjectId || ''}
                    onChange={e => setSelectedSubjectId(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                >
                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            )}
        </div>
      
        {subjects.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">Please add subjects before creating notes.</p>
        ) : (
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)]">
                <div className="md:col-span-1 lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col h-full">
                    <button onClick={handleCreateNote} className="w-full mb-4 inline-flex justify-center items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        <Icon name="add" className="w-5 h-5 mr-2" /> New Note
                    </button>
                    <div className="overflow-y-auto">
                        {subjectNotes.length > 0 ? (
                            <ul>
                            {subjectNotes.map(note => (
                                <li key={note.id}>
                                <a href="#" onClick={e => { e.preventDefault(); setSelectedNote(note); }} className={`block p-2 rounded-lg mb-1 ${selectedNote?.id === note.id ? 'bg-primary-100 dark:bg-primary-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <h4 className="font-semibold truncate text-gray-800 dark:text-gray-200">{note.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(note.lastModified).toLocaleString()}</p>
                                </a>
                                </li>
                            ))}
                            </ul>
                        ) : <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">No notes for this subject.</p>}
                    </div>
                </div>
                <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col h-full">
                {selectedNote ? (
                    <>
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                        <input type="text" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} onBlur={handleSaveNote} className="text-xl font-bold bg-transparent focus:outline-none w-full dark:text-white" />
                        <div className="flex items-center space-x-2">
                             <button onClick={() => handleGenerateAid('summarize')} className="p-2 text-gray-500 hover:text-primary-500" title="Summarize"><Icon name="ai" /></button>
                             <button onClick={() => handleGenerateAid('quiz')} className="p-2 text-gray-500 hover:text-primary-500" title="Generate Quiz"><Icon name="ai" /></button>
                             <button onClick={() => handleGenerateAid('explain')} className="p-2 text-gray-500 hover:text-primary-500" title="Explain Concepts"><Icon name="ai" /></button>
                             <button onClick={handleDeleteNote} className="p-2 text-gray-500 hover:text-red-500" title="Delete Note"><Icon name="delete" /></button>
                        </div>
                    </div>
                    <textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} onBlur={handleSaveNote} placeholder="Start writing your notes here..." className="w-full h-full bg-transparent focus:outline-none resize-none dark:text-gray-300"></textarea>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <Icon name="notes" className="w-16 h-16 mb-4"/>
                        <p>Select a note to view or create a new one.</p>
                    </div>
                )}
                </div>
            </div>
        )}
        <Modal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} title="AI Study Assistant">
            {isAiLoading ? (
                 <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                 </div>
            ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none max-h-[60vh] overflow-y-auto" dangerouslySetInnerHTML={{ __html: aiContent }} />
            )}
        </Modal>
    </div>
  );
};

export default Notes;
