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
    public class AsistenciaRepository : IAsistenciaRepository
    {
        private readonly CuerpoSanoDbContext _context;

        public AsistenciaRepository(CuerpoSanoDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Asistencia asistencia)
        {
            await _context.Asistencias.AddAsync(asistencia);
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();

        public async Task<bool> ExisteAsistenciaMiembroAsync(int claseId, int miembroId)
        {
            return await _context.Asistencias
                .AnyAsync(a => a.ClaseId == claseId && a.MiembroId == miembroId);
        }

        public async Task<int> ContarInasistenciasAsync(int miembroId)
        {
            return await _context.Asistencias
                .Where(a => a.MiembroId == miembroId && !a.Asistio)
                .CountAsync();
        }
    }

}
