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
        Task<Membresia?> UpdateAsync(Membresia membresia);
        Task<bool> DeleteAsync(int id);
    }
}
