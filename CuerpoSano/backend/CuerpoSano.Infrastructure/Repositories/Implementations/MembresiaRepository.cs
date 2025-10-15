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
    public class MembresiaRepository : IMembresiaRepository
    {
        private readonly CuerpoSanoDbContext _context;
        public MembresiaRepository(CuerpoSanoDbContext context) => _context = context;

        public async Task<IEnumerable<Membresia>> GetAllAsync() =>
            await _context.Membresias
                .Include(m => m.Miembro)
                .ToListAsync();

        public async Task<Membresia?> GetByIdAsync(int id)
        {
            return await _context.Membresias
                .Include(m => m.Miembro)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task AddAsync(Membresia membresia) =>
            await _context.Membresias.AddAsync(membresia);

        public async Task<Membresia> UpdateAsync(Membresia membresia)
        {
            var existingMembresia = await GetByIdAsync(membresia.Id);
            if (existingMembresia == null) return null;

            existingMembresia.Costo = membresia.Costo;  
            existingMembresia.FechaEmision = membresia.FechaEmision;
            existingMembresia.FechaVencimiento = membresia.FechaVencimiento;
            existingMembresia.Tipo = membresia.Tipo;

            _context.Membresias.Update(existingMembresia);
            await _context.SaveChangesAsync();
            return existingMembresia;
        }

        public async Task DeleteAsync(Membresia membresia)
        {
            _context.Membresias.Remove(membresia);
        }

        public async Task SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }

}
