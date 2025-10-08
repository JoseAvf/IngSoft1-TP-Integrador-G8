using CuerpoSano.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CuerpoSano.Application.Interfaces.PersistenceInterfaces
{
    public interface IMiembroRepository
    {
        Task<IEnumerable<Miembro>> GetAllAsync();
        Task<Miembro?> GetByIdAsync(int id);
        Task<Miembro?> GetByDniAsync(string dni);
        Task AddAsync(Miembro miembro);
        Task DeleteAsync(Miembro miembro);
        Task<Miembro?> UpdateAsync(int id, string nombre, string direccion, string correo, int telefono, int membresiaId);
        Task SaveChangesAsync();

    }
}
