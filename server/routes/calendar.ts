import express, {Router} from "express";
import app from "express";
import {connectToDatabase} from "../lib/mongodb.ts";
import {Calendar} from "../models/CalendarModel.ts";

 const calendar = Router()

calendar.post("/", async (req, res) => {
    try{
        await connectToDatabase()
        const newEntry = await Calendar.create(req.body)
        console.log("Type of req.body:", typeof req.body);
        console.log("Is array?", Array.isArray(req.body));
        console.log("Body content:", req.body);
        console.log("Inserted:", newEntry);
        res.status(200).json({ message: "Success", data: newEntry });
    }catch(err){
        console.log(err)
    }
})

export default calendar;