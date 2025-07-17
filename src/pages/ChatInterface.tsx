// ChatInterface.tsx
import React from 'react';

type Message = {
  id: number;
  sender: 'AI' | 'Raj';
  text: string;
};

const chatData: Message[] = [
  { id: 1, sender: 'AI', text: 'Hi, I am Suman AI. How are you doing today?' },
  { id: 2, sender: 'Raj', text: 'Hi, I’m Ravi. I’m doing great, thanks!' },
  { id: 3, sender: 'AI', text: 'Can you please give a brief introduction about yourself?' },
  { id: 4, sender: 'Raj', text: 'Sure! I have over 5 years of experience as a MERN Stack Developer and currently work as a Software Engineer at XYZ organization.' },
  { id: 5, sender: 'AI', text: '1. What is the MERN stack and why is it popular?' },
  { id: 6, sender: 'Raj', text: 'MERN stands for MongoDB, Express.js, React.js, and Node.js. It’s popular because it uses JavaScript throughout the stack.' },
  { id: 7, sender: 'AI', text: '2. How does MongoDB differ from relational databases?' },
  { id: 8, sender: 'Raj', text: 'MongoDB stores data in JSON-like documents, while relational databases use tables and schemas.' },
  { id: 9, sender: 'AI', text: '3. What are the key features of React for front-end development?' },
  { id: 10, sender: 'Raj', text: 'React provides a component-based structure, virtual DOM, and one-way data binding that simplify UI development and boost performance.' },
  { id: 11, sender: 'AI', text: '4. How is middleware used in Express.js?' },
  { id: 12, sender: 'Raj', text: 'Middleware functions handle HTTP requests and can modify or end the request-response cycle, or pass control to the next function.' },
  { id: 13, sender: 'AI', text: '5. What is Node.js and what role does it play in the MERN stack?' },
  { id: 14, sender: 'Raj', text: 'Node.js runs JavaScript on the server, enabling backend operations using a non-blocking, event-driven model.' },
  { id: 15, sender: 'AI', text: '6. What are Mongoose schemas and models in MongoDB?' },
  { id: 16, sender: 'Raj', text: 'Schemas define the structure of documents in MongoDB, while models are used to create and read documents from the database.' },
  { id: 17, sender: 'AI', text: '7. What is the difference between state and props in React?' },
  { id: 18, sender: 'Raj', text: 'Props are inputs to a component, while state is data managed within the component itself and can change over time.' },
  { id: 19, sender: 'AI', text: '8. How do you handle API requests in React?' },
  { id: 20, sender: 'Raj', text: 'I use the Fetch API or Axios inside useEffect hooks to call APIs, then update state with the response data.' },
  { id: 21, sender: 'AI', text: '9. What is the purpose of Redux in a MERN application?' },
  { id: 22, sender: 'Raj', text: 'Redux is used for centralized state management, making it easier to manage and share state across components.' },
  { id: 23, sender: 'AI', text: '10. Can you explain the MVC architecture and how it relates to MERN?' },
  { id: 24, sender: 'Raj', text: 'MVC separates concerns: React is the View, Express + Node handle the Controller, and MongoDB stores data as the Model.' }
];

const ChatInterface: React.FC = () => {
  return (
    <div style={styles.chatContainer}>
      {chatData.map((message) => (
        <div
          key={message.id}
          style={{
            ...styles.message,
            alignSelf: message.sender === 'AI' ? 'flex-start' : 'flex-end',
            backgroundColor: message.sender === 'AI' ? '#e3f2fd' : '#ffe0b2',
          }}
        >
          <strong>{message.sender}:</strong> {message.text}
        </div>
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
