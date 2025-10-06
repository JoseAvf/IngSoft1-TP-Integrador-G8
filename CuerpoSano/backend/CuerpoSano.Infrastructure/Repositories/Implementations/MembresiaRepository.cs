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
            await _context.Membresias.ToListAsync();

        public async Task<Membresia?> GetByIdAsync(int id) =>
            await _context.Membresias.FindAsync(id);

        public async Task AddAsync(Membresia membresia) =>
            await _context.Membresias.AddAsync(membresia);

        public async Task SaveChangesAsync() =>
            await _context.SaveChangesAsync();
    }

}
