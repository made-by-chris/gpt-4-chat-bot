import React, { useState } from 'react';
import OpenAI from 'openai';

function ChatApp() {
    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });
    const [messages, setMessages] = useState([
        { role: 'system', content: 'You are an expert about BMW cars' }
    ]);
    const [userInput, setUserInput] = useState('');

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!userInput.trim()) return;

        const newMessage = { role: 'user', content: userInput };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);

        try {
            console.log(openai)
            const params = {
                model: 'gpt-3.5-turbo',
                // @ts-ignore
                messages,	
                stream: false,
              }
              const response = await openai.chat.completions.create( params );
            console.log(response)
            const botMessage = { role: 'assistant', content: response.choices[0].message.content };
            const updatedMessages = [...messages, botMessage];
            setMessages(updatedMessages);

        } catch (error) {
            console.error('Error fetching response:', error);
        }

        setUserInput('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={userInput} onChange={handleInputChange} />
                <button type="submit">Send</button>
            </form>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        <strong>{message.role}:</strong> {message.content}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChatApp;
