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
    public class MembresiaService : IMembresiaService 
    {
        private readonly IMembresiaRepository _repo;
        public MembresiaService(IMembresiaRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Membresia>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<Membresia?> GetByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<Membresia> CreateAsync(Membresia membresia)
        {
            membresia.FechaEmision = DateTime.Now;
            membresia.FechaVencimiento = DateTime.Now.AddMonths(1);
            await _repo.AddAsync(membresia);
            await _repo.SaveChangesAsync();
            return membresia;
        }
    }

}
