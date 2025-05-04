import express, {Router} from "express";
import app from "express";
import {connectToDatabase} from "../lib/mongodb.ts";
import {Calendar} from "../models/CalendarModel.ts";

 const calendar = Router()

calendar.post("/", async (req, res) => {
    try{
        await connectToDatabase()
        const newEntry = await Calendar.findOneAndUpdate(
            {},
            {availabilities:req.body},
            {upsert:true, new: true}
            )
        res.status(200).json({ message: "Success", data: newEntry });
    }catch(err){
        console.log(err)
    }
})

calendar.get("/", async (req, res) => {
    try{
        await connectToDatabase()
        const calendarData = await Calendar.findOne()
        if(!calendarData){
            return res.status(404).json({ message: "No calendar data found." });
        }

        res.status(200).json(calendarData);
    }catch(err){
        console.error("error getting calendar data:", err);
        res.status(404).json({ message: "No calendar data found." });
    }
})

export default calendar;