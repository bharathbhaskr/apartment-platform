const express = require('express');
const router = express.Router();
const Chore = require('../models/choreModel');
const Household = require('../models/householdModel'); // Import the Household model

// Get all chores for a specific household
router.get('/households/:householdId/chores', async (req, res) => {
  try {
    const householdId = req.params.householdId;
    //console.log('Fetching chores for householdId:', householdId);
    const household = await Household.findById(householdId).populate('chores');
    const chores = household.chores;
    //console.log('Retrieved chores:', chores);
    res.json(chores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new chore for a specific household
router.post('/households/:householdId/chores', async (req, res) => {
  try {
    const householdId = req.params.householdId;
    const newChore = new Chore({ ...req.body, household: householdId });
    const savedChore = await newChore.save();

    // Update the household's chores array with the new chore
    await Household.findByIdAndUpdate(
      householdId,
      { $push: { chores: savedChore._id } },
      { new: true }
    );

    res.json(savedChore);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a chore for a specific household
router.delete('/households/:householdId/chores/:choreId', async (req, res) => {
  try {
    const choreId = req.params.choreId;
    await Chore.findByIdAndDelete(choreId);

    // Update the household's chores array by removing the deleted chore
    await Household.findByIdAndUpdate(
      req.params.householdId,
      { $pull: { chores: choreId } }
    );

    res.json({ message: 'Chore deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update chore completion status
router.patch('/households/:householdId/chores/:choreId', async (req, res) => {
  try {
    const updatedChore = await Chore.findByIdAndUpdate(
      req.params.choreId,
      { completed: req.body.completed },
      { new: true }
    );
    res.json(updatedChore);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update chore details
router.put('/households/:householdId/chores/:choreId', async (req, res) => {
  const {choreName, assignee} = req.body;
  
  try {
    // console.log("REQ body", req.body)
    // const updatedChore = await Chore.findByIdAndUpdate(
    //   req.params.choreId,
    //   {choreName : choreName},
    //   {assignee : assignee},
    //   { new: true }
    // );

    const currentChore = await Chore.findById(req.params.choreId);

    currentChore.assignee = assignee;
    currentChore.choreName = choreName;

    await currentChore.save();

    console.log("Updated chore" , currentChore)
    res.json(currentChore);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// router.put('/households/:householdId/chores/:choreId', async (req, res) => {
//   const { choreName, assignee } = req.body;
//   console.log("CHORE ID",req.params.choreId)
//   try {
//     console.log("CHORE ",req.body)
//     const updatedChore = await Chore.findByIdAndUpdate(
//       req.params.choreId,
//       { choreName, assignee },
//       { new: true }
//     );

//     if (!updatedChore) {
//       return res.status(404).json({ message: 'Chore not found' });
//     }

//     console.log("Updated chore", updatedChore);
//     res.json(updatedChore);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


module.exports = router;
