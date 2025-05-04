import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
    availabilities:{
        start: {
            type: Date,
            required: true,
        },
        end: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["Częściowo dostępny", "Niedostępny"],
            required: true,
        },}

});

export const Calendar =
    mongoose.models.Calendar || mongoose.model("Calendar", calendarSchema);

