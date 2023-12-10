import React, { useState, useEffect } from 'react';
import styles from '../ShowResult/ShowResult.module.css'; // Import the module CSS

function ShowResult({ resultData }) {
    const [isPassed, setIsPassed] = useState(false);

    useEffect(() => {
        // Assuming you have a function to determine if the student passed
        const calculateResult = () => {
            // Use the resultData from the API response to determine if the student passed
            const hasPassed = resultData.result === 'Pass'; // Adjust based on your API response
            setIsPassed(hasPassed);

            // Log the resultData to the console
            console.log('Result Data:', resultData);
        };

        calculateResult();
    }, [resultData]);

    return (
        <div
            className={`${styles.resultContainer} ${isPassed ? styles.passed : styles.failed}`}
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100vh',
                flexDirection: 'column',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Added box shadow
            }}
        >


            <div style={{
                backgroundColor: '#ffff',
                padding: '30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                zIndex:'222',
                boxShadow:'2px 2px 2px 2px ',
                borderRadius:'8px',
                minWidth:'600px',
                minHeight:'300px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Modified box shadow
                gap:'30px',


            }}>
                <h1>{isPassed ? 'Congratulations!' : 'Sorry, you did not pass.'}</h1>

                {/* <p>Message: {resultData.message}</p> */}
                {/* <p>Correct Answers Count: {resultData.correctAnswersCount}</p> */}
                <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                <h2 style={{fontSize:'26px',fontWeight:'400',fontFamily:'Inter'}}>Your Score: {resultData.score}</h2>
                <h3 style={{fontSize:'26px',fontWeight:'400',fontFamily:'Inter'}}>Result: {resultData.result}</h3>
                </div>
            </div>
        </div>
    );
}

export default ShowResult;
