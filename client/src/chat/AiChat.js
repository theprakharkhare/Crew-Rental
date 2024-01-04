import React, { useState , useEffect } from 'react';
import './style.css';
import button from "./assets/send.svg"
import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
import Header from '../components/Pages/Header';
import Footer from "../components/Footer";
import chatrobo from "../Images/chaigif.gif"

// function Loader({ element }) {
//   const [text, setText] = useState('');
  
//   setInterval(() => {
//     setText(prevText => {
//       const newText = prevText === '....' ? '' : prevText + '.';
//       element.textContent = newText;
//       return newText;
//     });
//   }, 300)

//   return null;
// }

function Loader() {
  const [text, setText] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setText(prevText => {
        const newText = prevText === '....' ? '' : prevText + '.';
        return newText;
      });
    }, 300);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <div id="loading">{text}</div>;
}



function ChatStripe({ isAi, value, uniqueId }) {
  return (
    <div className={`wrapper ${isAi && 'ai'}`}>
      <div className="chat">
        <div className="profile-user">
          <img src={isAi ? bot : user} alt={isAi ? 'bot' : 'user'} />
        </div>
        <div className="message" id={uniqueId}>
          {value}
        </div>
      </div>
    </div>
  );
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function AiChat() {

  
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("")
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData(e.target);
    const prompt = data.get('prompt');
    const uniqueId = generateUniqueId();
    setChat(prevChat => [
      ...prevChat,
      <ChatStripe key={uniqueId} isAi={false} value={prompt} />,
      <ChatStripe key={`${uniqueId}-bot`} isAi={true} value="" uniqueId={uniqueId} />
    ]);

    setIsLoading(true);
    const response = await fetch('https://codex-backend-3wci.onrender.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt
      })
    });

    setIsLoading(false);

    const messageDiv = document.getElementById(uniqueId);
    if (!messageDiv) return;

    messageDiv.innerHTML = '';
    if (response.ok) {
      const { bot } = await response.json();
      const parseData = bot.trim();
      setChat(prevChat => prevChat.map(item => {
        if (item.props.uniqueId === uniqueId) {
          return <ChatStripe key={uniqueId} isAi={true} value={parseData} uniqueId={uniqueId} />
        }
        return item;
      }));
    } else {
      const err = await response.text();
      messageDiv.innerHTML = 'Laxmikant ko bol ki AI App thik kre!!!';
      alert(err);
    }
  };

  const handleKeyDown = (e) => {

    if (e.charCode === 13 && !e.shiftKey) {
      e.preventDefault();
      console.log(e.charCode);
      handleSubmit(e);
      document.getElementById('aichatform').dispatchEvent(new Event('submit'));
    }
  }

  return (
    <>
      <Header />
      <div className="container-complete-ai">


        <div>


        </div>

        <div id="app">

          <div id="chat_container">
            {chat}
            {isLoading && <Loader element={document.getElementById('loading')} />}
            <div id="loading"></div>
          </div>
          <form id="aichatform" onSubmit={handleSubmit}>
            <textarea id="aichattext" name="prompt" onChange={(e) => { setSearchText(e.target.value) }} rows="1" cols="1" placeholder="Ask you question related to construction..." onKeyPress={handleKeyDown}></textarea>
            <button id="aichatbutton" type="submit"><img src={button} alt="Send" /></button>
          </form>
        </div>
        <div className="hero-section-chat">

          <h1 style={{ fontFamily: "revert-layer", fontweight: "1000", fontSize: "50px" }}>Ask me Anything😊😎 </h1>

          <img
            src={chatrobo}
            alt="hero-section-photo"
            className="img-style"
          />

        </div>
      </div>
      <Footer />
    </>
  );
}

export default AiChat;
