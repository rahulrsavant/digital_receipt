import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getReceipt, getShareLink } from "../api";

export default function AdminReceiptView() {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const projectCode = query.get("projectCode") || "";
  const [receipt, setReceipt] = useState(null);
  const [shareLink, setShareLink] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getReceipt(projectCode, id);
        setReceipt(data);
      } catch (err) {
        setError(err.message);
      }
    };
    if (projectCode) {
      load();
    }
  }, [id, projectCode]);

  const handleShare = async () => {
    try {
      const link = await getShareLink(projectCode, id);
      setShareLink(link);
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(link);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!projectCode) {
    return <p className="error">Missing project code.</p>;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Receipt #{receipt?.receiptNo || ""}</h1>
          <p className="muted">Manage and share this receipt.</p>
        </div>
        <Link to="/admin/receipts" className="btn secondary">
          Back
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      {!receipt ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <div className="receipt-meta">
            <div>
              <strong>Date:</strong> {new Date(receipt.dateTime).toLocaleString()}
            </div>
            <div>
              <strong>Payment:</strong> {receipt.paymentMode}
            </div>
            <div>
              <strong>Grand Total:</strong> {receipt.grandTotal}
            </div>
          </div>

          <h3>Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.itemName}</td>
                  <td>{item.qty}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.lineTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {receipt.extraData && Object.keys(receipt.extraData).length > 0 && (
            <div className="extra-block">
              <h3>Extra Data</h3>
              <ul>
                {Object.entries(receipt.extraData).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {String(value)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="actions">
            <button type="button" className="btn" onClick={handleShare}>
              Generate Share Link
            </button>
          </div>
          {shareLink && (
            <div className="share-link">
              <p>Share Link:</p>
              <code>{shareLink}</code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
