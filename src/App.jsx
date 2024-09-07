import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from '@chatscope/chat-ui-kit-react'

const API_KEY = process.env.React_App_open_api_key;
function App() {
  const [typing, setTyping]=useState(false);
  const [messages, setMessages] = useState([
    {
      message:"Hello,I am ChatGPT !",
      sender: "ChatGPT"
    }
  ])
 
  const handleSend = async (message)=>{
    const newMessage ={
      message:message,
      sender: "user",
      direction: "outgoing"
    }
  
  const newMessages =[...messages,newMessage];//all the old messages,+ new messages
  
    //update our messages state
    setMessages(newMessages);
    //set a typing indicator (chatgpt is typing)
    //setTyping(True);
    //process message to chatGpt (send it over and see the response)
    await processMessageToChatGPT(newMessages);
  
  }
  async function processMessageToChatGPT(chatMessages){
    //chatMessages {sender: "user" or "ChatGPT",message:" The message content here"}
  //apiMessages{role:"user" or "assistant", content :"The message content here"}
let apiMessages = chatMessages.map((messageObject)=>{
  let role = "";
  if(messageObject.sender === "ChatGPT"){
    role="assistant"
  } else{
    role= "user"
  }
  return { role: role, content: messageObject.message}
});  
//role:"user"-> amessage from the user ,"assistant"-> a response from chatGPT
//"System"-> generally one initial message defining How we want chatgpt to talk
const SystemMessage ={
  role:"system",
  content:"Explain all concept like I am 5 years old."
}
const apiRequestBody={
  "model": "gpt-3.5-turbo",
  "messages": [
    SystemMessage,
    ...apiMessages//[message1,message2,message3]
  ]
}
await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers:{
    "Authorization":"Bearer " + API_KEY,
    "Content-Type":"application/json"
  },
  body:JSON.stringify(apiRequestBody)
}).then((data)=>{
  return data.json();
}).then((data)=>{
  console.log(data);
  console.log(data.choices[0].message.content);
  setMessages(
    [...chatMessages,{
      message: data.choices[0].message.content,
      sender:"ChatGPT"
    }]
  );
  setTyping(false);
})
}
  return (
    <>
      <div className='App'>
      <div style={{position:"relative"}}>
        <MainContainer>
        <ChatContainer>
        <MessageList
        scrollBehavior='smooth'
         typingIndicator={typing?<TypingIndicator content="ChatGPT is typing"/> : null}>
          {messages.map((message,i)=>{
            return<Message key={i} model={message}/>
          })}
        </MessageList>
<MessageInput placeholder='Type message here' onSend={handleSend} />
        </ChatContainer>
        </MainContainer>
      </div>
        
        </div>
    </>
  )
}

export default App
