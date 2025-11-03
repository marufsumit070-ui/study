import React from 'react';
import { Assignment, Exam, ScheduleEntry, Subject, DayOfWeek, DAYS_OF_WEEK } from '../types';
// FIX: Import ICONS object to use for typing the iconName prop.
import { Icon, ICONS } from './Icons';

interface DashboardProps {
  subjects: Subject[];
  assignments: Assignment[];
  exams: Exam[];
  schedule: ScheduleEntry[];
  setView: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ subjects, assignments, exams, schedule, setView }) => {

  const getSubject = (id: string) => subjects.find(s => s.id === id);

  const today = new Date();
  const todayIndex = (today.getDay() + 6) % 7; // Monday is 0
  const tomorrowDay = DAYS_OF_WEEK[(todayIndex + 1) % 7];

  const tomorrowSchedule = schedule
    .filter(item => item.day === tomorrowDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const upcomingAssignments = assignments
    .filter(a => !a.completed && new Date(a.dueDate) >= today && new Date(a.dueDate) <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const upcomingExams = exams
    .filter(e => new Date(e.date) >= today && new Date(e.date) <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  const StatCard: React.FC<{title: string, value: number, iconName: keyof typeof ICONS, color: string}> = ({title, value, iconName, color}) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            <Icon name={iconName} className="w-6 h-6 text-white"/>
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's a summary of your academic life.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Subjects" value={subjects.length} iconName="subjects" color="bg-blue-500" />
        <StatCard title="Pending Assignments" value={assignments.filter(a => !a.completed).length} iconName="assignments" color="bg-yellow-500" />
        <StatCard title="Upcoming Exams" value={exams.filter(e => new Date(e.date) >= today).length} iconName="exams" color="bg-red-500" />
        <StatCard title="Total Notes" value={0} iconName="notes" color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Tomorrow's Schedule ({tomorrowDay})</h2>
          {tomorrowSchedule.length > 0 ? (
            <ul className="space-y-4">
              {tomorrowSchedule.map(item => {
                const subject = getSubject(item.subjectId);
                return (
                  <li key={item.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-2 h-12 rounded" style={{backgroundColor: subject?.color || '#ccc'}}></div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{subject?.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.startTime} - {item.endTime} @ {item.location}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No classes scheduled for tomorrow. Enjoy your day off!</p>
          )}
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Deadlines (Next 7 Days)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Assignments</h3>
              {upcomingAssignments.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingAssignments.map(a => {
                    const subject = getSubject(a.subjectId);
                    return (
                        <li key={a.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                          <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: subject?.color || '#ccc' }}></span>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{a.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                          </div>
                        </li>
                    )
                  })}
                </ul>
              ) : <p className="text-sm text-gray-500 dark:text-gray-400">No assignments due soon.</p>}
            </div>
            <div>
              <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Exams</h3>
              {upcomingExams.length > 0 ? (
                <ul className="space-y-3">
                  {upcomingExams.map(e => {
                      const subject = getSubject(e.subjectId);
                      return (
                        <li key={e.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                          <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: subject?.color || '#ccc' }}></span>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{e.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Date: {new Date(e.date).toLocaleDateString()}</p>
                          </div>
                        </li>
                      )
                  })}
                </ul>
              ) : <p className="text-sm text-gray-500 dark:text-gray-400">No exams scheduled soon.</p>}
            </div>
          </div>
        </div>
      </div>
       {subjects.length === 0 && (
         <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-dashed border-primary-400">
            <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">Welcome to AcademiaOS!</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">To get started, you should add some subjects first.</p>
             <button onClick={() => setView('subjects')} className="mt-4 inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Add Subjects
             </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;