import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Col, Row, Card, Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './Background.css';
import './Exam.css'
import {  useNavigate } from 'react-router-dom';
import ShowResult from '../ShowResult/ShowResult';

function Exam() {
  const [questionsData, setQuestionsData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const [timer, setTimer] = useState(1800); // 30 minutes in seconds
  const [testId, setTestId] = useState(null);

  const [tData, setTData]= useState();
  const [decodeData, setDecodeData] = useState(null);

  const [showResult, setShowResult] = useState(false);

  const [resultData, setResultData] = useState(null); 

const navigate = useNavigate();
  const handleOptionSelect = (selectedOption) => {
    const updatedSelectedAnswers = [...selectedAnswers];
    updatedSelectedAnswers[currentQuestion] = selectedOption;
    setSelectedAnswers(updatedSelectedAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSkip = () => {
    if (!skippedQuestions.includes(currentQuestion)) {
      setSkippedQuestions([...skippedQuestions, currentQuestion]);
    }
    handleNext();
  };

  const getQuestionStatus = (index) => {
    if (selectedAnswers[index] !== undefined) {
      return 'attempted';
    } else if (skippedQuestions.includes(index)) {
      return 'skipped';
    } else {
      return 'unanswered';
    }
  };
 

  const handleSubmit = async () => {
    const data = {
        userName: decodeData?.data?.studentName,
        emailId: decodeData?.data?.emailId,
        userAnswers: selectedAnswers,
    };

    try {
        const apiUrl = `https://rfc2rnvg-5000.inc1.devtunnels.ms/result/${testId}`;

        const response = await axios.post(apiUrl, data);
        const responseData = response.data;

        if (response.status === 200) {
          console.log('Submission successful:', responseData);
          setResultData(responseData); // Store result data in state
          setShowResult(true);           
           
        } else {
            console.error('Unexpected status code:', response.status);
            // Handle unexpected status codes
        }
    } catch (error) {
        console.error('Error submitting answers:', error);
        // Handle errors here
    }
};



  useEffect(() => {
    if (timer > 0) {
      const timerId = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    } else {
      handleSubmit(); // Auto-submit when the timer reaches 0
    }
  }, [timer, handleSubmit]);

  const isLastQuestion = currentQuestion === questionsData.length - 1;

  const extractTokenFromURL = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get('token');
  };

  const token = extractTokenFromURL();
  console.log('JWT Token:', token);

  useEffect(() => {
    const token = extractTokenFromURL();

    if (token) {
      try {
        const decodeData = jwtDecode(token);
        console.log('Decoded Token:', decodeData);
        setDecodeData(decodeData);

        const test_id = decodeData?.data.testId;

        axios
          .get(`https://rfc2rnvg-5000.inc1.devtunnels.ms/test/${test_id}`)
          .then((res) => {
            const responseData = res.data.data;
            console.log(responseData[0].QuestionSet);
            setQuestionsData(responseData[0].QuestionSet);
            setSelectedAnswers(Array(responseData[0].QuestionSet.length).fill(undefined));
            setTestId(test_id);
          })
          .catch((error) => {
            console.error('Error fetching questions:', error);
          });
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);


  



  return (
    <div className="main">
      <div className="box">
        <div className="wave -one"></div>
        <div className="wave -two"></div>
        <div className="wave -three"></div>
      </div>
      {showResult ? (
          <ShowResult resultData={resultData} />
      ) : (
      <Container className="exam-dashboard-container d-flex justify-content-center align-items-center h-100">
        <Card className="d-flex justify-content-center align-items-center p-4 mb-0 bgCard qsWidth">
          <Row className="qsWidth">
            <Col md={12}>
              <Card className="left-card mb-4">
                <Card.Body className="p-0">
                  <Card.Title className="d-flex justify-content-between align-items-center mb-0">
                    <h5 className="fw-bold mb-0 p-0">Subject: {decodeData?.data?.testId}</h5>
                    <div className="timer">
                      <h6 className="mb-0">Time Left :</h6>
                      <p className="mb-0">
                        {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                      </p>
                    </div>
                  </Card.Title>
                  <Form>
                    <Form.Group></Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="qsWidth">
            <Col md={8} sm={12}>
              <Card className="left-card mb-4">
                <Card.Body>
                  <Card.Title>
                    <h5>{questionsData?.length > 0 && questionsData[currentQuestion]?.question}</h5>
                  </Card.Title>
                  <Form>
                    <Form.Group>
                      {questionsData &&
                        questionsData[currentQuestion]?.option.map((option, index) => (
                          <div key={index} onClick={() => handleOptionSelect(option)}>
                            <Form.Check
                              type="radio"
                              label={option}
                              value={option}
                              checked={selectedAnswers[currentQuestion] === option}
                            />
                          </div>
                        ))}
                    </Form.Group>
                  </Form>
                </Card.Body>
                <Card.Footer className="button-container bg-white pt-4">
                  <Button variant="secondary" onClick={handlePrevious} disabled={currentQuestion === 0}>
                    Previous
                  </Button>

                  {isLastQuestion ? (
                    <Button variant="primary" onClick={handleSubmit}>
                      Submit
                    </Button>
                  ) : (
                    <Button variant="info" onClick={handleSkip}>
                      Next
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            </Col>
            <Col md={4} className="d-none d-lg-block d-md-block">
              <Card className="mb-4">
                <Card.Body className="p-3">
                  <h5 className="text-center fw-bold">Answers Status</h5>
                  <div className="question-status">
                    {questionsData?.map((_, index) => (
                      <Badge
                        key={index}
                        className={`question-circle ${getQuestionStatus(index)}`}
                        onClick={() => setCurrentQuestion(index)}
                      >
                        {index + 1}
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
                <Card.Footer className="p-0">
                  <div className="indicator bg-white">
                    <ul className="d-flex flex-column gap-2">
                      <li className="indicator-points">
                        <div className="circle attempted"></div>
                        <h6>Attempted</h6>
                      </li>
                      <li className="indicator-points">
                        <div className="circle skipped"></div>
                        <h6>Not Attempted</h6>
                      </li>
                    </ul>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Card>
      </Container>
      )}
    </div>
  );
}

export default Exam;
