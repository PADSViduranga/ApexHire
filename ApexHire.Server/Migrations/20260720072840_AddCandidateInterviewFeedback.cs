using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApexHire.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddCandidateInterviewFeedback : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CandidateInterviewFeedbacks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InterviewId = table.Column<int>(type: "int", nullable: false),
                    CandidateUserId = table.Column<int>(type: "int", nullable: false),
                    OverallExperienceRating = table.Column<int>(type: "int", nullable: false),
                    InterviewerProfessionalismRating = table.Column<int>(type: "int", nullable: false),
                    ProcessClarityRating = table.Column<int>(type: "int", nullable: false),
                    Comments = table.Column<string>(type: "nvarchar(3000)", maxLength: 3000, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ReviewedByUserId = table.Column<int>(type: "int", nullable: true),
                    InternalNote = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CandidateInterviewFeedbacks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CandidateInterviewFeedbacks_Interviews_InterviewId",
                        column: x => x.InterviewId,
                        principalTable: "Interviews",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CandidateInterviewFeedbacks_Users_CandidateUserId",
                        column: x => x.CandidateUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CandidateInterviewFeedbacks_Users_ReviewedByUserId",
                        column: x => x.ReviewedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CandidateInterviewFeedbacks_CandidateUserId",
                table: "CandidateInterviewFeedbacks",
                column: "CandidateUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CandidateInterviewFeedbacks_InterviewId",
                table: "CandidateInterviewFeedbacks",
                column: "InterviewId");

            migrationBuilder.CreateIndex(
                name: "IX_CandidateInterviewFeedbacks_ReviewedByUserId",
                table: "CandidateInterviewFeedbacks",
                column: "ReviewedByUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CandidateInterviewFeedbacks");
        }
    }
}
