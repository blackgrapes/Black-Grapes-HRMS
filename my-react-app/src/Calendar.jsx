import React, { useState } from "react";
import "./Calendar.css"; // Import the CSS for the calendar

const Calendar = () => {
  // Get the current date
  const currentDate = new Date();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [meetings, setMeetings] = useState({}); // Store meetings for each day
  const [newMeeting, setNewMeeting] = useState({ title: "", time: "", description: "" });
  const [weekView, setWeekView] = useState(false); // Week view toggle

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

  // Get the start and end of the current week
  const getWeekDates = (date) => {
    const start = new Date(date);
    const end = new Date(date);
    const dayOfWeek = start.getDay();
    
    start.setDate(start.getDate() - dayOfWeek); // Start of week (Sunday)
    end.setDate(end.getDate() + (6 - dayOfWeek)); // End of week (Saturday)

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(start);
      currentDay.setDate(start.getDate() + i);
      weekDates.push(currentDay);
    }

    return weekDates;
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

  const handleWeekChange = (direction) => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 7);
    } else if (direction === "next") {
      newDate.setDate(newDate.getDate() + 7);
    }
    setSelectedDate(newDate);
  };

  const handleAddMeeting = (day) => {
    const dateString = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${day}`;
    const newMeetings = { ...meetings };

    if (!newMeetings[dateString]) {
      newMeetings[dateString] = [];
    }

    newMeetings[dateString].push(newMeeting);

    setMeetings(newMeetings);
    setNewMeeting({ title: "", time: "", description: "" }); // Reset input fields
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prev) => ({ ...prev, [name]: value }));
  };

  const calendarDays = generateCalendar(selectedDate.getMonth(), selectedDate.getFullYear());
  const weekDates = getWeekDates(selectedDate);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => handleMonthChange("prev")}>&lt;</button>
        <h2>{months[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h2>
        <button onClick={() => handleMonthChange("next")}>&gt;</button>
        <button onClick={() => setWeekView(!weekView)}>{weekView ? "Month View" : "Week View"}</button>
      </div>

      {weekView ? (
        <div className="week-view">
          <button onClick={() => handleWeekChange("prev")}>&lt;</button>
          <h3>{weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}</h3>
          <button onClick={() => handleWeekChange("next")}>&gt;</button>

          <div className="week-days">
            {weekDates.map((date, index) => (
              <div key={index} className="week-day">
                <h4>{date.toLocaleDateString()}</h4>
                <ul>
                  {(meetings[date.toISOString().split('T')[0]] || []).map((meeting, i) => (
                    <li key={i}>
                      <strong>{meeting.title}</strong> ({meeting.time})
                      <p>{meeting.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
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
                onClick={day ? () => alert(`Selected Date: ${day}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`) : null}
              >
                {day || ""}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="meeting-form">
        <h3>Add Meeting</h3>
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
        <button onClick={() => handleAddMeeting(selectedDate.getDate())}>Add Meeting</button>
      </div>
    </div>
  );
};

export default Calendar;
