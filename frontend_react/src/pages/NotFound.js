import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page">
      <h1>Page Not Found</h1>
      <Link to="/" className="btn">
        Go Home
      </Link>
    </div>
  );
}
