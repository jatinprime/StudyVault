// // routes/files.js
// const express = require('express');
// const multer = require('multer');
// const jwt = require('jsonwebtoken');
// const File = require('../models/File');
// const User = require('../models/User');
// const path = require('path');
// const fs = require('fs');

// const router = express.Router();

// // Configure Multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
// const upload = multer({ storage: storage });

// // Middleware to authenticate user
// function auth(req, res, next) {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.redirect('/login');
//   }
//   try {
//     const decoded = jwt.verify(token, 'secret');
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.redirect('/login');
//   }
// }

// // Upload file
// router.get('/upload', auth, (req, res) => {
//   res.render('upload');
// });

// router.post('/upload', auth, upload.single('file'), async (req, res) => {
//   try {
//     const newFile = new File({
//       user: req.user.id,
//       filename: req.file.filename,
//       filepath: req.file.path
//     });
//     await newFile.save();
//     res.redirect('/files');
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Get all files for the logged-in user
// router.get('/', auth, async (req, res) => {
//   try {
//     const files = await File.find({ user: req.user.id });
//     res.render('files', { files });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Delete file

// // Delete file
// router.delete('/delete/:id', auth, async (req, res) => {
//     try {
//       const file = await File.findById(req.params.id);
//       if (!file) {
//         return res.status(404).json({ msg: 'File not found' });
//       }
  
//       // Check if the logged-in user owns the file
//       if (file.user.toString() !== req.user.id) {
//         return res.status(401).json({ msg: 'Not authorized' });
//       }
  
//       // Delete file from uploads directory
//       fs.unlinkSync(file.filepath);
  
//       // Delete file from database
//       await File.deleteOne({ _id: req.params.id });
  
//       res.redirect('/files');
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   });
  
  

// module.exports = router ;



// routes/files.js
// const express = require('express');
// const multer = require('multer');
// const jwt = require('jsonwebtoken');
// const File = require('../models/File');
// const path = require('path');
// const fs = require('fs-extra');
// const User = require('../models/User');

// const router = express.Router();

// // Middleware to authenticate user
// function auth(req, res, next) {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.redirect('/login');
//   }
//   try {
//     const decoded = jwt.verify(token, 'secret');
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     res.redirect('/login');
//   }
// }
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     }
//   });
// const upload = multer({ storage: storage });
// // Upload file
// router.get('/upload', auth, (req, res) => {
//   res.render('upload');
// });

// router.post('/upload', auth, upload.single('file'), async (req, res) => {
//   try {
//     const newFile = new File({
//       user: req.user.id,
//       filename: req.file.filename,
//       filepath: req.file.path
//     });     
//     await newFile.save();
//     res.redirect('/files');
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Get all files for the logged-in user
// router.get('/', auth, async (req, res) => {
//   try {
//     const files = await File.find({ user: req.user.id });
//     const existingFiles = [];

//     for (const file of files) {
//       if (await fs.pathExists(path.join(__dirname, '..', file.filepath))) {
//         existingFiles.push(file);
//       } else {
//         // Remove the file entry from the database if the file doesn't exist
//         await File.findByIdAndDelete(file._id);
//       }
//     }
//   const success = req.session.success;
//   const error = req.session.error;
//   req.session.success = null;
//   req.session.error = null;
//   // res.render('files', { success, error });

//     res.render('files', { files: existingFiles , success , error});
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Delete file
// router.delete('/delete/:id', auth, async (req, res) => {
//   try {
//     const file = await File.findById(req.params.id);
//     if (!file) {
//       return res.status(404).json({ msg: 'File not found' });
//     }

//     // Check if file exists before trying to delete it
//     if (await fs.pathExists(path.join(__dirname, '..', file.filepath))) {
//       await fs.remove(path.join(__dirname, '..', file.filepath));
//     }

//     await File.deleteOne({ _id: req.params.id });

//     res.redirect('/files');
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;
