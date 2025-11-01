using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using CuerpoSano.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using CuerpoSano.Application.DTOs.Request;
using CuerpoSano.Application.Mappers;

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
            return Ok(entrenadores.Select(e => e.ToResponse()));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var entrenador = await _service.GetByIdAsync(id);
            if (entrenador == null) return NotFound();
            return Ok(entrenador.ToResponse());
        }

        [HttpGet("dni/{dni}")]
        public async Task<IActionResult> GetByDni(string dni)
        {
            var entrenador = await _service.GetByDniAsync(dni);
            if (entrenador == null) return NotFound();
            return Ok(entrenador.ToResponse());
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
        public async Task<IActionResult> Update(int id, [FromBody] Entrenador entrenador)
        {
            if (id != entrenador.Id) return BadRequest();
            await _service.UpdateAsync(entrenador);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
    }
}
