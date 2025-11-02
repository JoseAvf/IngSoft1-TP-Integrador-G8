using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.ServicesInterfaces
{
    public interface IAsistenciaService
    {
        Task<Asistencia> RegistrarAsistenciaMiembroAsync(int claseId, int miembroId, bool asistio);
        Task<Asistencia> RegistrarAsistenciaEntrenadorAsync(int claseId, int entrenadorId, bool asistio);
        Task RegistrarInasistenciasPendientesAsync(int claseId);
        Task<bool> DebeBloquearMiembroAsync(int miembroId);
    }

}
