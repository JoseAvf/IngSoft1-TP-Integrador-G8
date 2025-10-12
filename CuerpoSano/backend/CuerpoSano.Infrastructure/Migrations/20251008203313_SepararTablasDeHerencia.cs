using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CuerpoSano.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SepararTablasDeHerencia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Carnets_Personas_MiembroId",
                table: "Carnets");

            migrationBuilder.DropForeignKey(
                name: "FK_Personas_Membresias_MembresiaId",
                table: "Personas");

            migrationBuilder.DropIndex(
                name: "IX_Personas_MembresiaId",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Correo",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "MembresiaId",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "TipoPersona",
                table: "Personas");

            migrationBuilder.CreateTable(
                name: "Miembros",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Correo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MembresiaId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Miembros", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Miembros_Membresias_MembresiaId",
                        column: x => x.MembresiaId,
                        principalTable: "Membresias",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Miembros_Personas_Id",
                        column: x => x.Id,
                        principalTable: "Personas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Miembros_MembresiaId",
                table: "Miembros",
                column: "MembresiaId",
                unique: true,
                filter: "[MembresiaId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Carnets_Miembros_MiembroId",
                table: "Carnets",
                column: "MiembroId",
                principalTable: "Miembros",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Carnets_Miembros_MiembroId",
                table: "Carnets");

            migrationBuilder.DropTable(
                name: "Miembros");

            migrationBuilder.AddColumn<string>(
                name: "Correo",
                table: "Personas",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MembresiaId",
                table: "Personas",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TipoPersona",
                table: "Personas",
                type: "nvarchar(8)",
                maxLength: 8,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Personas_MembresiaId",
                table: "Personas",
                column: "MembresiaId",
                unique: true,
                filter: "[MembresiaId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Carnets_Personas_MiembroId",
                table: "Carnets",
                column: "MiembroId",
                principalTable: "Personas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Personas_Membresias_MembresiaId",
                table: "Personas",
                column: "MembresiaId",
                principalTable: "Membresias",
                principalColumn: "Id");
        }
    }
}
