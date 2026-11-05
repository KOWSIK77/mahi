import { z } from "zod";
import { divisionOptions } from "./site";

const text = (label: string, max: number) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);

export const enquirySchema = z.object({
  fullName: text("Full name", 120),
  companyName: text("Company name", 160),
  businessEmail: z
    .string({ error: "Business email is required." })
    .trim()
    .max(200)
    .pipe(z.email("Please enter a valid business email.")),
  country: text("Country", 80),
  division: z.enum(divisionOptions, { error: "Please choose a product division." }),
  requirement: text("Product / requirement", 200),
  message: z
    .string({ error: "Message is required." })
    .trim()
    .min(20, "Please add a little more detail (at least 20 characters).")
    .max(4000, "Message must be 4000 characters or fewer."),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type Enquiry = z.infer<typeof enquirySchema>;
export type EnquiryField = keyof Omit<Enquiry, "website">;
