import React, {FormEvent, useState} from "react";
import {pricingItems} from "../../../../server/pricingItems.tsx";
import {Service} from "../../../../server/routes/estimate.ts";
import {Services} from "../../../../server/routes/services.ts";

export default function ServicesAdmin({className, setPricingItems}:{className: string, setPricingItems: (service: (prev: Services[]) => Services[]) => void}){

    const [services, setServices] = useState<string>("");
    const [price, setPrice] = useState<string>("");
    const [unit, setUnit] = useState<string>("");
    const [category, setCategory] = useState<string>("podstawowe");


    async function handleSubmit(e:FormEvent){
        e.preventDefault();

        const newEntry:Services = {
            service:services,
            price:price,
            unit:unit,
            category:category,
        }
        console.log(newEntry);

        try{
                await fetch("/api/services",  {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(newEntry),
            })
            setPricingItems((prev: Services[]) => [...prev, newEntry]);
        }catch(e){
            console.log(e);

        }
    }

   return (
       <div className={`${className} container mx-auto`}>

           <form className="flex flex-col gap-3 bg-white shadow-lg rounded-lg p-6" onSubmit={handleSubmit}>
                <label>nazwa</label>
               <input type="text" className="bg-gray-50 shadow-inner" value={services} placeholder="nazwa" onChange={(e)=>{setServices(e.target.value)}}/>
               <label>cena</label>
               <input type="text" className="bg-gray-50 shadow-inner" value={price} placeholder="cena" onChange={(e)=>{setPrice(e.target.value)}}/>
               <label>jednostka</label>
               <input type="text" className="bg-gray-50 shadow-inner" value={unit} placeholder="jednostka" onChange={(e)=>{setUnit(e.target.value)}}/>
               <label>kategoria</label>
               <select value={category} defaultValue="podstawowe" className="bg-gray-50 shadow-inner" onChange={(e)=>{setCategory(e.target.value)}}>

               <option value="podstawowe">Naprawy i usługi podstawowe</option>
               <option value="kuchnie-lazienki">Kuchnie i łazienki</option>
               <option value="wykonczeniowe">Prace wykończeniowe</option>
               <option value="instalacje">Instalacje</option>
               <option value="zewnetrzne">Prace zewnętrzne</option>
               </select>
               <button type="submit" className="btn btn-primary">Wyślij</button>
           </form>
       </div>
)

       }