import prisma from "@/lib/db";
import {
    ActionError,
    CompletedAction,
    ACTIONS_CORS_HEADERS,
} from "@solana/actions";

import nodemailer from "nodemailer";

export const GET = async () => {
    return Response.json(
        { message: "Method not supported" },
        {
        headers: ACTIONS_CORS_HEADERS,
        }
    );
    };

    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
    });

    export const OPTIONS = GET;

    export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const url = new URL(req.url);
        const atendeePubKey = body.account;
        const atendeeName = url.searchParams.get("atendeeName") ?? "";
        const atendeeEmail = url.searchParams.get("atendeeEmail") ?? "";
        const workshopId = url.searchParams.get("workshopId") ?? "";
        const atendeeId = crypto.randomUUID();

        const orgData = await prisma.workshop.findUnique({
        where: { workshopId },
        });

        await prisma.atendee.create({
        data: {
            atendeeId,
            workshopId,
            atendeeName,
            atendeeEmail,
            atendeePubKey,
        },
        });

        await transporter.sendMail({
        from: process.env.EMAIL,
        to: atendeeEmail,
        subject: "Workshop Registration Successful",
        text: `Hello ${atendeeName},\n\nYou have successfully registered for the workshop with ID: ${workshopId}.\n\nGood luck!`,
        html: `<p>Hello ${atendeeName},</p><p>You have successfully registered for the workshop with ID: <strong>${workshopId}</strong>.</p><p>Good luck!</p>`,
        });

        const payload: CompletedAction = {
        type: "completed",
        title: "Registration Successful",
        icon: `${orgData?.image}`,
        label: "Completed",
        description: `You have successfully joined the workshop`,
        };

        return new Response(JSON.stringify(payload), {
        headers: ACTIONS_CORS_HEADERS,
        });
    } catch (err) {
        console.error("General error:", err);
        const actionError: ActionError = { message: "An unknown error occurred" };
        if (typeof err === "string") actionError.message = err;
        return new Response(JSON.stringify(actionError), {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
        });
    }
};
