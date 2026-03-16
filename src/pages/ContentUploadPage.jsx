import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useRef } from 'react';

export default function ContentUploadPage() {
    const titleRef = useRef();
    const authorRef = useRef();
    const chapterTitleRef = useRef();
    const chapterNumberRef = useRef();
    const textRef = useRef();

    function handleSubmit(e) {
        e?.preventDefault();

        const formData = {
            title: titleRef.current.value,
            author: authorRef.current.value,
            chapter_title: chapterTitleRef.current.value,
            chapter_num: parseInt(chapterNumberRef.current.value),
            text: textRef.current.value
            }

        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        let url = `${API_URL}/admin/upload-content`;
        
        
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(res => {
            if (res.status === 200) {
                alert("Submission Successful");
                titleRef.current.value = '';
                authorRef.current.value = '';
                chapterTitleRef.current.value = '';
                chapterNumberRef.current.value = '';
                textRef.current.value = '';
            } else {
                alert("Submission failed. Please check all fields.");
            }
        })
        .catch(error => {
            alert("Network error: " + error.message);
        })
    }


    return (
        <Container className="my-5" style={{textAlign: "left"}}>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Book Title</Form.Label>
                        <Form.Control ref={titleRef} placeholder="Enter Book Title" />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Author</Form.Label>
                        <Form.Control ref={authorRef} placeholder="Enter Author" />
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Chapter Title</Form.Label>
                        <Form.Control ref={chapterTitleRef} placeholder="Enter Chapter Title" />
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Chapter Number</Form.Label>
                        <Form.Control ref={chapterNumberRef} placeholder="Enter Chapter Number" />
                    </Form.Group>
                </Row>
                <Form.Group>
                    <Form.Label>Chapter Text</Form.Label>
                    <Form.Control ref={textRef} as="textarea" rows={10} placeholder='Enter Chapter Text' />
                </Form.Group>
                <Button>Submit</Button>
            </Form>
        </Container>
    );
}