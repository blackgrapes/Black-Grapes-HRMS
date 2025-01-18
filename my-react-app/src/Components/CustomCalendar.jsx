import React, { useState } from "react";
import ReactCalendar from "react-calendar";
import DatePicker from "react-datepicker";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import "./calendar.css";

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

    setMeetings([...meetings, { date: meetingDate, details: meetingDetails }]);
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
          tileClassName="calendar-tile"
          tileContent={({ date, view }) =>
            meetings.some(
              (meeting) =>
                meeting.date.toLocaleDateString() === date.toLocaleDateString()
            ) && <span className="meeting-dot"></span>
          }
        />
      </div>

      <div className="meeting-scheduler">
        <h3>Schedule a Meeting</h3>
        <div className="form-group">
          <DatePicker
            selected={meetingDate}
            onChange={(date) => setMeetingDate(date)}
            showTimeSelect
            dateFormat="Pp"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Meeting details"
            value={meetingDetails}
            onChange={handleMeetingDetailsChange}
            className="form-control"
          />
        </div>
        <button
          onClick={handleScheduleMeeting}
          className="btn btn-primary w-100 mt-3"
        >
          Schedule
        </button>
      </div>

      <div className="scheduled-meetings">
        <h3>Scheduled Meetings</h3>
        {meetings.length === 0 ? (
          <p>No meetings scheduled</p>
        ) : (
          <ul>
            {meetings.map((meeting, index) => (
              <li key={index} className="meeting-item">
                <strong>{meeting.date.toLocaleString()}</strong> -{" "}
                {meeting.details}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomCalendar;
