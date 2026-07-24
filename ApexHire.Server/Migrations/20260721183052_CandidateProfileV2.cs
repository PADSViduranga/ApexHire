using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApexHire.Server.Migrations
{
    /// <inheritdoc />
    public partial class CandidateProfileV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ProfessionalSummary",
                table: "CandidateProfiles",
                type: "nvarchar(3000)",
                maxLength: 3000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CoverImageUrl",
                table: "CandidateProfiles",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GitHubUrl",
                table: "CandidateProfiles",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Headline",
                table: "CandidateProfiles",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "CandidateProfiles",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResumeFileName",
                table: "CandidateProfiles",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ResumeUploadedAt",
                table: "CandidateProfiles",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoverImageUrl",
                table: "CandidateProfiles");

            migrationBuilder.DropColumn(
                name: "GitHubUrl",
                table: "CandidateProfiles");

            migrationBuilder.DropColumn(
                name: "Headline",
                table: "CandidateProfiles");

            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "CandidateProfiles");

            migrationBuilder.DropColumn(
                name: "ResumeFileName",
                table: "CandidateProfiles");

            migrationBuilder.DropColumn(
                name: "ResumeUploadedAt",
                table: "CandidateProfiles");

            migrationBuilder.AlterColumn<string>(
                name: "ProfessionalSummary",
                table: "CandidateProfiles",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(3000)",
                oldMaxLength: 3000,
                oldNullable: true);
        }
    }
}
