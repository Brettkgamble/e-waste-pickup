import { UserIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";

export const customer = defineType({
  name: "customer",
  title: "Customer",
  type: "document",
  icon: UserIcon,
  groups: GROUPS,
  description: "Customer information for e-waste pickup jobs",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Customer Name",
      description: "Full name of the customer",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("Customer name is required"),
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Email Address",
      description: "Primary email address for contacting the customer",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => 
        Rule.required().error("Email address is required")
        .email().error("Please enter a valid email address"),
    }),
    defineField({
      name: "phone",
      type: "string",
      title: "Phone Number",
      description: "Primary phone number for contacting the customer",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("Phone number is required"),
    }),
    defineField({
      name: "address",
      type: "object",
      title: "Address",
      description: "Customer's address information",
      group: GROUP.MAIN_CONTENT,
      fields: [
        defineField({
          name: "street",
          type: "string",
          title: "Street Address",
          description: "Street address and number",
          validation: (Rule) => Rule.required().error("Street address is required"),
        }),
        defineField({
          name: "city",
          type: "string",
          title: "City",
          description: "City or town",
          validation: (Rule) => Rule.required().error("City is required"),
        }),
        defineField({
          name: "state",
          type: "string",
          title: "State/Province",
          description: "State or province",
          validation: (Rule) => Rule.required().error("State is required"),
        }),
        defineField({
          name: "zipCode",
          type: "string",
          title: "ZIP/Postal Code",
          description: "ZIP code or postal code",
          validation: (Rule) => Rule.required().error("ZIP code is required"),
        }),
      ],
      options: {
        columns: 2,
      },
    }),
    defineField({
      name: "notes",
      type: "text",
      title: "Notes",
      description: "Additional notes about the customer",
      group: GROUP.MAIN_CONTENT,
      rows: 3,
    }),
    defineField({
      name: "dateCreated",
      type: "date",
      title: "Date Created",
      description: "When this customer record was created",
      group: GROUP.MAIN_CONTENT,
      initialValue: () => new Date().toISOString().split("T")[0],
      validation: (Rule) => Rule.required().error("Date created is required"),
    }),
  ],
  preview: {
    select: {
      name: "name",
      email: "email",
      phone: "phone",
      city: "address.city",
      state: "address.state",
      dateCreated: "dateCreated",
    },
    prepare: ({ name, email, phone, city, state, dateCreated }) => {
      const location = city && state ? `${city}, ${state}` : "";
      const contact = email || phone || "";
      const dateInfo = dateCreated ? ` • ${new Date(dateCreated).toLocaleDateString()}` : "";

      return {
        title: name || "Unnamed Customer",
        subtitle: `${contact}${location ? ` • ${location}` : ""}${dateInfo}`,
      };
    },
  },
}); 