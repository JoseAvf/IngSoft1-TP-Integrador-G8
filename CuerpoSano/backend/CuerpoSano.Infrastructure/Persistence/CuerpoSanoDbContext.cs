using Microsoft.EntityFrameworkCore;
using CuerpoSano.Domain.Entities;
using Org.BouncyCastle.Bcpg;

namespace CuerpoSano.Infrastructure.Persistence 
{
    public class CuerpoSanoDbContext : DbContext
    {
        public CuerpoSanoDbContext(DbContextOptions<CuerpoSanoDbContext> options)
            : base(options) { }

        //iteracion1:
        public DbSet<Persona> Personas => Set<Persona>();
        public DbSet<Miembro> Miembros => Set<Miembro>();
        public DbSet<Carnet> Carnets => Set<Carnet>();
        public DbSet<Membresia> Membresias => Set<Membresia>();

        //iteracion2:
        public DbSet<Clase> Clases => Set<Clase>(); 
        public DbSet<Actividad> Actividades => Set<Actividad>();
        public DbSet<Entrenador> Entrenadores => Set<Entrenador>();
        public DbSet<Certificado> Certificados => Set<Certificado>();
        public DbSet<Asistencia> Asistencias => Set<Asistencia>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //-------------Iteracion1--------------

            // Configurar TPT (Table Per Type)
            modelBuilder.Entity<Persona>().ToTable("Personas");
            modelBuilder.Entity<Miembro>().ToTable("Miembros");
            modelBuilder.Entity<Entrenador>().ToTable("Entrenadores");

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

            //------------Iteracion2------------------

            // 🔹 Actividad (1:N) Clase
            modelBuilder.Entity<Clase>()
                .HasOne(c => c.Actividad)
                .WithMany(a => a.Clases)
                .HasForeignKey(c => c.ActividadId)
                .OnDelete(DeleteBehavior.Restrict);

            // 🔹 Entrenador (1:N) Clase
            modelBuilder.Entity<Clase>() 
                .HasOne(c => c.Entrenador)
                .WithMany(e => e.Clases)
                .HasForeignKey(c => c.EntrenadorId)
                .OnDelete(DeleteBehavior.Restrict);

            // 🔹 Miembro ↔ Clase (N:M)
            modelBuilder.Entity<MiembroClase>()
                .HasKey(mc => new { mc.MiembroId, mc.ClaseId });

            modelBuilder.Entity<MiembroClase>()
                .HasOne(mc => mc.Miembro)
                .WithMany(m => m.Clases)
                .HasForeignKey(mc => mc.MiembroId);

            modelBuilder.Entity<MiembroClase>()
                .HasOne(mc => mc.Clase)
                .WithMany(c => c.Miembros)
                .HasForeignKey(mc => mc.ClaseId);

            // 🔹 Asistencia (1:N)
            modelBuilder.Entity<Asistencia>()
                .HasOne(a => a.Clase)
                .WithMany(c => c.Asistencias) 
                .HasForeignKey(a => a.ClaseId)
                 .OnDelete(DeleteBehavior.NoAction); // NO CASCADE

            modelBuilder.Entity<Asistencia>()
                .HasOne(a => a.Miembro)
                .WithMany(m => m.Asistencias)
                .HasForeignKey(a => a.MiembroId)
                 .OnDelete(DeleteBehavior.NoAction); // NO CASCADE

            modelBuilder.Entity<Asistencia>()
                .HasOne(a => a.Entrenador)
                .WithMany(e => e.Asistencias)
                .HasForeignKey(a => a.EntrenadorId)
                 .OnDelete(DeleteBehavior.NoAction); // NO CASCADE

            //-------------------------

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
