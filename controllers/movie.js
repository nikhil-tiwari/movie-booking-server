const Movie = require('../models/movie');
const { validateCreateMovie } = require('../lib/movie');

const handleGetMovie = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const LIMIT = 5;
    const skip = (page-1)*LIMIT;
    try {
        const allMovies = await Movie.find({}).skip(skip).limit(LIMIT);
        return res.status(201).json({ status: "Movie Fetched successfully", data: allMovies, page: page });
    } catch (err) {
        return res.status(500).json({ status: "Internal server error", error: err });
    }
}

const handleGetMovieByName = async (req, res) => {
    const movieName = req.params.name;
    try {
        const movie = await Movie.find({ title: { $regex: new RegExp(movieName, 'i') } });
        if (!movie) {
            return res.status(404).json({ message: "Movie does not exist" });
        }
        return res.status(201).json({ status: "Movie Fetched successfully", data: movie });
    } catch (err) {
        return res.status(500).json({ status: "Internal server error", error: err });
    }
}

const handleCreateMovie = async (req, res) => {
    const safeParseResult = validateCreateMovie(req.body);

    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error });
    }

    const { title, description, releaseYear, director = null, poster = null, rating, runtime, cast, genre, languages, imdbRating } = safeParseResult.data;

    try {
        const newMovie = await Movie.create({ title: title, description: description, releaseYear: releaseYear, director: director, poster: poster, rating: rating, imdbRating: imdbRating,  runtime: runtime, languages: [...languages], cast: [...cast], genre: [...genre] });
        return res.status(201).json({ status: "Movie created successfully", id: newMovie._id });
    } catch (err) {
        return res.status(500).json({ status: "Internal server error", error: err });
    }
}

const handleUpdateMovie = async (req, res) => {
    const safeParseResult = validateCreateMovie(req.body);
    const movieID = req.params.id;
    if(!movieID) {
        return res.status(403).json({ status: "Failed", message: "Name not Provided" });
    }
    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error });
    }
    const { title, description, releaseYear, director = null, poster = null, rating, runtime, cast, genre, languages, imdbRating } = safeParseResult.data;
    let movieToUpdate = null;
    try {
        movieToUpdate = await Movie.findById(movieID);
        movieToUpdate.title = title; 
        movieToUpdate.description = description;
        movieToUpdate.releaseYear = releaseYear;
        movieToUpdate.director = director || null;
        movieToUpdate.imdbRating = imdbRating;
        movieToUpdate.poster = poster || null;
        movieToUpdate.rating = rating;
        movieToUpdate.runtime = runtime;
        movieToUpdate.cast = [...cast];
        movieToUpdate.genre = [...genre];
        movieToUpdate.languages = [...languages];
        await movieToUpdate.save();
        return res.status(200).json({ status: "Success", message: "Movie updated successfully", data: movieToUpdate });
    } catch (err) {
        if(!movieToUpdate) {
            return res.status(404).json({ status: "Failed", message: "Movie does not exist" });
        }
        return res.status(500).json({ status: "Internal server error", error: err });
    }
}

const handleDeleteMovie = async (req, res) => {
    const movieID = req.params.id;
    try {
        await Movie.findByIdAndDelete(movieID);
        return res.status(200).json({ status: "Movie deleted successfully" });
    } catch (err) {
        return res.status(500).json({ status: "Internal server error", error: err });
    }
    
}

module.exports = {
    handleGetMovie,
    handleGetMovieByName,
    handleCreateMovie,
    handleUpdateMovie,
    handleDeleteMovie,
}