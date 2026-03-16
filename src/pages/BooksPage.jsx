import { Container, Row, Col, Pagination, Form } from 'react-bootstrap';
import { useEffect, useState } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import ArticleCard from '../components/ArticleCard';
import './ArticlesPage.css';

function SourceSelect({ filters, setFilters, uniqueAuthors}) {  
  return (
    <Form.Select 
      value={filters.source}
      onChange={(e) => {
        setFilters({...filters, author: e.target.value})}}
      aria-label="Author select"
    >
      <option value="">All Authors</option>
      {
        uniqueAuthors.map((sourceName) => (
          <option key={sourceName} value={sourceName}>{sourceName}</option>
        ))
      }
      {/* <option value="voa">Voice of America (VOA)</option>
      <option value="china news">China News</option> */}
    </Form.Select>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ source: "" });
  const [uniqueAuthors, setUniqueAuthors] = useState([]);
  const [difficultyRange, setDifficultyRange] = useState([1, 9]);
  const [lengthRange, setLengthRange] = useState([0, 2000]);
  
  const limit = 9;

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    const offset = (page - 1) * limit;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    let url = `${API_URL}/books`;
    
    if (filters.source) {
      url += `&source=${filters.source}`;
    }

    url += `&min_difficulty=${difficultyRange[0]}`;
    url += `&max_difficulty=${difficultyRange[1]}`;
    url += `&min_length=${lengthRange[0]}`;
    url += `&max_length=${lengthRange[1]}`;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setBooks(data.books);
        setTotal(data.total);
        setUniqueAuthors(data.author);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [page, filters, difficultyRange, lengthRange]);  // Fetch when page or filters change

  const totalPages = Math.ceil(total / limit);

  // Testing
  const getColSize = () => {
    if (books.length === 1) return { xs: 12, md: 8, lg: 6 };
    if (books.length === 2) return { xs: 12, md: 6, lg: 6 };
    return { xs: 12, md: 6, lg: 4 };  // 3+ articles
  };

  const colSize = getColSize();

  return (
    <Container fluid className="my-4">
      <h1>Browse Books</h1>
      <Form className="mb-4">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <SourceSelect filters={filters} setFilters={setFilters} uniqueSources={uniqueSources} />
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
            <Form.Group>
              <Form.Label>Length: {lengthRange[0]} - {lengthRange[1]} characters</Form.Label>
              <Slider
                range
                min={0}
                max={2000}
                step={100}
                value={lengthRange}
                onChange={setLengthRange}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <p>Showing ({(page - 1) * articles.length + 1}-{page * articles.length } articles) of {total} articles</p>

      <Row>
        <Col xs={12}>
          <div className="articles-grid">
            {books.map(book => (
              <ArticleCard key={book.id} book={book} /> 
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