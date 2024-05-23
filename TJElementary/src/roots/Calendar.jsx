import * as React from "react";
import { Link } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Modal, Box, Typography, Grid, Button } from "@mui/material";
import { db } from "/firebase";
import {
    addDoc,
    collection,
    getDocs,
    doc,
    deleteDoc,
} from "firebase/firestore";

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

const handleDelete = async (id, setEvents) => {
    try {
        const eventDoc = doc(db, "events", id);
        await deleteDoc(eventDoc);
        setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== id)
        );
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};

const getAllEvents = async (setEvents) => {
    try {
        let temp = [];
        const querySnapshot = await getDocs(collection(db, "events"));
        querySnapshot.forEach((doc) => {
            temp.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        setEvents(temp);
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
};

export const Calendar = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [events, setEvents] = React.useState([]);
    const [eventsForDay, setEventsForDay] = React.useState([]);
    const [value, setValue] = React.useState(dayjs());

    React.useEffect(() => {
        getAllEvents(setEvents);
    }, []);

    React.useEffect(() => {
        const selectedDate = value;
        const selectedYear = selectedDate.year();
        const selectedMonth = selectedDate.month() + 1; 

        const filteredEvents = events.filter(
            (event) =>
                event.year === selectedYear &&
                event.month === selectedMonth &&
                event.day === selectedDay
        );

        setEventsForDay(filteredEvents);
    }, [value, events]);

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
                                    color="black"
                                >
                                    Events for {value.month() + 1}/
                                    {value.date()}/{value.year()} at TJ
                                    Elementary
                                </Typography>
                                <Typography
                                    id="modal-modal-description"
                                    sx={{ mt: 2 }}
                                    color="black"
                                >
                                    {eventsForDay.length > 0 ? (
                                        eventsForDay.map((event) => (
                                            <div key={event.id}>
                                                <Typography>
                                                    {event.title}:{" "}
                                                    {event.description}
                                                </Typography>
                                                <Button
                                                    onClick={() =>
                                                        handleDelete(
                                                            event.id,
                                                            setEvents
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <Typography>
                                            No events for this day.
                                        </Typography>
                                    )}
                                </Typography>
                            </Box>
                        </Modal>
                    </DemoItem>
                </DemoContainer>
            </LocalizationProvider>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{
                        backgroundColor: "teal",
                        "&:hover": { backgroundColor: "#008080" },
                    }}
                >
                    Add Event
                </Button>
            </Grid>
        </>
    );
};
