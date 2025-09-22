// import React, { useState, useEffect } from "react";
// import Layout from "../component/Layout";
// import "../styles/styles.css";

// function Schedule() {
//   const [showForm, setShowForm] = useState(false);
//   const [viewMode, setViewMode] = useState(false);
//   const [filterGrade, setFilterGrade] = useState(""); 

//   const [formData, setFormData] = useState({
//     class_section_id: "",
//     time_slot_id: "",
//     course_id: "",
//     teacher_id: "",
//     room_id: "",
//     day_of_week: "1", // Monday by default
//   });

//   const [schedules, setSchedules] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [rooms, setRooms] = useState([]);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [classSections, setClassSections] = useState([]);

//   // Map day_of_week numbers to names
//   const dayMap = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

//   // Fetch all dropdown data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [teacherRes, courseRes, roomRes, timeSlotRes, classSectionRes, scheduleRes] = await Promise.all([
//           fetch("http://localhost:5000/api/teachers"),
//           fetch("http://localhost:5000/api/courses"),
//           fetch("http://localhost:5000/api/rooms"),
//           fetch("http://localhost:5000/api/time-slots"),
//           // fetch("http://localhost:5000/api/class-sections"),
//           fetch("http://localhost:5000/api/schedules"), // all active schedules
//         ]);

//         setTeachers(await teacherRes.json());
//         setCourses(await courseRes.json());
//         setRooms(await roomRes.json());
//         setTimeSlots(await timeSlotRes.json());
//         // setClassSections(await classSectionRes.json());
//         setSchedules(await scheduleRes.json());
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleAddSchedule = async (e) => {
//     e.preventDefault();

//     // Check for conflicts locally (optional, backend should validate as well)
//     const conflict = schedules.find(
//       (s) =>
//         s.day_of_week === parseInt(formData.day_of_week) &&
//         s.time_slot.id === parseInt(formData.time_slot_id) &&
//         (s.teacher.id === parseInt(formData.teacher_id) || (s.room && s.room.id === parseInt(formData.room_id)))
//     );

//     if (conflict) {
//       alert("Conflict detected! Resolve before saving.");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/schedules", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const newSchedule = await res.json();
//       setSchedules([...schedules, newSchedule]);
//       setShowForm(false);
//       setFormData({
//         class_section_id: "",
//         time_slot_id: "",
//         course_id: "",
//         teacher_id: "",
//         room_id: "",
//         day_of_week: "1",
//       });
//     } catch (err) {
//       console.error("Error saving schedule:", err);
//     }
//   };

//   // Filter schedules by grade
//   const filteredSchedules = filterGrade
//     ? schedules.filter((s) => s.class_section.grade.toLowerCase() === filterGrade.toLowerCase())
//     : schedules;

//   return (
//     <Layout>
//       <div className="page-header">
//         <h1>Class Schedule</h1>
//         <button className="btn" onClick={() => setShowForm(true)}>Add Schedule</button>
//         <button className="btn" onClick={() => setViewMode(!viewMode)}>
//           {viewMode ? "Hide Schedule" : "View Schedule"}
//         </button>
//       </div>

//       {/* Add Schedule Modal */}
//       {showForm && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h2>Add Schedule</h2>
//             <form className="modal-form" onSubmit={handleAddSchedule}>

//               <label>Class Section*</label>
//               <select
//                 value={formData.class_section_id}
//                 onChange={(e) => setFormData({ ...formData, class_section_id: e.target.value })}
//                 required
//               >
//                 <option value="">Select Section</option>
//                 {classSections.map(cs => (
//                   <option key={cs.id} value={cs.id}>{cs.name} ({cs.grade})</option>
//                 ))}
//               </select>

//               <label>Day*</label>
//               <select
//                 value={formData.day_of_week}
//                 onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
//                 required
//               >
//                 {dayMap.map((day, i) => (
//                   <option key={i} value={i + 1}>{day}</option>
//                 ))}
//               </select>

//               <label>Time Slot*</label>
//               <select
//                 value={formData.time_slot_id}
//                 onChange={(e) => setFormData({ ...formData, time_slot_id: e.target.value })}
//                 required
//               >
//                 <option value="">Select Time Slot</option>
//                 {timeSlots.map(ts => (
//                   <option key={ts.id} value={ts.id}>{ts.start_time} - {ts.end_time}</option>
//                 ))}
//               </select>

//               <label>Course*</label>
//               <select
//                 value={formData.course_id}
//                 onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
//                 required
//               >
//                 <option value="">Select Course</option>
//                 {courses.map(c => (
//                   <option key={c.id} value={c.id}>{c.name}</option>
//                 ))}
//               </select>

//               <label>Teacher*</label>
//               <select
//                 value={formData.teacher_id}
//                 onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
//                 required
//               >
//                 <option value="">Select Teacher</option>
//                 {teachers.map(t => (
//                   <option key={t.id} value={t.id}>{t.name}</option>
//                 ))}
//               </select>

//               <label>Room</label>
//               <select
//                 value={formData.room_id || ""}
//                 onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
//               >
//                 <option value="">Select Room</option>
//                 {rooms.map(r => (
//                   <option key={r.id} value={r.id}>{r.name}</option>
//                 ))}
//               </select>

//               <div className="modal-actions">
//                 <button type="button" className="btn cancel" onClick={() => setShowForm(false)}>Cancel</button>
//                 <button type="submit" className="btn">Save</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* View Schedule */}
//       {viewMode && (
//         <div className="schedule-view">
//           <h2>View Schedule</h2>
//           <label>Filter by Grade: </label>
//           <input
//             type="text"
//             placeholder="Enter grade (e.g., 5th, 8th)"
//             value={filterGrade}
//             onChange={(e) => setFilterGrade(e.target.value)}
//           />

//           <table className="data-table">
//             <thead>
//               <tr>
//                 <th>Class Section</th>
//                 <th>Grade</th>
//                 <th>Day</th>
//                 <th>Time Slot</th>
//                 <th>Course</th>
//                 <th>Teacher</th>
//                 <th>Room</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredSchedules.map(s => (
//                 <tr key={s.id}>
//                   <td>{s.class_section.name}</td>
//                   <td>{s.class_section.grade}</td>
//                   <td>{s.day}</td>
//                   <td>{s.time_slot.start_time} - {s.time_slot.end_time}</td>
//                   <td>{s.course.name}</td>
//                   <td>{s.teacher.name}</td>
//                   <td>{s.room ? s.room.name : "-"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <button className="btn" onClick={() => alert("Download feature coming soon!")}>Download</button>
//         </div>
//       )}
//     </Layout>
//   );
// }

// export default Schedule;


import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import "../styles/styles.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [filterGrade, setFilterGrade] = useState("");

  const dayMap = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    const fetchSchedules = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/schedules/student/${user.id}`);
        const data = await res.json();
        setSchedules(data);
      } catch (err) {
        console.error("Error fetching schedules:", err);
      }
    };

    fetchSchedules();
  }, [user]);

  // Filter schedules by grade
  const filteredSchedules = filterGrade
    ? schedules.filter(
        (s) =>
          s.class_section?.grade_level.toLowerCase() === filterGrade.toLowerCase()
      )
    : schedules;

  // PDF download function
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`${user.name}'s Class Schedule`, 14, 15);

    const tableData = filteredSchedules.map((s) => [
      s.class_section?.section_name,
      s.class_section?.grade_level,
      dayMap[s.day_of_week - 1],
      `${s.time_slot?.start_time} - ${s.time_slot?.end_time}`,
      s.course?.course_name,
      s.teacher_name || "-",
      s.room?.room_name || "-",
    ]);

    doc.autoTable({
      head: [["Section", "Grade", "Day", "Time", "Course", "Teacher", "Room"]],
      body: tableData,
      startY: 20,
    });

    doc.save("schedule.pdf");
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>My Schedule</h1>
      </div>

      <div className="schedule-view">
        <label>Filter by Grade: </label>
        <input
          type="text"
          placeholder="e.g., Grade 6"
          value={filterGrade}
          onChange={(e) => setFilterGrade(e.target.value)}
        />

        {filteredSchedules.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Grade</th>
                <th>Day</th>
                <th>Time Slot</th>
                <th>Course</th>
                <th>Teacher</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.map((s) => (
                <tr key={s.id}>
                  <td>{s.class_section?.section_name}</td>
                  <td>{s.class_section?.grade_level}</td>
                  <td>{dayMap[s.day_of_week - 1]}</td>
                  <td>
                    {s.time_slot?.start_time} - {s.time_slot?.end_time}
                  </td>
                  <td>{s.course?.course_name}</td>
                  <td>{s.teacher_name || "-"}</td>
                  <td>{s.room?.room_name || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No schedules available.</p>
        )}

        {filteredSchedules.length > 0 && (
          <button className="btn" onClick={downloadPDF}>
            Download Schedule as PDF
          </button>
        )}
      </div>
    </Layout>
  );
}

export default Schedule;
