import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";

interface ChallengeOpeningNotificationProps {
  userDisplayName: string;
  challengeTitle: string;
  challengeSlug: string;
  prizePool: string;
  deadline: string;
}

export function ChallengeOpeningNotification({
  userDisplayName,
  challengeTitle,
  challengeSlug,
  prizePool,
  deadline,
}: ChallengeOpeningNotificationProps) {
  const challengeUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/challenges/${challengeSlug}`;

  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "system-ui, sans-serif",
          color: "#000",
          backgroundColor: "#fff",
        }}
      >
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}
        >
          <Text
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0 0 20px 0",
            }}
          >
            ACC
          </Text>

          <Text style={{ fontSize: "16px", margin: "0 0 20px 0" }}>
            Hi {userDisplayName},
          </Text>

          <Text style={{ fontSize: "16px", margin: "0 0 20px 0" }}>
            Great news! The challenge you were interested in is now open for
            submissions.
          </Text>

          <Text
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              margin: "0 0 12px 0",
            }}
          >
            {challengeTitle}
          </Text>

          <Text style={{ fontSize: "14px", margin: "0 0 8px 0" }}>
            Prize Pool: {prizePool}
          </Text>

          <Text style={{ fontSize: "14px", margin: "0 0 20px 0" }}>
            Deadline: {deadline}
          </Text>

          <Text style={{ fontSize: "14px", margin: "0 0 40px 0" }}>
            <Link
              href={challengeUrl}
              style={{ color: "#000", textDecoration: "underline" }}
            >
              Submit your build now →
            </Link>
          </Text>

          <Text style={{ fontSize: "12px", color: "#666", margin: "0" }}>
            IA Hackathon Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
