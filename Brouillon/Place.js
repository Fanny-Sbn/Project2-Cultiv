const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({

    location: {
        type: {
            type: String,
            enum: ["Point"]
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        address: {
            name: String,
            numberOfStreet: Number,
            street: String,
            zip_code: Number,
            city: String
        }
    },
    transport: String,
    contact:{
        phone: Number,
        email: String,
        url_Place: String,
        facebook: String,
        Twitter: String
    }
});

const placeModel = mongoose.model("place", placeSchema);

module.exports = placeModel;