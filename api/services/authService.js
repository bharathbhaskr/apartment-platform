const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function loginUser(username, password) {
  const user = await User.findOne({ username: username });
  console.log("userpass", user);
  console.log("input pass", password);
  const passwordMatch = await bcrypt.compare(password, user.password);
  //const passwordMatch = password === user.password;

  if (user && passwordMatch) {
    //User authenticated, generate token
    const token = jwt.sign({ userID: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    //Returning token
    return { user, token };
  } else {
    return null; //Login failure
  }
}

async function registerUser(username, email, password) {
  const salt = 5;
  const HashedPassword = await bcrypt.hash(password, salt);
  console.log(HashedPassword);
  const newUser = new User({ username, email, password: HashedPassword });
  console.log("Before Save", newUser);
  await newUser.save();
  console.log(newUser);
  console.log("USER AFTER REGISTRATION", newUser);

  const token = jwt.sign({ userID: newUser._id }, "your_secret_key", {
    expiresIn: "1h",
  });

  // if (newUser.household === null){
  //   console.log("Null household")
  // } else {
  //   console.log("Non null", newUser.household)
  // }
  return { newUser, token };
}

async function getUserData(headers) {
  //console.log('Printing :' , headers.authorization);
  const token = headers.authorization.replace("Bearer ", "");

  return new Promise((resolve, reject) => {
    jwt.verify(token, "your_secret_key", async (err, decoded) => {
      if (err) {
        console.error("Error verifying token:", err);
        reject(err);
      }

      console.log("Decoded token:", decoded); // Add this line for debugging

      const user = await User.findById(decoded.userID);

      if (user) {
        resolve({ user });
      } else {
        resolve(null);
      }
    });
  });
}

// const createOrJoinHousehold = async (action, inputValue) => {
//   try {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       throw new Error('Token not found');
//     }

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };

//     // Add your logic here to make API request based on action and inputValue
//     const response = await apiCaller.post('/api/household', { action, inputValue }, { headers });

//     return response.data; // You may want to handle the response accordingly
//   } catch (error) {
//     console.error('Error creating or joining household:', error);
//     throw error;
//   }
// };

module.exports = { loginUser, registerUser, getUserData };
