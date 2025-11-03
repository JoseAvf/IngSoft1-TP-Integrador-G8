export function calcularDescuentos(miembro, membresia) {
	let descuento = 0;
	const edad = obtenerEdad(miembro.fechaNacimiento);
	if (edad >= 65) descuento += 20;
	if (miembro.esEstudiante) descuento += 10;
	const total = membresia.costo * (1 - descuento / 100);
	return { descuento, total };
}

function obtenerEdad(fechaNacimiento) 
{
	const hoy = new Date();
	const nacimiento = new Date(fechaNacimiento);
	let edad = hoy.getFullYear() - nacimiento.getFullYear();
	const mes = hoy.getMonth() - nacimiento.getMonth();
	if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())){edad--;}
	return edad;
}