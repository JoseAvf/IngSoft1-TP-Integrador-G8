using CuerpoSano.Application.Interfaces.PersistenceInterfaces;
using CuerpoSano.Application.Interfaces.ServicesInterfaces;
using CuerpoSano.Application.Services;
using CuerpoSano.Infrastructure.Persistence;
using CuerpoSano.Infrastructure.Repositories.Implementations;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Conexion BD
builder.Services.AddDbContext<CuerpoSanoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositorios
builder.Services.AddScoped<IMiembroRepository, MiembroRepository>();
builder.Services.AddScoped<IMembresiaRepository, MembresiaRepository>();

// Servicios
builder.Services.AddScoped<IMiembroService, MiembroService>();
builder.Services.AddScoped<IMembresiaService,  MembresiaService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Logger.LogInformation("✅ CuerpoSano Web API iniciada correctamente en {Environment}", app.Environment.EnvironmentName);
app.Run();
