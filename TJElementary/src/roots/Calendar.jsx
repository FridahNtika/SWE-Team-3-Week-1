import * as React from "react";
import { Link } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export const Calendar = () => {

  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
              components={["DateCalendar", "DateCalendar", "DateCalendar"]}
          >
                  <DateCalendar
                      defaultValue={dayjs("2022-04-17")}
                      views={["year", "month", "day"]}
                  />
          </DemoContainer>
      </LocalizationProvider>
  );
};
