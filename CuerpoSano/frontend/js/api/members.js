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

    /** Obtener miembro por ID */
    async getById(id) {
        const response = await fetch(`${API_BASE_URL}/Miembros/id/${id}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Error al obtener miembro por ID");
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

    /** Asignar o desasignar un entrenador */
    async assignTrainer(dni, entrenadorId) {
        const response = await fetch(`${API_BASE_URL}/Miembros/${dni}/asignar-entrenador`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(entrenadorId),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || "Error al asignar entrenador");
        }

        return await response.json();
    },
};
