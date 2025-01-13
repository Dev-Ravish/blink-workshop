import { uploadImage } from "@/lib/cloudinary";
import prisma from "@/lib/db";
import nodemailer from "nodemailer";

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

    export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const organizationName = formData.get("organizationName")?.toString() || "";
        const email = formData.get("email")?.toString() || "";
        const description = formData.get("description")?.toString() || "";
        const totalSlot = Number(formData.get("totalSlot") || 1);
        const publicKey = formData.get("publicKey")?.toString() || "";
        const date = formData.get("date")?.toString() || "";
        const time = formData.get("time")?.toString() || "";
        const location = formData.get("location")?.toString() || "";
        const joinFees = formData.get("joinFees")?.toString() || "0"; // Get as string
        const workshopId = crypto.randomUUID();
        const blinkLink = `${process.env.FRONTEND_URL}/api/actions/join/${workshopId}`;

        // Validate joinFees
        const joinFeesNumber = parseFloat(joinFees);
        if (isNaN(joinFeesNumber)) {
        throw new Error("Invalid joinFees value. Please provide a valid decimal number.");
        }

        const image = formData.get("image") as File;
        let imageUrl = "";
        if (image) {
        imageUrl = await uploadImage(image, "workshop");
        }

        const data = await prisma.workshop.create({
        data: {
            workshopId,
            organizationName,
            email,
            image: imageUrl,
            description,
            publicKey,
            totalSlot,
            date,
            time,
            location,
            joinFees: joinFeesNumber, // Save as number
        },
        });

        await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Workshop Created Successfully",
        text: `Dear ${organizationName},\n\nYou have successfully created a workshop with ID: ${workshopId}.\n\nHere is your blink link: ${blinkLink}\n\nBest regards,\nTeam Blink Workshop`,
        html: `
            <p>Dear ${organizationName},</p>
            <p>You have successfully created a workshop with ID: <strong>${workshopId}</strong>.</p>
            <p>Here is your blink link: <a href="${blinkLink}">${blinkLink}</a></p>
            
            <p>We will then send the necessary information to the registered users.</p>
            
            <p>Best regards,<br>Team Blink Workshop</p>
        `,
        });

        return new Response(
        JSON.stringify({
            success: true,
            message: "Workshop created successfully",
            data,
        }),
        {
            status: 201,
            headers: { "Content-Type": "application/json" },
        }
        );
    } catch (error) {
        console.log("error:", error);

        return new Response(
        JSON.stringify({
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
        }),
        {
            status: 500,
            headers: { "Content-Type": "application/json" },
        }
        );
    }
}