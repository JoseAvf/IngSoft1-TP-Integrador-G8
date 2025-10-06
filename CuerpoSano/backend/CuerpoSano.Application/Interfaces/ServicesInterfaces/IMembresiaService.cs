using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.ServicesInterfaces
{
    public interface IMembresiaService
    {
        Task<Membresia> CreateAsync(Membresia membresia);
        Task<IEnumerable<Membresia>> GetAllAsync();
        Task<Membresia?> GetByIdAsync(int id);
    }
}
