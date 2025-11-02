using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuerpoSano.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregoEntrenadorMiembro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EntrenadorId",
                table: "Miembros",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Miembros_EntrenadorId",
                table: "Miembros",
                column: "EntrenadorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Miembros_Entrenadores_EntrenadorId",
                table: "Miembros",
                column: "EntrenadorId",
                principalTable: "Entrenadores",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Miembros_Entrenadores_EntrenadorId",
                table: "Miembros");

            migrationBuilder.DropIndex(
                name: "IX_Miembros_EntrenadorId",
                table: "Miembros");

            migrationBuilder.DropColumn(
                name: "EntrenadorId",
                table: "Miembros");
        }
    }
}
