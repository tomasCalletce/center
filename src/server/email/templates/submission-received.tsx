import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
} from "@react-email/components";

interface SubmissionReceivedEmailProps {
  userDisplayName: string;
  submissionTitle: string;
  challengeTitle: string;
  challengeSlug: string;
  demoUrl: string;
  repositoryUrl: string;
}

export function SubmissionReceivedEmail({
  userDisplayName,
  submissionTitle,
  challengeTitle,
  challengeSlug,
  demoUrl,
  repositoryUrl,
}: SubmissionReceivedEmailProps) {
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
            Your submission "{submissionTitle}" for {challengeTitle} has been
            received.
          </Text>

          <Text style={{ fontSize: "14px", margin: "0 0 8px 0" }}>
            Demo:{" "}
            <Link href={demoUrl} style={{ color: "#000" }}>
              {demoUrl}
            </Link>
          </Text>

          <Text style={{ fontSize: "14px", margin: "0 0 20px 0" }}>
            Code:{" "}
            <Link href={repositoryUrl} style={{ color: "#000" }}>
              {repositoryUrl}
            </Link>
          </Text>

          <Text style={{ fontSize: "14px", margin: "0 0 40px 0" }}>
            <Link
              href={challengeUrl}
              style={{ color: "#000", textDecoration: "underline" }}
            >
              View challenge →
            </Link>
          </Text>

          <Text style={{ fontSize: "12px", color: "#666", margin: "0" }}>
            ACC Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
