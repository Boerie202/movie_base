const express = require('express');
morgan = require('morgan');
const app = express();

//-----------------------------------Code to log which pages are visited-----------------------

app.use(morgan('common'));

//-----------------------------------Manual data entry----------------------------------------

let topMovies = [
  {
    title: 'Iron Man',
    Genre: 'Action'
  },
  {
    title: 'Iron Man 2',
    Genre: 'Action'
  },
  {
    title: 'Iron Man 3',
    Genre: 'Action'
  },
  {
    title: 'Captain America',
    Genre: 'Action'
  },
 {
    title: 'Spider Man',
    Genre: 'Action'
  },
  {
    title: 'Avengers',
    Genre: 'Action'
  },
  {
    title: 'Avengers EndGame',
    Genre: 'Action'
  },
  {
    title: 'Superman',
    Genre: 'Action'
  },
  {
    title: 'Deadpool',
    Genre: 'Action'
  },
  {
    title: 'Deadpool 2',
    Genre: 'Action'
  },
];


//-------------------------------------Route calls----------------------------

app.get('/',(req, res) => {
  res.send('Welcome to Movie Base!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.get('/movies', (req, res) => {
  res.status(200).json(topMovies);
});

app.use(express.static("public"));

//-----------------------------Error handler-----------------------------

app.use((err, req, res, next) =>{
  console.error(err.stack);
  res.status(500).send("Something broke, sorry! We'll get right on that")
});

//------------------------Listener for port 8080-------------------------

app.listen(8080, () => {
console.log("Movie Base is listening on port 8080");
});
