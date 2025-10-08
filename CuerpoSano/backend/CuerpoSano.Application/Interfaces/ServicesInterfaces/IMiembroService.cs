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
        Task<Miembro> CreateMiembroAsync(Miembro miembro, bool esEstudiante);
        Task<bool> DeleteAsync(int id);
        Task<Miembro> UpdateAsync(Miembro miembro);

    }
}
