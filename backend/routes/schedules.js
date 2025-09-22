const express = require("express");
const router = express.Router();
const pool = require("../db");

// ✅ Get schedule for a specific student
router.get("/student/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT ds.id,
             cs.id AS class_section_id,
             cs.grade_level,
             cs.section_name,
             ts.id AS time_slot_id,
             ts.start_time,
             ts.end_time,
             c.id AS course_id,
             c.course_name AS course_name,
             t.id AS teacher_id,
             u.name AS teacher_name,
             r.id AS room_id,
             r.room_name,
             ds.day_of_week
      FROM daily_schedules ds
      JOIN class_sections cs ON ds.class_section_id = cs.id
      JOIN time_slots ts ON ds.time_slot_id = ts.id
      JOIN courses c ON ds.course_id = c.id
      JOIN teachers t ON ds.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      LEFT JOIN rooms r ON ds.room_id = r.id
      JOIN student_class_enrollments sce ON sce.class_section_id = cs.id
      WHERE sce.student_id = $1 AND ds.is_active = true
      ORDER BY ds.day_of_week, ts.start_time
    `;

    const result = await pool.query(query, [id]);

    const schedules = result.rows.map((row) => ({
      id: row.id,
      class_section: {
        id: row.class_section_id,
        grade_level: row.grade_level,
        section_name: row.section_name,
      },
      time_slot: {
        id: row.time_slot_id,
        start_time: row.start_time,
        end_time: row.end_time,
      },
      course: { id: row.course_id, name: row.course_name },
      teacher: { id: row.teacher_id, name: row.teacher_name },
      room: row.room_id ? { id: row.room_id, name: row.room_name } : null,
      day_of_week: row.day_of_week,
      day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
        row.day_of_week - 1
      ],
    }));

    res.json(schedules);
  } catch (err) {
    console.error("Error fetching student schedule:", err.message);
    res.status(500).json({ message: "Server error fetching schedule" });
  }
});

// ✅ Get all schedules (for admin/teachers)
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT ds.id,
             cs.id AS class_section_id,
             cs.grade_level,
             cs.section_name,
             ts.id AS time_slot_id,
             ts.start_time,
             ts.end_time,
             c.id AS course_id,
             c.course_name AS course_name,
             t.id AS teacher_id,
             u.name AS teacher_name,
             r.id AS room_id,
             r.room_name,
             ds.day_of_week
      FROM daily_schedules ds
      JOIN class_sections cs ON ds.class_section_id = cs.id
      JOIN time_slots ts ON ds.time_slot_id = ts.id
      JOIN courses c ON ds.course_id = c.id
      JOIN teachers t ON ds.teacher_id = t.id
      JOIN users u ON t.user_id = u.id
      LEFT JOIN rooms r ON ds.room_id = r.id
      WHERE ds.is_active = true
      ORDER BY ds.day_of_week, ts.start_time
    `;

    const result = await pool.query(query);

    const schedules = result.rows.map((row) => ({
      id: row.id,
      class_section: {
        id: row.class_section_id,
        grade_level: row.grade_level,
        section_name: row.section_name,
      },
      time_slot: {
        id: row.time_slot_id,
        start_time: row.start_time,
        end_time: row.end_time,
      },
      course: { id: row.course_id, name: row.course_name },
      teacher: { id: row.teacher_id, name: row.teacher_name },
      room: row.room_id ? { id: row.room_id, name: row.room_name } : null,
      day_of_week: row.day_of_week,
      day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
        row.day_of_week - 1
      ],
    }));

    res.json(schedules);
  } catch (err) {
    console.error("Error fetching schedules:", err.message);
    res.status(500).json({ message: "Server error fetching schedules" });
  }
});

module.exports = router;
