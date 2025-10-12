using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace CuerpoSano.Infrastructure.Persistence
{
    public class CuerpoSanoDbContextFactory : IDesignTimeDbContextFactory<CuerpoSanoDbContext>
    {
        public CuerpoSanoDbContext CreateDbContext(string[] args)
        {
            // Construir configuración para leer appsettings.json 
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../CuerpoSano.WebApi")) // carpeta donde se ejecuta
                .AddJsonFile("appsettings.json")
                .Build();

            // Obtener la cadena de conexión
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<CuerpoSanoDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new CuerpoSanoDbContext(optionsBuilder.Options);
        }
    }
}
