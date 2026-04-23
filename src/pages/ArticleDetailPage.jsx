import { Container, Table, Form, Row, Col, Button, Badge, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { s2t } from 'chinese-s2t';

function convertToNumber(hskLevel) {
  if (hskLevel.startsWith("new")) {
    return parseInt(hskLevel.slice(-1));
  } else {
    return 8;
  } 
};


export default function ArticleDetailPage() {
  const { id } = useParams();  
  const [article, setArticle] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [sortCol, setSortCol] = useState('frequency');
  const [sortDirection, setSortDirection] = useState('desc');
  const [minHSKLevel, setMinHSKLevel] = useState(4);
  const [maxHSKLevel, setMaxHSKLevel] = useState(8);
  const [itemsToShow, setItemsToShow] = useState(20);
  const [enableTooltip, setEnableTooltip] = useState(true);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({x: 0, y: 0});
  const [displayTraditional, setDisplayTraditional] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // fetch(`http://localhost:8000/articles/${id}`)
    fetch(`${API_URL}/articles/${id}`)
      .then(res => res.json())
      .then(data => {
        // console.log("article data: ", data.article);   // Use for debugging
        console.log("analysis data: ", data.analysis); // Use for debugging
        setArticle(data.article);
        setAnalysis(data.analysis);
      });
  }, [id]);

  useEffect(() => {
    if (!enableTooltip) return;
    
    const handleMouseMove = (e) => {
      // Check if mouse is currently over a vocab word
      const element = document.elementFromPoint(e.clientX, e.clientY);
      
      if (!element || !element.classList.contains('vocab-word')) {
        // Not hovering over vocab word - hide tooltip
        setHoveredWord(null);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enableTooltip]);

  if (!article || !analysis) return <p>Loading...</p>;

  const articleSplit = article.text.split("\n");
  const analysisData = JSON.parse(analysis.hsk_data);

  // Filter vocabulary for table
  const filtered = analysisData.vocabulary.filter((word) => {
            const wordLevel = convertToNumber(word.hsk_level);
            return wordLevel >= minHSKLevel && wordLevel <= maxHSKLevel;
          });
    

  // Sort vocabulary for table
  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;

    let comparison;

    // Get comparison value
    if (typeof a[sortCol] === 'number') {
      comparison = a[sortCol] - b[sortCol];  // Ascending
    } else {
      comparison = a[sortCol].localeCompare(b[sortCol]);  // Ascending
    }
    
    // Flip if descending
    return sortDirection === 'asc' ? comparison : -comparison;
    })

  const displayed = sorted.slice(0, itemsToShow);


  const onSort = (sortKey) => {
    let newDirection;
    if (sortCol === sortKey) {
      newDirection = (sortDirection === 'asc') ? 'desc' : 'asc';
    } else {
      newDirection = 'asc';
    }

    setSortCol(sortKey);
    setSortDirection(newDirection);
  };

  // HSK Levels for buttons
  const hskLevels = [
    { value: 1, label: 'HSK 1' },
    { value: 2, label: 'HSK 2' },
    { value: 3, label: 'HSK 3' },
    { value: 4, label: 'HSK 4' },
    { value: 5, label: 'HSK 5' },
    { value: 6, label: 'HSK 6' },
    { value: 7, label: 'HSK 7' },
    { value: 8, label: 'Not in HSK' }
  ];

  const vocabMap = new Map();
  analysisData.vocabulary.forEach(word => {
    vocabMap.set(word.word, word);
  });

  const displayVocabMap = displayTraditional 
    ? new Map(
        Array.from(vocabMap.entries()).map(([key, value]) => [
          s2t(key),
          value
        ])
      )
    : vocabMap;

  function matchVocabInText(text) {
    const segments = [];
    let position = 0;
    const maxWordLength = Math.max(
      ...analysisData.vocabulary.map(w => w.word.length)
    );

    while (position < text.length) {
      let matched = false;

      // Try longest matches first
      for (let len = maxWordLength; len >= 1; len--) {
        const substring = text.slice(position, position + len);

        if (displayVocabMap.has(substring)) {
          segments.push({
            type: 'vocab',
            word: displayVocabMap.get(substring),
            text: substring
          });
          position += len;
          matched = true;
          break;  
        }
      }

      // If no match found, add as plain text
      // Handles cases like punctuation, english, etc.
      if (!matched) {
        segments.push({
          type: 'plain',
          text: text[position]
        });
        position += 1;
      }
    }

    return segments;
  }

  function renderArticleWithTooltip(text) {
    const segments = matchVocabInText(text);
    
    return segments.map((segment, index) => {
      if (segment.type === 'vocab') {
        return (
          <VocabWord 
            key={index} 
            wordData={segment.word}
            onHover={handleWordHover}
            onLeave={() => setHoveredWord(null)}
          >
            {segment.text}
          </VocabWord>
        );
      } else {
        return <span key={index}>{segment.text}</span>;
      }
    });
  }


  const handleWordHover = (wordData, e) => {
    setHoveredWord(wordData);
    
    // Smart positioning
    const tooltipWidth = 250;
    const tooltipHeight = 150;
    
    let x = e.clientX + 20;
    let y = e.clientY + 20;
    
    // Adjust if off-screen
    if (x + tooltipWidth > window.innerWidth) {
      x = e.clientX - tooltipWidth - 10;
    }
    if (y + tooltipHeight > window.innerHeight) {
      y = e.clientY - tooltipHeight - 10;
    }
    
    setTooltipPos({x, y});
  };

  function VocabWord({ wordData, children, onHover, onLeave }) {
    return (
      <span 
        className="vocab-word"
        onMouseEnter={(e) => onHover(wordData, e)}  
        onMouseLeave={onLeave}
        style={{
        // textDecoration: 'underline dotted', // Only for debugging
        // cursor: 'pointer',                     // Only for debugging
        // color: '#0066cc'                     // Only for debugging
        // Test for highlighting characters
        // backgroundColor: 'blue',
        // color: 'white'
      }}
      >
        {children}
      </span>
    );
  }

  function getDefinitionText(word) {
    // If has definition, return it
    if (word.definition) {
      return word.definition;
    }
    
    // Check if number-measure word pattern
    const numberMeasurePattern = /^[一二三四五六七八九十百千万亿零]+[个位名口具户只头匹条棵株朵把支根张团堆颗粒扇包卷封桶盒束本份件节门次场段阵刻番席趟间栋层堵面所家座片块道顿碗盘笼滴杯瓶壶罐股床盏幅帧套顶双副对些种群众组帮班排队列项串打叠句首通篇则出部台辆架艘秒分天日周年代斤吨磅坪毛笔寸尺里升斗度]+$/;
    if (word.word.match(numberMeasurePattern)) {
      return "(Number + measure word)";
    }
    
    // Default
    return "Definition not available";
  }

  function cleanPinyin(pinyin) {
    if (!pinyin) return 'No pinyin';
    return pinyin.replace(/[\[\]]/g, '');
  }


  return (
    <>
      <Container className="my-4">
        {displayTraditional 
          ? 
            <h1>
              {s2t(article.title)}
            </h1>
          : <h1>
              {article.title}
            </h1>
          }
        <p>Source: {article.source}</p>
        <p>Published on {article.published_at}</p>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Link: {article.url}
        </a>
        <br/>
        <br/>
        <Stack>
          <Badge pill bg="warning" text="dark">
            Scored HSK Level: {analysisData.difficulty_score}
          </Badge>
          <Badge pill bg="dark" text="Light">
            Category: {article.category}
          </Badge>
        </Stack>
        <Form>
          <Form.Check
            type="switch"
            label="Enable hover word lookup"
            checked={enableTooltip}
            onChange={(e) => setEnableTooltip(e.target.checked)}
            style={{textAlign: 'left'}}
          />
        </Form>
        <Form>
          <Form.Check
            type="switch"
            label="繁體"
            checked={displayTraditional}
            onChange={(e) => setDisplayTraditional(e.target.checked)}
            style={{textAlign: "left"}}
          />
        </Form>
        {enableTooltip 
          ? articleSplit.map((paragraph, index) => {
              // Convert to Traditional if needed
              const textToDisplay = displayTraditional ? s2t(paragraph) : paragraph;
              
              return (
                <p key={index} style={{textAlign: "left"}}>
                  {renderArticleWithTooltip(textToDisplay)}
                </p>
              );
            })
          : articleSplit.map((paragraph, index) => {
              // No tooltips, just text (with optional conversion)
              const textToDisplay = displayTraditional ? s2t(paragraph) : paragraph;
              
              return (
                <p key={index} style={{textAlign: "left"}}>
                  {textToDisplay}
                </p>
              );
            })
        }
      </Container>
      {hoveredWord && (
        <div className="tooltip-box" style={{
          position: 'fixed',
          top: `${tooltipPos.y}px`,   // Use calculated position
          left: `${tooltipPos.x}px`,
          pointerEvents: 'none',      // Cursor moves through the tooltip (Doesn't interact with the tooltip)
          background: 'white',
          border: '1px solid #ccc',
          padding: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}>
          {/* <strong>{displayTraditional ? s2t(hoveredWord.word) : hoveredWord.word}</strong> */}
          <strong>{hoveredWord.word}</strong>
          <br/>  
          <strong>{s2t(hoveredWord.word)}</strong>
          {/* <div><em>{hoveredWord.pinyin || 'No pinyin'}</em></div> */}
          <div><em>{cleanPinyin(hoveredWord.pinyin)}</em></div>
          {/* <div>{hoveredWord.definition || 'No definition'}</div> */}
          {getDefinitionText(hoveredWord)}
          <div><small>HSK {hoveredWord.hsk_level.replace('new-', '')}</small></div>
        </div>
      )}
      <div>
        <h3>Vocabulary</h3>
          <Form className="mb-3">
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Minimum HSK Level</Form.Label>
                  <Form.Select
                    value={minHSKLevel}
                    onChange={(e) => setMinHSKLevel(parseInt(e.target.value))}
                  >
                    {hskLevels.map(level => (
                      <option 
                        key={level.value} 
                        value={level.value}
                        disabled={level.value > maxHSKLevel}
                      >
                        {level.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Maximum HSK Level</Form.Label>
                  <Form.Select
                    value={maxHSKLevel}
                    onChange={(e) => setMaxHSKLevel(parseInt(e.target.value))}
                  >
                    {hskLevels.map(level => (
                      <option 
                        key={level.value} 
                        value={level.value}
                        disabled={level.value < minHSKLevel}
                      >
                        {level.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <div className="table-responsive">
            <Table striped bordered hover>
            <thead>
              <tr>
                <th>Word</th>
                <th onClick={() => onSort('frequency')}>
                  <small>(Click to Sort)</small>
                  <br/>
                  Frequency 
                  {sortCol === 'frequency' && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
                </th>
                <th>Pinyin</th>
                <th>Definition</th>
                <th onClick={() => onSort('hsk_level')} style={{cursor: 'pointer'}}>
                  <small>(Click to Sort)</small>
                  <br/>
                  HSK Level
                  {sortCol === 'hsk_level' && (sortDirection === 'asc' ? ' ▲': ' ▼')}
                </th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(vocabWord => (
                <tr key={vocabWord.word}>
                  <td>{vocabWord.word}</td>
                  <td>{vocabWord.frequency}</td>
                  <td>{cleanPinyin(vocabWord.pinyin)}</td>
                  <td>{getDefinitionText(vocabWord)}</td>
                  <td>{vocabWord.hsk_level.replace('new-', 'HSK ')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {itemsToShow > 20 && (
          <Button variant="danger" onClick={() => setItemsToShow(itemsToShow - 20)}>
            Show Less
          </Button>
        )}

        {itemsToShow < sorted.length && (
          <Button onClick={() => setItemsToShow(itemsToShow + 20)}>
            Show More ({sorted.length - itemsToShow} remaining)
          </Button>
        )}
        <h3>Analysis</h3>
        <h4>HSK Vocabulary Distribution</h4>
        <div className="table-responsive">
          <Table striped>
            <thead>
              <tr>
                <th>Level</th>
                <th>Word Count</th>
                <th>Cumulative Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analysisData.hsk_distribution).map(([level, count]) => (
                <tr key={level}>
                  <td>{level.replace('new-', 'HSK ')}</td>
                  <td>{count}</td>
                  <td>{analysisData.hsk_percentages[level]}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
}
