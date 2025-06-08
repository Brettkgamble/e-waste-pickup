import { z } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

export const FormDataSchema = z.object({
  // name: z.string().nonempty("Name is required"),
  // message: z
  //   .string()
  //   .nonempty("Message is required")
  //   .min(6, { message: "Message must be at least 6 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email must be a valid format"),
  phone: z.string().regex(phoneRegex, "Invalid contact number"),
});
