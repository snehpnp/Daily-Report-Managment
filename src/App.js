import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
const App = () => {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState("");
  const [totalTime, setTotalTime] = useState(0);
  const [detailedReport, setDetailedReport] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const storedReports = localStorage.getItem("reports");
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  }, []);

  const handleAddReport = () => {
    if (!newReport.trim()) return;
    const newReportObj = {
      report: newReport,
      startTime: Date.now(),
      done: false,
      hold: false,
      holdStartTime: null,
      totalHoldTime: 0,
      doneTime: null,
      timeTaken: 0,
    };
    setReports([...reports, newReportObj]);
    localStorage.setItem("reports", JSON.stringify([...reports, newReportObj]));
    setNewReport("");
  };

  const handleDone = (index) => {
    const updatedReports = [...reports];
    const report = updatedReports[index];

    if (report.hold) {
      // Ensure task is not on hold when marking as done
      const holdDuration = (Date.now() - report.holdStartTime) / 60000;
      report.totalHoldTime = (report.totalHoldTime || 0) + holdDuration;
      report.holdStartTime = null;
      report.hold = false;
    }

    const endTime = Date.now();
    const timeTaken = (endTime - report.startTime) / 60000; // Convert to minutes
    report.done = true;
    report.doneTime = endTime;
    report.timeTaken = timeTaken - (report.totalHoldTime || 0); // Exclude hold time
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  const handleHold = (index) => {
    const updatedReports = [...reports];
    const report = updatedReports[index];

    if (!report.hold) {
      // Start hold
      report.holdStartTime = Date.now();
    } else {
      // Resume: Calculate total hold time
      const holdDuration = (Date.now() - report.holdStartTime) / 60000; // Convert to minutes
      report.totalHoldTime = (report.totalHoldTime || 0) + holdDuration;
      report.holdStartTime = null; // Clear hold start time
    }

    report.hold = !report.hold; // Toggle hold state
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  const handleDelete = (index) => {
    // ADD CONFIRM TO DELETE REPORT
    if (!window.confirm("Are you sure you want to delete this report?")) return;


    const updatedReports = reports.filter((_, i) => i !== index);
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditDescription(reports[index].report);
  };

  const handleSaveEdit = (index) => {
    const updatedReports = [...reports];
    updatedReports[index].report = editDescription;
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
    setEditIndex(null);
    setEditDescription("");
  };

  const calculateTotalTime = () => {
    // Calculate total time in minutes
    const totalMinutes = reports.reduce(
      (acc, report) => acc + report.timeTaken,
      0
    );

    // Convert total time to hours and minutes
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = Math.round(totalMinutes % 60);

    let reportSummary = "DAILY REPORT SUMMARY\n\n";

    reportSummary += reports
  .map(
    (report, index) =>
      `${index + 1}. ${report.report} | Start Time: ${formatTime(
        report.startTime
      )} | Done Time: ${
        report.doneTime ? formatTime(report.doneTime) : "Pending"
      } | Time Taken: ${
        report.done ? formatDuration(report.timeTaken) : "In Progress"
      } | Status: ${
        report.hold ? "On Hold" : report.done ? "Completed" : "In Progress"
      }`
  )
  .join("\n");


    reportSummary += `\n\nTotal Time: ${totalHours}h ${remainingMinutes}m`;

    setDetailedReport(reportSummary);
  };

  const clearAllData = () => {
    setReports([]);
    setTotalTime(0);
    setDetailedReport("");
    localStorage.removeItem("reports");
  };

  const styles = {
    page: {
      padding: "20px",
      background: "#f9f9f9",
      borderRadius: "8px",
    },
    input: {
      flex: 1,
      padding: "8px 12px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "16px",
    },
    button: {
      padding: "8px 12px",
      fontSize: "14px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    primary: {
      backgroundColor: "#007bff",
      color: "#fff",
    },
    success: {
      backgroundColor: "#28a745",
      color: "#fff",
    },
    warning: {
      backgroundColor: "#ffc107",
      color: "#000",
    },
    danger: {
      backgroundColor: "#dc3545",
      color: "#fff",
    },
    tableWrapper: {
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    th: {
      background: "#007bff",
      color: "#fff",
      padding: "10px",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
    },
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };
  

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "60px",
    },
    {
      name: "Report Description",
      selector: (row) => row.report,
      cell: (row, index) =>
        editIndex === index ? (
          <input
            type="text"
            value={row.report}
            onChange={(e) => setEditDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "5px",
            }}
          />
        ) : (
          <span
            style={{
              wordBreak: "break-word",
              maxWidth: "800px",
              whiteSpace: "normal",
            }}
          >
            {row.report}
          </span>
        ),
    },
    {
      name: "Start Time",
      selector: (row) => formatTime(row.startTime),
    },
    {
      name: "Done Time",
      selector: (row) => (row.done ? formatTime(row.doneTime) : "Not Done Yet"),
    },
    {
      name: "Time Taken",
      selector: (row) => {
        if (row.done) {
          const hours = Math.floor(row.timeTaken / 60);
          const minutes = Math.round(row.timeTaken % 60);
          return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        }
        return "In Progress";
      },
    },
    
    {
      name: "Actions",
      cell: (row, index) => (
        <div style={{ display: "flex", gap: "5px" }}>
          {!row.done && (
            <button
              onClick={() => handleHold(index)}
              style={{
                backgroundColor: row.hold ? "#ffc107" : "#007bff",
                color: "#fff",
                padding: "5px 10px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              {row.hold ? "Resume" : "Hold"}
            </button>
          )}
          {!row.done && !row.hold && (
            <button
              onClick={() => handleDone(index)}
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "5px 10px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Mark as Done
            </button>
          )}
          {editIndex === index ? (
            <button
              onClick={() => handleSaveEdit(index)}
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "5px 10px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Save
            </button>
          ) : (
            <button
              onClick={() => handleEdit(index)}
              style={{
                backgroundColor: "#ffc107",
                color: "#000",
                padding: "5px 10px",
                border: "none",
                borderRadius: "4px",
              }}
            >
              Edit
            </button>
          )}
          <button
            onClick={() => handleDelete(index)}
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              padding: "5px 10px",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // Format time function (use your own implementation)
  const formatTime = (time) => {
    return new Date(time).toLocaleString(); // Example formatting
  };

  return (
    <div style={styles.page}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter report description"
          value={newReport}
          onChange={(e) => setNewReport(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={handleAddReport}
          style={{ ...styles.button, ...styles.primary }}
        >
          Add Report
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <DataTable
          title="Reports"
          columns={columns}
          data={reports}
          pagination
          responsive
          highlightOnHover
        />
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={calculateTotalTime}
          style={{ ...styles.button, ...styles.warning }}
        >
          Calculate Total Time
        </button>
        {totalTime > 0 && (
          <div style={{ marginTop: "10px", fontSize: "18px", color: "#333" }}>
            <strong>Total Time: {totalTime.toFixed(2)} minutes</strong>
          </div>
        )}
        <textarea
          value={detailedReport}
          readOnly
          style={{
            marginTop: "20px",
            width: "100%",
            height: "200px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            resize: "none",
          }}
        />
        <button
          onClick={clearAllData}
          style={{
            ...styles.button,
            ...styles.danger,
            marginTop: "10px",
          }}
        >
          Clear All Data
        </button>
      </div>
    </div>
  );
};

export default App;
