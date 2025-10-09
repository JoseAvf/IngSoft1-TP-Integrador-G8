using CuerpoSano.Application.DTOs.Request;
using CuerpoSano.Application.Interfaces.PersistenceInterfaces;
using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using CuerpoSano.Domain.Entities;
using MediatR;

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

        public async Task<Miembro> CreateMiembroAsync(MiembroCreateRequest request, bool esEstudiante)
        {
            // Validación de DNI único
            var existente = await _miembroRepository.GetByDniAsync(request.DNI);
            if (existente != null)
                throw new InvalidOperationException("El DNI ya está registrado");

            var miembro = new Miembro
            {
                Nombre = request.Nombre,
                DNI = request.DNI,
                Direccion = request.Direccion,
                FechaNacimiento = request.FechaNacimiento,
                Telefono = request.Telefono,
                Correo = request.Correo
                // No seteamos Carnet ni Membresia aquí
            };


            // Generar carnet
            miembro.Carnet = new Carnet
            {
                CodigoBarra = Guid.NewGuid().ToString("N"),
                FechaEmision = DateTime.Now
            };

            //miembro.Membresia.Costo = CalcularCostoFinal(miembro.Membresia, miembro.FechaNacimiento, esEstudiante); //Calcular costo con descuentos

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
