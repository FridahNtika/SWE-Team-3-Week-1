import * as React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import {
    Modal,
    Box,
    Typography,
    Grid,
    Button,
    TextField,
    Container,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { db } from "../../firebase";
import {
    addDoc,
    collection,
    getDocs,
    doc,
    deleteDoc,
} from "firebase/firestore";

export const Calendar = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [events, setEvents] = React.useState([]);
    const [eventsForDay, setEventsForDay] = React.useState([]);
    const [value, setValue] = React.useState(dayjs());
    const [newDateValue, setNewDateValue] = React.useState(dayjs());
    const [year, setYear] = React.useState(value.year());
    const [month, setMonth] = React.useState(value.month() + 1);
    const [day, setDay] = React.useState(value.date());

    const [newDay, setNewDay] = React.useState("");
    const [newMonth, setNewMonth] = React.useState("");
    const [newYear, setNewYear] = React.useState("");
    const [newTitle, setNewTitle] = React.useState("");
    const [newDescription, setNewDescription] = React.useState("");
    const [newHour, setNewHour] = React.useState("");
    const [newMinute, setNewMinute] = React.useState("");
    const [newTimeValue, setNewTimeValue] = React.useState("");

    const [showModal, setShowModal] = React.useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

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

    const handleDelete = async (id) => {
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

    const getAllEvents = async () => {
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
    React.useEffect(() => {
        setNewTimeValue(dayjs());
    }, []);

    React.useEffect(() => {
        getAllEvents();
    }, []);

    React.useEffect(() => {
        setYear(value.year());
        setMonth(value.month() + 1);
        setDay(value.date());
        const filteredEvents = events.filter(
            (event) =>
                event.Year === value.year() &&
                event.Month === value.month() + 1 &&
                event.Day === value.date()
        );

        setEventsForDay(filteredEvents);
    }, [value]);

    const handleDateChange = (newValue) => {
        setValue(newValue);
        setYear(newValue.year());
        setMonth(newValue.month() + 1);
        setDay(newValue.date());
        handleOpen();
    };
    const handleNewDateChange = (newValue) => {
        setNewValue(newValue);
        setNewYear(newValue.year());
        setNewMonth(newValue.month() + 1);
        setNewDay(newValue.date());
    };

    const handleNewTimeChange = (newValue) => {
        setNewTimeValue(newValue);
        setNewHour(newValue.hour());
        setNewMinute(newValue.minute());
    };

    const addEvent = async () => {
        if (newMonth === "") {
            try {
                const docRef = await addDoc(collection(db, "events"), {
                    Month: month,
                    Day: day,
                    Year: year,
                    Hour: newHour,
                    Minute: newMinute,
                    Description: newDescription,
                    Title: newTitle,
                });
                console.log("Created doc with ID: ", docRef.id);
                setMessage(`Event ${newTitle} added successfully.`);
                getAllEvents();
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        } else {
            try {
                const docRef = await addDoc(collection(db, "events"), {
                    Month: newMonth,
                    Day: newDay,
                    Year: newYear,
                    Description: newDescription,
                    Title: newTitle,
                    Hour: newHour,
                    Minute: newMinute,
                });
                console.log("Created doc with ID: ", docRef.id);
                setMessage(`Event ${newTitle} added successfully.`);
                getAllEvents();
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    };

    return (
        <>
            <h1 style={{ color: "#FF6B3B" }}> Events Calendar</h1>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Container
                    components={["DateCalendar", "DateCalendar"]}
                    color="white"
                >
                    <DemoItem label="">
                        <DateCalendar
                            value={value}
                            onChange={handleDateChange}
                            sx={{
                                backgroundColor: "#FFFFFF",
                                padding: "16px",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                color: "#FF6B3B",
                            }}
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
                                    color="#FF6B3B"
                                >
                                    Events for {month}/{day}/{year} at TJ
                                    Elementary
                                </Typography>
                                <Typography
                                    id="modal-modal-description"
                                    sx={{ mt: 2 }}
                                    color="#FF6B3B"
                                >
                                    {eventsForDay.length > 0 ? (
                                        eventsForDay.map((event) => (
                                            <div key={event.id}>
                                                <Typography color="#1E2D5F">
                                                    Title: {event.Title}
                                                    <br></br>
                                                    Description:{" "}
                                                    {event.Description}
                                                    <br></br>
                                                    Time:{""}
                                                    {event.Hour}:{event.Minute}
                                                </Typography>
                                                <Button
                                                    type="submit"
                                                    sx={{
                                                        color: "#FFFFFF",
                                                        backgroundColor:
                                                            "#1E2D5F",
                                                        "&:hover": {
                                                            backgroundColor:
                                                                "#008080",
                                                        },
                                                    }}
                                                    onClick={() => {
                                                        handleDelete(event.id);
                                                        handleClose();
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <Typography color="#FF6B3B">
                                            No events for this day.
                                        </Typography>
                                    )}
                                </Typography>
                            </Box>
                        </Modal>
                    </DemoItem>
                </Container>
            </LocalizationProvider>

            <Grid item xs={12}>
                <div style={{ marginTop: "16px" }}>
                    <Button
                        onClick={() => setShowModal(true)}
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{
                            backgroundColor: "teal",
                            "&:hover": { backgroundColor: "#1E2D5F" },
                        }}
                    >
                        Add Event
                    </Button>
                </div>
                <Modal open={showModal} onClose={() => closeModal()}>
                    <Box sx={style}>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            color="black"
                        ></Typography>
                        <Typography
                            id="modal-modal-description"
                            sx={{ mt: 2 }}
                            color="black"
                        >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DatePicker"]}>
                                    <DatePicker
                                        slotProps={{
                                            textField: { size: "small" },
                                            sx: {
                                                width: "100px",
                                            },
                                        }}
                                        label="Date of event"
                                        color="#FF6B3B"
                                        variant="outlined"
                                        value={newDateValue}
                                        onChange={handleNewDateChange}
                                    />
                                    <TimePicker
                                        slotProps={{
                                            textField: { size: "small" },
                                            sx: {
                                                width: "100px", 
                                            },
                                        }}
                                        value={newTimeValue}
                                        onChange={handleNewTimeChange}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            <form action="">
                                <TextField
                                    label="Event Title"
                                    variant="outlined"
                                    onChange={(e) =>
                                        setNewTitle(e.target.value)
                                    }
                                    fullWidth
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        style: {
                                            backgroundColor: "white",
                                            borderColor: "orange",
                                        },
                                    }}
                                    InputLabelProps={{
                                        style: { color: "#FF6B3B" },
                                    }}
                                />

                                <TextField
                                    label="Event Description"
                                    variant="outlined"
                                    onChange={(e) =>
                                        setNewDescription(e.target.value)
                                    }
                                    fullWidth
                                    margin="dense"
                                    size="small"
                                    InputProps={{
                                        style: {
                                            backgroundColor: "white",
                                            borderColor: "orange",
                                        },
                                    }}
                                    InputLabelProps={{
                                        style: { color: "#FF6B3B" },
                                    }}
                                />
                            </form>
                            <Button
                                onClick={() => {
                                    addEvent();
                                    setShowModal(false);
                                    getAllEvents();
                                }}
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{
                                    backgroundColor: "teal",
                                    "&:hover": { backgroundColor: "#1E2D5F" },
                                }}
                            >
                                Save Event
                            </Button>
                        </Typography>
                    </Box>
                </Modal>
            </Grid>
        </>
    );
};
