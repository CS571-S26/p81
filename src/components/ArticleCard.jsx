import { Link } from 'react-router-dom';
import { Card, Button, Badge } from 'react-bootstrap';

export default function ArticleCard({ article }) {  
  return (
    <Card className="mb-3 h-100">
      <Card.Body>
        <Badge pill bg="warning" text="dark">
          HSK {article.difficulty_score}
        </Badge>
        <Card.Title>{article.title}</Card.Title>
        <Card.Text>
          <strong>Source:</strong> {article.source}<br/>
          <strong>Published:</strong> {article.published_at}
        </Card.Text>
        <Button variant="primary" as={Link} to={`/articles/${article.id}`}>
          Read More
        </Button>
        <br/>
        <Badge pill bg="secondary" text="light">
          Length: {article.total_words} Characters
        </Badge>
        <Badge pill bg="secondary" text="light">
          Unique: {article.unique_words}
        </Badge>
      </Card.Body>
    </Card>
  );
}