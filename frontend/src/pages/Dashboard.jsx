import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskService, listService } from '../utils/api';
import logo from '../assets/logo.png';

const Dashboard = () => {
  const { user } = useAuth();
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showListModal, setShowListModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [newList, setNewList] = useState({ name: '' });
  const [newTask, setNewTask] = useState({
    title: '',
    detail: '',
    dueDate: ''
  });

  useEffect(() => {
    fetchLists();
    fetchTasks();
  }, []);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const listsData = await listService.getLists();
      console.log('Fetched lists:', listsData); // Debug log
      
      // Handle different response formats
      if (Array.isArray(listsData)) {
        setLists(listsData);
      } else if (listsData && listsData.data && Array.isArray(listsData.data)) {
        setLists(listsData.data);
      } else {
        setLists([]);
      }
      
      setError('');
    } catch (err) {
      setError('Failed to fetch lists. Please try again.');
      console.error('Error fetching lists:', err);
      setLists([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTasks();
      setTasks(response.data || []);
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
      // Add the selected list ID to the task
      const taskWithList = { ...newTask, listId: selectedList };
      await taskService.createTask(taskWithList);
      setNewTask({ title: '', detail: '', dueDate: '' });
      setShowTaskModal(false);
      fetchTasks();
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    console.log('Create list button clicked');
    console.log('List data being sent:', newList);
    
    try {
      console.log('Sending request to create list...');
      const response = await listService.createList(newList);
      console.log('List creation raw response:', response);
      
      // Handle different response formats
      let newListItem;
      if (response && response.data) {
        console.log('Response has data property:', response.data);
        newListItem = response.data.data || response.data;
      } else if (response && response.success && response.data) {
        console.log('Response has success and data properties');
        newListItem = response.data;
      } else {
        console.log('Using response directly as list item');
        newListItem = response;
      }
      
      console.log('Final new list item:', newListItem);
      
      // Add the new list to the state
      setLists(prevLists => {
        console.log('Previous lists:', prevLists);
        const updatedLists = [...prevLists, newListItem];
        console.log('Updated lists:', updatedLists);
        return updatedLists;
      });
      
      setNewList({ name: '' });
      setShowListModal(false);
      
      // Refresh lists from server to ensure we have the correct data
      console.log('Fetching updated lists from server...');
      fetchLists();
    } catch (err) {
      console.error('Error creating list (detailed):', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response?.data);
      setError('Failed to create list. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-800 bg-opacity-30 rounded-lg p-6 backdrop-blur-sm shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="w-10 h-10 mr-3" />
              <h1 className="text-2xl font-bold text-white">My Tasks</h1>
            </div>
            <div>
              <span className="text-white text-sm bg-blue-600 px-3 py-1 rounded-full shadow-sm">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Lists Section */}
          <div className="space-y-4">
            {lists.length === 0 && !loading && (
              <div className="bg-white bg-opacity-20 rounded-lg text-white text-center py-10 px-4 backdrop-blur-sm">
                <svg className="w-16 h-16 mx-auto mb-4 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <p className="text-lg">No lists yet. Create your first list using the + button below.</p>
              </div>
            )}
            
            {loading && lists.length === 0 && (
              <div className="bg-white bg-opacity-20 rounded-lg text-white text-center py-10 px-4 backdrop-blur-sm">
                <div className="animate-pulse flex justify-center">
                  <div className="h-8 w-8 bg-blue-400 rounded-full"></div>
                </div>
                <p className="text-lg mt-4">Loading lists...</p>
              </div>
            )}
            
            {lists.map(list => (
              <div key={list._id} className="bg-white bg-opacity-90 rounded-lg p-4 shadow">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium text-blue-900">{list.name}</h2>
                  <button 
                    onClick={() => {
                      setSelectedList(list._id);
                      setShowTaskModal(true);
                    }}
                    className="text-white bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-full text-sm shadow-sm transition-all hover:shadow-md flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Task
                  </button>
                </div>
                
                {/* Tasks within this list */}
                {tasks
                  .filter(task => task.listId === list._id)
                  .map(task => (
                    <div
                      key={task._id}
                      className="bg-white rounded p-3 mb-2 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => handleTaskClick(task._id)}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => handleTaskCompletion(task._id, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="mr-3"
                        />
                        <span className={`text-black font-medium ${task.completed ? 'line-through' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                      {expandedTaskId === task._id && (
                        <div className="mt-2 text-black">
                          <p>{task.detail}</p>
                          <p className="text-sm mt-1 font-medium">Due: {formatDate(task.dueDate)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                {tasks.filter(task => task.listId === list._id).length === 0 && (
                  <div className="text-gray-600 text-center py-3 text-sm">
                    <p>No tasks in this list yet. Click "Add Task" to create one.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowListModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
      >
        <svg
          className="w-8 h-8 text-blue-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* List Creation Modal */}
      {showListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New List</h2>
            <form onSubmit={handleCreateList}>
              <input
                type="text"
                placeholder="List Name"
                value={newList.name}
                onChange={(e) => setNewList({ name: e.target.value })}
                className="w-full border rounded p-2 mb-4"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowListModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Task Creation Modal */}
      {showTaskModal && (
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Details</label>
                  <textarea
                    name="detail"
                    value={newTask.detail}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
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
