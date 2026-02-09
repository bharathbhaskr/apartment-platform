// // toDoListController.js
// const express = require('express');
// const router = express.Router();
// const ToDoList = require('../models/toDoListModel'); // Update the path accordingly

// // Get all tasks
// router.get('/tasks', async (req, res) => {
//   try {
//     const tasks = await ToDoList.find();
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Add a new task
// router.post('/tasks', async (req, res) => {
//   try {
//     const newTask = new ToDoList(req.body);
//     const savedTask = await newTask.save();
//     res.json(savedTask);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Delete a task
// router.delete('/tasks/:id', async (req, res) => {
//   try {
//     await ToDoList.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Task deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update task completion status
// router.patch('/tasks/:id', async (req, res) => {
//   try {
//     const updatedTask = await ToDoList.findByIdAndUpdate(
//       req.params.id,
//       { completed: req.body.completed },
//       { new: true }
//     );
//     res.json(updatedTask);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Update task content
// router.put('/tasks/:id', async (req, res) => {
//   try {
//     const updatedTask = await ToDoList.findByIdAndUpdate(
//       req.params.id,
//       { task: req.body.task },
//       { new: true }
//     );
//     res.json(updatedTask);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;

//NEW CODE:
const express = require('express');
const router = express.Router();
const ToDoList = require('../models/toDoListModel');
const Household = require('../models/householdModel'); // Import the Household model

// Get all tasks for a specific household
router.get('/households/:householdId/tasks', async (req, res) => {
  try {
    const householdId = req.params.householdId;
    console.log('Fetching tasks for householdId:', householdId);
    const household = await Household.findById(householdId).populate('tasks');
    const tasks = household.tasks;
    console.log('Retrieved tasks:', tasks);
    res.json(tasks); //CHECK THIS FROM FRONTEND
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Add a new task for a specific household
router.post('/households/:householdId/tasks', async (req, res) => {
  try {
    const householdId = req.params.householdId;
    const newTask = new ToDoList({ ...req.body, household: householdId });
    const savedTask = await newTask.save();
    
    // Update the household's tasks array with the new task
    await Household.findByIdAndUpdate(
      householdId,
      { $push: { tasks: savedTask._id } },
      { new: true }
    );

    res.json(savedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a task for a specific household
router.delete('/households/:householdId/tasks/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    await ToDoList.findByIdAndDelete(taskId);

    // Update the household's tasks array by removing the deleted task
    await Household.findByIdAndUpdate(
      req.params.householdId,
      { $pull: { tasks: taskId } }
    );

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update task completion status
router.patch('/households/:householdId/tasks/:taskId', async (req, res) => {
  try {
    const updatedTask = await ToDoList.findByIdAndUpdate(
      req.params.taskId,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update task content
router.put('/households/:householdId/tasks/:taskId', async (req, res) => {
  try {
    const updatedTask = await ToDoList.findByIdAndUpdate(
      req.params.taskId,
      { task: req.body.task },
      { new: true }
    );
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
