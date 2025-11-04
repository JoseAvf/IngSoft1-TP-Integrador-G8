using CuerpoSano.Application.DTOs.Response;
using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Mappers
{
    public static class PagoMapper 
    {
        public static PagoResponse ToResponse(this Pago p)
        {
            return new PagoResponse
            {
                Id = p.Id,
                FechaPago = p.Fecha,
                Monto = p.Monto,
                MetodoPago = p.MetodoPago,
                MembresiaId = p.MembresiaId
            };
        }
    }


}
