const BASE_URL = "http://localhost:5000/api";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const getAllItems = (resource) => apiRequest(`/${resource}`);

export const getItemById = (resource, id) => apiRequest(`/${resource}/${id}`);

export const createItem = (resource, formData) =>
  apiRequest(`/${resource}`, {
    method: "POST",
    body: JSON.stringify(formData)
  });

export const updateItem = (resource, id, formData) =>
  apiRequest(`/${resource}/${id}`, {
    method: "PUT",
    body: JSON.stringify(formData)
  });

export const deleteItem = (resource, id) =>
  apiRequest(`/${resource}/${id}`, {
    method: "DELETE"
  });