import React, { useState } from "react";
import ReactCalendar from "react-calendar"; // Renaming to avoid conflict with custom Calendar component
import DatePicker from "react-datepicker";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "./calendar.css"; // Assuming you will add some styles here

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [meetingDate, setMeetingDate] = useState(null);
  const [meetingDetails, setMeetingDetails] = useState("");
  const [meetings, setMeetings] = useState([]);

  const handleScheduleMeeting = () => {
    if (!meetingDate || !meetingDetails) {
      alert("Please select a date and add meeting details.");
      return;
    }

    setMeetings([
      ...meetings,
      { date: meetingDate, details: meetingDetails },
    ]);
    setMeetingDate(null);
    setMeetingDetails("");
  };

  const handleMeetingDetailsChange = (event) => {
    setMeetingDetails(event.target.value);
  };

  return (
    <div className="calendar-container">
      <div className="calendar">
        <ReactCalendar
          onChange={setDate}
          value={date}
          tileClassName="calendar-tile" // You may want to define this class in calendar.css for custom styling
        />
      </div>

      <div className="meeting-scheduler">
        <h3>Schedule a Meeting</h3>
        <DatePicker
          selected={meetingDate}
          onChange={(date) => setMeetingDate(date)}
          showTimeSelect
          dateFormat="Pp"
        />
        <input
          type="text"
          placeholder="Meeting details"
          value={meetingDetails}
          onChange={handleMeetingDetailsChange}
        />
        <button onClick={handleScheduleMeeting}>Schedule</button>
      </div>

      <div className="scheduled-meetings">
        <h3>Scheduled Meetings</h3>
        {meetings.length === 0 ? (
          <p>No meetings scheduled</p>
        ) : (
          <ul>
            {meetings.map((meeting, index) => (
              <li key={index}>
                <strong>{meeting.date.toLocaleString()}</strong> - {meeting.details}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomCalendar;
