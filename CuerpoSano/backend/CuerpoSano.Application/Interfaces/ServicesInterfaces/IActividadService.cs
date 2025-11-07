using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.ServicesInterfaces
{
    public interface IActividadService
    {
        Task<IEnumerable<Actividad>> GetAllAsync();
        Task<Actividad?> GetByIdAsync(int id);
        Task<Actividad> CreateAsync(Actividad actividad);
        Task UpdateAsync(Actividad actividad);
        Task<bool> DeleteAsync(int id);

    }
}
