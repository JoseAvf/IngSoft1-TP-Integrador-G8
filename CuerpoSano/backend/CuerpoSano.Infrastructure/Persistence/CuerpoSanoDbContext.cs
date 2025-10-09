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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurar TPT (Table Per Type)
            modelBuilder.Entity<Persona>().ToTable("Personas");
            modelBuilder.Entity<Miembro>().ToTable("Miembros");

            // Miembro ↔ Carnet (1:1)
            modelBuilder.Entity<Miembro>()
                .HasOne(m => m.Carnet)
                .WithOne(c => c.Miembro)
                .HasForeignKey<Carnet>(c => c.MiembroId)
                .OnDelete(DeleteBehavior.Cascade); //si se borra el miembro se borra el carnet

            // Miembro ↔ Membresia (1:1)
            modelBuilder.Entity<Membresia>()
                .HasOne(m => m.Miembro)
                .WithOne(mb => mb.Membresia)
                .HasForeignKey<Miembro>(m => m.MembresiaId)
                .OnDelete(DeleteBehavior.SetNull); //para eliminar la membresia y setear a null los datos de membresia en miembro

            modelBuilder.Entity<Miembro>()
                .HasOne(m => m.Membresia)
                .WithOne(mb => mb.Miembro)
                .HasForeignKey<Membresia>(mb => mb.MiembroId)
                .OnDelete(DeleteBehavior.Cascade); //si se borra el miembro se borra la membresia


            // Configurar precisión del decimal Costo
            modelBuilder.Entity<Membresia>()
                .Property(m => m.Costo)
                .HasColumnType("decimal(18,2)"); // 18 dígitos, 2 decimales

            // Configuraciones adicionales
            modelBuilder.Entity<Persona>()
                .Property(p => p.DNI)
                .HasMaxLength(15)
                .IsRequired();

            modelBuilder.Entity<Carnet>()
                .Property(c => c.FechaEmision)
                .IsRequired();
        }
    }
}
