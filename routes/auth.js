// // routes/auth.js
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const router = express.Router();

// // Register
// router.get('/register', (req, res) => {
//   res.render('register');
// });

// router.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     // if (user) {
//     //   return res.status(400).render('user-exist') ;
//     // //   res.render('user-exist') ;
//     // }
//     if (user) {
//       return res.render('register', { error: 'User already exists' });
//     }

//     user = new User({ name, email, password });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     const payload = { user: { id: user.id } };
//     jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
//       if (err) throw err;
//       res.cookie('token', token, { httpOnly: true });
//       res.redirect('/files');
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });
// // Example route handler
// // router.post('/register', async (req, res) => {
// //     try {
// //       // Your registration logic here
// //       // Example: const newUser = await User.create(req.body);
// //       res.status(200).json({ message: 'Registration successful' });
// //     } catch (err) {
// //       console.error('Error in registration:', err);
// //       res.status(500).json({ error: 'Internal server error' });
// //     }
// //   });
  

// // Login
// router.get('/login', (req, res) => {
//   res.render('login');
// });

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (!user) {
//       // return res.status(400).json("hello");
//       return res.render('login', { error: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       // return res.status(400).json({ msg: 'Invalid credentials' });
//       return res.render('login', { error: 'Invalid credentials' });
//     }

//     const payload = { user: { id: user.id } };
//     jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
//       if (err) throw err;
//       res.cookie('token', token, { httpOnly: true });
//       res.redirect('/files');
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Logout
// router.get('/logout', (req, res) => {
//   res.clearCookie('token');
//   res.redirect('/login');
// });

// module.exports = router;

// *****************************

// *****************************
/////2ND FILE*******************

// *************************



// ********************
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const router = express.Router();

// // Register
// router.get('/register', (req, res) => {
//   res.render('register', { error: null, success: null });
// });

// router.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.render('register', { error: 'User already exists', success: null });
//     }
    
//     user = new User({ name, email, password });
    
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);
    
//     await user.save();
    
//     const payload = { user: { id: user.id } };
//     jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
//       if (err) throw err;
//       res.cookie('token', token, { httpOnly: true });
//       res.render('files', { error: null, success: 'Registration successful' });
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Login
// router.get('/login', (req, res) => {
//   res.render('login', { error: null, success: null });
// });

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.render('login', { error: 'Invalid credentials', success: null });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.render('login', { error: 'Invalid credentials', success: null });
//     }

//     const payload = { user: { id: user.id } };
//     jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
//       if (err) throw err;
//       res.cookie('token', token, { httpOnly: true });
//       res.render('files', { error: null, success: 'Login successful' });
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Logout
// router.get('/logout', (req, res) => {
//   res.clearCookie('token');
//   res.redirect('/login');
// });

// module.exports = router;

// *****************************

// *****************************
/////3ND FILE*******************

// *************************



// ********************


const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.get('/register', (req, res) => {
  res.render('register', { error: req.session.error, success: req.session.success });
  req.session.error = null;
  req.session.success = null;
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      req.session.error = 'User already exists';
      return res.redirect('/register');
    }

    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true });
      req.session.success = 'Registration successful';
      res.redirect('/');
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.get('/login', (req, res) => {
  res.render('login', { error: req.session.error, success: req.session.success });
  req.session.error = null;
  req.session.success = null;
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      req.session.error = 'Invalid credentials';
      return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.error = 'Invalid credentials';
      return res.redirect('/login');
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, 'secret', { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true });
      req.session.success = 'Login successful';
      res.redirect('/');
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
