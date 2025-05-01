import React from "react";
import { DayStatus } from "./Calendar";
import { format } from "date-fns";
import { pl } from "date-fns/locale/pl";

interface AvailabilityProps {
  date: Date;
  selectedStatus: DayStatus;
}

export default function Availability({
  date,
  selectedStatus,
}: AvailabilityProps) {
  return (
    <div className="h-[200px] bg-white rounded-lg border border-primary-300 shadow-md overflow-hidden p-6 flex flex-col md:h-full">
      <h3 className="text-sm md:text-xl font-semibold mb-4 text-gray-900 text-center">
        {date
          ? `Status (${format(date, "d MMMM yyyy", { locale: pl })})`
          : "Wybierz datę, aby zobaczyć status"}
      </h3>
      <div className="flex-1 flex flex-col text-center justify-center">
        {date && selectedStatus ? (
          <div>
            <div
              className={`
                inline-block text-sm md:text-2xl font-bold p-2 md:p-6 rounded-lg mb-1 md:mb-4
                ${
                  selectedStatus === "dostepny"
                    ? "bg-green-100 text-green-800 border-2 border-green-500"
                    : selectedStatus === "zajety"
                    ? "bg-orange-100 text-orange-800 border-2 border-orange-500"
                    : "bg-red-100 text-red-800 border-2 border-red-500"
                }
              `}
            >
              {selectedStatus === "dostepny"
                ? "Dostępny"
                : selectedStatus === "zajety"
                ? "Zajęty"
                : "Niedostępny"}
            </div>

            <p className=" text-sm md:text-base mt-4 text-gray-700">
              {selectedStatus === "dostepny"
                ? "W tym dniu możemy wykonać wszystkie usługi. Zadzwoń, aby umówić spotkanie."
                : selectedStatus === "zajety"
                ? "W tym dniu mamy ograniczoną dostępność. Zadzwoń, aby sprawdzić możliwości."
                : "W tym dniu nie jesteśmy dostępni. Wybierz inny dzień."}
            </p>
          </div>
        ) : date ? (
          <div className="text-center py-2 md:py-8 text-gray-500">
            <p>Brak informacji o dostępności w tym dniu</p>
            <p className="mt-2">
              Wybierz inną datę lub skontaktuj się z nami telefonicznie
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Wybierz datę w kalendarzu, aby zobaczyć status dostępności</p>
          </div>
        )}

        <div className="mt-2 md:mt-8">
          <p className="text-gray-600">
            Aby zarezerwować wizytę, zadzwoń do nas:{" "}
            <span className="font-semibold text-primary-700">
              +48 123 456 789
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
