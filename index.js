const express = require('express');
morgan = require('morgan');
bodyParser = require('body-parser');
uuid = require ('uuid');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require('express-validator');//Server side validation tool



// Allows mongoose to connect to Movie Base database stored locally
//mongoose.connect('mongodb://localhost:27017/MovieBaseDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Connecting mongoose to the Movie Base Database hosted on Mongo Atlas
// mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect('mongodb+srv://MattH:Motocros202@moviebasedb.js4zy.mongodb.net/MovieBaseDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.urlencoded({ extensed: true}));
app.use(morgan('common'));
app.use(bodyParser.json());

//----------------------------------Code below to import the auth.js file-------------------------------------


const cors = require('cors'); // Might need to move this up in code if nothing works

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

app.use(bodyParser.urlencoded({ extended: true}));
let auth = require('./auth')(app);

//-------------Code below to require the passport module to import the passport.js file-----------------------


const passport = require('passport');
require('./passport');



//--------------------------------------------------Route calls below-------------------------------------------

//------------------------------------Create a new user/allow a new user to register----------------------------
//CREATE CRUD Operation
//Add a user (JSON format below)
/*
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users',

    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(), (req, res) => {


    let errors = validationResult(req); // check the validation object for errors

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

 passport.authenticate('jwt', { session: false}), (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


//----------------------------------Read all user data---------------------------------


//READ CRUD Operation
app.get('/users', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch ((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


//-----------------------------Get a user by username---------------------------------


//READ CRUD Operation
app.get('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



//--------------------------Update a user's info, by username----------------------------
/* Use JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});



//--------------------------------Add a movie to a user's list of favorites---------------------------------


//CREATE CRUD Operation
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.status(200).send ('Movie added to favourites');
    }
  });
});


//-----------------------------------Delete a user by username-------------------------------

//DELETE CRUD Operation
app.delete('/users/:Username', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});



//---------------------------Allow users to remove a movie from their list of favourites-----------------


//DELETE CRUD Operation
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false}), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.status(200).send ('Movie removed from favourites');
    }
  });
});



//-----------------------------------------------------------------------------------------------------


//READ CRUD Operation
app.get('/',(req, res) => {
  res.send('Welcome to Movie Base!');
});


//-----------------------------Returns a list of all the movies-----------------------------

//READ CRUD Operation
app.get('/movies', passport.authenticate('jwt', { session: false}), (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(200).json(movies);
  })
  .catch ((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});




//------------------------Returns data for a movie by using the title------------------------


//READ CRUD Operation
app.get('/movies/:title', passport.authenticate('jwt', { session: false}), (req, res) => {
const { title } = req.params;
const movie = Movies.find (movie => movie.Title === title);

if (movie) {
  res.status(200).json(movie);
} else {
  res.status(400).send('No movie by this name')
}
});



//-------------------------Return data about a genre by using the genre name-----------------


//READ CRUD Operation
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false}), (req, res) => {
const {genreName} = req.params;
const genre = Movies.find (movie => movie.Genre.Name === genreName).Genre;

if (genre) {
  res.status(200).json(genre);
} else {
  res.status(400).send('No genre by this name')
}
});


//----------------------------Return data about a drector by name------------------------


//READ CRUD Operation
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false}), (req, res) => {
const {directorName} = req.params;
const director = MOvies.find (movie => movie.Director.Name === directorName).Director;

if (director) {
  res.status(200).json(director);
} else {
  res.status(400).send('No director by this name')
}
});



//-----------------------------Error handler-----------------------------


app.use((err, req, res, next) =>{
  console.error(err.stack);
  res.status(500).send("Something broke, sorry! We'll get right on that")
});


//------------------------Listener for port 8080-------------------------


const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Movie Base is listening on port ${port}`);
});
