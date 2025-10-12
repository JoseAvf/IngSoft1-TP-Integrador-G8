using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuerpoSano.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ActualizarMembresia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FechaPausaFin",
                table: "Membresias",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaPausaInicio",
                table: "Membresias",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MiembroId",
                table: "Membresias",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaPausaFin",
                table: "Membresias");

            migrationBuilder.DropColumn(
                name: "FechaPausaInicio",
                table: "Membresias");

            migrationBuilder.DropColumn(
                name: "MiembroId",
                table: "Membresias");
        }
    }
}
