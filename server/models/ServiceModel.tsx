import mongoose from "mongoose";
import {Services} from "../routes/services.ts";

const serviceSchema = new mongoose.Schema<Services>({
        service: {type:String, required: true},
        price: {type:String, required: true},
        unit: {type:String, required: true},
        category: {type:String, required: true},

})

export const Service = mongoose.models.Service || mongoose.model("Service", serviceSchema)



