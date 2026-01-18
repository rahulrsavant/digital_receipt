const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.error || JSON.stringify(data);
    } catch (err) {
      message = await response.text();
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

export function getProjects() {
  return request("/api/admin/projects");
}

export function getProject(id) {
  return request(`/api/admin/projects/${id}`);
}

export function createProject(payload) {
  return request("/api/admin/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProject(id, payload) {
  return request(`/api/admin/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProject(id) {
  return request(`/api/admin/projects/${id}`, {
    method: "DELETE",
  });
}

export async function uploadProjectLogo(id, file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_BASE}/api/admin/projects/${id}/logo`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Upload failed");
  }
  return response.json();
}

export function createReceipt(payload) {
  return request("/api/admin/receipts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listReceipts(projectCode) {
  return request(`/api/admin/receipts?projectCode=${encodeURIComponent(projectCode)}`);
}

export function getReceipt(projectCode, receiptId) {
  return request(`/api/admin/receipts/${receiptId}?projectCode=${encodeURIComponent(projectCode)}`);
}

export function getShareLink(projectCode, receiptId) {
  return request(`/api/admin/receipts/${receiptId}/share-link?projectCode=${encodeURIComponent(projectCode)}`);
}

export function getPublicReceipt(projectCode, receiptId, sign) {
  return request(`/api/public/receipt/${projectCode}/${receiptId}?sign=${encodeURIComponent(sign)}`);
}
