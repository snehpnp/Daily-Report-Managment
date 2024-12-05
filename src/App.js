import React, { useState, useEffect } from "react";

const App = () => {
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState("");
  const [totalTime, setTotalTime] = useState(0);
  const [detailedReport, setDetailedReport] = useState("");

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };
  

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
      doneTime: null,
      timeTaken: 0,
    };
    setReports([...reports, newReportObj]);
      localStorage.setItem("reports", JSON.stringify([...reports, newReportObj]));

    setNewReport("");
  };

  const handleDone = (index) => {
    const updatedReports = [...reports];
    const endTime = Date.now();
    const timeTaken = (endTime - updatedReports[index].startTime) / 60000;

    updatedReports[index].done = true;
    updatedReports[index].doneTime = endTime;
    updatedReports[index].timeTaken = timeTaken;
    setReports(updatedReports);
  };

  const calculateTotalTime = () => {
    const totalMinutes = reports.reduce((acc, report) => acc + report.timeTaken, 0);
    setTotalTime(totalMinutes);

    const reportSummary = reports
      .map(
        (report, index) =>
          `${index + 1}. ${report.report} | Start Time: ${formatTime(
            report.startTime
          )} | Done Time: ${report.doneTime ? formatTime(report.doneTime) : "Pending"} | Time Taken: ${
            report.done ? `${report.timeTaken.toFixed(2)} minutes` : "In Progress"
          }`
      )
      .join("\n");
    setDetailedReport(reportSummary);
  };

  const clearAllData = () => {
    console.log("Clearing all data...");
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

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Report Description</th>
                <th style={styles.th}>Start Time</th>
                <th style={styles.th}>Done Time</th>
                <th style={styles.th}>Time Taken (Minutes)</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={index}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{report.report}</td>
                  <td style={styles.td}>{formatTime(report.startTime)}</td>
                  <td style={styles.td}>
                    {report.done ? formatTime(report.doneTime) : "Not Done Yet"}
                  </td>
                  <td style={styles.td}>
                    {report.done
                      ? `${report.timeTaken.toFixed(2)} min`
                      : "In Progress"}
                  </td>
                  <td style={styles.td}>
                    {!report.done ? (
                      <button
                        onClick={() => handleDone(index)}
                        style={{ ...styles.button, ...styles.success }}
                      >
                        Mark as Done
                      </button>
                    ) : (
                      <span style={{ fontSize: "14px", fontWeight: "bold", color: "#28a745" }}>
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={calculateTotalTime}
            style={{ ...styles.button, backgroundColor: "#ffc107", color: "#000" }}
          >
            Calculate Total Time
          </button>
          {totalTime > 0 && (
            <div style={{ marginTop: "10px", fontSize: "18px", color: "#333" }}>
              <strong>Total Time: {totalTime.toFixed(2)} Minutes</strong>
            </div>
          )}
        </div>

        {detailedReport && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <h3>Detailed Report</h3>
            <textarea
              readOnly
              value={detailedReport}
              style={{
                width: "100%",
                height: "150px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                background: "#f9f9f9",
                color: "#333",
                resize: "none",
              }}
            />
          </div>
        )}

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={clearAllData}
            style={{ ...styles.button, backgroundColor: "#dc3545", color: "#fff" }}
          >
            Clear All Data
          </button>
        </div>
      </div>

  );
};

export default App;
