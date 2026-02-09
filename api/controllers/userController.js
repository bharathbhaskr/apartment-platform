const express = require('express');
const axios = require('axios'); 
const app = express();
const router = express.Router();
const User = require("../models/userModel");
const Household = require("../models/householdModel");
const dotenv = require("dotenv");
dotenv.config();
const ElasticEmail = require('@elasticemail/elasticemail-client');
const client = ElasticEmail.ApiClient.instance;
const apikey = client.authentications['apikey'];
apikey.apiKey = process.env.YOUR_API_KEY;
const templatesApi = new ElasticEmail.TemplatesApi();
const emailsApi = new ElasticEmail.EmailsApi();



// const postmark = require('postmark');

//
// // Replace 'YOUR_POSTMARK_SERVER_TOKEN' with the actual environment variable
// const postmarkServerToken = process.env.POSTMARK_SERVER_TOKEN;

// // Replace 'YOUR_SERVER_TOKEN' with the token from your Postmark server

// const client = new postmark.ServerClient(postmarkServerToken);

// const sendRegistrationEmail = async (userEmail) => {
//   try {
//     const message = {
//       From: 'desai.aaka@northeastern.edu', // Sender's email
//       To: userEmail, // Recipient's email
//       Subject: 'Welcome to Apartment Amigo!',
//       TextBody: 'Thank you for registering with Apartment Amigo. We are excited to have you!',
//     };

//     const response = await client.sendEmail(message);
//     console.log('Email sent successfully:', response);
//   } catch (error) {
//     console.error('Error sending email:', error.message);
//   }
// };

// const sendinblue = require('sendinblue-api');
// const sendinblueApiKey = 'YOUR_API_KEY';
// const sendinblueClient = new sendinblue(sendinblueApiKey);

// Create a new user
router.post("/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username and email are unique
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    sendEmail(email)
  .then(() => console.log('Email sent successfully to', email))
  .catch((error) => console.error('Failed to send email:', error));

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Get user details
router.get("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate("household");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user information
router.put("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email, password } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { username, email, password },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a user
router.delete("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Join a household
// Join a household
router.post("/users/:userId/join-household/:householdId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const householdId = req.params.householdId;

    const user = await User.findById(userId);
    const household = await Household.findById(householdId);

    if (!user || !household) {
      return res.status(404).json({ message: "User or household not found" });
    }

    if (household.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already a member of the household" });
    }

    household.members.push(userId);
    await household.save();

    user.household = householdId;
    await user.save();

    res
      .status(200)
      .json({
        message: "User joined the household successfully",
        user,
        household,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ...

// Get all members for a specific household
router.get("/households/:householdId/members", async (req, res) => {
  try {
    const householdId = req.params.householdId;
    const household = await Household.findById(householdId).populate("members");
    //console.log("The backend household is", household);
    const members = household.members;
    //console.log("The return value is", members);
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Remove a member from a household (and remove the household object inside member)
router.delete("/households/:householdId/:memberUsername/delete", async (req, res) => {
  try {
    const householdId = req.params.householdId;
    const memberUsername = req.params.memberUsername;

    const member = await User.findOne({username:memberUsername});
    const household = await Household.findById(householdId);

    console.log("Household Before deletion", household);

    //Remove household from member
    member.household = null;
    await member.save();

    // Remove member from household
    household.members = household.members.filter(
      (memberId) => memberId.toString() !== member._id.toString()
    );
    
    await household.save();

    console.log("The updated household is", household);
    console.log("Remove member", member);
    res.json(household._id);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function sendEmail(to){
  try {
    const emailData = {
      Recipients: {
        To: [to]
      },
      Content: {
        Body: [
          {
            ContentType: "HTML",
            Charset: "utf-8",
            Content: `
              <h2>Welcome to Apartment Amigo</h2>
              <p>Congratulations on becoming an Amigo. Let's set you up for a smooth living experience with your roommates.</p>
              <h6>Here's what you should do, now that you have registered:</h6>
              <ol>
                <li>Create or Join a Household</li>
                <li>Invite your roommates to join your household</li>
                <li>Start using the amazing features that we provide</li>
                <li>Relax and live stress-free!</li>
              </ol>
              <p>Have fun!</p>
              <p>Best Regards,</p>
              <p>Team Apartment Amigo</p>
            `
          },
          {
            ContentType: "PlainText",
            Charset: "utf-8",
            Content: "Mail content." // You can leave this as a placeholder or adjust as needed
          }
        ],
        From: "teamapartmentamigo@gmail.com",
        Subject: "Welcome to Apartment Amigo"
      }
    };
    emailsApi.emailsTransactionalPost(emailData, callback);

  
    // The rest of your code to send the email...
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
  }
}

const callback = (error, data, response) => {
  if (error) {
      console.error('error from callback:',error);
  } else {
      console.log('API called successfully.');
      console.log('Email sent.');
  }
};

// Other user controller functions...

module.exports = router;
