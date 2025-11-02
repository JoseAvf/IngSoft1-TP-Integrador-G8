using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.PersistenceInterfaces
{
    public interface IClaseRepository 
    {
        Task AddAsync(Clase clase);
        Task UpdateAsync(Clase clase);
        Task<Clase?> GetByIdAsync(int id);
        Task DeleteAsync(Clase clase);
        Task<IEnumerable<Clase>> GetAllAsync();
        Task SaveChangesAsync();

        // Método útil para RF-23 (inscripciones)
        Task<int> CountInscriptosAsync(int claseId);
        Task<bool> EstaInscriptoAsync(int claseId, int miembroId);
        Task AddMiembroClaseAsync(MiembroClase miembroClase);
        Task RemoveMiembroClaseAsync(int claseId, int miembroId);
        Task<Clase?> GetByIdWithMiembrosAsync(int id);
        Task<Clase?> GetByIdWithAsistenciasAsync(int id);

    }
}
