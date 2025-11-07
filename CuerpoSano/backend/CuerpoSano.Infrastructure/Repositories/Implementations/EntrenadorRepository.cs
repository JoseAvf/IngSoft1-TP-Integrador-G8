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
            .Include(e => e.Clases)
                    .ThenInclude(c => c.Miembros)
            .ToListAsync();

        public async Task<Entrenador?> GetByIdAsync(int id)
            => await _context.Entrenadores.Include(e => e.Certificado)
            .Include(c => c.Clases)
                    .ThenInclude(e => e.Actividad)
            .Include(e => e.Clases)
                    .ThenInclude(c => c.Miembros)
            .FirstOrDefaultAsync(e => e.Id == id);

        public async Task<Entrenador?> GetByDniAsync(string dni)
            => await _context.Entrenadores.Include(e => e.Certificado).Include(c => c.Clases).ThenInclude(e => e.Actividad)
            .Include(e => e.Clases)
                    .ThenInclude(c => c.Miembros)
                .FirstOrDefaultAsync(e => e.DNI == dni);

        public async Task AddAsync(Entrenador entrenador) => await _context.Entrenadores.AddAsync(entrenador);
        public async Task UpdateAsync(Entrenador entrenador) => _context.Entrenadores.Update(entrenador);
        public async Task DeleteAsync(Entrenador entrenador)
        {
            var miembros = await _context.Miembros
                .Where(m => m.EntrenadorId == entrenador.Id).ToListAsync();

            foreach (var miembro in miembros) //desasigno el entrenador en cada miembro
            {
                miembro.EntrenadorId = null;
                _context.Miembros.Update(miembro);
            }
            await _context.SaveChangesAsync(); 
            _context.Entrenadores.Remove(entrenador);


        }
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();

        public async Task<IEnumerable<Miembro>> GetMiembrosByEntrenadorIdAsync(int entrenadorId)
        {
            return await _context.Miembros
                .Include(m => m.Membresia)
                .Include(m => m.Carnet)
                .Include(m => m.Clases)
                    .ThenInclude(mc => mc.Clase)
                    .ThenInclude(c => c.Actividad)
                .Where(m => m.EntrenadorId == entrenadorId)
                .ToListAsync();
        }


    }
}
