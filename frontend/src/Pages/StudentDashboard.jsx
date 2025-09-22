import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/styles.css";

function StudentDashboard() {
  const [schedule, setSchedule] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [courses, setCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
  if (!user) return;

  // Fetch student's schedule for list and courses
  fetch(`http://localhost:5000/api/schedules/student/${user.id}`)
    .then((res) => res.json())
    .then((data) => {
      setSchedule(data);

      // Extract unique courses
      const uniqueCourses = [
        ...new Map(data.map((item) => [item.course?.id, item.course])).values(),
      ];
      setCourses(uniqueCourses);
    })
    .catch((err) => console.error("Schedule fetch error:", err));

  fetch("http://localhost:5000/api/announcements/for-student")
    .then((res) => res.json())
    .then((data) => {
      console.log("Announcements fetched:", data);
      setAnnouncements(data);

        const calendarEvents = data
          .filter(item => item.announcement_date)
          .map(item => {
            const [year, month, day] = item.announcement_date.split("-").map(Number);
            return {
              date: new Date(year, month - 1, day), // Month is 0-indexed
              title: item.title,
            };
          });

      console.log("Events created:", calendarEvents);
      setEvents(calendarEvents);
    })
    .catch((err) => console.error("Announcements fetch error:", err));


}, [user]);

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Left column */}
        <div className="dashboard-left">
          <h2 className="dashboard-welcome">Welcome, {user?.name}!</h2>

          <div className="dashboard-section">
            <h3>Your Schedule</h3>
            {schedule.length > 0 ? (
              <ul className="schedule-list">
                {schedule.map((item) => (
                  <li key={item.id}>
                    {item.course?.course_name || "No course"} -{" "}
                    {item.day_of_week
                      ? ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][item.day_of_week - 1]
                      : "N/A"}{" "}
                    {item.time_slot?.start_time} to {item.time_slot?.end_time} in{" "}
                    {item.room?.room_name || "No room assigned"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No schedule available.</p>
            )}
          </div>

          <div className="dashboard-section">
            <h3>Your Courses</h3>
            {courses.length > 0 ? (
              <ul className="courses-list">
                {courses.map((c) => (
                  <li key={c.id}>{c.name}</li>
                ))}
              </ul>
            ) : (
              <p>No courses assigned.</p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="dashboard-right">
          <div className="dashboard-section">
            <h3>Calendar</h3>
            <Calendar
              tileContent={({ date }) => {
                const dayEvents = events.filter(
                e =>
                  e.date.getFullYear() === date.getFullYear() &&
                  e.date.getMonth() === date.getMonth() &&
                  e.date.getDate() === date.getDate()
              );

              return dayEvents.length > 0 ? (
                <div className="calendar-event">
                  {dayEvents.map((ev, i) => (
                    <div key={i}>{ev.title}</div>
                  ))}
                </div>
              ) : null;
              }}
            />
          </div>
          <div className="dashboard-section">
            <h3>Announcements</h3>
            {announcements.length > 0 ? (
              <ul className="announcements-list">
                {announcements.map((a) => (
                  <li key={a.id}>
                    <strong>{a.title}</strong>: {a.content}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No announcements available.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StudentDashboard;
