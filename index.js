const express = require('express');
morgan = require('morgan');
bodyParser = require('body-parser');
uuid = require ('uuid');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Movie Base is listening on port ${Port}`);
});




// Allows mongoose to connect to Movie Base database
mongoose.connect('mongodb://localhost:27017/Movies', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.urlencoded({ extensed: true}));
app.use(morgan('common'));
app.use(bodyParser.json());


//-------------------------------------Route calls below----------------------------

//------------------------------------Create a new user----------------------------
//CREATE
//Add a user (JSON format)
/*
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'User already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
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

app.get('/users', (req, res) => {
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

app.get('/users/:Username', (req, res) => {
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
app.put('/users/:Username', (req, res) => {
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

app.post('/users/:Username/movies/:MovieID', (req, res) => {
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
app.delete('/users/:Username', (req, res) => {
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

app.delete('/users/:Username/movies/:MovieID', (req, res) => {
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

//READ
app.get('/',(req, res) => {
  res.send('Welcome to Movie Base!');
});

//-----------------------------Returns a list of all the movies-----------------------------
//READ
app.get('/movies', (req, res) => {
  res.status(200).json(Movies);
});

app.use(express.static("public"));

//------------------------Returns data for a movie by using the title------------------------
//READ
app.get('/movies/:title', (req, res) => {
const { title } = req.params;
const movie = Movies.find (movie => movie.Title === title);

if (movie) {
  res.status(200).json(movie);
} else {
  res.status(400).send('No movie by this name')
}

});

//-------------------------Return data about a genre by using the genre name-----------------
//READ
app.get('/movies/genre/:genreName', (req, res) => {
const {genreName} = req.params;
const genre = Movies.find (movie => movie.Genre.Name === genreName).Genre;

if (genre) {
  res.status(200).json(genre);
} else {
  res.status(400).send('No genre by this name')
}

});

//----------------------------Return data about a drector by name------------------------
//READ
app.get('/movies/director/:directorName', (req, res) => {
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

app.listen(8080, () => {
console.log("Movie Base is listening on port 8080");
});
