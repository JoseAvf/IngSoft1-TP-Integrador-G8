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
    public class ActividadService : IActividadService
    {
        private readonly IActividadRepository _actividadRepository;
        public ActividadService(IActividadRepository actividadRepository) => _actividadRepository = actividadRepository;

        public async Task<IEnumerable<Actividad>> GetAllAsync() => await _actividadRepository.GetAllAsync();
        public async Task<Actividad?> GetByIdAsync(int id) => await _actividadRepository.GetByIdAsync(id);
        public async Task<Actividad> CreateAsync(Actividad actividad)
        {
            await _actividadRepository.AddAsync(actividad);
            await _actividadRepository.SaveChangesAsync();
            return actividad;
        }
        public async Task UpdateAsync(Actividad actividad)
        {
            await _actividadRepository.UpdateAsync(actividad);
            await _actividadRepository.SaveChangesAsync();
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var a = await _actividadRepository.GetByIdAsync(id);
            if (a == null) return false;
            await _actividadRepository.DeleteAsync(a);
            await _actividadRepository.SaveChangesAsync();
            return true;
        }

    }
}
