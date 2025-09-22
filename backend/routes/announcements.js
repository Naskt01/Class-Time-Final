const express = require("express");
const router = express.Router();
const pool = require("../db");

// ✅ Get all announcements
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        content,
        target_audience,
        status,
        announcement_date
      FROM announcements
      ORDER BY announcement_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Get announcements error:", error.message);
    res.status(500).json({ message: "Server error fetching announcements" });
  }
});

// ✅ Get announcements for students only
router.get("/for-student", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        content,
        target_audience,
        status,
        announcement_date
      FROM announcements
      WHERE target_audience = 'students' OR target_audience = 'all'
      ORDER BY announcement_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Get student announcements error:", error.message);
    res.status(500).json({ message: "Server error fetching student announcements" });
  }
});

// ✅ Get single announcement by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT
        id,
        title,
        content,
        target_audience,
        status,
        announcement_date
      FROM announcements
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get announcement error:", error.message);
    res.status(500).json({ message: "Server error fetching announcement" });
  }
});

// ✅ Create a new announcement
router.post("/", async (req, res) => {
  try {
    const {
      title,
      content,
      target_audience = "all",
      status = "published",
      announcement_date = new Date() // default to today if not provided
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Please provide title and content" });
    }

    const result = await pool.query(`
      INSERT INTO announcements (title, content, target_audience, status, announcement_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, content, target_audience, status, announcement_date
    `, [title, content, target_audience, status, announcement_date]);

    res.status(201).json({
      message: "Announcement created successfully",
      announcement: result.rows[0]
    });
  } catch (error) {
    console.error("Create announcement error:", error.message);
    res.status(500).json({ message: "Server error creating announcement" });
  }
});

// ✅ Update an existing announcement
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, target_audience, status, announcement_date } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Please provide title and content" });
    }

    const result = await pool.query(`
      UPDATE announcements
      SET
        title = $1,
        content = $2,
        target_audience = $3,
        status = $4,
        announcement_date = $5
      WHERE id = $6
      RETURNING id, title, content, target_audience, status, announcement_date
    `, [title, content, target_audience, status, announcement_date, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({
      message: "Announcement updated successfully",
      announcement: result.rows[0]
    });
  } catch (error) {
    console.error("Update announcement error:", error.message);
    res.status(500).json({ message: "Server error updating announcement" });
  }
});

// ✅ Delete an announcement
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM announcements WHERE id = $1", [id]);
    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Delete announcement error:", error.message);
    res.status(500).json({ message: "Server error deleting announcement" });
  }
});

module.exports = router;
