import { useState } from "react";
import { Button, Card, Col, Container, Form, Row, Stack } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

// interface Message {
//   text: string;
//   metaData?: {
//     documentId: number;
//     pageNumber: number;
//   };
// }

// interface Iresponse {
//   history: { role: string; parts: { text: string }[] }[];
//   question: string;
//   answer: string;
// }

interface IHistory {
  role: string;
  parts: { text: string }[];
}

export function Thread() {
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<IHistory[]>([]);

  const formAction = async () => {
    if (!question) {
      setError("Please enter a question");
      return;
    }
    try {
      const body = {
        question,
        history: chatHistory,
      };

      const response = await axiosPrivate.post("/domain/create", JSON.stringify(body));
      const data = response.data;
      console.log(data);
      setChatHistory((oldChat) => [
        ...oldChat,
        {
          role: "user",
          parts: [{ text: question }],
        },
        {
          role: "model",
          parts: [{ text: data }],
        },
      ]);
      setQuestion("");
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formAction();
  };

  const clearChat = () => {
    setQuestion("");
    setError("");
    setChatHistory([]);
  };
  const exampleChatHistory: IHistory[] = [
    {
      role: "user",
      parts: [{ text: "Hi there!" }, { text: "How can I help you?" }],
    },
    {
      role: "agent",
      parts: [
        { text: "Hello! How can I assist you today?" },
        { text: "Please provide more details about your issue." },
      ],
    },
    {
      role: "user",
      parts: [{ text: "Hi there!" }, { text: "How can I help you?" }],
    },
    {
      role: "agent",
      parts: [
        { text: "Hello! How can I assist you today?" },
        { text: "Please provide more details about your issue." },
      ],
    },
    // Add more example chat histories as needed
  ];

  return (
    <Container>
      <Row>
        <Col></Col>
        <Col xs={8}>
          <div style={{ marginTop: "20px" }}>
            <Form onSubmit={handleSubmit}>
              <Stack direction="horizontal" gap={3}>
                <Form.Control
                  className="me-auto"
                  type="text"
                  name="message"
                  placeholder="Ask me about MyBid"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <Button variant="outline-success" onClick={formAction}>
                  Send
                </Button>
                <div className="vr" />
                <Button variant="outline-danger" onClick={clearChat}>
                  Reset
                </Button>
              </Stack>
            </Form>
          </div>

          <div>
            <p>{error}</p>
          </div>
          {exampleChatHistory.map((chatItem, index) => (
            <Card style={{ marginBottom: "10px", marginTop: "10px" }} key={index}>
              <Card.Header>{chatItem.role}</Card.Header>
              {chatItem.parts.map((part, i) => (
                <Card.Body key={i}>
                  <Card.Text>{part.text}</Card.Text>
                </Card.Body>
              ))}
            </Card>
          ))}
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}
