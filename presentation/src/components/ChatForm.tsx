import DOMPurify from "dompurify";
import { useState } from "react";
import { Button, Card, Container, Form, ListGroup, Row, Stack } from "react-bootstrap";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import NavBar from "./NavBar";
import markdownIt from "markdown-it";
import Books from "./DropDown";
import { IDocument } from "../interfaces/document.interface";
import FileUploader from "./DragAndDrop";

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
    <Container style={{ overflow: "hidden" }} fluid>
      <Row>
        <NavBar />
      </Row>
      <Row>
        <div className="col-lg-1 col-md-4 col-sm-6"></div>
        <div className="col-lg-8 col-md-4 col-sm-6">
          <Stack direction="horizontal" gap={3}>
            <div className="p-2"></div>
            <div className="p-2 ms-auto">
              <div>
                <Books onBookSelect={handleBookSelect} />
              </div>
            </div>
            <div className="p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-gear-fill"
                viewBox="0 0 16 16"
                color="#fff"
              >
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
              </svg>
            </div>
          </Stack>

          <div style={{ marginTop: "20px" }}>
            <div>
              <Form onSubmit={handleSubmit} className="d-flex">
                <Form.Control
                  type="text"
                  name="message"
                  className="me-2"
                  placeholder="Select a Book and ask me questions"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <Button variant="dark" onClick={formAction} disabled={loading}>
                  Ask
                </Button>
                <div className="vr mx-2" />
                <Button variant="outline-info" onClick={clearChat} disabled={loading}>
                  Reset
                </Button>
              </Form>
            </div>
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
        </div>
        <div style={{ width: "18rem" }} className="col-lg-3 col-md-4 col-sm-6">
          <div style={{ marginTop: "10px" }}>
            <Card style={{ backgroundColor: "#000", borderColor: "#fff", color: "#fff" }}>
              <Card.Body>
                <Card.Title>IntelliSearch</Card.Title>
                <div style={{ marginBottom: "10px" }}>
                  <Button style={{ color: "#fff" }} variant="outline-success">
                    Sign Up to Use Application
                  </Button>
                </div>
                <Card.Text>
                  A gemini API key is required to use this service. Sign up with your gmail to get a key.
                </Card.Text>
                <Button style={{ color: "#fff" }} variant="outline-success">
                  Get your Gemini API Key
                </Button>
              </Card.Body>
            </Card>
          </div>
          <div style={{ marginTop: "10px", color: "#fff" }}>
            <h5>Books</h5>
            <ListGroup style={{ backgroundColor: "none" }}>
              <ListGroup.Item>Designing data intensive applications</ListGroup.Item>
              <ListGroup.Item>MyBid white paper</ListGroup.Item>
              <ListGroup.Item>Microservices Design</ListGroup.Item>
              <ListGroup.Item>The pregmatic Engineer</ListGroup.Item>
              <ListGroup.Item>Software development at Google</ListGroup.Item>
            </ListGroup>
          </div>
          <div>
            <Card style={{ marginTop: "10px", backgroundColor: "#000" }}>
              <Card.Body>
                <FileUploader />
              </Card.Body>
            </Card>
          </div>
          <div style={{ marginTop: "10px" }}>
            <Card style={{ backgroundColor: "#000", borderColor: "#fff", color: "#fff" }}>
              <Card.Body>
                <Card.Title>Function Calling</Card.Title>
                <Card.Text>
                  Gemini function calling allows you to directly query our Ecommerce database and get insight
                </Card.Text>
                <Button style={{ color: "#fff" }} variant="outline-info">
                  coming soon
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Row>
    </Container>
  );
}
