import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const ChatInterface: React.FC = () => {

  const answers = useSelector((state: RootState) => state.interview.answers);

  return (
    <div style={styles.chatContainer}>
      {answers.map((message, index) => (
        <React.Fragment key={index}>
          <div
            style={{
              ...styles.message,
              alignSelf: 'flex-start',
              backgroundColor: '#e3f2fd',
            }}
          >
            <strong>AI:</strong> {message.question}
          </div>

          <div
            style={{
              ...styles.message,
              alignSelf: 'flex-end',
              backgroundColor: '#ffe0b2',
            }}
          >
            <strong>You:</strong> {message.answer || <em>(No answer)</em>}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    width: '40%',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: '0',
    fontFamily: 'Segoe UI, sans-serif',
    gap: '0.5rem',
  },
  message: {
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    maxWidth: '75%',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
};

export default ChatInterface;
