import React, { useState } from "react";
import "./Calendar.css"; // Import the CSS for the calendar

const Calendar = () => {
  // Get the current date
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [meetings, setMeetings] = useState({}); // Store meetings for each day
  const [newMeeting, setNewMeeting] = useState({ title: "", time: "", description: "" }); // New meeting form state

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Function to generate a calendar for the selected month and year
  const generateCalendar = (month, year) => {
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    const startDay = startOfMonth.getDay();
    const totalDaysInMonth = endOfMonth.getDate();

    const calendarDays = [];

    // Fill in empty spaces before the first day of the month
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(null); // Empty space
    }

    // Fill in the days of the month
    for (let day = 1; day <= totalDaysInMonth; day++) {
      calendarDays.push(day);
    }

    return calendarDays;
  };

  const handleMonthChange = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (direction === "next") {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  // Function to handle meeting form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle adding a new meeting
  const handleAddMeeting = (day) => {
    const dateString = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${day}`;
    const newMeetings = { ...meetings };

    // Add the meeting to the selected day's array
    if (!newMeetings[dateString]) {
      newMeetings[dateString] = [];
    }

    newMeetings[dateString].push(newMeeting);
    setMeetings(newMeetings);
    setNewMeeting({ title: "", time: "", description: "" }); // Reset form after submission
  };

  // Function to handle deleting a meeting
  const handleDeleteMeeting = (day, index) => {
    const dateString = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${day}`;
    const newMeetings = { ...meetings };

    // Remove the selected meeting
    newMeetings[dateString].splice(index, 1);

    // If there are no more meetings for that day, delete the array
    if (newMeetings[dateString].length === 0) {
      delete newMeetings[dateString];
    }

    setMeetings(newMeetings);
  };

  // Generate the calendar days
  const calendarDays = generateCalendar(selectedDate.getMonth(), selectedDate.getFullYear());

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => handleMonthChange("prev")}>&lt;</button>
        <h2>{months[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h2>
        <button onClick={() => handleMonthChange("next")}>&gt;</button>
      </div>

      <div className="calendar">
        <div className="calendar-weekdays">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-days">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${day ? "" : "empty"}`}
              onClick={day ? () => setNewMeeting({ ...newMeeting, day }) : null}
            >
              {day || ""}
              {day && meetings[`${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${day}`] && (
                <div className="meetings-list">
                  {meetings[`${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${day}`].map((meeting, i) => (
                    <div key={i} className="meeting-item">
                      <strong>{meeting.title}</strong> ({meeting.time})
                      <p>{meeting.description}</p>
                      <button onClick={() => handleDeleteMeeting(day, i)}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Form */}
      <div className="meeting-form">
        <h3>Add Meeting for {newMeeting.day}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}</h3>
        <input
          type="text"
          name="title"
          value={newMeeting.title}
          onChange={handleInputChange}
          placeholder="Meeting Title"
        />
        <input
          type="time"
          name="time"
          value={newMeeting.time}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          value={newMeeting.description}
          onChange={handleInputChange}
          placeholder="Meeting Description"
        />
        <button onClick={() => handleAddMeeting(newMeeting.day)}>Add Meeting</button>
      </div>
    </div>
  );
};

export default Calendar;
