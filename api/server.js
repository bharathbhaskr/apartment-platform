// Import required modules
const express = require("express");
const app = express();
const cors = require("cors");
//require("dotenv").config({ path: "./configure.env" });
require("dotenv").config();
const connectToDatabase = require('./db/conn');
const multer = require('multer');
const path = require('path');


// Set up the port, default to 5000 if not provided in the environment
const port = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS) for the app
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

//storage:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const household = req.params.householdId;
    const householdFolder = path.join(__dirname, `uploads/${household}`);
    cb(null, householdFolder);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.originalname}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Include the routes defined in the "record" module
app.use(require("./routes/record"));

// Include the authentication Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api",authRoutes);

//Including controllers:
app.use(require("./controllers/toDoListController"));
app.use(require("./controllers/householdController"));
app.use(require("./controllers/ChoreController"));
app.use(require("./controllers/userController"));
app.use(require("./controllers/documentController"));

connectToDatabase().catch((error) => process.exit(1));

// Start the Express app and listen on the specified port
app.listen(port, () => {
  // Log a message indicating that the server is running
  console.log(`Server is running on port: ${port}`);
});
