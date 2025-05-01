import { addDays, format } from "date-fns";
import { DayAvailability } from "./Calendar";

const generateCalendarAvailability = (): DayAvailability => {
  const availability: DayAvailability = {};
  const today = new Date();

  for (let i = 0; i < 70; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayOfWeek = date.getDay();
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
export default mockAvailability;
