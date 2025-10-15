// frontend/js/api/members.js
import { API_BASE_URL } from "./config.js";

export const MembersAPI = {

    async getByDni(dni) {
        const response = await fetch(`${API_BASE_URL}/Miembros/${dni}`);
        if (response.status === 404) {
            return null; // miembro no encontrado
        }
        if (!response.ok) throw new Error("Error al obtener miembro");
        return await response.json();
    },

    async getAll() {
        const response = await fetch(`${API_BASE_URL}/Miembros`);
        if (!response.ok) throw new Error("Error al obtener miembros");
        return await response.json();
    },

    async create(memberData) {
        const response = await fetch(`${API_BASE_URL}/Miembros`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(memberData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al crear miembro");
        }
        return await response.json();
    },

    async update(id, memberData) {
        const response = await fetch(`${API_BASE_URL}/Miembros/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(memberData),
        });
        if (!response.ok) throw new Error("Error al actualizar miembro");
        return await response.json();
    },

    async delete(id) {
        const response = await fetch(`${API_BASE_URL}/Miembros/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar miembro");
    },
};
