const mongoose = require('mongoose');

//Secure login authentication code below
const bcrypt = require('bcrypt');
//----------------------------------------------

let movieSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},

  Genre:{
    Name: String,
    Description: String
  },

  Director:{
    Name: String,
    Bio: String
  },

  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({

  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});


//-------------Function to hash submitted passwords--------------------------------------------
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};
//------------------------------------------------------------------------------------------------

//-------------Function to compare submitted hash passwords to what's stored in the database-----
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};
//------------------------------------------------------------------------------------------------

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
