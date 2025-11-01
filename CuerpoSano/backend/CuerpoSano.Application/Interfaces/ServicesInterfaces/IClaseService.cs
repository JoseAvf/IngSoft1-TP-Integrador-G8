using CuerpoSano.Application.DTOs.Request;
using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.ServicesInterfaces
{
    public interface IClaseService
    {
        Task<Clase> CreateAsync(Clase clase);
        Task UpdateAsync(Clase clase);
        Task<Clase?> GetByIdAsync(int id);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Clase>> GetAllAsync();

        // Inscripciones / asistencia
        Task<bool> InscribirMiembroAsync(int claseId, int miembroId);
        Task<bool> DesinscribirMiembroAsync(int claseId, int miembroId);
        Task<int> CountInscriptosAsync(int claseId);
        Task<IEnumerable<Miembro>?> GetMiembrosDeClaseAsync(int claseId);


    }
}
