// server/routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer
const path = require('path');
const fs = require('fs'); 
const Document = require('../models/documentModel');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const householdId = req.params.householdId;
      const householdFolderPath = path.join('uploads', householdId);
  
      // Create the household folder if it doesn't exist
      if (!fs.existsSync(householdFolderPath)) {
        fs.mkdirSync(householdFolderPath, { recursive: true });
      }
  
      cb(null, householdFolderPath);
    },
    filename: (req, file, cb) => {
      const userProvidedFileName = file.originalname || 'default';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(file.originalname);
        console.log(userProvidedFileName)
      cb(null, `${userProvidedFileName}-${uniqueSuffix}${extension}`);
    },
  });
  
  const upload = multer({ storage: storage });
  
  router.post('/uploads/:householdId', upload.single('file'), async (req, res) => {
    const { filename, path } = req.file;
    const household = req.params.householdId;

    console.log(req.file)
  
    // Access the name property inside the file object
    const originalFileName = req.file.originalname;
    console.log('og',originalFileName)
  
    const document = new Document({
      fileName: filename,
      filePath: path,
      household: household,
      originalFileName: originalFileName, // Store the original file name in the database
    });
  
    await document.save();
  
    res.send('File uploaded successfully');
  });

router.get('/uploads/:householdId', async (req, res) => {
    const household = req.params.householdId;
  
    try {
      const documents = await Document.find({ household });
      const documentInfo = documents.map((doc) => ({
        fileName: doc.fileName,
        filePath: doc.filePath,
      }));
  
      res.json(documentInfo);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.delete('/uploads/:householdId', async (req, res) => {
    const householdId = req.params.householdId;
    const householdFolderPath = path.join('uploads', householdId);
  
    try {
      // Check if the folder exists before attempting to delete
      const folderExists = await fs.access(householdFolderPath).then(() => true).catch(() => false);
  
      if (folderExists) {
        // Delete all files in the folder
        const files = await fs.readdir(householdFolderPath);
        await Promise.all(files.map(file => fs.unlink(path.join(householdFolderPath, file))));
  
        // Remove all document entries from the database for the specified household
        await Document.deleteMany({ household: householdId });
  
        res.send('All files deleted successfully');
      } else {
        res.status(404).send('Household folder not found');
      }
    } catch (error) {
      console.error('Error deleting files:', error);
      res.status(500).send('Internal Server Error');
    }
  });
module.exports = router;
