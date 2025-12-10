import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Plus,
  Calendar,
  CheckCircle,
  Circle,
  List,
  Clock,
  Check,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [search, setSearch] = useState('');
  const [dailyGoal, setDailyGoal] = useState(5);
  const [timeRequired, setTimeRequired] = useState(1);

  // Timer states
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsLeft, setSessionsLeft] = useState(0);

  // Timer functionality
  useEffect(() => {
    let interval;

    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const handleTimerComplete = () => {
    if (!isBreak) {
      setIsBreak(true);
      setTimerSeconds(5);
      setTimerActive(false);
    } else {
      if (sessionsLeft > 1) {
        setIsBreak(false);
        setTimerSeconds(25);
        setSessionsLeft((n) => n - 1);
        setTimerActive(false);
      } else {
        completeTaskSession();
      }
    }
  };

  const startTaskWithTimer = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const totalSessions = (task.timeRequired || 1) * 5;
    setCurrentTaskId(taskId);
    setSessionsLeft(totalSessions);
    setIsBreak(false);
    setTimerSeconds(25);
    setTimerActive(true);
  };

  const completeTaskSession = () => {
    if (currentTaskId) {
      toggleTask(currentTaskId);
    }
    resetTimer();
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(25);
    setCurrentTaskId(null);
    setIsBreak(false);
    setSessionsLeft(0);
  };

  // Add Task
  const addTask = () => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title,
      date: date || new Date().toISOString().split('T')[0],
      priority,
      timeRequired,
      completed: false,
      editMode: false
    };

    setTasks([newTask, ...tasks]);
    setTitle('');
    setDate('');
    setPriority('medium');
    setTimeRequired(1);
  };

  // Task functions
  const toggleTask = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const deleteTask = (id) => setTasks(tasks.filter((t) => t.id !== id));

  const updatePriority = (id, priority) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, priority } : t)));

  const updateDate = (id, date) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, date } : t)));

  const updateTimeRequired = (id, timeRequired) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, timeRequired } : t)));

  const toggleEdit = (id) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, editMode: !t.editMode } : t)));

  const updateTitle = (id, title) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title } : t)));

  const clearCompleted = () => setTasks(tasks.filter((t) => !t.completed));

  // Filtering
  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter((t) => t.date === today);
  const todaysCompleted = todaysTasks.filter((t) => t.completed).length;

  const filteredTasks = tasks
    .filter((t) => (activeTab === 'pending' ? !t.completed : true))
    .filter((t) => (activeTab === 'completed' ? t.completed : true))
    .filter((t) => (activeTab === 'high' ? t.priority === 'high' : true))
    .filter((t) => (activeTab === 'today' ? t.date === today : true))
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  const sortedTasks = [...filteredTasks].sort(
    (a, b) =>
      ({ high: 0, medium: 1, low: 2 }[a.priority] -
        { high: 0, medium: 1, low: 2 }[b.priority])
  );

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    highPriority: tasks.filter((t) => t.priority === 'high').length
  };

  const currentTask = tasks.find((t) => t.id === currentTaskId);
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  return (
    <div className="flex h-screen flex-col">

      {/* TIMER NAVBAR */}
      <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">

          <div className="flex items-center gap-4">
            <Clock size={24} />
            <span className="font-semibold text-lg">TaskFlow Timer</span>
          </div>

          <div className="flex items-center gap-4">

            {currentTask && (
              <div className="text-sm">
                <p className="font-semibold">
                  {isBreak ? '☕ BREAK TIME' : '⏱ Working on'}
                </p>
                <p className="text-xs opacity-90">{currentTask.title}</p>
                <p className="text-xs opacity-75">Sessions left: {sessionsLeft}</p>
              </div>
            )}

            <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2 text-center">
              <p className="text-2xl font-mono font-bold">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </p>
              {currentTask && (
                <p className="text-xs">{isBreak ? 'Break' : 'Work'}</p>
              )}
            </div>

            {/* Start / Pause / Reset */}
            {currentTask && (
              <div className="flex gap-2">
                {!timerActive ? (
                  <button
                    onClick={() => setTimerActive(true)}
                    className="bg-green-500 hover:bg-green-600 p-2 rounded"
                  >
                    <Play size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => setTimerActive(false)}
                    className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded"
                  >
                    <Pause size={18} />
                  </button>
                )}

                <button
                  onClick={resetTimer}
                  className="bg-red-500 hover:bg-red-600 p-2 rounded"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            )}

          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-80 bg-white shadow-lg p-6 flex flex-col">

          {/* Scrollable area */}
          <div className="flex-1 overflow-y-auto pb-6">

            <h1 className="text-3xl font-bold mb-2">TaskFlow</h1>
            <p className="text-gray-500 mb-4">Stay organized, stay productive</p>

            {/* DAILY GOAL */}
            <div className="p-4 bg-blue-100 rounded-lg border mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-blue-700">📊 Daily Goal</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={dailyGoal}
                  onChange={(e) =>
                    setDailyGoal(parseInt(e.target.value) || 1)
                  }
                  className="w-12 border rounded p-1 text-center"
                />
              </div>

              <p className="text-4xl font-bold text-blue-600">
                {todaysCompleted}/{dailyGoal}
              </p>

              <div className="w-full bg-gray-300 h-3 rounded-full my-2 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width: `${Math.min(
                      (todaysCompleted / dailyGoal) *
                        100,
                      100
                    )}%`
                  }}
                />
              </div>

              <p className="text-sm font-semibold text-blue-700">
                {dailyGoal - todaysCompleted} tasks left
              </p>
            </div>

            {/* STATS */}
            <Stat label="Pending" value={stats.pending} />
            <Stat label="Completed" value={stats.completed} />
            <Stat label="Urgent" value={stats.highPriority} />
            <Stat label="Total" value={stats.total} />

            {/* INPUT AREA */}
            <div className="mt-6 space-y-3">
              <input
                className="w-full border rounded p-2"
                placeholder="Task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />

              <input
                className="w-full border rounded p-2"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <select
                className="w-full border rounded p-2"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select
                className="w-full border rounded p-2"
                value={timeRequired}
                onChange={(e) => setTimeRequired(parseInt(e.target.value))}
              >
                <option value="1">1 minute</option>
                <option value="2">2 minutes</option>
                <option value="3">3 minutes</option>
                <option value="4">4 minutes</option>
              </select>
            </div>
          </div>

          {/* FIXED BUTTONS */}
          <div className="pt-4 border-t space-y-3">
            <button
              onClick={addTask}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Task
            </button>

            {stats.completed > 0 && (
              <button
                onClick={clearCompleted}
                className="w-full bg-red-600 text-white py-2 rounded"
              >
                Clear Completed
              </button>
            )}
          </div>

        </aside>

        {/* TASKS MAIN SECTION */}
        <main className="flex-1 bg-gray-100 p-8 overflow-y-auto pb-24">

          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-semibold">Tasks</h2>
            <input
              className="ml-auto border rounded p-2"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {sortedTasks.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-12">No tasks found</p>
          ) : (
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center p-4 rounded-lg shadow bg-white border-l-4 ${
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

                  <div className="flex-1 px-4">
                    {task.editMode ? (
                      <input
                        value={task.title}
                        onChange={(e) =>
                          updateTitle(task.id, e.target.value)
                        }
                        onBlur={() => toggleEdit(task.id)}
                        autoFocus
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      <p
                        onDoubleClick={() => toggleEdit(task.id)}
                        className={`font-medium ${
                          task.completed
                            ? 'line-through text-gray-500'
                            : ''
                        }`}
                      >
                        {task.title}
                      </p>
                    )}

                    {/* Task details row */}
                    <div className="flex flex-wrap gap-3 text-sm mt-1">

                      <span className="flex items-center gap-1">
                        <Calendar size={15} />{' '}
                        {new Date(task.date).toLocaleDateString()}
                      </span>

                      <select
                        value={task.priority}
                        disabled={task.completed}
                        onChange={(e) =>
                          updatePriority(task.id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>

                      <input
                        type="date"
                        value={task.date}
                        onChange={(e) =>
                          updateDate(task.id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      />

                      <select
                        disabled={task.completed}
                        value={task.timeRequired}
                        onChange={(e) =>
                          updateTimeRequired(
                            task.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="1">⏰ 1m</option>
                        <option value="2">⏰ 2m</option>
                        <option value="3">⏰ 3m</option>
                        <option value="4">⏰ 4m</option>
                      </select>

                      {!task.completed && currentTaskId !== task.id && (
                        <button
                          onClick={() =>
                            startTaskWithTimer(task.id)
                          }
                          className="bg-purple-500 text-white px-3 py-1 rounded text-xs"
                        >
                          ▶ START
                        </button>
                      )}
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
          )}

          {/* Bottom Nav */}
          <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner">
            <div className="max-w-7xl mx-auto flex justify-around items-center py-3">
              {[
                { key: 'all', label: 'All Tasks', Icon: List },
                { key: 'pending', label: 'Pending', Icon: Clock },
                { key: 'completed', label: 'Completed', Icon: Check },
                { key: 'high', label: 'High Priority', Icon: AlertTriangle },
                { key: 'today', label: "Today's Tasks", Icon: Calendar }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex flex-col items-center text-sm ${
                    activeTab === item.key
                      ? 'text-blue-600'
                      : 'text-gray-600'
                  }`}
                >
                  <item.Icon size={20} />
                  <span className="hidden md:block">{item.label}</span>
                </button>
              ))}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* STAT COMPONENT */
function Stat({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-2 border-b">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
