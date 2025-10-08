using Microsoft.EntityFrameworkCore;
using CuerpoSano.Domain.Entities;

namespace CuerpoSano.Infrastructure.Persistence 
{
    public class CuerpoSanoDbContext : DbContext
    {
        public CuerpoSanoDbContext(DbContextOptions<CuerpoSanoDbContext> options)
            : base(options) { }

        public DbSet<Persona> Personas => Set<Persona>();
        public DbSet<Miembro> Miembros => Set<Miembro>();
        public DbSet<Carnet> Carnets => Set<Carnet>();
        public DbSet<Membresia> Membresias => Set<Membresia>();
        
        
        //public DbSet<Entrenador> Entrenadores => Set<Entrenador>();
        //public DbSet<Cobranza> Cobranzas => Set<Cobranza>();
        //public DbSet<Clase> Clases => Set<Clase>();
        //public DbSet<Reporte> Reportes => Set<Reporte>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Herencia Persona -> Miembro/Entrenador (TPH)
            modelBuilder.Entity<Persona>()
                .HasDiscriminator<string>("TipoPersona")
                .HasValue<Miembro>("Miembro");
                //.HasValue<Entrenador>("Entrenador");

            // Miembro ↔ Carnet (1:1)
            modelBuilder.Entity<Miembro>()
                .HasOne(m => m.Carnet)
                .WithOne(c => c.Miembro)
                .HasForeignKey<Carnet>(c => c.MiembroId);

            // Miembro ↔ Membresia (1:1)
            modelBuilder.Entity<Membresia>()
                .HasOne(m => m.Miembro)
                .WithOne(mb => mb.Membresia)
                .HasForeignKey<Miembro>(m => m.MembresiaId);

            // Configurar precisión del decimal Costo
            modelBuilder.Entity<Membresia>()
                .Property(m => m.Costo)
                .HasColumnType("decimal(18,2)"); // 18 dígitos, 2 decimales

          /*  // Miembro ↔ Cobranza (1:N)
            modelBuilder.Entity<Cobranza>()
                .HasOne(c => c.Miembro)
                .WithMany(m => m.Cobranzas)
                .HasForeignKey(c => c.Id_Miembro);*/

            /*// Miembro ↔ Entrenador (0..1:N)
            modelBuilder.Entity<Miembro>()
                .HasOne(m => m.Entrenador)
                .WithMany(e => e.Miembros) 
                .HasForeignKey(m => m.EntrenadorId)
                .OnDelete(DeleteBehavior.Restrict); 

            // Clase ↔ Miembro (N:M)
            modelBuilder.Entity<Clase>()
                .HasMany(c => c.Participantes)
                .WithMany(m => m.Clases)
                .UsingEntity(j => j.ToTable("ClaseMiembros"));

            // Clase ↔ Entrenador (1:N)
            modelBuilder.Entity<Clase>()
                .HasOne(c => c.Entrenador)
                .WithMany(e => e.Clases)
                .HasForeignKey(c => c.Id_Entrenador)
                .OnDelete(DeleteBehavior.Restrict);

            // Clase ↔ Actividad (1:N)
            modelBuilder.Entity<Clase>()
                .HasOne(c => c.Actividad)
                .WithMany(a => a.Clases)
                .HasForeignKey(c => c.Id_Actividad)
                .OnDelete(DeleteBehavior.Restrict);*/

            // Configuraciones adicionales
            modelBuilder.Entity<Persona>().Property(p => p.DNI).HasMaxLength(15).IsRequired();
            modelBuilder.Entity<Carnet>().Property(c => c.FechaEmision).IsRequired();
        }
    }
}
