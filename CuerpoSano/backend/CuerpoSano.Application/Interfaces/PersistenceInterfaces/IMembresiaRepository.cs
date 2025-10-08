using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.PersistenceInterfaces
{
    public interface IMembresiaRepository
    {
        Task<IEnumerable<Membresia>> GetAllAsync();
        Task<Membresia?> GetByIdAsync(int id);
        Task AddAsync(Membresia membresia);
        Task<Membresia> UpdateAsync(Membresia membresia);
        Task DeleteAsync(Membresia membresia);
        Task SaveChangesAsync();
    }

}
