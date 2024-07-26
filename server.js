// const express = require('express');
// const connectDB = require('./db');
// const cookieParser = require('cookie-parser');
// const path = require('path');
// const methodOverride = require('method-override');
// const session = require('express-session'); // Add express-session
// const jwt = require('jsonwebtoken');
// const User = require('./models/User');
// const app = express();

// // Connect to database
// connectDB();

// // JWT secret key
// const jwtSecret = 'your-jwt-secret';
// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static('uploads'));
// app.use(methodOverride('_method'));

// // Session middleware setup
// app.use(session({
//   secret: 'your-secret-key', // Change this to your own secret key
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } // Set to true if using HTTPS
// }));

// // Set EJS as templating engine
// app.set('view engine', 'ejs');

// // Routes
// app.use('/', require('./routes/auth'));
// app.use('/files', require('./routes/files'));

// // Serve home page
// // app.get('/', (req, res) => {
// //   res.render('index');
// // });

// app.get('/', (req, res) => {
//   const token = req.cookies.token;
//   if (!token) {
//     console.log('No token found');
//     return res.render('index', { currentUser: null });
//   }

//   jwt.verify(token, 'secret', (err, decoded) => {
//     if (err) {
//       console.log('Token verification failed');
//       res.clearCookie('token');
//       return res.render('index', { currentUser: null });
//     }

//     User.findById(decoded.user.id)
//       .then(user => {
//         if (!user) {
//           console.log('User not found');
//           return res.render('index', { currentUser: null });
//         }
//         console.log('User found:', user);
//         res.render('index', { currentUser: { id: user.id, email: user.email } });
//       })
//       .catch(err => {
//         console.error('Database error:', err);
//         res.render('index', { currentUser: null });
//       });
//   });
// });




// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));






const express = require('express');
const connectDB = require('./db');
const cookieParser = require('cookie-parser');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const app = express();

// Connect to database
connectDB();

// JWT secret key
const jwtSecret = 'your-jwt-secret';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(methodOverride('_method'));

// Session middleware setup
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Set EJS as templating engine
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./routes/auth'));
app.use('/books', require('./routes/books'));
app.use('/notes', require('./routes/notes'));
app.use('/assignments', require('./routes/assignments'));

app.get('/', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    console.log('No token found');
    return res.render('index', { currentUser: null });
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      console.log('Token verification failed');
      res.clearCookie('token');
      return res.render('index', { currentUser: null });
    }

    User.findById(decoded.user.id)
      .then(user => {
        if (!user) {
          console.log('User not found');
          return res.render('index', { currentUser: null });
        }
        console.log('User found:', user);
        res.render('index', { currentUser: { id: user.id, email: user.email } });
      })
      .catch(err => {
        console.error('Database error:', err);
        res.render('index', { currentUser: null });
      });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
