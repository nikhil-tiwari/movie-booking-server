const { Schema, model }  = require('mongoose')

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
    },
    releaseYear: {
        type: String,
        required: true,
    },
    director: {
        type: String,
    },
    poster: {
        type: String,
    },
    languages: {
        type: [String], 
        required: true,
    },
    cast: {
        type: [String], 
        required: true,
    },
    genre: {
        type: [String], 
        required: true,
    },
    runtime: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    imdbRating: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Movie = model('movie', movieSchema);

module.exports = Movie;