import prisma from "@/lib/db";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const workshopId = pathSegments[pathSegments.length - 1];

    if (!workshopId) {
    return new Response(
        JSON.stringify({
            success: false,
            message: "Tournament ID not found",
        }),
        {
            status: 404,
            headers: { "Content-Type": "application/json" },
        }
    );
    }

  try {
    const workshop = await prisma.workshop.findUnique({
      where: { workshopId },
    });
    if (workshop) {
        return new Response(
          JSON.stringify({
            success: true,
            data: workshop,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            message: "Tournament not found",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Internal Server Error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  };
  