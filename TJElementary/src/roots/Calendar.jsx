import React from "react";
import { Link } from "react-router-dom";
import DateCalendar from "@mui/material/DateCalendar";

export const Calendar = () => {
    return (
        <>
            <h1>Welcome to TJ 'Elementary's calander</h1>
            <DemoItem label="disabled">
                <DateCalendar defaultValue={dayjs("2022-04-17")} disabled />
            </DemoItem>
            <DemoItem label="readOnly">
                <DateCalendar defaultValue={dayjs("2022-04-17")} readOnly />
            </DemoItem>
        </>
    );
};
