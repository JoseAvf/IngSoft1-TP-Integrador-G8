using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuerpoSano.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AjustesEntrenador : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdCertificado",
                table: "Entrenadores");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "IdCertificado",
                table: "Entrenadores",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
