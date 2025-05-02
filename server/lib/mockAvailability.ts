import { addDays, format } from "date-fns";
import {DayAvailability} from "@/components/home/calendar/Calendar.tsx";
// import {Calendar} from "../models/CalendarModel.ts";
import {connectToDatabase} from "./mongodb.ts";

const generateCalendarAvailability = (): DayAvailability => {
  const availability: DayAvailability = {};
  const today = new Date();

  for (let i = 0; i < 70; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, "yyyy-MM-dd");
    const random = Math.random();
    // Assign statuses based on day of week and randomness

    if(random <1 && random >0.6) {
      availability[dateStr]="niedostepny";
    }else if(random < 0.6 && random >0.3) {
      availability[dateStr]="zajety";
    }else if(random < 0.3) {
      availability[dateStr]="dostepny";
    }
  }

  return availability;
};

const mockAvailability: DayAvailability = generateCalendarAvailability();
// console.log(mockAvailability);
//
// async function loadAvailabilityToDb() {
//   try {
//
//   await connectToDatabase()
//   await Calendar.create({dates:mockAvailability})
//   }catch(err) {
//     console.log(err);
//   }
// }

// loadAvailabilityToDb()
//     .then(() => console.log("✅ Calendar loaded"))
//     .catch(console.error);

export default mockAvailability
