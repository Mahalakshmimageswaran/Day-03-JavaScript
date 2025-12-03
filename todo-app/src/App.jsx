import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Calendar, CheckCircle, Circle } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title,
      date: date || new Date().toISOString().split('T')[0],
      priority,
      completed: false,
      editMode: false
    };
    setTasks([newTask, ...tasks]);
    setTitle('');
    setDate('');
    setPriority('medium');
  };

  const toggleTask = (id) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  const updatePriority = (id, priority) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, priority } : t));

  const updateDate = (id, date) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, date } : t));

  const toggleEdit = (id) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, editMode: !t.editMode } : t));

  const updateTitle = (id, title) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, title } : t));

  const clearCompleted = () =>
    setTasks(tasks.filter(t => !t.completed));

  const filteredTasks = tasks
    .filter(t => (activeTab === 'pending' ? !t.completed : true))
    .filter(t => (activeTab === 'completed' ? t.completed : true))
    .filter(t => (activeTab === 'high' ? t.priority === 'high' : true))
    .filter(t => {
      if (activeTab === 'today') {
        const today = new Date().toISOString().split('T')[0];
        return t.date === today;
      }
      return true;
    })
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const sortedTasks = [...filteredTasks].sort(
    (a, b) => ({ high: 0, medium: 1, low: 2 }[a.priority] -
      ({ high: 0, medium: 1, low: 2 }[b.priority]))
  );

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'high').length
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-2">TaskFlow</h1>
        <p className="text-gray-500 mb-6">Stay organized, stay productive</p>

        <Stat label="Pending" value={stats.pending} color="text-blue-600" />
        <Stat label="Completed" value={stats.completed} color="text-green-600" />
        <Stat label="Urgent" value={stats.highPriority} color="text-red-600" />
        <Stat label="Total" value={stats.total} color="text-purple-600" />

        <div className="mt-6 space-y-3">
          <input
            className="w-full border rounded p-2"
            placeholder="Task title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            className="w-full border rounded p-2"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <select
            className="w-full border rounded p-2"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            onClick={addTask}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center gap-2"
          >
            <Plus size={18} /> Add Task
          </button>
          {stats.completed > 0 && (
            <button
              onClick={clearCompleted}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Clear All Completed
            </button>
          )}
        </div>
      </aside>

      {/* Main Section */}
      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        <div className="flex mb-6 gap-4 items-center">
          {['all', 'pending', 'completed', 'high', 'today'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'} pb-2 font-medium`}
            >
              {tab === 'all'
                ? 'All Tasks'
                : tab === 'pending'
                ? 'Pending'
                : tab === 'completed'
                ? 'Completed'
                : tab === 'high'
                ? 'High Priority'
                : "Today's Tasks"}
            </button>
          ))}
          <input
            className="ml-auto border rounded p-2"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {sortedTasks.length === 0 && (
          <p className="text-center text-gray-500 text-lg mt-12">No tasks found</p>
        )}

        <div className="space-y-3">
          {sortedTasks.map(task => (
            <div
              key={task.id}
              className={`flex items-center p-4 rounded-lg shadow bg-white gap-4 border-l-4 ${
                task.priority === 'high'
                  ? 'border-red-500'
                  : task.priority === 'medium'
                  ? 'border-yellow-500'
                  : 'border-green-500'
              }`}
            >
              <button onClick={() => toggleTask(task.id)}>
                {task.completed ? (
                  <CheckCircle size={24} className="text-green-600" />
                ) : (
                  <Circle size={24} className="text-gray-400" />
                )}
              </button>

              <div className="flex-1">
                {task.editMode ? (
                  <input
                    value={task.title}
                    onChange={e => updateTitle(task.id, e.target.value)}
                    onBlur={() => toggleEdit(task.id)}
                    autoFocus
                    className="border rounded p-1 w-full"
                  />
                ) : (
                  <p
                    onDoubleClick={() => toggleEdit(task.id)}
                    className={`font-medium cursor-pointer ${
                      task.completed ? 'line-through text-gray-500' : ''
                    }`}
                  >
                    {task.title}
                  </p>
                )}

                <div className="flex gap-3 text-sm text-gray-600 mt-1 items-center flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar size={15} /> {new Date(task.date).toLocaleDateString()}
                  </span>

                  <select
                    disabled={task.completed}
                    className="border rounded px-2 py-1"
                    value={task.priority}
                    onChange={e => updatePriority(task.id, e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={task.date}
                    onChange={e => updateDate(task.id, e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="flex justify-between items-center py-2 border-b">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}
