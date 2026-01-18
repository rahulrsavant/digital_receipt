import React from "react";

const FIELD_TYPES = ["string", "number", "boolean", "date", "enum"];

export default function SchemaEditor({ schema, onChange }) {
  const updateField = (index, updates) => {
    const next = schema.map((field, i) => (i === index ? { ...field, ...updates } : field));
    onChange(next);
  };

  const addField = () => {
    onChange([
      ...schema,
      { key: "", label: "", type: "string", required: false, options: [] },
    ]);
  };

  const removeField = (index) => {
    const next = schema.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div className="schema-editor">
      <div className="schema-header">
        <h3>Extra Field Schema</h3>
        <button type="button" onClick={addField} className="btn secondary">
          Add Field
        </button>
      </div>
      {schema.length === 0 ? (
        <p className="muted">No extra fields yet. Add one to collect extra data per receipt.</p>
      ) : (
        <div className="schema-grid">
          {schema.map((field, index) => (
            <div className="schema-row" key={index}>
              <input
                type="text"
                placeholder="key"
                value={field.key}
                onChange={(e) => updateField(index, { key: e.target.value.trim() })}
              />
              <input
                type="text"
                placeholder="label"
                value={field.label}
                onChange={(e) => updateField(index, { label: e.target.value })}
              />
              <select
                value={field.type}
                onChange={(e) => updateField(index, { type: e.target.value })}
              >
                {FIELD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={field.required || false}
                  onChange={(e) => updateField(index, { required: e.target.checked })}
                />
                Required
              </label>
              {field.type === "enum" && (
                <input
                  type="text"
                  placeholder="options (comma separated)"
                  value={(field.options || []).join(",")}
                  onChange={(e) =>
                    updateField(index, {
                      options: e.target.value
                        .split(",")
                        .map((opt) => opt.trim())
                        .filter(Boolean),
                    })
                  }
                />
              )}
              {field.type !== "enum" && <div className="placeholder" />}
              <button type="button" onClick={() => removeField(index)} className="btn link">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
