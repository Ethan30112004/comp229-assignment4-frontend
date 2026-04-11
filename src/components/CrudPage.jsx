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
      setError(err.message || "Failed to load data");
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
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // làm sạch dữ liệu trước khi gửi
      const payload = { ...formData };

      // nếu đang edit và password để trống thì bỏ password ra khỏi payload
      if (editingId !== null && payload.password === "") {
        delete payload.password;
      }

      if (editingId !== null) {
        await updateItem(resource, editingId, payload);
        setMessage(`${title} updated successfully.`);
      } else {
        await createItem(resource, payload);
        setMessage(`${title} added successfully.`);
      }

      resetForm();
      loadItems();
    } catch (err) {
      setError(err.message || `Failed to save ${title.toLowerCase()}`);
    }
  };

  const handleEdit = (item) => {
    const nextForm = {};

    fields.forEach((field) => {
      if (field.clearOnEdit) {
        nextForm[field.name] = "";
      } else {
        nextForm[field.name] = item[field.name] || "";
      }
    });

    const itemId = item._id || item.id;

    setFormData(nextForm);
    setEditingId(itemId);
    setMessage("");
    setError("");
  };

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${title.toLowerCase()}?`
    );
    if (!confirmed) return;

    try {
      await deleteItem(resource, itemId);
      setMessage(`${title} deleted successfully.`);
      loadItems();
    } catch (err) {
      setError(err.message || `Failed to delete ${title.toLowerCase()}`);
    }
  };

  const formatValue = (fieldName, value) => {
    if (!value) return "-";

    if (fieldName === "completion") {
      return new Date(value).toLocaleDateString();
    }

    return value;
  };

  return (
    <div className="page-container">
      <h2>{title} Management</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form className="crud-form" onSubmit={handleSubmit}>
        {fields.map((field) => {
          const isEditingAndHidden = editingId !== null && field.hideOnEdit;
          if (isEditingAndHidden) return null;

          return (
            <div key={field.name} className="form-group">
              <label>{field.label}</label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={editingId === null ? field.required !== false : false}
                  placeholder={field.placeholder || ""}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={
                    editingId === null
                      ? field.required !== false
                      : field.requiredOnEdit === true
                  }
                  placeholder={field.placeholder || ""}
                />
              )}
            </div>
          );
        })}

        <div className="button-group">
          <button type="submit">
            {editingId !== null ? `Update ${title}` : `Add ${title}`}
          </button>

          {editingId !== null && (
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
        <p>No {title.toLowerCase()} found yet.</p>
      ) : (
        <div className="card-list">
          {items.map((item) => {
            const itemId = item._id || item.id;

            return (
              <div key={itemId} className="card-item">
                {fields
                  .filter((field) => !field.hideInList)
                  .map((field) => (
                    <p key={field.name}>
                      <strong>{field.label}:</strong>{" "}
                      {formatValue(field.name, item[field.name])}
                    </p>
                  ))}

                <div className="button-group">
                  <button type="button" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(itemId)}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}