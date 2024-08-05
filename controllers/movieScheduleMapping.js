const { validateMovieScheduleSchema } = require('../lib/movieSchedule');
const MovieSchedule = require('../models/movieScheduleMapping');
const Theatre = require("../models/theatre");
const Movie = require('../models/movie');

const handleGetMovieSchedule = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const LIMIT = 5;
    const skip = (page-1)*LIMIT;
    try {
        const allMovieSchedule = await MovieSchedule.find({}).skip(skip).limit(LIMIT);
        return res.status(201).json({ status: "Movie Schedule Fetched successfully", data: allMovieSchedule, page: page });
    } catch (err) {
        return res.status(500).json({ status: "Internal server error", error: err });
    }
}

const handleCreateMovieSchedule = async (req, res) => {
    const safeParseResult = validateMovieScheduleSchema(req.body);
    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error });
    }
    const { theatreID, movieID, startTime, pricing, language } = safeParseResult.data;
    const movie = await Movie.findById(movieID);
    if(!movie) {
        return res.status(404).json({ status: 'Faied', message: 'Movie not found' });
    }
    const theatre = await Theatre.findById(theatreID);
    if(!theatre) {
        return res.status(404).json({ status: 'Faied', message: 'Theatre not found' });
    }
    try {
        const newMovieSchedule = MovieSchedule.create({ theatreID, movieID, startTime, pricing, language });
        return res.status(201).json({ status: 'Success', message: 'Movie schedule created', data: newMovieSchedule })
    } catch {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ status: 'Failed', message: 'Schedule conflict: a movie is already scheduled at this time in this theatre' });
        }
        return res.status(500).json({ status: 'Failed', message: 'Internal Server Error' });
    }
}

const handleUpdateMovieSchedule = async (req, res) => {
    const safeParseResult = validateMovieScheduleSchema(req.body);
    const movieScheduleID = req.params.id;
    // console.log("Theatre ID", theatreID, isActive)
    if(!movieScheduleID) {
        return res.status(403).json({ status: "Failed", message: "ID not Provided" });
    }
    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error });
    }
    const { theatreID, movieID, startTime, pricing, language } = safeParseResult.data;
    let movieScheduleToUpdate = null;
    try {
        const movie = await Movie.findById(movieID);
        if(!movie) {
            return res.status(404).json({ status: 'Faied', message: 'Movie not found' });
        }
        const theatre = await Theatre.findById(theatreID);
        if(!theatre) {
            return res.status(404).json({ status: 'Faied', message: 'Theatre not found' });
        }
        movieScheduleToUpdate = await MovieSchedule.findById(movieScheduleID);
        // console.log(req.user)
        movieScheduleToUpdate.theatreID = theatreID; 
        movieScheduleToUpdate.movieID = movieID;
        movieScheduleToUpdate.startTime = startTime;
        movieScheduleToUpdate.pricing = pricing;
        movieScheduleToUpdate.language = language;
        await movieScheduleToUpdate.save();
        return res.status(200).json({ status: "Success", message: "Movie Schedule updated successfully", data: movieScheduleToUpdate });
    } catch (err) {
        if(!movieScheduleToUpdate) {
            return res.status(404).json({ status: "Failed", message: "Movie Schedule does not exist" });
        }
        return res.status(500).json({ status: "Internal server error", error: err });
    }
}

const handleDeleteMovieSchedule = async (req, res) => {
    const movieScheduleID = req.params.id;
    try {
        await MovieSchedule.findByIdAndDelete(movieScheduleID);
        return res.status(200).json({ status: "Movie Schedule deleted successfully" });
    } catch (err) {
        return res.status(500).json({ status: "Internal server error", error: err });
    }
}

module.exports = {
    handleGetMovieSchedule,
    handleCreateMovieSchedule,
    handleUpdateMovieSchedule,
    handleDeleteMovieSchedule,
}