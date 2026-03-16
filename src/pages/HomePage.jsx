import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageHeader from '../components/PageHeader';
import ArticleCard from '../components/ArticleCard';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // fetch('http://localhost:8000/articles?limit=3')
    fetch(`${API_URL}/articles?limit=3`)
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles);
      })
      .catch(error => {
        console.error('Error fetching:', error);
      });
  }, []);

  return (
    <Container className='my-4'>
      <PageHeader />
      <p className="text-center">Get started with one of these {articles.length} featured articles!</p>
      
      <Row>
        {articles.map(article => (
          <Col key={article.id} xs={12} md={6} lg={4}>
            <ArticleCard article={article} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}