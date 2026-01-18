import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page hero">
      <h1>Digital Receipt System</h1>
      <p className="muted">
        Manage multi-tenant receipts with dynamic fields. Use admin tools to configure projects,
        then share receipts publicly.
      </p>
      <div className="actions">
        <Link to="/admin/projects" className="btn">
          Manage Projects
        </Link>
        <Link to="/admin/receipts" className="btn secondary">
          Manage Receipts
        </Link>
      </div>
    </div>
  );
}
