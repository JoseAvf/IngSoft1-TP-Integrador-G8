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
builder.Services.AddScoped<IActividadRepository, ActividadRepository>();
builder.Services.AddScoped<IAsistenciaRepository, AsistenciaRepository>();
builder.Services.AddScoped<IClaseRepository, ClaseRepository>();
builder.Services.AddScoped<IEntrenadorRepository, EntrenadorRepository>();
builder.Services.AddScoped<IMembresiaRepository, MembresiaRepository>();
builder.Services.AddScoped<IMiembroRepository, MiembroRepository>();
builder.Services.AddScoped<IPagoRepository, PagoRepository>();

// Servicios
builder.Services.AddScoped<IActividadService, ActividadService>();
builder.Services.AddScoped<IAsistenciaService, AsistenciaService>();
builder.Services.AddScoped<IClaseService, ClaseService>();
builder.Services.AddScoped<IEntrenadorService, EntrenadorService>(); 
builder.Services.AddScoped<IMembresiaService,  MembresiaService>();
builder.Services.AddScoped<IMiembroService, MiembroService>();
builder.Services.AddScoped<IPagoService, PagoService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()  // solo para desarrollo
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

// Aplicar migraciones automáticamente al iniciar
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CuerpoSanoDbContext>();
    db.Database.Migrate(); // Aplica todas las migraciones pendientes
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Logger.LogInformation(
    "✅ CuerpoSano Web API iniciada correctamente en {Environment}",
    app.Environment.EnvironmentName
);

app.Run();
