using CuerpoSano.Application.DTOs.Request;
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
        

        public ClaseService(IClaseRepository claseRepository, IMiembroRepository miembroRepository)
        {
            _claseRepository = claseRepository;
            _miembroRepository = miembroRepository;
        }

        public async Task<IEnumerable<Clase>> GetAllAsync() => await _claseRepository.GetAllAsync();

        public async Task<Clase?> GetByIdAsync(int id) => await _claseRepository.GetByIdAsync(id);

        public async Task<Clase> CreateAsync(Clase clase)
        {
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
            if (count >= clase.Cupo) return false; // clase llena

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

    }

}

