using CuerpoSano.Application.Services;
using CuerpoSano.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CuerpoSano.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembresiasController : ControllerBase
    {
        private readonly MembresiaService _service;
        public MembresiasController(MembresiaService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Membresia>>> GetAll() =>
            Ok(await _service.GetAllAsync());

        [HttpPost]
        public async Task<ActionResult<Membresia>> Create(Membresia membresia)
        {
            var creada = await _service.CreateAsync(membresia);
            return CreatedAtAction(nameof(GetAll), new { id = creada.Id }, creada);
        }
    }
}
