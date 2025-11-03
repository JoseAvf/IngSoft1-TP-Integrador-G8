using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using CuerpoSano.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using CuerpoSano.Application.DTOs.Request;
using CuerpoSano.Application.Mappers;


namespace CuerpoSano.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActividadesController : ControllerBase
    {
        private readonly IActividadService _service;
        public ActividadesController(IActividadService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var actividades = await _service.GetAllAsync();
            return Ok(actividades.Select(a => a.ToResponse()));
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var actividad = await _service.GetByIdAsync(id);
            if (actividad == null) return NotFound();
            return Ok(actividad.ToResponse());
        }



        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ActividadCreateRequest request)
        {
            var actividad = new Actividad
            {
                Nombre = request.Nombre,
                Activa = request.Activa
            };
            var creado = await _service.CreateAsync(actividad);
            return CreatedAtAction(nameof(GetById), new { id = creado.Id }, creado.ToResponse());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ActividadUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // 1️⃣ Verificar existencia
            var existente = await _service.GetByIdAsync(id);
            if (existente == null)
                return NotFound($"No se encontró la actividad con ID {id}");

            // 2️⃣ Actualizar propiedades
            existente.Nombre = request.Nombre;
            existente.Activa = request.Activa;

            // 3️⃣ Guardar cambios
            await _service.UpdateAsync(existente);

            return Ok(existente.ToResponse()); // o NoContent() si preferís no devolver el objeto
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
    }
}
