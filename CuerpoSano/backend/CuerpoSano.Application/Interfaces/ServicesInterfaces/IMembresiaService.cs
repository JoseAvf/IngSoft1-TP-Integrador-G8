using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.ServicesInterfaces
{
    public interface IMembresiaService
    {
        Task<IEnumerable<Membresia>> GetAllAsync();
        Task<Membresia?> GetByIdAsync(int id);
        Task<Membresia> CreateAsync(Membresia membresia);
        Task DeleteAsync(Membresia membresia);
        Task<Membresia?> UpdateAsync(int id, string tipo, DateTime fechaEmision, DateTime fechaVencimiento, float costo);
        Task SaveChangesAsync();
    }
}
