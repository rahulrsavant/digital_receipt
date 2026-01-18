import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects, listReceipts } from "../api";

export default function AdminReceiptsList() {
  const [projects, setProjects] = useState([]);
  const [projectCode, setProjectCode] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        if (data.length > 0) {
          setProjectCode(data[0].code);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!projectCode) {
      return;
    }
    const loadReceipts = async () => {
      try {
        const data = await listReceipts(projectCode);
        setReceipts(data);
      } catch (err) {
        setError(err.message);
      }
    };
    loadReceipts();
  }, [projectCode]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Receipts</h1>
          <p className="muted">Browse receipts by project.</p>
        </div>
        <Link to="/admin/receipts/new" className="btn">
          New Receipt
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="filters">
        <label>
          Project
          <select value={projectCode} onChange={(e) => setProjectCode(e.target.value)}>
            {projects.map((project) => (
              <option key={project.code} value={project.code}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {receipts.length === 0 ? (
        <p>No receipts found.</p>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Date</th>
                <th>Grand Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map((receipt) => (
                <tr key={receipt.id}>
                  <td>{receipt.receiptNo}</td>
                  <td>{new Date(receipt.dateTime).toLocaleString()}</td>
                  <td>{receipt.grandTotal}</td>
                  <td>
                    <Link
                      to={`/admin/receipts/${receipt.id}?projectCode=${projectCode}`}
                      className="btn link"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
