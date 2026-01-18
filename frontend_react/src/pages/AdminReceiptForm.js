import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createReceipt, getProjects } from "../api";
import ExtraFieldsForm from "../components/ExtraFieldsForm";

const emptyItem = { itemName: "", qty: "", unitPrice: "" };

export default function AdminReceiptForm() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectCode, setProjectCode] = useState("");
  const [schema, setSchema] = useState([]);
  const [extraData, setExtraData] = useState({});
  const [items, setItems] = useState([emptyItem]);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    paymentMode: "CASH",
    discount: "0",
    tax: "0",
    notes: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        if (data.length > 0) {
          setProjectCode(data[0].code);
          setSchema(data[0].receiptExtraSchema || []);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const project = projects.find((p) => p.code === projectCode);
    setSchema(project ? project.receiptExtraSchema || [] : []);
    setExtraData({});
  }, [projectCode, projects]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (index, field, value) => {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    setItems(next);
  };

  const addItem = () => {
    setItems([...items, emptyItem]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = {
        projectCode,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        paymentMode: form.paymentMode,
        discount: Number(form.discount || 0),
        tax: Number(form.tax || 0),
        notes: form.notes,
        items: items.map((item) => ({
          itemName: item.itemName,
          qty: Number(item.qty),
          unitPrice: Number(item.unitPrice),
        })),
        extraData,
      };
      const saved = await createReceipt(payload);
      navigate(`/admin/receipts/${saved.id}?projectCode=${projectCode}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>New Receipt</h1>
          <p className="muted">Create a receipt with dynamic fields.</p>
        </div>
        <Link to="/admin/receipts" className="btn secondary">
          Back
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      <form className="card form" onSubmit={handleSubmit}>
        <div className="field-grid">
          <label className="field">
            <span>Project</span>
            <select value={projectCode} onChange={(e) => setProjectCode(e.target.value)}>
              {projects.map((project) => (
                <option key={project.code} value={project.code}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Customer Name</span>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => updateForm("customerName", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Customer Phone</span>
            <input
              type="text"
              value={form.customerPhone}
              onChange={(e) => updateForm("customerPhone", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Payment Mode</span>
            <select value={form.paymentMode} onChange={(e) => updateForm("paymentMode", e.target.value)}>
              <option value="CASH">CASH</option>
              <option value="UPI">UPI</option>
              <option value="CARD">CARD</option>
              <option value="OTHER">OTHER</option>
            </select>
          </label>
          <label className="field">
            <span>Discount</span>
            <input
              type="number"
              value={form.discount}
              onChange={(e) => updateForm("discount", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Tax</span>
            <input
              type="number"
              value={form.tax}
              onChange={(e) => updateForm("tax", e.target.value)}
            />
          </label>
          <label className="field">
            <span>Notes</span>
            <input type="text" value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} />
          </label>
        </div>

        <div className="items">
          <h3>Items</h3>
          {items.map((item, index) => (
            <div className="item-row" key={index}>
              <input
                type="text"
                placeholder="Item name"
                value={item.itemName}
                onChange={(e) => updateItem(index, "itemName", e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => updateItem(index, "qty", e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Unit price"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                required
              />
              <button type="button" className="btn link" onClick={() => removeItem(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn secondary" onClick={addItem}>
            Add Item
          </button>
        </div>

        <ExtraFieldsForm schema={schema} value={extraData} onChange={setExtraData} />

        <div className="actions">
          <button type="submit" className="btn">
            Create Receipt
          </button>
        </div>
      </form>
    </div>
  );
}
