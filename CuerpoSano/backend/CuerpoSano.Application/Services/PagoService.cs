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
    public class PagoService : IPagoService
    {
        private readonly IPagoRepository _repository;

        public PagoService(IPagoRepository repository)
        {
            _repository = repository;
        }

        public Task<List<Pago>> GetAllAsync() => _repository.GetAllAsync();

        public Task<Pago?> GetByIdAsync(int id) => _repository.GetByIdAsync(id);

        public async Task<Pago> CreateAsync(Pago pago)
        {
            // Lógica extra: si el pago tiene una membresía asociada, la marcamos como pagada
            if (pago.MembresiaId.HasValue)
            {
                // (Esto se podría hacer en el repositorio con Include si querés)
            }

            return await _repository.CreateAsync(pago);
        }
        public async Task<Pago> UpdateAsync(Pago pago) 
        {
            await _repository.UpdateAsync(pago);
            return pago;
        }

    }

}
