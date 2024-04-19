import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

function Books() {
  const [selectedBook, setSelectedBook] = useState<string>("Select Book");

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedBook(eventKey);
    }
  };
  return (
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle variant="dark" id="dropdown-basic">
        {selectedBook}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="MyBid">MyBid</Dropdown.Item>
        <Dropdown.Item eventKey="Microservice Pattern">Microservice Pattern</Dropdown.Item>
        <Dropdown.Item eventKey="Pregmatic Engineer">Pregmatic Engineer</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default Books;
