const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    ID: Number,
    title: String,
    description: String,
    category: String,
    tags: [String],
    date_start: Date,
    date_end: Date,
    description_date: String,
    image_URL: String,
    contact:{
        email: String,
        url_event: String,
        phone: Number
    },
    reservation_type:{
        type: String,
        enum:["reservation", "libre", "conseillee"]
    },
    price_type: String,
    price_detail: String,
    place:{
        type: Schema.Types.ObjectId,
        ref: "Place"
    }
});

const eventModel = mongoose.model("Event", eventSchema);

module.exports = eventModel;