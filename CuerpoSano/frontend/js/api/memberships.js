import { API_BASE_URL } from "./config.js";

export const MembershipsAPI = {
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/Membresias`);
        if (!response.ok) throw new Error("Error al obtener membresías");
        return await response.json();
    },

    async getById(id) {
        const response = await fetch(`${API_BASE_URL}/Membresias/${id}`);
        if (!response.ok) throw new Error("Error al obtener membresía");
        return await response.json();
    },

    async create(data) {
        const response = await fetch(`${API_BASE_URL}/Membresias`, {
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
        const response = await fetch(`${API_BASE_URL}/Membresias/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar membresía");
    },

    async update(id, membershipDate) {
        const response = await fetch(`${API_BASE_URL}/Membresias/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(membershipDate),
        });
        if (!response.ok) throw new Error("Error al actualizar miembro");
        return await response.json();
    },

    /** Pausar membresía */
    async pause(id, inicioPausa) {
        const response = await fetch(
            `${API_BASE_URL}/Membresias/pausar/${id}?inicioPausa=${encodeURIComponent(inicioPausa)}`,
            { method: "PUT" }
        );

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || "Error al pausar membresía");
        }

        return await response.json();
    },

    /** Despausar membresía */
    async unpause(id) {
        const response = await fetch(`${API_BASE_URL}/Membresias/despausar/${id}`, {
            method: "PUT",
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || "Error al despausar membresía");
        }

        return await response.json();
    },
};
