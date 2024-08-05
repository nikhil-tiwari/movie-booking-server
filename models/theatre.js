const { Schema, model }  = require('mongoose')

const theatreSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    location: {
        city: { type: String, required: true },
        lat: { type: String },
        long: { type: String },
        address: { type: String, required: true },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }
}, { timestamps: true });

const Theatre = model('theatre', theatreSchema);

module.exports = Theatre;