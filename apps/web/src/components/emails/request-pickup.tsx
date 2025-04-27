/* eslint-disable prettier/prettier */
// https://github.com/resend/resend-vercel-example/tree/main
// https://www.youtube.com/watch?v=xlA5XD8CSdo

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
  } from '@react-email/components';
  
  interface RequestPickupEmailProps {
    username?: string;
    userImage?: string;
    invitedByUsername?: string;
    invitedByEmail?: string;
    teamName?: string;
    teamImage?: string;
    inviteLink?: string;
    inviteFromIp?: string;
    inviteFromLocation?: string;
  }
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

    console.log('baseUrl', baseUrl);
  
  export const RequestPickupEmail = ({
    username,
    userImage,
    invitedByUsername,
    invitedByEmail,
    teamName,
    teamImage,
    inviteLink,
    inviteFromIp,
    inviteFromLocation,
  }: RequestPickupEmailProps) => {
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
                  src={`/e-waste-pickup-logo.png`}
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
                Simply send us your email address and we will send you a pickup
                request for your e-waste. We will pick up your e-waste at a time
                that is convenient for you. 
                Lookout for an email from us (<strong>{invitedByEmail}</strong>) to confirm your pickup request.
                <Link
                  href={`mailto:${invitedByEmail}`}
                  className="text-blue-600 no-underline"
                >
                  {/* {invitedByEmail} */}
                </Link>
                  {/* &nbsp;has invited you to the <strong>{teamName}</strong> team on{' '}
                <strong>Vercel</strong>. */}
              </Text>
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-[#000000] rounded text-[12px] font-semibold no-underline text-center px-5 py-3"
                  href={inviteLink}
                >
                  Join the team
                </Button>
              </Section>
              <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
              <Text className="text-[#666666] text-[12px] leading-[24px]">
                This invitation was intended for{' '}
                <span className="">{username}</span>. This invite was
                sent from <span className="">{inviteFromIp}</span>{' '}
                located in{' '}
                <span className="">{inviteFromLocation}</span>. If you
                were not expecting this invitation, you can ignore this email. If
                you are concerned about your account&apos;s safety, please reply to
                this email to get in touch with us.
              </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  
  RequestPickupEmail.PreviewProps = {
    username: 'alanturing',
    userImage: `${baseUrl}/static/vercel-user.png`,
    invitedByUsername: 'Alan',
    invitedByEmail: 'alan.turing@example.com',
    teamName: 'Enigma',
    teamImage: `${baseUrl}/static/vercel-team.png`,
    inviteLink: 'https://vercel.com',
    inviteFromIp: '204.13.186.218',
    inviteFromLocation: 'São Paulo, Brazil',
  } as RequestPickupEmailProps;
  
  export default RequestPickupEmail;
  