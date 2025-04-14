import { Resend } from "resend";

import { EmailTemplate } from "../../../components/email-template";

// eslint-disable-next-line turbo/no-undeclared-env-vars
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "Brett <admin@fine-metals-recovery.ca>",
      to: ["brettkgamble@gmail.com"],
      subject: "Hello world",
      react: EmailTemplate({ firstName: 'John' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
