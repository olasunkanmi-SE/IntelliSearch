import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { IDocument } from "../interfaces/document.interface";

interface IBookProps {
  onBookSelect: (bookData: IDocument) => void;
}

function Books({ onBookSelect }: Readonly<IBookProps>) {
  const axiosPrivate = useAxiosPrivate();
  const [selectedBook, setSelectedBook] = useState<string>("Select Book");
  const [books, setBooks] = useState<IDocument[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/documents");
        setBooks(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleSelect = async (eventKey: string | null) => {
    if (eventKey) {
      setSelectedBook(eventKey);
      const selectedBookData = books.find((book: { title: string }) => book.title === eventKey);
      if (selectedBookData) {
        onBookSelect(selectedBookData);
      }
    }
  };
  try {
    return (
      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle variant="dark" id="dropdown-basic">
          {selectedBook}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {books?.map((document: { title: string; id: number }) => (
            <Dropdown.Item eventKey={document.title} key={document.id}>
              {document.title}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  } catch (error) {
    console.error(error);
  }
}

export default Books;
