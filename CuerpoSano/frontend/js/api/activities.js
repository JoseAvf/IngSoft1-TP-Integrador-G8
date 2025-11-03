// frontend/js/api/activities.js
import { API_BASE_URL } from "./config.js";

export const ActivityAPI = {
    /** Obtener todas las actividades */
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/Actividades`);
        if (!response.ok) throw new Error("Error al obtener actividades");
        return await response.json();
    },

    /** Obtener una actividad por ID */
    async getById(id) {
        const response = await fetch(`${API_BASE_URL}/Actividades/${id}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Error al obtener la actividad");
        return await response.json();
    },

    /** Crear una nueva actividad */
    async create(data) {
        const response = await fetch(`${API_BASE_URL}/Actividades`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || "Error al crear la actividad");
        }

        return await response.json(); // CreatedAtAction devuelve la actividad creada
    },

    /** Actualizar una actividad existente */
    async update(id, data) {
        const response = await fetch(`${API_BASE_URL}/Actividades/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(err || "Error al actualizar la actividad");
        }

        // El endpoint devuelve NoContent, así que devolvemos true
        return true;
    },

    /** Eliminar una actividad */
    async delete(id) {
        const response = await fetch(`${API_BASE_URL}/Actividades/${id}`, {
            method: "DELETE",
        });
        if (response.status === 404) throw new Error("Actividad no encontrada");
        if (!response.ok) throw new Error("Error al eliminar la actividad");
        return true;
    },
};
