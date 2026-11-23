// Salin ke: src/services/api.js (frontend)
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.");
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    // NestJS mengirim { statusCode, message: string | string[], error }
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message ?? `Permintaan gagal (${response.status})`;
    throw new Error(message);
  }
  return body;
}

export const getPets = () => request("/pets");

export const createPet = ({ nama, jenis, umur }) =>
  request("/pets", { method: "POST", body: JSON.stringify({ nama, jenis, umur }) });

export const updatePet = (id, data) =>
  request(`/pets/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deletePet = (id) => request(`/pets/${id}`, { method: "DELETE" });
