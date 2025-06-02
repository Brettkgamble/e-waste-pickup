"use server";
import * as React from "react";
import { Resend } from "resend";


import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Img } from "@react-email/img";

const resend = new Resend(process.env.RESEND_API_KEY);

const invitedByUsername = "Brett from e-waste-pickup";
const invitedByEmail = "admin@e-waste-pickup.ca";

function EmailTemplate() {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="my-auto mx-auto font-sans px-2">
          <Container className="mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[8px]">
              <Img
                src="https://res.cloudinary.com/dblps0yur/image/upload/v1748905865/logo_bright_Green_on_trans_170_53_centered_cfivva.png"
                width="350"
                height="115"
                alt="E-waste Pickup Logo"
                className="my-0 mx-auto"
              />
            </Section>
            <Text className="text-[14px] leading-[24px]">Hello,</Text>
            <Text className="text-[14px] leading-[24px]">
              We have received your e-mail and contact number and will be in
              contact shortly to arrange a pickup of your electronics.
            </Text>
            <Text className="text-[14px] leading-[24px]">
              We can also pickup electronics from your neighbors and friends
              while we are in the area and can also arrange for junk removal via
              our preferred supplier.
            </Text>
            <Text className="text-[14px] leading-[24px]">
              Stay on the lookout for an email from us (
              <strong>{invitedByEmail}</strong>) or a call (780-964-3364) to
              confirm your pickup request.
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              ></Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export async function newsletterSubmission(formData: FormData) {
  const email = formData.get("email");
  if (typeof email !== "string" || !email) {
    throw new Error("Invalid email address");
  }
  console.log("🚀 ~ newsletterSubmission ~ email:", email);
  await resend.emails.send({
    from: "E Waste Pickup <admin@e-waste-pickup.ca>",
    to: ["admin@e-waste-pickup.ca", email],
    subject: "Let us pickup your old electronics!",
    react: EmailTemplate(),
  });
}
