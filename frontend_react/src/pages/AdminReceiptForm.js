import React, { useEffect, useState } from "react";

export default function AdminReceiptForm() {
  const [form, setForm] = useState({
    businessName: "",
    receiptId: "",
    businessAddress: "",
    gstNumber: false,
    licenseNumber: false,
    fssaiNumber: false,
    customIdType: "",
    footerNote: "",
    phone: "",
    email: "",
    location: "",
    openTime: "",
    closeTime: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [dynamicFields, setDynamicFields] = useState([
    { keyText: "", labelText: "", dataType: "text", required: false },
  ]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!form.receiptId) {
      setForm((prev) => ({ ...prev, receiptId: generateReceiptId() }));
    }
  }, [form.receiptId]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const generateReceiptId = () => {
    const chunk = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `RCPT-${chunk}`;
  };

  const generateCustomIdType = () => {
    const chunk = Math.random().toString(36).slice(2, 8).toUpperCase();
    updateForm("customIdType", `CUSTOM-${chunk}`);
  };

  const updateDynamicField = (index, field, value) => {
    setDynamicFields((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const addDynamicField = (index) => {
    setDynamicFields((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, { keyText: "", labelText: "", dataType: "text", required: false });
      return next;
    });
  };

  const removeDynamicField = (index) => {
    setDynamicFields((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Business Setup</h1>
          <p className="muted">Configure common fields and dynamic inputs.</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <form className="card form" onSubmit={handleSubmit}>
        <h3>Common Fields for All</h3>
        <div className="field-grid">
          <label className="field">
            <span>Business Name</span>
            <input
              type="text"
              value={form.businessName}
              onChange={(e) => updateForm("businessName", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Random Receipt Id</span>
            <div className="field-inline">
              <input type="text" value={form.receiptId} readOnly />
              <button
                type="button"
                className="btn secondary"
                onClick={() => updateForm("receiptId", generateReceiptId())}
              >
                Generate
              </button>
            </div>
          </label>
          <label className="field">
            <span>Business Address</span>
            <input
              type="text"
              value={form.businessAddress}
              onChange={(e) => updateForm("businessAddress", e.target.value)}
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.gstNumber}
              onChange={(e) => updateForm("gstNumber", e.target.checked)}
            />
            GST Number
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.licenseNumber}
              onChange={(e) => updateForm("licenseNumber", e.target.checked)}
            />
            Liscence Number
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.fssaiNumber}
              onChange={(e) => updateForm("fssaiNumber", e.target.checked)}
            />
            FSSAI Number
          </label>
          <label className="field">
            <span>Custom Id Type</span>
            <div className="field-inline">
              <input
                type="text"
                value={form.customIdType}
                onChange={(e) => updateForm("customIdType", e.target.value)}
                placeholder="Enter your own option"
              />
              <button type="button" className="btn secondary" onClick={generateCustomIdType}>
                Generate
              </button>
            </div>
          </label>
          <label className="field">
            <span>Footer Note (max 200 chars)</span>
            <textarea
              value={form.footerNote}
              onChange={(e) => updateForm("footerNote", e.target.value)}
              maxLength={200}
              rows={3}
            />
            <span className="muted">{form.footerNote.length}/200</span>
          </label>
          <label className="field">
            <span>Phone (+91XXXXXXXXXX)</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateForm("phone", e.target.value)}
              placeholder="+911234567890"
              pattern="^\\+91\\d{10}$"
              title="Use +91 followed by 10 digits"
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
            <span>Google Location</span>
            <input
              type="text"
              value={form.location}
              onChange={(e) => updateForm("location", e.target.value)}
              placeholder="Search Google location"
            />
          </label>
          <label className="field">
            <span>Shop Open Time</span>
            <input
              type="time"
              value={form.openTime}
              onChange={(e) => updateForm("openTime", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Shop Close Time</span>
            <input
              type="time"
              value={form.closeTime}
              onChange={(e) => updateForm("closeTime", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Business Logo</span>
            <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
          </label>
        </div>

        <div className="items">
          <h3>Heading [Repeatitive Dynamic Fields]</h3>
          {dynamicFields.map((row, index) => (
            <div className="item-row" key={`${row.keyText}-${index}`}>
              <input
                type="text"
                placeholder="Key text"
                value={row.keyText}
                onChange={(e) => updateDynamicField(index, "keyText", e.target.value)}
              />
              <input
                type="text"
                placeholder="Label text"
                value={row.labelText}
                onChange={(e) => updateDynamicField(index, "labelText", e.target.value)}
              />
              <select
                value={row.dataType}
                onChange={(e) => updateDynamicField(index, "dataType", e.target.value)}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="email">Email</option>
                <option value="date">Date</option>
                <option value="phone">Phone</option>
              </select>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={row.required}
                  onChange={(e) => updateDynamicField(index, "required", e.target.checked)}
                />
                Required
              </label>
              <button type="button" className="btn secondary" onClick={() => addDynamicField(index)}>
                +
              </button>
              <button type="button" className="btn link" onClick={() => removeDynamicField(index)}>
                -
              </button>
            </div>
          ))}
        </div>

        <div className="actions">
          <button type="submit" className="btn">
            Save Business
          </button>
        </div>
      </form>
    </div>
  );
}
