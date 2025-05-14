"use server";

import * as React from "react";
import { Resend } from "resend";

import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";


const resend = new Resend(process.env.RESEND_API_KEY);

const invitedByUsername = "Brett from e-waste-pickup";
const invitedByEmail = "admin@e-waste-pickup.ca";

function EmailTemplate() {
  const previewText = `Invite ${invitedByUsername} to come and pick up your e-waste!`;
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="my-auto mx-auto font-sans px-2">
          <Container className="mx-auto p-[20px] max-w-[465px]">
            <Preview className="text-center">{previewText}</Preview>
            <Section className="mt-[8px]">
              <Img
                src={`e-waste-pickup-logo.png`}
                width="160"
                height="55"
                alt="E-waste Pickup Logo"
                className="my-0 mx-auto"
              />
            </Section>
            {/* <Heading className="text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Join <strong>{teamName}</strong> on <strong>Vercel</strong>
              </Heading> */}
            <Text className="text-[14px] leading-[24px]">
              {/* Hello {username}, */}
              Hello,
            </Text>
            <Text className="text-[14px] leading-[24px]">
              {/* <strong>{invitedByUsername}</strong> */}
              Simply send us your email address and we will reach out by email
              to arrange a pickup of your e-waste. We will pick up your e-waste
              at a time that is convenient for you.
            </Text>
            <Text className="text-[14px] leading-[24px]">
              Stay on the lookout for an email from us (
              <strong>{invitedByEmail}</strong>) to confirm your pickup request.
              <Link
                href={`mailto:${invitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {/* {invitedByEmail} */}
              </Link>
              {/* &nbsp;has invited you to the <strong>{teamName}</strong> team on{' '}
                <strong>Vercel</strong>. */}
            </Text>
            {/* <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Join the team
              </Button>
            </Section> */}
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            {/* <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{" "}
              <span className="">{firstName}</span>. This invite was sent from{" "}
              <span className="">{inviteFromIp}</span> located in{" "}
              <span className="">{inviteFromLocation}</span>. If you were not
              expecting this invitation, you can ignore this email. If you are
              concerned about your account&apos;s safety, please reply to this
              email to get in touch with us.
            </Text> */}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export async function newsletterSubmission(formData: FormData) {
  const email = formData.get("email");
  console.log("🚀 ~ newsletterSubmission ~ email:", email);
  await resend.emails.send({
    from: "admin <admin@e-waste-pickup.ca>",
    to: ["admin@e-waste-pickup.ca"],
    subject: "Let us pickup your e-waste!",
    // html: "<p>it works!</p>",
    react: EmailTemplate(),
    // react: EmailTemplate({ firstName: "Brett!!" }) as React.ReactElement,
  });
}
