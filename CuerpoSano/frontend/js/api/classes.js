// frontend/js/api/classes.js
import { API_BASE_URL } from "./config.js";

export const ClassAPI = {
    /** Obtener todas las clases */
    async getAll() {
        const response = await fetch(`${API_BASE_URL}/Clases`);
        if (!response.ok) throw new Error("Error al obtener las clases");
        return await response.json();
    },

    /** Obtener una clase por ID */
    async getById(id) {
        const response = await fetch(`${API_BASE_URL}/Clases/${id}`);
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Error al obtener la clase");
        return await response.json();
    },

    /** Crear una nueva clase */
    async create(data) {
        const response = await fetch(`${API_BASE_URL}/Clases`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Error al crear la clase");
        }
        return await response.json();
    },

    /** Actualizar una clase */
    async update(id, data) {
        const response = await fetch(`${API_BASE_URL}/Clases/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || "Error al actualizar la clase");
        }
        return true;
    },

    /** Eliminar una clase */
    async delete(id) {
        const response = await fetch(`${API_BASE_URL}/Clases/${id}`, {
            method: "DELETE",
        });
        if (response.status === 404) throw new Error("Clase no encontrada");
        if (!response.ok) throw new Error("Error al eliminar la clase");
        return true;
    },

    // ------------------ INSCRIPCIONES ------------------

    /** Inscribir un miembro en una clase */
    async inscribirMiembro(claseId, miembroId) {
        const response = await fetch(`${API_BASE_URL}/Clases/${claseId}/inscribir/${miembroId}`, {
            method: "POST",
        });
        const text = await response.text();
        if (!response.ok) throw new Error(text || "Error al inscribir al miembro");
        return text;
    },

    /** Desinscribir un miembro de una clase */
    async desinscribirMiembro(claseId, miembroId) {
        const response = await fetch(`${API_BASE_URL}/Clases/${claseId}/desinscribir/${miembroId}`, {
            method: "POST",
        });
        const text = await response.text();
        if (!response.ok) throw new Error(text || "Error al desinscribir al miembro");
        return text;
    },

    // ------------------ RELACIONES ------------------

    /** Obtener los miembros inscriptos en una clase */
    async getMiembros(claseId) {
        const response = await fetch(`${API_BASE_URL}/Clases/${claseId}/miembros`);
        if (response.status === 404) throw new Error("Clase no encontrada");
        if (!response.ok) throw new Error("Error al obtener miembros de la clase");
        return await response.json();
    },

    /** Obtener las asistencias registradas de una clase */
    async getAsistencias(claseId) {
        const response = await fetch(`${API_BASE_URL}/Clases/${claseId}/asistencias`);
        if (response.status === 404) throw new Error("Clase no encontrada");
        if (!response.ok) throw new Error("Error al obtener asistencias de la clase");
        return await response.json();
    },
};
