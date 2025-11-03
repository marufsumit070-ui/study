import React, { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { View, Subject, ScheduleEntry, Exam, Assignment, Note, Resource } from './types';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Subjects from './components/Subjects';
import Assignments from './components/Assignments';
import Notes from './components/Notes';

const App: React.FC = () => {
    const [view, setView] = useState<View>('dashboard');
    const [subjects, setSubjects] = useLocalStorage<Subject[]>('subjects', []);
    const [schedule, setSchedule] = useLocalStorage<ScheduleEntry[]>('schedule', []);
    const [exams, setExams] = useLocalStorage<Exam[]>('exams', []);
    const [assignments, setAssignments] = useLocalStorage<Assignment[]>('assignments', []);
    const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
    const [resources, setResources] = useLocalStorage<Resource[]>('resources', []);

    // Placeholder components for views not fully implemented in this example
    const PlaceholderView: React.FC<{ name: string }> = ({ name }) => (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-400 dark:text-gray-600">{name}</h1>
                <p className="text-gray-500">This feature is coming soon!</p>
            </div>
        </div>
    );

    const renderView = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard subjects={subjects} assignments={assignments} exams={exams} schedule={schedule} setView={setView} />;
            case 'subjects':
                return <Subjects subjects={subjects} setSubjects={setSubjects} />;
            case 'assignments':
                return <Assignments assignments={assignments} setAssignments={setAssignments} subjects={subjects} />;
            case 'notes':
                return <Notes notes={notes} setNotes={setNotes} subjects={subjects} />;
            case 'schedule':
                return <PlaceholderView name="Schedule" />;
            case 'exams':
                return <PlaceholderView name="Exams" />;
            case 'resources':
                return <PlaceholderView name="Resources" />;
            default:
                return <Dashboard subjects={subjects} assignments={assignments} exams={exams} schedule={schedule} setView={setView} />;
        }
    };
    
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <Sidebar currentView={view} setView={setView} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
};

export default App;
