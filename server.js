const express = require('express');
const bcrypt = require('bcrypt');
const { model, default: mongoose } = require('mongoose');
const app = express();
const Credential = require('./models/user')
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/bcryptTutorial', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error(err));
db.once('open', () => console.log('Connected to Database'));


// Route for user registration
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

     // Store the hashed password in the database
     const data = {
        username: req.body.username,
        password: hashedPassword,
      };

    await Credential.insertMany([data]);
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Route for user login
// app.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Find the user in your database (you should use a real database)
//     const user = bcryptTutorial.find((user) => user.username === username);

//     if (!user) {
//       return res.status(401).send('User not found');
//     }

//     // Compare the entered password with the stored hashed password
//     const passwordMatch = await bcrypt.compare(password, user.password);

//     if (passwordMatch) {
//       res.status(200).send('Login successful');
//     } else {
//       res.status(401).send('Invalid password');
//     }
//   } catch (error) {
//     res.status(500).send('Internal Server Error');
//   }
// });

// Login credential
app.post('/login', async (req, res) => {
    try {
      const user = await Credential.findOne({ username: req.body.username });
  
      if (!user) {
        return res.send('User not found');
      }
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  
      if (passwordMatch) {
        res.status(201).send('Login successfully');
      } else {
        res.send('Incorrect password');
      }
    } catch (error) {
      res.send('An error occurred while logging in.');
    }
  });

  // Starting server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
