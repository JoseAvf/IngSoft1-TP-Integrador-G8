using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.PersistenceInterfaces
{
    public interface IActividadRepository
    {
        Task AddAsync(Actividad actividad);
        Task UpdateAsync(Actividad actividad);
        Task<Actividad?> GetByIdAsync(int id);
        Task DeleteAsync(Actividad actividad);
        Task<IEnumerable<Actividad>> GetAllAsync();
        Task SaveChangesAsync();
    }
}
