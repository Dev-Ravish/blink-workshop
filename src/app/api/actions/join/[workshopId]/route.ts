import {
    Transaction,
    PublicKey,
    SystemProgram,
    Connection,
    clusterApiUrl,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import {
    ACTIONS_CORS_HEADERS,
    createPostResponse,
    ActionGetResponse,
    ActionPostResponse,
} from "@solana/actions";

import prisma from "@/lib/db";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const GET = async (req: Request) => {
const { pathname } = new URL(req.url);
const pathSegments = pathname.split("/");
const workshopId = pathSegments[4];

const orgData = await prisma.workshop.findUnique({
    where: {
        workshopId,
    },
});

if (!orgData) {
    return new Response(JSON.stringify({ error: "Workshop not found" }), {
    status: 404,
    headers: ACTIONS_CORS_HEADERS,
    });
}

try {
    const payload: ActionGetResponse = {
    icon: `${orgData.image}`,
    title: `Join ${orgData.organizationName} workshop`,
    description: `${orgData.description}\nAvailable Slots: ${orgData.totalSlot}\nJoin Fees: ${orgData.joinFees} SOL.`,

    label: "Join Now",
    links: {
        actions: [
        {
            label: "Join Now",
            href: `/api/actions/join/${workshopId}?name={name}&email={email}`,
            parameters: [
            {
                type: "text",
                name: "name",
                label: "Enter Your Name",
                required: true,
            },
            {
                type: "email",
                name: "email",
                label: "Enter Your Email",
                required: true,
            },
            ],
            type: "transaction",
        },
        ],
    },
    };
    return new Response(JSON.stringify(payload), {
    headers: ACTIONS_CORS_HEADERS,
    });
} catch (error) {
    console.error("Error processing GET request:", error);
    return new Response(
    JSON.stringify({ error: "Failed to process request" }),
    {
        status: 500,
        headers: ACTIONS_CORS_HEADERS,
    }
    );
}
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
try {
    const { pathname } = new URL(req.url);
    const pathSegments = pathname.split("/");
    const workshopId = pathSegments[4];
    const body = await req.json();
    const atendeePubKey = new PublicKey(body.account);
    const url = new URL(req.url);
    const atendeeName = url.searchParams.get("name") ?? "";
    const atendeeEmail = url.searchParams.get("email") ?? "";

    const workshop = await prisma.workshop.findUnique({
    where: { workshopId },
    });

    if (!workshop) {
    return new Response(JSON.stringify({ error: "Workshop not found" }), {
        status: 404,
        headers: ACTIONS_CORS_HEADERS,
    });
    }

    const joinFees = workshop.joinFees;
    const totalFees = joinFees ;

    const availableSlots = workshop.totalSlot;
    if (1 > availableSlots) {
    return new Response(
        JSON.stringify({ error: "Sorry! all slots are booked" }),
        {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
        }
    );
    }

    const updatedWorkshop = await prisma.workshop.update({
    where: { workshopId },
    data: {
        totalSlot: { decrement: 1 },
    },
    });

    if (!updatedWorkshop) {
    throw new Error("Failed to update workshop data");
    }

    if (!workshop.publicKey) {
    return new Response(
        JSON.stringify({ error: "Workshop public key not found" }),
        {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
        }
    );
    }

    const transaction = new Transaction().add(
    SystemProgram.transfer({
        fromPubkey: atendeePubKey,
        toPubkey: new PublicKey(workshop.publicKey),
        lamports: totalFees * LAMPORTS_PER_SOL,
    })
    );

    transaction.feePayer = atendeePubKey;
    transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
    fields: {
        type: "transaction",
        transaction,
        message: `Successfully joined the workshop! Remaining slots: ${updatedWorkshop.totalSlot}`,
        links: {
        next: {
            type: "post",
            href: `/api/actions/saveAtendeeData?atendeeName=${atendeeName}&atendeeEmail=${atendeeEmail}&workshopId=${workshopId}`,
        },
        },
    },
    });

    return new Response(JSON.stringify(payload), {
    status: 200,
    headers: ACTIONS_CORS_HEADERS,
    });
} catch (error) {
    console.error("Error processing POST request:", error);
    return new Response(
    JSON.stringify({ error: "Failed to process request" }),
    {
        status: 500,
        headers: ACTIONS_CORS_HEADERS,
    }
    );
}
};
