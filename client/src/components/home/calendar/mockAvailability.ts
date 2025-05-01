import { addDays, format } from "date-fns";
import { DayAvailability } from "./Calendar";

const generateCalendarAvailability = (): DayAvailability => {
  const availability: DayAvailability = {};
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayOfWeek = date.getDay();
    const random = Math.random();
    // Assign statuses based on day of week and randomness
    if (dayOfWeek === 0) {
      // Sundays are always unavailable
      availability[dateStr] = "niedostepny";
    } else if (dayOfWeek === 6) {
      // Saturdays are mostly busy
      availability[dateStr] = random < 0.7 ? "zajety" : "dostepny";
    } else {
      // Weekdays have mixed availability
      if (random < 0.5) {
        availability[dateStr] = "dostepny";
      } else if (random < 0.8) {
        availability[dateStr] = "zajety";
      } else {
        availability[dateStr] = "niedostepny";
      }
    }
  }

  return availability;
};

const mockAvailability: DayAvailability = generateCalendarAvailability();
export default mockAvailability;
