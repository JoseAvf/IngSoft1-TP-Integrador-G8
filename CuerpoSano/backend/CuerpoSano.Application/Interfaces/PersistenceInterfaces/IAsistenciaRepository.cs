using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.PersistenceInterfaces
{
    public interface IAsistenciaRepository
    {
        Task AddAsync(Asistencia asistencia);
        Task SaveChangesAsync();
        Task<bool> ExisteAsistenciaMiembroAsync(int claseId, int miembroId);
        Task<int> ContarInasistenciasAsync(int miembroId);
    }

}
