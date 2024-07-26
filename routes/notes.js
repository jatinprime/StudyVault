const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const File = require('../models/File');
const path = require('path');
const fs = require('fs-extra');

const router = express.Router();

function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.redirect('/login');
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

router.get('/upload', auth, (req, res) => {
  res.render('upload' , {category : 'notes'});
});

router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const newFile = new File({
      user: req.user.id,
      filename: req.file.filename,
      filepath: req.file.path,
      category: 'notes'
    });
    await newFile.save();
    req.session.success = 'Book uploaded successfully';
    res.redirect('/notes');
  } catch (err) {
    // console.error(err.message);  
    console.log("upload error") ;
    req.session.error = 'Failed to upload book';
    res.redirect('/notes');
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id, category: 'notes' });
    const existingFiles = [];

    for (const file of files) {
      if (await fs.pathExists(path.join(__dirname, '..', file.filepath))) {
        existingFiles.push(file);
      } else {
        await File.findByIdAndDelete(file._id);
      }
    }
    const success = req.session.success;
    const error = req.session.error;
    req.session.success = null;
    req.session.error = null;
    res.render('files', { files: existingFiles, success, error , category : 'notes' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ msg: 'File not found' });
    }
    if (await fs.pathExists(path.join(__dirname, '..', file.filepath))) {
      await fs.remove(path.join(__dirname, '..', file.filepath));
    }
    await File.deleteOne({ _id: req.params.id });
    req.session.success = 'Book deleted successfully';
    res.redirect('/notes');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
