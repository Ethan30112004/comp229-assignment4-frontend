import React, { useEffect, useState } from "react";
import {
  getAllItems,
  createItem,
  updateItem,
  deleteItem
} from "../services/api";

export default function CrudPage({
  title,
  resource,
  fields,
  initialForm
}) {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getAllItems(resource);
      setItems(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [resource]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await updateItem(resource, editingId, formData);
        setMessage(`${title} updated successfully.`);
      } else {
        await createItem(resource, formData);
        setMessage(`${title} added successfully.`);
      }

      resetForm();
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    const nextForm = {};
    fields.forEach((field) => {
      nextForm[field.name] = item[field.name] || "";
    });

    setFormData(nextForm);
    setEditingId(item.id);
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      await deleteItem(resource, id);
      setMessage(`${title} deleted successfully.`);
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <h2>{title} Management</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form className="crud-form" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className="form-group">
            <label>{field.label}</label>

            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required !== false}
              />
            ) : (
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required !== false}
              />
            )}
          </div>
        ))}

        <div className="button-group">
          <button type="submit">
            {editingId ? "Update" : "Add"} {title}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr />

      <h3>{title} List</h3>

      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No {title.toLowerCase()} found.</p>
      ) : (
        <div className="card-list">
          {items.map((item) => (
            <div key={item.id} className="card-item">
              {fields.map((field) => (
                <p key={field.name}>
                  <strong>{field.label}:</strong> {item[field.name] || "-"}
                </p>
              ))}

              <div className="button-group">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}