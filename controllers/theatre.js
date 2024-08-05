const Theatre = require("../models/theatre");
const { validateTheatreSchema } = require('../lib/theatre');

const handleGetTheatre = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const LIMIT = 5;
    const skip = (page-1)*LIMIT;
    try {
        const allTheatres = await Theatre.find({}).skip(skip).limit(LIMIT);
        return res.status(201).json({ status: "Movie Fetched successfully", data: allTheatres, page: page });
    } catch (err) {
        return res.status(500).json({ status: "Internal server error", error: err });
    }
}

const handleGetTheatreByName = async (req, res) => {
    const theatreName = req.params.name;
    try {
        const theatre = await Theatre.find({ name: { $regex: new RegExp(theatreName, 'i') } });
        if(!theatre) {
            return res.status(404).json({ message: "Theatre does not exists" });
        }
        return res.status(201).json({ status: "Theatre Fetched successfully", data: theatre });
    } catch (err) {
        return res.status(500).json({ status: "Internal server error", error: err });
    }
}

const handleCreateTheatre = async (req, res) => {
    const safeParseResult = validateTheatreSchema(req.body);
    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error });
    }
    const { name, location: { city, lat = null, long = null, address } } = safeParseResult.data;
    const userID = req.user.id;
    try {
        const newTheatre = await Theatre.create({ name: name, location: { city: city, lat: lat, long: long, address: address }, createdBy: userID });
        return res.status(200).json({ status: "Success", message: "New theatre created", data: newTheatre });
    } catch {
        return res.status(500).json({ status: "Failed", message: "Internal server error" });
    }
}

const handleUpdateTheatre = async (req, res) => {
    const safeParseResult = validateTheatreSchema(req.body);
    const isActive = (req.body.isActive === 'false' || req.body.isActive === false) ? false : true;
    const theatreID = req.params.id;
    // console.log("Theatre ID", theatreID, isActive)
    if(!theatreID) {
        return res.status(403).json({ status: "Failed", message: "ID not Provided" });
    }
    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error });
    }
    const { name, location: { city, lat = null, long = null, address } } = safeParseResult.data;
    let theatreToUpdate = null;
    try {
        theatreToUpdate = await Theatre.findById(theatreID);
        if(theatreToUpdate.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ status: 'Failed', message: "User can only edit their own theatre" });
        }
        // console.log(req.user)
        theatreToUpdate.name = name; 
        theatreToUpdate.location.city = city;
        theatreToUpdate.location.lat = lat || null;
        theatreToUpdate.location.long = long || null;
        theatreToUpdate.location.address = address;
        theatreToUpdate.isActive = isActive;
        await theatreToUpdate.save();
        return res.status(200).json({ status: "Success", message: "Theatre updated successfully", data: theatreToUpdate });
    } catch (err) {
        if(!theatreToUpdate) {
            return res.status(404).json({ status: "Failed", message: "Movie does not exist" });
        }
        return res.status(500).json({ status: "Internal server error", error: err });
    }
}

const handleDeleteTheatre = async (req, res) => {
    const theatreID = req.params.id;
    try {
        await Theatre.findByIdAndDelete(theatreID);
        return res.status(200).json({ status: "Theatre deleted successfully" });
    } catch (err) {
        return res.status(500).json({ status: "Internal server error", error: err });
    }
}

module.exports = {
  handleGetTheatre,
  handleGetTheatreByName,
  handleCreateTheatre,
  handleUpdateTheatre,
  handleDeleteTheatre,
};
