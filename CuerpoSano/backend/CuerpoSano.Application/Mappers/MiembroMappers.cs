using CuerpoSano.Application.DTOs.Response;
using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Mappers
{
    public static class MiembroMapper
    {
        public static MiembroCreateResponse ToCreateResponse(this Miembro miembro)
        {
            return new MiembroCreateResponse
            {
                Id = miembro.Id,
                Nombre = miembro.Nombre,
                DNI = miembro.DNI,
                Direccion = miembro.Direccion,
                FechaNacimiento = miembro.FechaNacimiento.Date,
                Telefono = miembro.Telefono,
                Correo = miembro.Correo,
                CodigoCarnet = miembro.Carnet?.CodigoBarra ?? string.Empty,
                tipoMembresia = miembro.Membresia?.Tipo ?? string.Empty,
                FechaEmision = miembro.Carnet?.FechaEmision.Date ?? DateTime.MinValue
            };
        }

        public static MiembroDetalleResponse ToDetalleResponse(this Miembro miembro)
        {
            return new MiembroDetalleResponse
            {
                Id = miembro.Id,
                Nombre = miembro.Nombre,
                DNI = miembro.DNI,
                Direccion = miembro.Direccion,
                FechaNacimiento = miembro.FechaNacimiento,
                Telefono = miembro.Telefono,
                Correo = miembro.Correo,

                // Carnet (puede ser null)
                CodigoCarnet = miembro.Carnet?.CodigoBarra,
                FechaEmisionCarnet = (DateTime)(miembro.Carnet?.FechaEmision),

                // Membresía (puede ser null)
                MembresiaId = miembro.Membresia?.Id,
                TipoMembresia = miembro.Membresia?.Tipo,
                FechaEmisionMembresia = miembro.Membresia?.FechaEmision,
                FechaVencimientoMembresia = miembro.Membresia?.FechaVencimiento,
                CostoMembresia = miembro.Membresia?.Costo,
                EstaPausada = miembro.Membresia?.FechaPausaInicio != null,

                Clases = miembro.Clases?.Select(c => c.Clase.ToResponsePersona()).ToList() ?? new List<ClasePersonaResponse>(),
            };
        }

    }

}
