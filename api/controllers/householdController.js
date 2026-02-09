const express = require('express');
const router = express.Router();
const Household = require('../models/householdModel');
const ToDoList = require('../models/toDoListModel');
const Chore = require('../models/choreModel')
// Create a new household
router.post('/households', async (req, res) => {
  try {
    const newHousehold = new Household(req.body);
    const savedHousehold = await newHousehold.save();
    res.status(201).json(savedHousehold);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all households
router.get('/households', async (req, res) => {
  try {
    const households = await Household.find();
    res.json(households);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific household by ID
router.get('/households/:id', async (req, res) => {
  try {
    const household = await Household.findById(req.params.id).populate('tasks').populate('chores').populate('members');
    res.json(household);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a household
router.put('/households/:id', async (req, res) => {
  try {
    const updatedHousehold = await Household.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedHousehold);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a household
router.delete('/households/:id', async (req, res) => {
  try {
    const deletedHousehold = await Household.findByIdAndDelete(req.params.id);
    
    // Remove tasks associated with the deleted household
    await ToDoList.deleteMany({ household: req.params.id });
    await Chore.deleteMany({ household: req.params.id });

    res.json({ message: 'Household deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
