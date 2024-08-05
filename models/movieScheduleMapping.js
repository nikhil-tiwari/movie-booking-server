const { Schema, model }  = require('mongoose')

const movieScheduleSchema = new Schema({
    movieID: {
        type: Schema.Types.ObjectId,
        ref: 'movie',
        required: true,
    },
    theatreID: {
        type: Schema.Types.ObjectId,
        ref: 'theatre',
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    pricing: {
        type: Number,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
}, { timestamps: true });

movieScheduleSchema.index({ movieID: 1, theatreID: 1, startTime: 1 }, { unique: true });

const MovieSchedule = model('movieSchedule', movieScheduleSchema);

module.exports = MovieSchedule;