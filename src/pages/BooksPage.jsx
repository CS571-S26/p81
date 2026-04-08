import { Container, Row, Col, Pagination, Form } from 'react-bootstrap';
import { useEffect, useState } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import BookCard from '../components/BookCard';
// import './ArticlesPage.css';

function SourceSelect({ filters, setFilters, uniqueAuthors}) {  
  return (
    <Form.Select 
      value={filters.author}
      onChange={(e) => {
        setFilters({...filters, author: e.target.value})}}
      aria-label="Author select"
    >
      <option value="">All Authors</option>
      {
        uniqueAuthors.map((authorName) => (
          <option key={authorName} value={authorName}>{authorName}</option>
        ))
      }
    </Form.Select>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ author: "" });
  const [difficultyRange, setDifficultyRange] = useState([1, 9]);
  const [uniqueAuthors, setUniqueAuthors] = useState([]);
  
  const limit = 9;

  useEffect(() => {
    setPage(1);
  }, [filters, difficultyRange]);

  useEffect(() => {
    const offset = (page - 1) * limit;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    let url = `${API_URL}/books?`;
    
    if (filters.author) {
      url += `author=${filters.author}&`;
    }

    url += `min_difficulty=${difficultyRange[0]}&`;
    url += `max_difficulty=${difficultyRange[1]}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setBooks(data.books);
        setTotal(data.total);
        setUniqueAuthors(data.authors);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [page, filters, difficultyRange]);  // Fetch when page or filters change

  const totalPages = Math.ceil(total / limit);

  return (
    <Container fluid className="my-4">
      <h1>Browse Books</h1>
      <Form className="mb-4">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <SourceSelect filters={filters} setFilters={setFilters} uniqueAuthors={uniqueAuthors} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Difficulty: HSK {difficultyRange[0]} - {difficultyRange[1]}</Form.Label>
              <Slider
                range
                min={1}
                max={9}
                step={0.5}  // Allow half-steps like HSK 4.5
                value={difficultyRange}
                onChange={(value) => {
                  // console.log('New value:', value); // Debugging
                  setDifficultyRange([...value])}}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {/* <p>Showing ({(page - 1) * books.length + 1}-{page * books.length } books) of {total} books</p> */}

      <Row>
        <Col xs={12}>
          <div className="books-grid">
            {books.map(book => (
              <BookCard key={book.id} book={book} /> 
            ))}
          </div>
        </Col>
      </Row>

      <Pagination className="mt-4">
        <Pagination.Prev 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
        >Previous</Pagination.Prev>

        {[...Array(totalPages)].map((_, i) => (
          <Pagination.Item 
            key={i + 1} 
            active={page === i + 1}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        
        <Pagination.Next 
          disabled={page === totalPages} 
          onClick={() => setPage(page + 1)}
        >Next</Pagination.Next>
      </Pagination>
    </Container>
  );
}
