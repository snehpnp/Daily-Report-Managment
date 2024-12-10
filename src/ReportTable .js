import React from "react";
import DataTable from "react-data-table-component";

const ReportTable = ({ reports, handleEdit, handleDelete, handleDone, handleHold, editIndex, setEditDescription, handleSaveEdit }) => {
  // Define Columns
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
          <span style={{ wordBreak: "break-word", maxWidth: "800px", whiteSpace: "normal" }}>
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
      name: "Time Taken (Minutes)",
      selector: (row) =>
        row.done ? `${row.timeTaken.toFixed(2)} min` : "In Progress",
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
    <DataTable
      title="Reports"
      columns={columns}
      data={reports}
      pagination
      responsive
      highlightOnHover
    />
  );
};

export default ReportTable;
