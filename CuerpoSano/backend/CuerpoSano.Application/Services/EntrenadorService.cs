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
    public class EntrenadorService : IEntrenadorService 
    {
        private readonly IEntrenadorRepository _repo;
        public EntrenadorService(IEntrenadorRepository repo) => _repo = repo;

        public async Task<IEnumerable<Entrenador>> GetAllAsync() => await _repo.GetAllAsync();
        public async Task<Entrenador?> GetByIdAsync(int id) => await _repo.GetByIdAsync(id);
        public async Task<Entrenador?> GetByDniAsync(string dni) => await _repo.GetByDniAsync(dni);

        public async Task<Entrenador> CreateAsync(Entrenador entrenador)
        {
            // Crear el certificado automáticamente
            var certificado = new Certificado
            {
                CodCertificado = new Random().Next(100000, 999999), // o algún código único
                Vigencia = true,
                FechaEmision = DateTime.Now,
                FechaVencimiento = DateTime.Now.AddYears(1) // validez de 1 año por ejemplo
            };
            // Asignar el certificado al entrenador
            entrenador.Certificado = certificado;

            // Guardar todo en la BD (EF Core manejará la FK automáticamente)
            await _repo.AddAsync(entrenador);
            await _repo.SaveChangesAsync();
            return entrenador;
        }

        public async Task UpdateAsync(Entrenador entrenador)
        {
            await _repo.UpdateAsync(entrenador);
            await _repo.SaveChangesAsync();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return false;
            await _repo.DeleteAsync(e);
            await _repo.SaveChangesAsync();
            return true;
        }

    }
}
