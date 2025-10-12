import { API_BASE_URL } from "./config.js";

export const MembershipsAPI = {
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/membresias`);
        if (!response.ok) throw new Error("Error al obtener membresías");
        return await response.json();
    },
    async create(data) {
        const response = await fetch(`${API_BASE_URL}/membresias`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Error al crear membresía");
        }
        return await response.json();
    },
    async delete(id) {
        const response = await fetch(`${API_BASE_URL}/membresias/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar membresía");
    },
};
