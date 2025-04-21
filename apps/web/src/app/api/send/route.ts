/* eslint-disable prettier/prettier */
import type * as React from "react";
import { Resend } from "resend";

import { EmailTemplate } from "../../../components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "admin <admin@e-waste-pickup.ca>",
      to: ["admin@e-waste-pickup.ca"],
      subject: "Hello world",
      react: EmailTemplate({ firstName: "Brett" }) as React.ReactElement,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
