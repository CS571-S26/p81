import { Container } from 'react-bootstrap';

export default function ResourcesPage() {
  return (
    <Container className="my-4" style={{textAlign: 'left'}}>
      <h1>Learning Resources</h1>
      <h3>Grammar: </h3>
      <ul>
        <li><a href="https://resources.allsetlearning.com/chinese/grammar">Chinese Grammar Wiki</a></li>
        <li><a href="https://mandarinbean.com/grammar-points/">Mandarin Bean</a></li>
      </ul>
      <h3>Readers similar to Jīngdú but better support for beginner and intermediate levels:</h3>
      <ul>
        <li><a href="https://duchinese.net/lessons">Du Chinese</a></li>
        <li><a href="https://www.thechairmansbao.com/lessons/">The Chairman's Bao</a></li>
      </ul>
    </Container>
  );
}