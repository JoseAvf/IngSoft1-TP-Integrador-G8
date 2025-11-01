using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.PersistenceInterfaces
{
    public interface IEntrenadorRepository
    {
        Task AddAsync(Entrenador entrenador);
        Task UpdateAsync(Entrenador entrenador);
        Task<Entrenador?> GetByIdAsync(int id);
        Task<Entrenador?> GetByDniAsync(string dni);
        Task DeleteAsync(Entrenador entrenador);
        Task<IEnumerable<Entrenador>> GetAllAsync();
        Task SaveChangesAsync();
    }
}
