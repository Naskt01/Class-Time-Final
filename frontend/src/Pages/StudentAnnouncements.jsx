import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import "../styles/styles.css";

function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/announcements/for-student");
      if (!response.ok) throw new Error("Failed to fetch announcements");
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <h1>Announcements</h1>
      </div>

      {loading ? (
        <p>Loading announcements...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((ann) => (
              <tr key={ann.id}>
                <td>{ann.title}</td>
                <td style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                  {ann.content}
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      ann.status === "published" ? "published" : ""
                    }`}
                  >
                    {ann.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default StudentAnnouncements;

