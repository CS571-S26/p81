import { Container } from 'react-bootstrap';

export default function AboutPage() {
  return (
    <Container className="my-5" style={{textAlign: "left"}}>
      <h1>About Jīngdú (精读)</h1>
      
      <p className="lead">
        Jīngdú is a Chinese reading platform designed for high-intermediate to advanced learners who are ready to engage with authentic Chinese content.
      </p>

      <h2 className="mt-4">Who Is This For?</h2>
      <p>
        HSK 5+ or those looking for a challenge. This platform bridges the gap between textbook Chinese and the real-world content that native speakers read every day.
      </p>

      <h2 className="mt-4">Our Philosophy</h2>
      <p>
        <strong>Read Harder, Learn Faster.</strong> The best way to advance your Chinese is through extensive reading of authentic materials. News articles, opinion pieces, and cultural commentary expose you to natural language patterns, contemporary vocabulary, and the way Chinese is actually used in context.
      </p>

      <h2 className="mt-4">What Makes Jīngdú Different?</h2>
      <p>
        Every article is analyzed to show you its HSK difficulty level, vocabulary breakdown, and word frequency. Hover over any word to see its definition, pinyin, and HSK level without breaking your reading flow. Filter articles by difficulty and length to find content that challenges you without overwhelming you.
      </p>

      <p>
        All content is curated from authentic Chinese news sources, ensuring you're reading the same material that native speakers engage with daily.
      </p>

      <h2 className="mt-4">How Article Difficulty is Scored</h2>
      <p>
        Each article receives a difficulty score from 1 to 9 based on the HSK vocabulary distribution within the text. The score reflects the cumulative percentage of words at each HSK level:
      </p>
      <ul>
        <li><strong>HSK 1-3:</strong> Articles where most vocabulary comes from beginner levels receive lower scores (1-3)</li>
        <li><strong>HSK 4-5:</strong> Intermediate articles with a mix of basic and intermediate vocabulary score in the middle range (4-6)</li>
        <li><strong>HSK 6+:</strong> Advanced articles containing significant amounts of HSK 6+ vocabulary and words outside the HSK system score higher (7-9)</li>
      </ul>
      <p>
        <strong>Note:</strong> Because Jīngdú focuses on authentic news content written for native speakers, most articles score 6 or higher. This is expected and reflects the natural difficulty of real-world Chinese media. If you're consistently finding articles too challenging, this is a sign you may benefit from building more foundational vocabulary before extensive reading practice.
        Please check out some suggested resources <a href="https://jingdu.app/resources">here</a> to better help you.
      </p>

      <h2 className="mt-4">Start Reading</h2>
      <p>
        Browse our collection of articles, choose something that interests you, and start building the reading skills that will take your Chinese to the next level.
      </p>

      <h2 className="mt-4">Coming Soon!</h2>
      <ul>
        <li>Article category tagging (such as international, finance, sports, etc.)</li>
        <li>Optimized hoover tooltip - Handle edge cases more gracefully</li>
        <li>Mobile View</li>
        <li>More news sources</li>
        <li>Different types of content (such as blogs or public domain books)</li>
      </ul>
    </Container>
  );
}