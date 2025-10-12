using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuerpoSano.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SetNullOnDeleteMembresia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Miembros_Membresias_MembresiaId",
                table: "Miembros");

            migrationBuilder.AddForeignKey(
                name: "FK_Miembros_Membresias_MembresiaId",
                table: "Miembros",
                column: "MembresiaId",
                principalTable: "Membresias",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Miembros_Membresias_MembresiaId",
                table: "Miembros");

            migrationBuilder.AddForeignKey(
                name: "FK_Miembros_Membresias_MembresiaId",
                table: "Miembros",
                column: "MembresiaId",
                principalTable: "Membresias",
                principalColumn: "Id");
        }
    }
}
