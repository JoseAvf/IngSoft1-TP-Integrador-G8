using CuerpoSano.Application.Interfaces.PersistenceInterfaces;
using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using CuerpoSano.Domain.Entities;

namespace CuerpoSano.Application.Services
{
    public class MiembroService : IMiembroService
    {
        private readonly IMiembroRepository _miembroRepository;

        public MiembroService(IMiembroRepository miembroRepository)
        {
            _miembroRepository = miembroRepository;
        }

        public async Task<IEnumerable<Miembro>> GetAllAsync()
        {
            return await _miembroRepository.GetAllAsync();
        }

        public async Task<Miembro?> GetByIdAsync(int id)
        {
            return await _miembroRepository.GetByIdAsync(id);
        }

        public async Task<Miembro> CreateMiembroAsync(Miembro miembro, bool esEstudiante)
        {
            // Validación de DNI único
            var existente = await _miembroRepository.GetByDniAsync(miembro.DNI);
            if (existente != null)
                throw new InvalidOperationException("El DNI ya está registrado");

            // Generar carnet
            miembro.Carnet = new Carnet
            {
                CodigoBarra = Guid.NewGuid().ToString("N"),
                FechaEmision = DateTime.Now
            };

            // Calcular costo con descuentos
            miembro.Membresia.Costo = CalcularCostoFinal(miembro.Membresia, miembro.FechaNacimiento, esEstudiante);

            await _miembroRepository.AddAsync(miembro);
            await _miembroRepository.SaveChangesAsync();

            return miembro;
        }

        public async Task<Miembro> UpdateAsync(Miembro miembro)
        {
            var newMember = await _miembroRepository.UpdateAsync(miembro);
            return newMember; 
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var miembro = await _miembroRepository.GetByIdAsync(id);
            if (miembro == null) return false;
            await _miembroRepository.DeleteAsync(miembro);
            await _miembroRepository.SaveChangesAsync();
            return true;
        }


        private decimal CalcularCostoFinal(Membresia membresia, DateTime fechaNacimiento, bool esEstudiante)
        {
            int edad = DateTime.Now.Year - fechaNacimiento.Year;
            if (fechaNacimiento > DateTime.Now.AddYears(-edad)) edad--;

            decimal descuento = 0;
            if (edad >= 65) descuento += 0.2m;
            if (esEstudiante) descuento += 0.1m;

            return membresia.Costo * (1 - descuento);
        }
    }
}
