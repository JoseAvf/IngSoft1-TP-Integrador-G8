using CuerpoSano.Application.DTOs.Request;
using CuerpoSano.Application.DTOs.Response;
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
    public class ClaseService : IClaseService
    {
        private readonly IClaseRepository _claseRepository;
        private readonly IMiembroRepository _miembroRepository; // para buscar miembro y relación
        private readonly IEntrenadorRepository _entrenadorRepository;
        private readonly IAsistenciaService _asistenciaService;


        public ClaseService(IClaseRepository claseRepository, IMiembroRepository miembroRepository, IEntrenadorRepository entrenadorRepository, IAsistenciaService asistenciaService)
        {
            _claseRepository = claseRepository;
            _miembroRepository = miembroRepository;
            _entrenadorRepository = entrenadorRepository;
            _asistenciaService = asistenciaService;
        }

        public async Task<IEnumerable<Clase>> GetAllAsync() => await _claseRepository.GetAllAsync();

        public async Task<Clase?> GetByIdAsync(int id) => await _claseRepository.GetByIdAsync(id);

        public async Task<Clase> CreateAsync(Clase clase)
        {
            var entrenador = await _entrenadorRepository.GetByIdAsync(clase.EntrenadorId);
            if (entrenador?.Certificado.Vigencia == false) 
            {
                throw new InvalidOperationException("El certificado del Entrenador no está vigente."); //RF:validar certificacion de entrenador
            }

            await _claseRepository.AddAsync(clase);
            await _claseRepository.SaveChangesAsync();
            return clase;
        }

        public async Task UpdateAsync(Clase clase)
        {
            await _claseRepository.UpdateAsync(clase);
            await _claseRepository.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var c = await _claseRepository.GetByIdAsync(id);
            if (c == null) return false;
            await _claseRepository.DeleteAsync(c);
            await _claseRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> InscribirMiembroAsync(int claseId, int miembroId)
        {
            var clase = await _claseRepository.GetByIdAsync(claseId);
            if (clase == null) return false;

            var miembro = await _miembroRepository.GetByIdAsync(miembroId);
            if (miembro == null) return false;

            if (await _claseRepository.EstaInscriptoAsync(claseId, miembroId))
                return false; // ya inscripto

            var count = await _claseRepository.CountInscriptosAsync(claseId);
            if (count >= clase.Cupo) return false; // clase llena: RF-23

            // 🔹 RF-26: Bloqueo por inasistencias
            bool bloqueado = await _asistenciaService.DebeBloquearMiembroAsync(miembroId);
            if (bloqueado)
                throw new InvalidOperationException("El miembro está bloqueado por inasistencias acumuladas.");

            await _claseRepository.AddMiembroClaseAsync(new MiembroClase
            {
                ClaseId = claseId,
                MiembroId = miembroId,
                FechaInscripcion = DateTime.UtcNow
            });

            await _claseRepository.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DesinscribirMiembroAsync(int claseId, int miembroId)
        {
            await _claseRepository.RemoveMiembroClaseAsync(claseId, miembroId);
            await _claseRepository.SaveChangesAsync();
            return true;
        }

        public async Task<int> CountInscriptosAsync(int claseId)
        {
            return await _claseRepository.CountInscriptosAsync(claseId);
        }

        public async Task<IEnumerable<Miembro>?> GetMiembrosDeClaseAsync(int claseId)
        {
            var clase = await _claseRepository.GetByIdWithMiembrosAsync(claseId);
            if (clase == null) return null;

            return clase.Miembros.Select(mc => mc.Miembro).ToList();
        }

        public async Task<ClaseAsistenciasResponse?> GetAsistenciasDeClaseAsync(int claseId)
        {
            var clase = await _claseRepository.GetByIdWithAsistenciasAsync(claseId); 
            if (clase == null) return null;

            var entrenadorAsistencia = clase.Asistencias
                .FirstOrDefault(a => a.EntrenadorId == clase.EntrenadorId);

            var response = new ClaseAsistenciasResponse
            {
                ClaseId = clase.Id,
                ClaseNombre = clase.Nombre,
                Fecha = clase.HoraInicio,

                Entrenador = new EntrenadorAsistenciaDTO
                {
                    EntrenadorId = clase.EntrenadorId,
                    Nombre = clase.Entrenador?.Nombre ?? "Sin entrenador",
                    Asistio = entrenadorAsistencia?.Asistio ?? false // false si no hay registro
                },


                Miembros = clase.Asistencias
                    .Where(a => a.MiembroId != null)
                    .GroupBy(a => a.MiembroId) // evita duplicados
                    .Select(g => new MiembroAsistenciaDTO
                    {
                        MiembroId = g.Key!.Value,
                        Nombre = g.First().Miembro!.Nombre,
                        Asistio = g.Any(x => x.Asistio)
                    })
                    .ToList(),
            };

            return response;
        }


    }

}

