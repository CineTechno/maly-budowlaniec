import {Router} from "express";
import {connectToDatabase} from "../lib/mongodb.ts";
import {Service} from "../models/ServiceModel.tsx";
import {Response, Request} from "express";
import { ObjectId } from "mongodb";


export interface Services {
        _id: string | ObjectId
        service: string,
        price: string,
        unit: string,
        category: string
}

const services= Router()

services.post('/', async (req:Request, res:Response) => {
    console.log("REQUEST BODY", req.body)
    try {
        await connectToDatabase()
        const existingService = await Service.findOneAndUpdate(
            {service: req.body.service},
            {price:req.body.price, unit:req.body.unit, category:req.body.category},
            {new: true, upsert: true},
            )

        res.json({response:"Services added"})
        console.log("inserted", existingService)
    }catch(err){
        console.error("Database error",err)
        res.status(500).json({"Cant connect to DB":err})
        return
    }


    console.log("Sent new services history")

})

services.delete('/', async (req:Request, res:Response) => {
    try {
        await connectToDatabase()
        const deletedService = await Service.deleteOne(
            {service: req.body.service},
            {new: true, upsert: true}
        )
        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        console.log("Deleted services history",deletedService)
        res.json({ message: "Service deleted", deletedService });
    }catch(err){
        console.error("Database error",err)
        res.status(500).json({"Cant connect to DB":err})
        return
    }

    })

services.get('/', async (req:Request, res:Response) => {
    try {
        await connectToDatabase()
        const pricingItems = await Service.find({})
        res.json(pricingItems)
    }catch(err){
        console.error("Database error",err)
    }
})

export default services;