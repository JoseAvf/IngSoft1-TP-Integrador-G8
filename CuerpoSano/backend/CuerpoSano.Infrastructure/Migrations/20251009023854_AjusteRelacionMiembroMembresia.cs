using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuerpoSano.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AjusteRelacionMiembroMembresia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Miembros_Membresias_MembresiaId",
                table: "Miembros");

            migrationBuilder.DropIndex(
                name: "IX_Miembros_MembresiaId",
                table: "Miembros");

            migrationBuilder.CreateIndex(
                name: "IX_Membresias_MiembroId",
                table: "Membresias",
                column: "MiembroId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Membresias_Miembros_MiembroId",
                table: "Membresias",
                column: "MiembroId",
                principalTable: "Miembros",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Membresias_Miembros_MiembroId",
                table: "Membresias");

            migrationBuilder.DropIndex(
                name: "IX_Membresias_MiembroId",
                table: "Membresias");

            migrationBuilder.CreateIndex(
                name: "IX_Miembros_MembresiaId",
                table: "Miembros",
                column: "MembresiaId",
                unique: true,
                filter: "[MembresiaId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Miembros_Membresias_MembresiaId",
                table: "Miembros",
                column: "MembresiaId",
                principalTable: "Membresias",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
