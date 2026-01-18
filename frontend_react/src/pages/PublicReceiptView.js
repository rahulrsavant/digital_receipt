import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPublicReceipt } from "../api";

export default function PublicReceiptView() {
  const { projectCode, receiptId } = useParams();
  const [searchParams] = useSearchParams();
  const sign = searchParams.get("sign") || "";
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getPublicReceipt(projectCode, receiptId, sign);
        setData(response);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [projectCode, receiptId, sign]);

  const schemaMap = useMemo(() => {
    const map = new Map();
    if (data?.receiptExtraSchema) {
      data.receiptExtraSchema.forEach((field) => map.set(field.key, field.label || field.key));
    }
    return map;
  }, [data]);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const { project, receipt } = data;
  const extraEntries = Object.entries(receipt.extraData || {});

  return (
    <div className="public-receipt">
      <div className="receipt-card">
        <header
          className="receipt-header"
          style={{
            borderColor: project.primaryColor || "#0f172a",
          }}
        >
          <div>
            <h1>{project.name}</h1>
            <p>{project.address}</p>
            <p>{project.phone}</p>
            <p>{project.email}</p>
          </div>
          {project.logoPath && (
            <img src={project.logoPath} alt="logo" className="logo" />
          )}
        </header>

        <section className="receipt-info">
          <div>
            <strong>Receipt No:</strong> {receipt.receiptNo}
          </div>
          <div>
            <strong>Date:</strong> {new Date(receipt.dateTime).toLocaleString()}
          </div>
          <div>
            <strong>Payment:</strong> {receipt.paymentMode}
          </div>
        </section>

        <section>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
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
        </section>

        <section className="totals">
          <div>
            <span>Subtotal</span>
            <strong>{receipt.subtotal}</strong>
          </div>
          <div>
            <span>Discount</span>
            <strong>{receipt.discount}</strong>
          </div>
          <div>
            <span>Tax</span>
            <strong>{receipt.tax}</strong>
          </div>
          <div className="grand">
            <span>Grand Total</span>
            <strong>{receipt.grandTotal}</strong>
          </div>
        </section>

        {extraEntries.length > 0 && (
          <section className="extra-data">
            <h3>Extra Details</h3>
            <ul>
              {extraEntries.map(([key, value]) => (
                <li key={key}>
                  <strong>{schemaMap.get(key) || key}:</strong> {String(value)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {receipt.notes && (
          <section className="notes">
            <h3>Notes</h3>
            <p>{receipt.notes}</p>
          </section>
        )}

        <footer>
          <p>{project.footerNote}</p>
          <button type="button" className="btn" onClick={() => window.print()}>
            Print
          </button>
        </footer>
      </div>
    </div>
  );
}
