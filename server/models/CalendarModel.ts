import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
    dates: {
        type: Map,
        of: String,
        required: true
    },
});

export const Calendar =
    mongoose.models.Calendar || mongoose.model("Calendar", calendarSchema);

