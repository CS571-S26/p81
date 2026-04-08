import { Container, Stack, Badge } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';


export default function BookDetailPage() {

  const [book, setBook] = useState();
  const [chapters, setChapters] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    let url = `${API_URL}/books/${id}`;
    
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setBook(data.book);
        setChapters(data.chapters);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []); 

  if (!book) return <p>Loading...</p>;

  return (
    <Container fluid className="my-4">
      <h1>{book.title}</h1>
      <h2>{book.author}</h2>
      <Stack>
        <Badge pill bg="warning" text="dark">
          Scored HSK Level: {book.difficulty_score}
        </Badge>
      </Stack>
      <ul>
      {chapters.map(chapter => (
        <li key={chapter.id} style={{textAlign: "left"}}>
          <Link
            to={`/books/${id}/chapters/${chapter.chapter_number}`}>
            {chapter.chapter_number}. {chapter.title}
          </Link>
        </li>
      ))}
      </ul>
    </Container>
  );
}
