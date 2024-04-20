import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavBar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container style={{ justifyContent: "right" }}>
        <Nav>
          <Nav.Link href="#home">Books</Nav.Link>
          <Nav.Link href="#features">Documents</Nav.Link>
          <Nav.Link href="#pricing">API Keys</Nav.Link>
          <Nav.Link href="#pricing">Settings</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
