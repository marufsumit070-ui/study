import React from 'react';
import { View } from '../types';
import { Icon, ICONS } from './Icons';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const SIDEBAR_ITEMS: { view: View; label: string; iconName: keyof typeof ICONS }[] = [
    { view: 'dashboard', label: 'Dashboard', iconName: 'dashboard' },
    { view: 'schedule', label: 'Schedule', iconName: 'schedule' },
    { view: 'exams', label: 'Exams', iconName: 'exams' },
    { view: 'assignments', label: 'Assignments', iconName: 'assignments' },
    { view: 'notes', label: 'Notes', iconName: 'notes' },
    { view: 'resources', label: 'Resources', iconName: 'resources' },
    { view: 'subjects', label: 'Subjects', iconName: 'subjects' }
];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const NavLink: React.FC<{ item: typeof SIDEBAR_ITEMS[0]}> = ({ item }) => (
        <li>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setView(item.view);
                    setIsSidebarOpen(false);
                }}
                className={`flex items-center p-2 text-base font-normal rounded-lg transition-colors duration-150 ${
                    currentView === item.view 
                    ? 'bg-primary-500 text-white' 
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
                <Icon name={item.iconName} className="w-6 h-6" />
                <span className="ml-3">{item.label}</span>
            </a>
        </li>
    );

  return (
      <>
        <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed top-4 left-4 z-40 md:hidden p-2 text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 rounded-md"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
        <aside className={`w-64 z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="h-full px-3 py-4 overflow-y-auto">
                <div className="flex items-center pl-2.5 mb-5">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-3 text-primary-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0l-2.072-1.036A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41l-2.072 1.036m-12.156 0a48.636 48.636 0 00-2.072 1.036" />
                    </svg>
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">AcademiaOS</span>
                </div>
                <ul className="space-y-2">
                    {SIDEBAR_ITEMS.map((item) => <NavLink key={item.view} item={item} />)}
                </ul>
            </div>
        </aside>
      </>
  );
};

export default Sidebar;
