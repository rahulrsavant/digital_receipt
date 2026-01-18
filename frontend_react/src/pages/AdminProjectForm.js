import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createProject, getProject, updateProject, uploadProjectLogo } from "../api";
import SchemaEditor from "../components/SchemaEditor";

const initialForm = {
  code: "",
  name: "",
  logoPath: "",
  primaryColor: "",
  secondaryColor: "",
  address: "",
  phone: "",
  email: "",
  footerNote: "",
  isActive: true,
};

export default function AdminProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [schema, setSchema] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const data = await getProject(id);
        setForm({
          code: data.code || "",
          name: data.name || "",
          logoPath: data.logoPath || "",
          primaryColor: data.primaryColor || "",
          secondaryColor: data.secondaryColor || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          footerNote: data.footerNote || "",
          isActive: data.isActive !== false,
        });
        setSchema(data.receiptExtraSchema || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateSchema = () => {
    const keys = schema.map((field) => field.key).filter(Boolean);
    const uniqueKeys = new Set(keys);
    if (keys.length !== uniqueKeys.size) {
      throw new Error("Extra field keys must be unique");
    }
    if (schema.some((field) => !field.key || !field.label || !field.type)) {
      throw new Error("Each extra field needs key, label, and type");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      validateSchema();
      const payload = {
        ...form,
        receiptExtraSchema: schema,
      };
      let saved;
      if (id) {
        saved = await updateProject(id, payload);
      } else {
        saved = await createProject(payload);
      }
      if (logoFile) {
        await uploadProjectLogo(saved.id, logoFile);
      }
      navigate("/admin/projects");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{id ? "Edit Project" : "New Project"}</h1>
          <p className="muted">Configure branding and custom fields.</p>
        </div>
        <Link to="/admin/projects" className="btn secondary">
          Back
        </Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && (
        <form className="card form" onSubmit={handleSubmit}>
          <div className="field-grid">
            <label className="field">
              <span>Code *</span>
              <input
                type="text"
                value={form.code}
                onChange={(e) => updateForm("code", e.target.value)}
                disabled={Boolean(id)}
                required
              />
            </label>
            <label className="field">
              <span>Name *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Primary Color</span>
              <input
                type="text"
                value={form.primaryColor}
                onChange={(e) => updateForm("primaryColor", e.target.value)}
                placeholder="#1f2937"
              />
            </label>
            <label className="field">
              <span>Secondary Color</span>
              <input
                type="text"
                value={form.secondaryColor}
                onChange={(e) => updateForm("secondaryColor", e.target.value)}
                placeholder="#14b8a6"
              />
            </label>
            <label className="field">
              <span>Address</span>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateForm("address", e.target.value)}
              />
            </label>
            <label className="field">
              <span>Phone</span>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
              />
            </label>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
              />
            </label>
            <label className="field">
              <span>Footer Note</span>
              <input
                type="text"
                value={form.footerNote}
                onChange={(e) => updateForm("footerNote", e.target.value)}
              />
            </label>
            <label className="field">
              <span>Logo</span>
              <input type="file" onChange={(e) => setLogoFile(e.target.files[0])} />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateForm("isActive", e.target.checked)}
              />
              Active
            </label>
          </div>

          <SchemaEditor schema={schema} onChange={setSchema} />

          <div className="actions">
            <button type="submit" className="btn">
              Save Project
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
