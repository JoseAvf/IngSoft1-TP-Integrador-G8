using CuerpoSano.Application.DTOs.Request;
using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.ServicesInterfaces
{
    public interface IMiembroService
    {
        Task<IEnumerable<Miembro>> GetAllAsync();
        Task<Miembro?> GetByIdAsync(int id);
        Task<Miembro?> GetByDniAsync(string dni);
        Task<Miembro> CreateMiembroAsync(MiembroCreateRequest miembro);
        Task<Miembro> UpdateAsync(Miembro miembro);
        Task<bool> DeleteAsync(int id);

    }
}
