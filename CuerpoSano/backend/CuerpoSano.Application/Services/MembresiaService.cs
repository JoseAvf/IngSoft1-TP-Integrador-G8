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
        private readonly IMembresiaRepository _membresiaRepository;
        private readonly IMiembroRepository _miembroRepository;
        public MembresiaService(IMembresiaRepository membresiaRepository, IMiembroRepository miembroRepository)
        {
            _membresiaRepository = membresiaRepository;
            _miembroRepository = miembroRepository;
        }

        public async Task<IEnumerable<Membresia>> GetAllAsync()
        {
            return await _membresiaRepository.GetAllAsync();
        }

        public async Task<Membresia?> GetByIdAsync(int id)
        {
            return await _membresiaRepository.GetByIdAsync(id);
        }

        /// <summary>
        /// Crea una nueva membresía para un miembro, calculando automáticamente fechas y costos según tipo y descuentos.
        /// </summary>
        /// <param name="membresia">Entidad con Tipo y MiembroId definidos.</param>
        /// <param name="fechaNacimiento">Fecha de nacimiento del miembro para calcular descuento por edad.</param>
        /// <param name="esEstudiante">Indica si aplica descuento por estudiante.</param>
        /// <returns>Membresía creada con fechas y costo calculado.</returns>
        public async Task<Membresia> CreateAsync(Membresia membresia, DateTime fechaNacimiento, bool esEstudiante)
        {
            // Validar tipo
            var tiposValidos = new[] { "Diaria", "Semanal", "Mensual", "Anual" };
            if (!tiposValidos.Contains(membresia.Tipo))
                throw new InvalidOperationException("Tipo de membresía inválido.");

            // Fecha de emisión
            membresia.FechaEmision = DateTime.Now;

            // Calcular fecha de vencimiento según tipo
            membresia.FechaVencimiento = membresia.Tipo switch
            {
                "Diaria" => membresia.FechaEmision.AddDays(1),
                "Semanal" => membresia.FechaEmision.AddDays(7),
                "Mensual" => membresia.FechaEmision.AddMonths(1),
                "Anual" => membresia.FechaEmision.AddYears(1),
                _ => throw new InvalidOperationException("Tipo de membresía no reconocido.")
            };

            // Calcular descuento por edad y estudiante
            int edad = DateTime.Now.Year - fechaNacimiento.Year;
            if (fechaNacimiento.Date > DateTime.Now.AddYears(-edad)) edad--; 

            decimal descuento = 0; // Porcentaje de descuento
            if (edad >= 65) descuento += 0.2m;
            if (esEstudiante) descuento += 0.1m;

            // Calcular costo final
            membresia.Costo = membresia.Costo * (1 - descuento);

            // Inicializar pausa como null
            membresia.FechaPausaInicio = null;
            membresia.FechaPausaFin = null;

            // Guardar en la base de datos
            await _membresiaRepository.AddAsync(membresia);
            await _membresiaRepository.SaveChangesAsync();

            var miembro = await _miembroRepository.GetByIdAsync(membresia.MiembroId);
            if (miembro != null)
            {
                miembro.MembresiaId = membresia.Id;
                await _miembroRepository.UpdateAsync(miembro);
                await _miembroRepository.SaveChangesAsync(); 
            }


            return membresia;
        }

        public async Task<Membresia?> UpdateAsync(Membresia membresia)
        {
            var newMembresia = await _membresiaRepository.UpdateAsync(membresia);
            return newMembresia;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var membresia = await _membresiaRepository.GetByIdAsync(id);
            if (membresia == null) return false;

            await _membresiaRepository.DeleteAsync(membresia);
            await _membresiaRepository.SaveChangesAsync();
            return true;
        }

        public async Task<Membresia> PausarMembresiaAsync(int id, DateTime inicioPausa)
        {
            var membresia = await _membresiaRepository.GetByIdAsync(id);
            if (membresia == null) throw new InvalidOperationException("Membresía no encontrada.");

            membresia.FechaPausaInicio = inicioPausa;
            membresia.FechaPausaFin = inicioPausa.AddDays(30); // límite máximo de pausa

            // Guardar cambios
            await _membresiaRepository.UpdateAsync(membresia);
            await _membresiaRepository.SaveChangesAsync();

            return membresia;
        }

        public async Task<Membresia> DespausarMembresiaAsync(int id)
        { 
            var membresia = await _membresiaRepository.GetByIdAsync(id);
            if (membresia == null) throw new InvalidOperationException("Membresía no encontrada.");

            membresia.FechaPausaInicio = null;
            membresia.FechaPausaFin = null;

            // Guardar cambios
            await _membresiaRepository.UpdateAsync(membresia);
            await _membresiaRepository.SaveChangesAsync();

            return membresia;
        }

    }

}
