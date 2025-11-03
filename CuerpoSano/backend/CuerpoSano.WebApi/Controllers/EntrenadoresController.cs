using CuerpoSano.Application.DTOs.Request;
using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using CuerpoSano.Application.Mappers;
using CuerpoSano.Application.Services;
using CuerpoSano.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CuerpoSano.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EntrenadoresController : ControllerBase
    {
        private readonly IEntrenadorService _service;
        public EntrenadoresController(IEntrenadorService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entrenadores = await _service.GetAllAsync();
            return Ok(entrenadores.Select(e => e.ToDetalleResponse()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entrenador = await _service.GetByIdAsync(id);
            if (entrenador == null) return NotFound();
            return Ok(entrenador.ToDetalleResponse());
        }

        [HttpGet("dni/{dni}")]
        public async Task<IActionResult> GetByDni(string dni)
        {
            var entrenador = await _service.GetByDniAsync(dni);
            if (entrenador == null) return NotFound();
            return Ok(entrenador.ToDetalleResponse());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EntrenadorCreateRequest req)
        {
            try
            {
                var ent = new Entrenador
                {
                    Nombre = req.Nombre,
                    DNI = req.DNI,
                    Direccion = req.Direccion,
                    FechaNacimiento = req.FechaNacimiento,
                    Telefono = req.Telefono,
                };
                var creado = await _service.CreateAsync(ent);
                return CreatedAtAction(nameof(GetById), new { id = creado.Id }, creado.ToResponse());
            }
            catch (Exception ex)
            { return BadRequest(ex.Message); }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] EntrenadorUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existente = await _service.GetByIdAsync(id);
            if (existente == null)
                return NotFound($"No se encontró el entrenador con ID {id}");

            // Actualizamos los campos
            existente.Nombre = request.Nombre;
            existente.Direccion = request.Direccion;
            existente.Telefono = request.Telefono;

            await _service.UpdateAsync(existente);
            return Ok(existente.ToDetalleResponse());
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }

        [HttpGet("{id}/miembros")]
        public async Task<IActionResult> GetMiembrosAsignados(int id)
        {
            var entrenador = await _service.GetByIdAsync(id);
            if (entrenador == null)
                return NotFound($"No se encontró un entrenador con ID {id}");

            var miembros = await _service.GetMiembrosByEntrenadorIdAsync(id);

            if (!miembros.Any())
                return Ok($"El entrenador con ID {id} no tiene miembros asignados.");

            return Ok(miembros.Select(m => m.ToDetalleEntrenadorResponse()));
        }

    }
}
