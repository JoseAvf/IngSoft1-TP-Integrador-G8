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
    public class ClasesController : ControllerBase
    {
        private readonly IClaseService _claseService;
        public ClasesController(IClaseService claseService) => _claseService = claseService;

        // ------------------ CRUD DE CLASES ------------------

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clases = await _claseService.GetAllAsync();
            return Ok(clases.ToResponseList());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var clase = await _claseService.GetByIdAsync(id);
            if (clase == null) return NotFound();

            return Ok(clase.ToResponse());
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ClaseCreateRequest request)
        {
            var nueva = new Clase
            {
                Nombre = request.Nombre,
                HoraInicio = request.HoraInicio,
                HoraFin = request.HoraFin,
                Cupo = request.Cupo,
                FechaCreacion = DateTime.UtcNow,
                ActividadId = request.ActividadId,
                EntrenadorId = request.EntrenadorId
            };

            var cread = await _claseService.CreateAsync(nueva);
            var creado = await _claseService.GetByIdAsync(cread.Id); 

            return CreatedAtAction(nameof(GetById), new { id = cread.Id }, cread.ToResponse());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Clase clase)
        {
            if (id != clase.Id) return BadRequest();
            await _claseService.UpdateAsync(clase);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _claseService.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }

        // ------------------ INSCRIPCIONES ------------------



        [HttpPost("{id}/inscribir/{miembroId}")]
        public async Task<IActionResult> Inscribir(int id, int miembroId)
        {
            var ok = await _claseService.InscribirMiembroAsync(id, miembroId);
            return ok ? Ok("Miembro inscripto correctamente.") : BadRequest("No se pudo inscribir: cupo completo o datos inválidos.");
        }

        [HttpPost("{id}/desinscribir/{miembroId}")]
        public async Task<IActionResult> Desinscribir(int id, int miembroId)
        {
            var ok = await _claseService.DesinscribirMiembroAsync(id, miembroId);
            return ok ? Ok("Miembro desinscripto correctamente.") : BadRequest("No se pudo desinscribir.");
        }

        [HttpGet("{id}/miembros")]
        public async Task<IActionResult> GetMiembrosDeClase(int id)
        {
            var miembros = await _claseService.GetMiembrosDeClaseAsync(id);
            if (miembros == null) return NotFound("Clase no encontrada.");

            return Ok(miembros.Select(m => m.ToDetalleResponse()));
        }
    }
}
