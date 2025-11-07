using CuerpoSano.Application.Interfaces.PersistenceInterfaces;
using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Services
{
    public class AsistenciaService : IAsistenciaService 
    {
        private readonly IAsistenciaRepository _repo;
        private readonly IMiembroRepository _miembroRepo;
        private readonly IClaseRepository _claseRepo;

        public AsistenciaService(IAsistenciaRepository repo, IMiembroRepository miembroRepo, IClaseRepository claseRepo)
        {
            _repo = repo;
            _miembroRepo = miembroRepo;
            _claseRepo = claseRepo;
        }

        public async Task<Asistencia> RegistrarAsistenciaMiembroAsync(int claseId, int miembroId, bool asistio)
        {
            // 🔹 RF-24: Bloquear si no está inscripto
            var clase = await _claseRepo.GetByIdAsync(claseId);
            if (clase == null) throw new InvalidOperationException("La clase no existe");

            var inscripto = clase.Miembros.Any(mc => mc.MiembroId == miembroId);
            if (!inscripto)
                throw new InvalidOperationException("El miembro no está inscripto en esta clase");

            // 🔹 Crear registro de asistencia
            var asistencia = new Asistencia
            {
                ClaseId = claseId,
                MiembroId = miembroId,
                Asistio = asistio,
                FechaRegistro = DateTime.UtcNow
            };

            await _repo.AddAsync(asistencia);
            await _repo.SaveChangesAsync();

            return asistencia;
        }

        public async Task<Asistencia> RegistrarAsistenciaEntrenadorAsync(int claseId, int entrenadorId, bool asistio)
        {
            var clase = await _claseRepo.GetByIdAsync(claseId);
            if (clase == null) throw new InvalidOperationException("La clase no existe");
            if (clase.EntrenadorId != entrenadorId)
                throw new InvalidOperationException("El entrenador no pertenece a esta clase");

            var asistencia = new Asistencia
            {
                ClaseId = claseId,
                EntrenadorId = entrenadorId,
                Asistio = asistio,
                FechaRegistro = DateTime.UtcNow
            };

            await _repo.AddAsync(asistencia);
            await _repo.SaveChangesAsync();
            return asistencia;
        }

        // 🔹 RF-25: registrar inasistencias automáticamente
        public async Task RegistrarInasistenciasPendientesAsync(int claseId)
        {
            var clase = await _claseRepo.GetByIdAsync(claseId);
            if (clase == null) throw new InvalidOperationException("Clase no encontrada");

            foreach (var mc in clase.Miembros)
            {
                bool yaRegistrado = await _repo.ExisteAsistenciaMiembroAsync(claseId, mc.MiembroId);
                if (!yaRegistrado)
                {
                    var inasistencia = new Asistencia
                    {
                        ClaseId = claseId,
                        MiembroId = mc.MiembroId,
                        Asistio = false,
                        FechaRegistro = DateTime.UtcNow
                    };
                    await _repo.AddAsync(inasistencia);
                }
            }

            await _repo.SaveChangesAsync();
        }

        // 🔹 RF-26: detectar bloqueo por inasistencias
        public async Task<bool> DebeBloquearMiembroAsync(int miembroId)
        {
            var inasistencias = await _repo.ContarInasistenciasAsync(miembroId);
            return inasistencias >= 3; // regla: 3 inasistencias seguidas → bloqueo
        }
    }

}
