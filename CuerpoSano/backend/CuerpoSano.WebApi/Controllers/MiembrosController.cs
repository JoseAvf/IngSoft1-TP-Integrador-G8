using CuerpoSano.Application.DTOs.Request;
using CuerpoSano.Application.DTOs.Response;
using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using CuerpoSano.Application.Mappers;
using CuerpoSano.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CuerpoSano.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MiembrosController : ControllerBase
    {
        private readonly IMiembroService _miembroService;

        public MiembrosController(IMiembroService miembroService)
        {
            _miembroService = miembroService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MiembroDetalleResponse>>> GetAll()
        {
            var miembros = await _miembroService.GetAllAsync();
            return Ok(miembros.Select(m => m.ToDetalleResponse()));
        }

        [HttpGet("{dni}")]
        public async Task<ActionResult<MiembroDetalleResponse>> GetByDni(string dni)
        {
            var miembro = await _miembroService.GetByDniAsync(dni); 
            if (miembro == null)
                return NotFound();

            return Ok(miembro.ToDetalleResponse());
        }


        [HttpGet("id/{id}")]
        public async Task<ActionResult<MiembroDetalleResponse>> GetById(int id)
        {
            var miembro = await _miembroService.GetByIdAsync(id);
            if (miembro == null)
                return NotFound();

            return Ok(miembro.ToDetalleResponse());
        }

        [HttpPost]
        public async Task<ActionResult<MiembroCreateResponse>> Create([FromBody] MiembroCreateRequest request)
        {
            try
            {
                var nuevo = await _miembroService.CreateMiembroAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = nuevo.Id }, nuevo.ToCreateResponse());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MiembroUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existente = await _miembroService.GetByIdAsync(id);
            if (existente == null)
                return NotFound($"No se encontró el miembro con ID {id}");

            // Actualizamos los campos
            existente.Nombre = request.Nombre;
            existente.Direccion = request.Direccion;
            existente.Telefono = request.Telefono;
            existente.Correo = request.Correo;

            // Guardamos los cambios
            var updateMiembro = await _miembroService.UpdateAsync(existente);

            return Ok(updateMiembro.ToDetalleResponse());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var eliminado = await _miembroService.DeleteAsync(id); 
            if (!eliminado) return NotFound();
            return NoContent();
        }

        [HttpPut("{dni}/asignar-entrenador")]
        public async Task<IActionResult> AsignarEntrenador(string dni, [FromBody] int? entrenadorId)
        {
            var miembro = await _miembroService.GetByDniAsync(dni);
            if (miembro == null)
                return NotFound("Miembro no encontrado");

            miembro.EntrenadorId = entrenadorId; // puede ser null para desasignar
            await _miembroService.UpdateAsync(miembro);

            return Ok(new
            {
                message = entrenadorId == null ?
                "Entrenador desasignado" :
                "Entrenador asignado correctamente"
            });
        }
    }
}
