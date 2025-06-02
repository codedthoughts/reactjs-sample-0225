import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    detail: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks();
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleTaskCompletion = async (taskId, completed) => {
    try {
      await taskService.updateTask(taskId, { completed });
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, completed } : task
      ));
    } catch (err) {
      setError('Failed to update task status.');
      console.error('Error updating task:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask(newTask);
      setNewTask({ title: '', detail: '', dueDate: '' });
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-900 rounded-lg p-6">
          <div className="flex items-center mb-6">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-8 h-8 mr-3"
            />
            <h1 className="text-xl font-medium text-white">My Tasks</h1>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-white cursor-pointer" onClick={() => setShowModal(true)}>
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span>Add a task</span>
            </div>

            {tasks.map((task) => (
              <div key={task._id} className="text-white">
                <div className="flex items-center cursor-pointer" onClick={() => handleTaskClick(task._id)}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleTaskCompletion(task._id, e.target.checked);
                    }}
                    className="w-8 h-8 rounded-full border-2 border-white mr-3 cursor-pointer"
                  />
                  <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
                </div>
                
                {expandedTaskId === task._id && (
                  <div className="ml-11 mt-2 space-y-2 text-sm text-gray-300">
                    <p><span className="text-gray-400">Due Date:</span> {formatDate(task.dueDate)}</p>
                    <p><span className="text-gray-400">Description:</span> {task.detail}</p>
                    <p><span className="text-gray-400">Status:</span> {task.completed ? 'Completed' : 'Pending'}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Details</label>
                  <textarea
                    name="detail"
                    value={newTask.detail}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
