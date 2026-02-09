// server/models/document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    displayName: String,
  fileName: String,
  filePath: String,
  household: String,
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
