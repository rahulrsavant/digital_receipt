import React from "react";

export default function ExtraFieldsForm({ schema, value, onChange }) {
  const updateValue = (key, newValue) => {
    const next = { ...value };
    if (newValue === "" || newValue === null) {
      delete next[key];
    } else {
      next[key] = newValue;
    }
    onChange(next);
  };

  if (!schema || schema.length === 0) {
    return null;
  }

  return (
    <div className="extra-fields">
      <h3>Extra Fields</h3>
      <div className="field-grid">
        {schema.map((field) => {
          const fieldValue = value[field.key] ?? "";
          const commonProps = {
            id: field.key,
            name: field.key,
          };

          return (
            <label key={field.key} className="field">
              <span>
                {field.label || field.key}
                {field.required ? " *" : ""}
              </span>
              {field.type === "string" && (
                <input
                  {...commonProps}
                  type="text"
                  value={fieldValue}
                  onChange={(e) => updateValue(field.key, e.target.value)}
                />
              )}
              {field.type === "number" && (
                <input
                  {...commonProps}
                  type="number"
                  value={fieldValue}
                  onChange={(e) =>
                    updateValue(
                      field.key,
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              )}
              {field.type === "boolean" && (
                <input
                  {...commonProps}
                  type="checkbox"
                  checked={Boolean(fieldValue)}
                  onChange={(e) => updateValue(field.key, e.target.checked)}
                />
              )}
              {field.type === "date" && (
                <input
                  {...commonProps}
                  type="date"
                  value={fieldValue}
                  onChange={(e) => updateValue(field.key, e.target.value)}
                />
              )}
              {field.type === "enum" && (
                <select
                  {...commonProps}
                  value={fieldValue}
                  onChange={(e) => updateValue(field.key, e.target.value)}
                >
                  <option value="">Select</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
