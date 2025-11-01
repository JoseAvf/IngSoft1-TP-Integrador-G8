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
    public class EntrenadorRepository : IEntrenadorRepository
    {
        private readonly CuerpoSanoDbContext _context;
        public EntrenadorRepository(CuerpoSanoDbContext context) => _context = context;

        public async Task<IEnumerable<Entrenador>> GetAllAsync()
            => await _context.Entrenadores
            .Include(e => e.Certificado)
            .Include(c => c.Clases)
                    .ThenInclude(e => e.Actividad)
            .ToListAsync();

        public async Task<Entrenador?> GetByIdAsync(int id)
            => await _context.Entrenadores.Include(e => e.Certificado)
            .Include(c => c.Clases)
                    .ThenInclude(e => e.Actividad)
                .FirstOrDefaultAsync(e => e.Id == id);

        public async Task<Entrenador?> GetByDniAsync(string dni)
            => await _context.Entrenadores.Include(e => e.Certificado).Include(c => c.Clases).ThenInclude(e => e.Actividad)
                .FirstOrDefaultAsync(e => e.DNI == dni);

        public async Task AddAsync(Entrenador entrenador) => await _context.Entrenadores.AddAsync(entrenador);
        public async Task UpdateAsync(Entrenador entrenador) => _context.Entrenadores.Update(entrenador);
        public async Task DeleteAsync(Entrenador entrenador) => _context.Entrenadores.Remove(entrenador);
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();

    }
}
