import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProject, getProjects } from "../api";

export default function AdminProjectsList() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) {
      return;
    }
    try {
      await deleteProject(id);
      await loadProjects();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p className="muted">Manage tenant projects and their branding.</p>
        </div>
        <Link to="/admin/projects/new" className="btn">
          New Project
        </Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && projects.length === 0 && <p>No projects yet.</p>}

      {projects.length > 0 && (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.code}</td>
                  <td>{project.name}</td>
                  <td>{project.isActive ? "Active" : "Inactive"}</td>
                  <td className="actions">
                    <Link to={`/admin/projects/${project.id}/edit`} className="btn link">
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      className="btn link danger"
                    >
                      Delete
                    </button>
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
