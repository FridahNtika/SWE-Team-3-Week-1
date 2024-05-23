import * as React from "react";
import { Link } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Modal } from "@mui/material";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { db } from "/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const getEevents = async () => {
    {
        let temp = [];
        const querySnapshot = await getDocs(collection(db, "events"));
        querySnapshot.forEach((doc) => {
            temp.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        setAllData(temp);
    }

    useEffect(() => {
        fetchData();
    }, []);
};

function getEventsForDate() {
    setEventsForDay(
        allData.filter(
            (event) =>
                event.year == year && event.month == month && event.day == day
        )
    );
}

export const Calendar = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [year, setYear] = React.useState("");
    const [month, setMonth] = React.useState("");
    const [day, setDay] = React.useState("");
    const [allData, setAllData] = React.useState([]);
    const [eventsForDay, setEventsForDay] = React.useState([]);
    const [value, setValue] = React.useState(dayjs());

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateCalendar", "DateCalendar"]}>
                    <DemoItem label="TJ Elementary Events Calendar">
                        <DateCalendar
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                            onClick={handleOpen}
                        />
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography
                                    id="modal-modal-title"
                                    variant="h6"
                                    component="h2"
                                >
                                    Text in a modal
                                </Typography>
                                <Typography
                                    id="modal-modal-description"
                                    sx={{ mt: 2 }}
                                    color="black"
                                >
                                    Events for {value.month()}/{value.day()}/
                                    {value.year()} at TJ Elementary
                                    {eventsForDay}
                                </Typography>
                            </Box>
                        </Modal>
                    </DemoItem>
                </DemoContainer>
            </LocalizationProvider>
        </>
    );
};
