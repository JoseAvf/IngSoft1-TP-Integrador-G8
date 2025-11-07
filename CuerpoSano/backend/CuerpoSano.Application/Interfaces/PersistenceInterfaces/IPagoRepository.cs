using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.PersistenceInterfaces
{
    public interface IPagoRepository
    {
        Task<List<Pago>> GetAllAsync();
        Task<Pago?> GetByIdAsync(int id);
        Task<Pago> CreateAsync(Pago pago);
        Task UpdateAsync(Pago pago);
    }

}
