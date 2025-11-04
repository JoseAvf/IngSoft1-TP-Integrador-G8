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
    public class PagoRepository : IPagoRepository
    {
        private readonly CuerpoSanoDbContext _context;
        public PagoRepository(CuerpoSanoDbContext context)
        {
            _context = context;
        }

        public async Task<List<Pago>> GetAllAsync() => await _context.Pagos.ToListAsync();

        public async Task<Pago?> GetByIdAsync(int id) => await _context.Pagos.FindAsync(id);

        public async Task<Pago> CreateAsync(Pago pago)
        {
            _context.Pagos.Add(pago);
            await _context.SaveChangesAsync();
            return pago;
        }
        public async Task UpdateAsync(Pago pago) 
        {
            _context.Pagos.Update(pago);
            await _context.SaveChangesAsync();
        }
    }

}
