const express = require('express');
morgan = require('morgan');
bodyParser = require('body-parser');
uuid = require ('uuid');
const app = express();

//-----------------------------------Code to log which pages are visited-----------------------

app.use(morgan('common'));
app.use(bodyParser.json());

//------------------------------------------User data-----------------------------------

let users = [
  {
    id: 1,
    username: 'Jeff',
    favouriteMovies: []
  },

  {
    id: 2,
    username: 'Sarah',
    favouriteMovies: ['Iron Man']
  }
]


//-----------------------------------Manual data entry for movies----------------------------------------

let movies = [
  {
    Title: 'Iron Man',
    Description: 'When Tony Stark, an industrialist, is captured, he constructs a high-tech armoured suit to escape. Once he manages to escape, he decides to use his suit to fight against evil forces to save the world.',

    Genre:{
      Name: 'Action',
      Description: 'Action movies are packed full of high intensity scenes, designed to excite & awe'
    },

    Director:{
    Name: 'Jon Favreau',
    Bio: 'Initially an indie film favorite, actor Jon Favreau has progressed to strong mainstream visibility into the millennium and, after nearly two decades in the business, is still enjoying character stardom as well as earning notice as a writer/producer/director.',
    Birth: '19/10/1966',
    },
  },

  {
    Title: 'Iron Man 2',
    Description: 'With the world now aware of his identity as Iron Man, Tony Stark must contend with both his declining health and a vengeful mad man with ties to his father\'s legacy.',

    Genre:{
      Name: 'Action',
      Description: 'Action movies are packed full of high intensity scenes, designed to excite & awe'
    },

    Director:{
      Name: 'Jon Favreau',
      Bio: 'Initially an indie film favorite, actor Jon Favreau has progressed to strong mainstream visibility into the millennium and, after nearly two decades in the business, is still enjoying character stardom as well as earning notice as a writer/producer/director.',
      Birth: '19/10/1966',
      },
  },

  {
    Title: 'Iron Man 3',
    Description: 'When Tony Stark\'s world is torn apart by a formidable terrorist called the Mandarin, he starts an odyssey of rebuilding and retribution.',

    Genre:{
      Name: 'Action',
      Description: 'Action movies are packed full of high intensity scenes, designed to excite & awe'
    },

    Director:{
    Name: 'Shane Black',
    Bio: 'Considered one of the pioneer screenwriters of the action genre, Black made his mark with his Lethal Weapon (1987) screenplay.',
    Birth: '16/12/1961',
    },
  },

  {
    Title: 'Captain America: The First Avenger',
    Description: 'Steve Rogers, a rejected military soldier, transforms into Captain America after taking a dose of a "Super-Soldier serum". But being Captain America comes at a price as he attempts to take down a war monger and a terrorist organization.',

    Genre:{
      Name: 'Action',
      Description: 'Action movies are packed full of high intensity scenes, designed to excite & awe'
    },

    Director:{
    Name: 'Joe Johnston',
    Bio: 'Joe Johnston was born on May 13, 1950 in Austin, Texas, USA as Joseph Eggleston Johnston II. He is known for his work on Captain America: The First Avenger (2011), Indiana Jones and the Raiders of the Lost Ark (1981) and The Rocketeer (1991).',
    Birth: '13/05/1950',
    },
  },

 {
    Title: 'Spider-Man',
    Description: 'When bitten by a genetically modified spider, a nerdy, shy, and awkward high school student gains spider-like abilities that he eventually must use to fight evil as a superhero after tragedy befalls his family.',

    Genre:{
      Name: 'Action',
      Description: 'Action movies are packed full of high intensity scenes, designed to excite & awe'
    },

    Director:{
    Name: 'Sam Raimi',
    Bio: 'Highly inventive U.S. film director/producer/writer/actor Sam Raimi first came to the attention of film fans with the savage, yet darkly humorous, low-budget horror film, The Evil Dead (1981). From his childhood, Raimi was a fan of the cinema and, before he was ten-years-old, he was out making movies with an 8mm camera. He was a devoted fan of The Three Stooges, so much of Raimi\'s film work in his teens, with good friends Bruce Campbell and Rob Tapert, was slapstick comedy based around what they had observed from "Stooges" movies.',
    Birth: '23/10/1959',
    },
  },

  {
    Title: 'The Avengers',
    Description: 'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.',

    Genre:{
      Name: 'Action',
      Description: 'Action movies are packed full of high intensity scenes, designed to excite & awe'
    },

    Director:{
    Name: 'Joss Whedon',
    Bio: 'Joss Whedon is the middle of five brothers - his younger brothers are Jed Whedon and Zack Whedon. Both his father, Tom Whedon and his grandfather, John Whedon were successful television writers. Joss\' mother, Lee Stearns, was a history teacher and she also wrote novels as Lee Whedon. Whedon was raised in New York and was educated at Riverdale Country School, where his mother also taught. He also attended Winchester College in England for two years, before graduating with a film degree from Wesleyan University.',
    Birth: '23/06/1964',
    },
  },

  {
    Title: 'Man of Steel',
    Description: 'An alien child is evacuated from his dying world and sent to Earth to live among humans. His peace is threatened, when other survivors of his home planet invade Earth.',

    Genre:{
      Name: 'Action',
      Description: 'Action movies are packed full of high intensity scenes, designed to excite & awe'
    },

    Director:{
    Name: 'Zack Snyder',
    Bio: 'Zachary Edward "Zack" Snyder (born March 1, 1966) is an American film director, film producer, and screenwriter, best known for action and science fiction films. Snyder made his feature film debut with the 2004 remake Dawn of the Dead and has gone on to be known for his comic book movies and superhero films, including 300 (2007), Watchmen (2009), Man of Steel (2013) and its upcoming sequel, Batman v Superman: Dawn of Justice (2016). Snyder is the co-founder of Cruel and Unusual Films, a production company he established in 2004, alongside his wife Deborah Snyder and producing partner Wesley Coller.',
    Birth: '01/03/1966',
    },
  },

  {
    Title: 'Eternals',
    Description: 'The saga of the Eternals, a race of immortal beings who lived on Earth and shaped its history and civilizations.',

    Genre:{
      Name: 'Action',
      Description: 'Action movies are packed full of high intensity scenes, designed to excite & awe'
    },

    Director:{
    Name: 'Chloé Zhao',
    Bio: 'Chloé Zhao or Zhao Ting (born March 31, 1982) is a Chinese film director, screenwriter, and producer. Her debut feature film, Songs My Brothers Taught Me (2015), premiered at Sundance Film Festival. Her second feature film, The Rider (2017), was critically acclaimed and received several accolades including nominations for Independent Spirit Award for Best Film and Best Director.',
    Birth: '31/03/1982',
    },
  },

  {
    Title: 'Deadpool',
    Description: 'A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.',

    Genre:{
      Name: 'Comedy',
      Description: 'Action movies are packed full of high intensity scenes, designed to excite & awe'
    },

    Director:{
    Name: 'Tim Miller',
    Bio: 'Tim Miller is an American animator, film director, creative director and visual effects artist. He was nominated for the Academy Award for Best Animated Short Film for the work on his short animated film Gopher Broke. He made his directing debut with Deadpool. Miller is also famous for creating opening sequences of The Girl with the Dragon Tattoo and Thor: The Dark World.',
    Birth: '10/10/1964',
    },
  },

  {
    Title: 'Deadpool 2',
    Description: 'Foul-mouthed mutant mercenary Wade Wilson (a.k.a. Deadpool) assembles a team of fellow mutant rogues to protect a young boy with supernatural abilities from the brutal, time-traveling cyborg Cable.',

    Genre:{
      Name: 'Action',
      Description: 'Action movies are packed full of high intensity scenes, designed to excite & awe'
    },

    Director:{
    Name: 'David Leitch',
    Bio: 'David Leitch is a billion dollar film director, actor, stuntman, writer, producer, and stunt coordinator. He co-directed John Wick (2014) with Chad Stahelski, which he also served as producer. David directed Atomic Blonde (2017) starring Charlize Theron. David also directed the box office smash and critically acclaimed Deadpool 2 (2018). He is the director of Fast and Furious spin off: Hobbs and Shaw (2019). Leitch was a stunt double for Brad Pitt five times, Matt Damon multiple times as well, including Bourne Ultimatum.',
    Birth: '16/11/1975',
    },
  },
];


//-------------------------------------Route calls below----------------------------

//-------------------===-------------Create a new user----------------------------
//CREATE
app.post ('/users', (req, res) => {
const newUser = req.body;

if (newUser.username) {
  newUser.id = uuid.v4();
  users.push(newUser);
  res.status(201).json(newUser)
} else {
  res.status(400).send('Users need a name')
}

});

//-------------------------------Option to update a user's info------------------------
//UPDATE
app.put ('/users/:id', (req, res) => {
const { id } = req.params;
const updatedUser = req.body;

let user = users.find( user => user.id == id);
  if (user) {
    user.username = updatedUser.username;
    res.status(200).json(user);
  } else {
    res.status(400).send('User not found')
  }
});

//------------------------Allow users to add a movie name to their favourite movies list--------------
//CREATE
app.post ('/users/:id/:movieTitle', (req, res) => {
const { id, movieTitle } = req.params;

let user = users.find( user => user.id == id);
  if (user) {
    user.favouriteMovies.push(movieTitle);
    res.status(200).send('movieName has been added to user id\'s array'); //to be added later
  } else {
    res.status(400).send('User not found')
  }
});

//----------------------Allow users to remove movies from their favourite movies list------------------
//DELETE
app.delete ('/users/:id/:movieTitle', (req, res) => {
const { id, movieTitle } = req.params;

let user = users.find( user => user.id == id);
  if (user) {
    user.favouriteMovies = user.favouriteMovies.filter( title => title !== movieTitle);
    res.status(200).send('movieName has been removed from user id\'s array'); //to be added later
  } else {
    res.status(400).send('User not found')
  }
});


//--------------------------Allow users to remove their email from the database---------------------
//DELETE
app.delete ('/users/:id', (req, res) => {
const { id, movieTitle } = req.params;

let user = users.find( user => user.id == id);
  if (user) {
    users = users.filter( user => user.id !== id);
    res.status(200).send('user id has been deleted'); //to be added later
  } else {
    res.status(400).send('User not found')
  }
});
//-----------------------------------------------------------------------------------------------------

//READ
app.get('/',(req, res) => {
  res.send('Welcome to Movie Base!');
});

//-----------------------------Returns a list of all the movies-----------------------------
//READ
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

app.use(express.static("public"));

//------------------------Returns data for a movie by using the title------------------------
//READ
app.get('/movies/:title', (req, res) => {
const { title } = req.params;
const movie = movies.find (movie => movie.Title === title);

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
const genre = movies.find (movie => movie.Genre.Name === genreName).Genre;

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
const director = movies.find (movie => movie.Director.Name === directorName).Director;

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
