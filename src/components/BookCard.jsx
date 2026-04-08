import { Link } from 'react-router-dom';
import { Card, Button, Badge } from 'react-bootstrap';

export default function BookCard({ book }) {  
  return (
    <Card className="mb-3 h-100">
      <Card.Body>
        <Badge pill bg="warning" text="dark">
          HSK {book.difficulty_score}
        </Badge>
        <Card.Title>{book.title}</Card.Title>
        <Card.Text>
          <strong>Author:</strong> {book.author ?? "Unknown"}<br/>
        </Card.Text>
        <Button variant="primary" as={Link} to={`/books/${book.id}`}>
          Read More
        </Button>
      </Card.Body>
    </Card>
  );
}
