import React, { useState, useEffect } from 'react';
import './ShoppingList.css'; // Import the CSS file
import axios from 'axios';
import backendUrlPrefix from '../../utils/backendUrlPrefix';

const ShoppingList = (props) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const householdID = props.householdID;
  //const householdID='656dffd6e3baf8051351da1a'; //HARDCODED FOR NOW -- UPDATE DYNAMICALLY LATER
  const backendApiUrl = `${backendUrlPrefix}/households/${householdID}/tasks`; // Replace 'your_household_id'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(backendApiUrl);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching data from the backend:', error);
      }
    };

    fetchData();
  }, [backendApiUrl]);

  const addTask = () => {
    if (newTask.trim() === '') return;

    const newTaskObject = {
      task: newTask,
    };

    axios.post(backendApiUrl, newTaskObject)
      .then(response => {
        setTasks([...tasks, response.data]);
      })
      .catch(error => {
        console.error('Error adding task to the backend:', error);
      });

    setNewTask('');
  };

  const deleteTask = (taskId) => {
    axios.delete(`${backendApiUrl}/${taskId}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== taskId));
      })
      .catch(error => {
        console.error('Error deleting task from the backend:', error);
      });

    setEditingTask(null);
  };

  const toggleTaskStatus = (taskId) => {
    axios.patch(`${backendApiUrl}/${taskId}`, { completed: !tasks.find(task => task._id === taskId).completed })
      .then(response => {
        const updatedList = tasks.map((task) =>
          task._id === taskId ? response.data : task
        );
        setTasks(updatedList);
      })
      .catch(error => {
        console.error('Error toggling task status in the backend:', error);
      });

    setEditingTask(null);
  };

  const startEditingTask = (task) => {
    setEditingTask({ ...task });
    setIsModalOpen(true);
  };

  const finishEditingTask = () => {
    axios.put(`${backendApiUrl}/${editingTask._id}`, { task: editingTask.task })
      .then(response => {
        const updatedList = tasks.map((task) =>
          task._id === editingTask._id ? response.data : task
        );
        setTasks(updatedList);
      })
      .catch(error => {
        console.error('Error updating task in the backend:', error);
      });

    setEditingTask(null);
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  return (
    <div className="shopping-list">
      <div className="add-task">
        <div className="input-container">
          <input
            type="text"
            placeholder="Add a new item"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="add-button" onClick={addTask}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
      <table className='sl-table'>
      <thead className='sl-thead'>
        <th>Status</th>
        <th>Item Name</th>
        <th>Actions</th>
      </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className={task.completed ? 'completed' : ''}>
              <td className='sl-td'>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskStatus(task._id)}
                />
              </td>
              <td className='sl-td'>
                {editingTask && editingTask._id === task._id ? (
                  <div className="modal1">
                    <input
                      type="text"
                      value={editingTask.task}
                      onChange={(e) => setEditingTask({ ...editingTask, task: e.target.value })}
                    />
                    <button onClick={finishEditingTask}>
                      <i className="fas fa-check"></i>
                    </button>
                    <button onClick={handleModalClose}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <span>{task.task}</span>
                )}
              </td>
              <td className='sl-td'>
                <div>
                  <button onClick={() => startEditingTask(task)} disabled={task.completed} className='my-btn edit-btn'>
                    <i className="fas fa-pencil-alt" ></i>
                  </button>
                  <button onClick={() => deleteTask(task._id)} className='my-btn'>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShoppingList;
