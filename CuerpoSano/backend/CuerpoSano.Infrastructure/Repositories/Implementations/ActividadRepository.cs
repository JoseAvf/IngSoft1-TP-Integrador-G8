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
    public class ActividadRepository : IActividadRepository
    {
        private readonly CuerpoSanoDbContext _context;
        public ActividadRepository(CuerpoSanoDbContext context) => _context = context;

        public async Task<IEnumerable<Actividad>> GetAllAsync()
            => await _context.Actividades
                .Include(a => a.Clases)
                    .ThenInclude(c => c.Entrenador)
            .Include(e => e.Clases)
                    .ThenInclude(c => c.Miembros)
                .ToListAsync();

        public async Task<Actividad?> GetByIdAsync(int id)
            => await _context.Actividades
                .Include(a => a.Clases)
                    .ThenInclude(c => c.Entrenador)
            .Include(e => e.Clases)
                    .ThenInclude(c => c.Miembros)
              .FirstOrDefaultAsync(a => a.Id == id);

        public async Task AddAsync(Actividad actividad) => await _context.Actividades.AddAsync(actividad);
        public async Task UpdateAsync(Actividad actividad) => _context.Actividades.Update(actividad);
        public async Task DeleteAsync(Actividad actividad) => _context.Actividades.Remove(actividad);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();

    }
}
