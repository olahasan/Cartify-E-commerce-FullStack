// this code NEVER used
import React from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AuthChoice: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Card
        style={{
          width: "400px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Card.Body>
          <Card.Title className="mb-3" style={{ fontSize: "1.5rem" }}>
            👋 Welcome!
          </Card.Title>
          <Card.Text className="mb-4 text-muted">
            To continue, please choose one of the following:
          </Card.Text>

          <div className="d-flex flex-column gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/login")}
            >
              I already have an account
            </Button>

            <Button
              variant="outline-primary"
              size="lg"
              onClick={() => navigate("/register")}
            >
              I’m new here (Create Account)
            </Button>
          </div>

          <div className="mt-4">
            <Button
              variant="link"
              className="text-muted"
              onClick={() => navigate(-1)}
            >
              ← Go back
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AuthChoice;
