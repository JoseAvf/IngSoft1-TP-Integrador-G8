using CuerpoSano.Application.DTOs.Request;
using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using CuerpoSano.Application.Mappers;
using CuerpoSano.Application.Services;
using CuerpoSano.Domain.Entities;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/[controller]")]
public class PagosController : ControllerBase
{
    private readonly IPagoService _service;
    private readonly IMembresiaService _membresiaService;


    public PagosController(IPagoService service, IMembresiaService membresiaService)
    {
        _service = service;
        _membresiaService = membresiaService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() 
    {
        var pagos = await _service.GetAllAsync();
        return Ok(pagos.Select(p => p.ToResponse()));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var pago = await _service.GetByIdAsync(id);
        if (pago == null) return NotFound();
        return Ok(pago.ToResponse());
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PagoCreateRequest request)
    {
        var pago = new Pago
        {
            Fecha = request.Fecha,
            Monto = request.Monto,
            MetodoPago = request.MetodoPago,
            MembresiaId = request.MembresiaId //puede venir null
        };

        var nuevoPago = await _service.CreateAsync(pago);

        // Si viene una membresía asociada, marcamos como pagada
        if (request.MembresiaId.HasValue)
        {
            var membresia = await _membresiaService.GetByIdAsync(request.MembresiaId.Value);
            if (membresia != null)
            {
                membresia.EstaPagada = true;
                await _membresiaService.UpdateAsync(membresia);
            }
        }

        return CreatedAtAction(nameof(GetById), new { id = nuevoPago.Id }, nuevoPago.ToResponse());

    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PagoUpdateRequest request)
    {
        var pago = await _service.GetByIdAsync(id);
        if (pago == null) return NotFound($"Pago con ID {id} no encontrado.");

        // Si se envía una membresía, la asociamos
        if (request.MembresiaId.HasValue)
            pago.MembresiaId = request.MembresiaId.Value;

        // Actualizar en BD
        await _service.UpdateAsync(pago); 

        // Si la membresía existe, marcamos como pagada
        if (request.MembresiaId.HasValue)
        {
            var membresia = await _membresiaService.GetByIdAsync(request.MembresiaId.Value);
            if (membresia != null)
            {
                membresia.EstaPagada = true;
                await _membresiaService.UpdateAsync(membresia);
            }
        }

        return Ok(pago.ToResponse());
    }

}
