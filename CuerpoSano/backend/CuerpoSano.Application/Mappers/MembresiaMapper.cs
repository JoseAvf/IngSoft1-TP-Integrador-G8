using CuerpoSano.Application.DTOs.Response;
using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Mappers
{
    public static class MembresiaMapper
    {
        public static MembresiaCreateResponse ToCreateResponse(this Membresia membresia)
        {
            return new MembresiaCreateResponse
            {
                Id = membresia.Id,
                MiembroId = membresia.MiembroId,
                Tipo = membresia.Tipo,
                FechaEmision = membresia.FechaEmision,
                FechaVencimiento = membresia.FechaVencimiento,
                Costo = membresia.Costo,
                FechaPausaInicio = membresia.FechaPausaInicio,
                FechaPausaFin = membresia.FechaPausaFin
            };
        }
    }

}
