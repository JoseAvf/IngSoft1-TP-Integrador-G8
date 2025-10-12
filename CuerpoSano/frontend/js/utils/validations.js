 
export function validateMemberForm(data) {
    const errors = [];
    if (!data.nombre) errors.push("El nombre es obligatorio");
    if (!data.dni) errors.push("El DNI es obligatorio");
    if (!/^\d+$/.test(data.dni)) errors.push("El DNI debe contener solo números");
    if (!data.telefono) errors.push("El teléfono es obligatorio");
    if (isNaN(data.edad) || data.edad <= 0)
        errors.push("La edad debe ser un número válido");
    return errors;
}
export function validateMembershipForm(data) {
    const errors = [];
    if (!data.tipo) errors.push("El tipo de membresía es obligatorio");
    if (isNaN(data.costoBase) || data.costoBase <= 0)
        errors.push("El costo base debe ser un número positivo");
    if (isNaN(data.mesesDuracion) || data.mesesDuracion <= 0)
        errors.push("La duración en meses debe ser mayor que 0");
    if (isNaN(data.miembroId) || data.miembroId <= 0)
        errors.push("Debe especificar un miembro válido");
    return errors;
}

