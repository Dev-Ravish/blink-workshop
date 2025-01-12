import { z } from "zod";

const workshopFormSchema = z.object({
    organizationName: z.string().min(1, "Required Org name"),
    email: z.string().email("Provide a valid email"),
    image: z.instanceof(File).nullable(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    totalSlot: z.number().min(1, "Provide a minimum of 1 slot"),
    publicKey: z.string().min(44, "Please provide a valid public key"),
    date: z.string().min(1, "Please provide a valid date"),
    time: z.string().min(1, "Please provide a valid time"),
    location: z.string().min(1, "Please provide a valid location"),
    joinFees: z.number().nonnegative("Please provide a valid fee"),

});

export type workshopFormData = z.infer<typeof workshopFormSchema>;
export default workshopFormSchema;
