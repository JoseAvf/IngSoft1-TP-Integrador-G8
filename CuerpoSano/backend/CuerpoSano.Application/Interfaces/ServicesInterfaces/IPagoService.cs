using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.ServicesInterfaces
{
    public interface IPagoService
    {
        Task<List<Pago>> GetAllAsync();
        Task<Pago?> GetByIdAsync(int id);
        Task<Pago> CreateAsync(Pago pago);
        Task<Pago> UpdateAsync(Pago pago);
    }


}
