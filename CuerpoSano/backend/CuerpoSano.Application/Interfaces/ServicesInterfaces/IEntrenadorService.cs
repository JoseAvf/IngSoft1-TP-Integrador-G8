using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.ServicesInterfaces
{
    public interface IEntrenadorService
    {
        Task<IEnumerable<Entrenador>> GetAllAsync();
        Task<Entrenador?> GetByIdAsync(int id);
        Task<Entrenador?> GetByDniAsync(string dni);
        Task<Entrenador> CreateAsync(Entrenador entrenador);
        Task UpdateAsync(Entrenador entrenador);
        Task<bool> DeleteAsync(int id);

    }
}
