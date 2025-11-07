using CuerpoSano.Application.Interfaces.PersistenceInterfaces;
using CuerpoSano.Domain.Entities;
using CuerpoSano.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Infrastructure.Repositories.Implementations
{
    public class ClaseRepository : IClaseRepository 
    {
        private readonly CuerpoSanoDbContext _context;

        public ClaseRepository(CuerpoSanoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Clase>> GetAllAsync()
        {
            return await _context.Clases
                .Include(c => c.Actividad)
                .Include(c => c.Entrenador)
                .Include(c => c.Miembros)
                .ToListAsync();
        }

        public async Task<Clase?> GetByIdAsync(int id)
        {
            return await _context.Clases
                .Include(c => c.Actividad)
                .Include(c => c.Entrenador)
                .Include(c => c.Miembros)
                    .ThenInclude(mc => mc.Miembro)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task AddAsync(Clase clase) => await _context.Clases.AddAsync(clase);
        public async Task UpdateAsync(Clase clase) => _context.Clases.Update(clase);
        public async Task DeleteAsync(Clase clase) => _context.Clases.Remove(clase);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();

        public async Task<int> CountInscriptosAsync(int claseId)
        {
            return await _context.Set<MiembroClase>()
                .CountAsync(mc => mc.ClaseId == claseId);
        }

        public async Task<bool> EstaInscriptoAsync(int claseId, int miembroId)
        {
            return await _context.Set<MiembroClase>()
                .AnyAsync(mc => mc.ClaseId == claseId && mc.MiembroId == miembroId);
        }

        public async Task AddMiembroClaseAsync(MiembroClase miembroClase)
        {
            await _context.Set<MiembroClase>().AddAsync(miembroClase);
        }

        public async Task RemoveMiembroClaseAsync(int claseId, int miembroId)
        {
            var mc = await _context.Set<MiembroClase>()
                .FirstOrDefaultAsync(x => x.ClaseId == claseId && x.MiembroId == miembroId);

            if (mc != null)
                _context.Set<MiembroClase>().Remove(mc);
        }

        public async Task<Clase?> GetByIdWithMiembrosAsync(int id)
        {
            return await _context.Clases
                .Include(c => c.Miembros) //  importante para cargar la lista
                     .ThenInclude(mc => mc.Miembro).ThenInclude(m => m.Carnet)
                .Include(c => c.Miembros)
                    .ThenInclude(mc => mc.Miembro).ThenInclude(m => m.Membresia)
                 .Include(c => c.Miembros)
                    .ThenInclude(mc => mc.Miembro).ThenInclude(m => m.Entrenador)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Clase?> GetByIdWithAsistenciasAsync(int id)
        {
            return await _context.Clases
                .Include(c => c.Entrenador)
                .Include(c => c.Asistencias)
                    .ThenInclude(a => a.Miembro)      // Trae el Miembro de cada asistencia
                .Include(c => c.Asistencias)
                    .ThenInclude(a => a.Entrenador)   // Trae el Entrenador de cada asistencia
                .FirstOrDefaultAsync(c => c.Id == id);
        }
    }

}
