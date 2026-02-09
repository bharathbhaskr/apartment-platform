const authService = require("../services/authService");
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Household = require("../models/householdModel");
const User = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();
const ElasticEmail = require('@elasticemail/elasticemail-client');
const client = ElasticEmail.ApiClient.instance;
const apikey = client.authentications['apikey'];
apikey.apiKey = process.env.YOUR_API_KEY;
const templatesApi = new ElasticEmail.TemplatesApi();
const emailsApi = new ElasticEmail.EmailsApi();



async function login(req, res) {
  const { username, password } = req.body;

  try {
    const result = await authService.loginUser(username, password);

    if (result) {
      res.status(200).json({
        message: "Login successful",
        user: result.user,
        token: result.token,
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Encountered server error" });
  }
}

async function register(req, res) {
  const { username, email, password } = req.body;
  console.log("Here1")
  //Validation check
  const errors = validateRegistrationInput(username, email, password);
  console.log("post validation")
  if (Object.keys(errors).length > 0) {
    res.status(400).json({ message: "Validation Error", errors });
    return;
  }

  try {
    console.log("inside try")
    const newUser = await authService.registerUser(username, email, password);
    console.log("After awaiting register")
    res.status(201).json({ message: "Registration successful", user: newUser });

    sendEmail(email)
    .then(() => console.log('Email sent successfully to', email))
    .catch((error) => console.error('Failed to send email:', error));


  } catch (error) {
    if (error.name === "ValidationError") {
      res
        .status(400)
        .json({ message: "Validation Error", errors: error.errors });
    } else if (error.name === "MongoServerError" && error.code === 11000) {
      // Duplicate key error (username already exists)
      res
        .status(400)
        .json({ message: "User already exists with this username or email" });
    } else {
      console.error(error);
      res.status(500).json({ message: "Encountered server error" });
    }
  }
}

async function userData(req, res) {
  console.log("Reached here ", req.body.authorization);
  try {
    // No need to check for token presence here; authMiddleware will handle it
    const result = await authService.getUserData(req.headers);

    if (result) {
      res.status(200).json({
        message: "User data retrieved successfully",
        user: result.user,
      });
    } else {
      res.status(401).json({ message: "Invalid token or user data not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Encountered server error" });
  }
}

//Update user information (email and username only)
const updateUserData = async (req, res) => {
  try {
    const userId = req.userId;
    const { username, email } = req.body;

    //console.log("REACHED HERE")

    if (!isValidUsername(username) || !isValidEmail(email)) {
      return res
        .status(400)
        .json({ message: "Invalid username or email format" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true } // Return the updated document
    );

    console.log("New user email and username", user.email, user.username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

  const getAllUsers = async (req,res) => {

    //Since it doesnt pass through middleware, check token
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || token!="fakeToken") {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    try{
    const users = await User.find();
    var length = Object.keys(users).length;
    //console.log("Total users Array", users, length);
  res.status(200).json(length)  
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } 

  }

  const getAllHouseholds = async (req,res) => {

    //Since it doesnt pass through middleware, check token
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || token!="fakeToken") {
      return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    try{
    const households = await Household.find();
    var length = Object.keys(households).length;
    //console.log("Total users Array", households, length);
    res.status(200).json(length)  
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } 

  }

//validation functions
const isValidEmail = (email) => {
  // Add your email validation logic here
  // For example, you might use a regular expression to check the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === "string" && emailRegex.test(email);
};

const isValidUsername = (username) => {
  // Add your username validation logic here
  // For example, you might check for a minimum length, maximum length, or specific character requirements
  return typeof username === "string" && username.length >= 3;
};

function validateRegistrationInput(username, email, password) {
  const errors = {};

  // Username validation
  if (!username || typeof username !== "string") {
    errors.username = "Username is required and must be a string";
  } else if (username.length < 3) {
    errors.username = "Username must be at least 3 characters long";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email)) {
    errors.email = "Email is required and must be a valid email address";
  }

  // Password validation
  if (!password || typeof password !== "string") {
    errors.password = "Password is required and must be a string";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  return errors;
}

const router = express.Router();

// Example of a protected route that checks if the token is valid
router.get("/validateToken", authMiddleware, (req, res) => {
  // If the middleware is reached, the token is valid
  res.status(200).json({ message: "Token is valid" });
});

const createOrJoinHousehold = async (req, res) => {
  try {
    //console.log("!")
    const result = await authService.getUserData(req.headers);

    const { action, inputValue } = req.body;

    const userId = req.userId; // Assuming you have middleware setting userId in the request

    const user = await User.findById(userId);

    const oldHousehold = await Household.findById(user.household);

    

    if (action === "create") {
      // Create a new household
      const newHousehold = new Household({
        name: inputValue,
        members: [userId],
      });

      await newHousehold.save();

      if (oldHousehold) {
        oldHousehold.members = oldHousehold.members.filter(memberId => memberId.toString() !== userId);
        await oldHousehold.save();
      }

      user.household = newHousehold._id;
      await user.save();

      console.log("user ", user);

      res.status(200).json({
        message: "Household created successfully",
        household: newHousehold,
      });
    } else if (action === "join") {
      // Join an existing household
      const household = await Household.findById(inputValue);

      if (!household) {
        return res.status(404).json({ message: "Household not found" });
      }

      if (oldHousehold) {
        oldHousehold.members = oldHousehold.members.filter(memberId => memberId.toString() !== userId);
        await oldHousehold.save();
      }

      // Add the user to the household members
      household.members.push(userId);
      await household.save();

      const user = await User.findById(userId);
      user.household = household._id;
      await user.save();

      res
        .status(200)
        .json({ message: "Joined household successfully", household });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Error creating or joining household:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


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




module.exports = {
  router,
  login,
  register,
  userData,
  createOrJoinHousehold,
  updateUserData,
  getAllUsers,
  getAllHouseholds,
};
