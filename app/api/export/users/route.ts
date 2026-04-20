import { dashboardUsers } from "@/lib/mock-data";

export async function GET() {
  const rows = [
    ["name", "email", "phone", "membership", "joined"],
    ...dashboardUsers.map((user) => [user.name, user.email, user.phone, user.membership, user.joined])
  ];

  const csv = rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bbc-members.csv"'
    }
  });
}
