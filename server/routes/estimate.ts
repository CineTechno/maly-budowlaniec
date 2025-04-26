import { Express } from "express";
export async function estimate(app:Express) {
"api/estimate",
    (req,res) => {
      res.send("hello");
    })
}