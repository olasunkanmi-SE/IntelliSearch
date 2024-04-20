import DOMPurify from "dompurify";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row, Stack } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import NavBar from "./NavBar";
import markdownIt from "markdown-it";
import Books from "./DropDown";
import { IDocument } from "../interfaces/document.interface";

interface IHistory {
  role: string;
  parts: { text: string }[];
}

export function Thread() {
  const axiosPrivate = useAxiosPrivate();
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<IHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<IDocument>();

  const handleBookSelect = (bookData: IDocument) => {
    setSelectedBook(bookData);
  };

  const formAction = async () => {
    if (!question) {
      setError("Please enter a question");
      return;
    }
    try {
      setLoading(true);
      setQuestion("");
      console.log(chatHistory);
      const response = await axiosPrivate.post("/chat", {
        documentId: selectedBook?.id,
        question,
        chatHistory: JSON.stringify(chatHistory.slice(0, 4)),
      });
      const data = response.data;
      setChatHistory((oldChat) => [
        {
          role: "user",
          parts: [{ text: question }],
        },
        {
          role: "model",
          parts: [{ text: data.data.answer }],
        },
        ...oldChat,
      ]);

      setLoading(false);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      setError(error.message);
      setLoading(false);
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

  return (
    <Container>
      <Row>
        <NavBar />
      </Row>
      <Row>
        <Col></Col>
        <Col xs={6}>
          <div style={{ marginTop: "20px" }}>
            <Stack direction="horizontal" gap={3}>
              <div className="p-2">
                <Books onBookSelect={handleBookSelect} />
              </div>
              <div className="p-2">
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
                    <Button variant="dark" onClick={formAction} disabled={loading}>
                      Send
                    </Button>
                    <div className="vr" />
                    <Button variant="outline-danger" onClick={clearChat} disabled={loading}>
                      Reset
                    </Button>
                  </Stack>
                </Form>
              </div>
            </Stack>
          </div>

          <div style={{ color: "red" }}>
            <p>{error}</p>
          </div>
          <div>
            {loading ? (
              <>
                <div
                  className="loader"
                  style={{
                    marginBottom: "10px",
                    marginTop: "10px",
                    height: "30px",
                  }}
                ></div>
                <div
                  className="loader"
                  style={{
                    marginBottom: "10px",
                    marginTop: "10px",
                    height: "70px",
                  }}
                ></div>
              </>
            ) : (
              ""
            )}
          </div>
          <div>
            {chatHistory.map((chatItem, index) => (
              <Card
                style={{
                  marginBottom: "10px",
                  marginTop: "10px",
                  backgroundColor: "#212529",
                  color: "#fff",
                  borderColor: `${chatItem.role && chatItem.role === "user" ? "" : "#2c2c29"}`,
                  borderWidth: "medium",
                }}
                key={index}
              >
                {chatItem.parts.map((part, i) => (
                  <Card.Body key={i}>
                    <Card.Text
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(markdownIt().render(part.text)),
                      }}
                    ></Card.Text>
                  </Card.Body>
                ))}
              </Card>
            ))}
          </div>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}
