using CuerpoSano.Application.Interfaces.PersistenceInterfaces;
using CuerpoSano.Domain.Entities;
using CuerpoSano.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CuerpoSano.Infrastructure.Repositories.Implementations
{
    public class MiembroRepository : IMiembroRepository
    {
        private readonly CuerpoSanoDbContext _context;

        public MiembroRepository(CuerpoSanoDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Miembro>> GetAllAsync()
        {
            return await _context.Miembros
                .Include(m => m.Membresia)
                .Include(m => m.Carnet)
                .Include(m => m.Clases)
                    .ThenInclude(mc => mc.Clase).ThenInclude(c => c.Actividad)
                .ToListAsync();
        }

        public async Task<Miembro?> GetByIdAsync(int id)
        {
            return await _context.Miembros
                .Include(m => m.Membresia)
                .Include(m => m.Carnet)
                .Include(m => m.Clases)
                    .ThenInclude(mc => mc.Clase).ThenInclude(c => c.Actividad)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Miembro?> GetByDniAsync(string dni)
        {
            return await _context.Miembros
                .Include(m => m.Membresia)
                .Include(m => m.Carnet)
                .Include(m => m.Clases)
                    .ThenInclude(mc => mc.Clase).ThenInclude(c => c.Actividad)
                .FirstOrDefaultAsync(m => m.DNI == dni);
        }

        public async Task AddAsync(Miembro miembro)
        {
            await _context.Miembros.AddAsync(miembro);
        }

        

        public async Task<Miembro> UpdateAsync(Miembro miembro)
        {
            var existingMiembro = await GetByIdAsync(miembro.Id);
            if (existingMiembro == null) return null;

            existingMiembro.Nombre = miembro.Nombre;
            existingMiembro.Direccion = miembro.Direccion;
            existingMiembro.Correo = miembro.Correo;
            existingMiembro.Telefono = miembro.Telefono; 
            existingMiembro.MembresiaId = miembro.MembresiaId;

            _context.Miembros.Update(existingMiembro);
            await _context.SaveChangesAsync();
            return existingMiembro;
        }

        public async Task DeleteAsync(Miembro miembro)
        {
            _context.Miembros.Remove(miembro);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
