/* eslint-disable no-param-reassign */
import React, { useState } from "react";
import PropTypes, { string } from "prop-types";
import { useSelector, useDispatch } from 'react-redux';
import { DropzoneArea } from 'material-ui-dropzone';
import WebSocketMessage from "./WebSocketMessage";
import { WebSocketWindowProps } from "../../../types"
import ImageDropzone from '../../components/display/ImageDropzone'
// import * as actions from "../../../../src/client/actions/actions.js";
const { api } = window;

const WebSocketWindow :React.SFC<WebSocketWindowProps> = ({ content, outgoingMessages, incomingMessages, connection }) => {

  const [inputMessage, setInputMessage] = useState('');
  const [inputImg, setInputImg] = useState('')
 

  //updates the outgoing message when it changes
  const updateOutgoingMessage = (value: any) => {
   if (value.includes('data:image/')) setInputImg (value);
   else setInputMessage(value);
  }

  //sends to WScontroller in main.js to send the message to server
  const sendToWSController = () =>  {
     if (inputMessage) {
       api.send("send-ws", content, inputMessage);
       setInputMessage('')
       setInputImg("")
     }
     if (inputImg) {
      api.send("send-ws", content, inputImg);
      setInputImg("")
      setInputMessage('')
     }
   
    //reset inputbox
    
  }

  const handleFileChange = async (file:any)=>{
    console.log('file==>', file)
    const img = file[0]
    console.log('image-->',img)
   
    
    //const imageSrc = URL.createObjectURL(file)

    const dataURL = (file:any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
    
     const data:any = await dataURL(img);
     
    // const buffer = Buffer.from(data, "utf8");
    // console.log(buffer)
    
 
    updateOutgoingMessage(data) //file is 
  }

  //when you press enter send the message, send message to socket
  const handleKeyPress = (event: {key: string}) => {
    if (event.key === "Enter") {
      sendToWSController();
    }
  }
  //maps the messages to view in chronological order and by whom - self/server
  const combinedMessagesReactArr = outgoingMessages
      .map((message) => {
        message.source = "client";
        
        return message;
      })
      .concat(
        incomingMessages.map((message) => {
          message.source = "server";
          
          return message;
        })
      )
      //sorts by time
      .sort((a, b) => a.timeReceived - b.timeReceived)
      //then maps the combined array to a WebSocket Component
      //conditionally rendering messages or images
      .map((message, index) => (
        
        <WebSocketMessage
          key={index}
          index={index}
          source={message.source}
          data={message.data}
          timeReceived={message.timeReceived}
        />
      ));
    
    //sets the message style depending on if the connection is open
    //hides when connection is not open
    const messageInputStyles = {
      display: connection === "open" ? "block" : "none",
    };


    //exports the chatLog- sends it to the backend
    const exportChatLog = (event:any) => {
      api.send("exportChatLog", outgoingMessages, incomingMessages
      
      
      );
    }

    return (
      <div style={{}} className="websocket_container is-tall is-flex is-flex-direction-column m-3">
        <div className="is-flex is-align-items-center">
         
          <input
            className="ml-1 mr-1 input is-small"
            value={inputMessage}
            onKeyPress={handleKeyPress}
            placeholder="Message"
            onChange={(e) => updateOutgoingMessage(e.target.value)}
          />
          <button
            className="button is-primary is-outlined is-small"
            onClick={sendToWSController}
            type="button"
          >
            Send Message
          </button>
         
         </div>
          {/* <input
            className="ml-1 mr-1 input is-small"
            type='file'
            onKeyPress={handleKeyPress}
            onChange={onFileChange}
          /> */}
        <div className="is-flex is-align-items-center">
          <ImageDropzone onFileChange={handleFileChange}/>
          <button
            className="button is-primary is-outlined is-small"
            onClick={sendToWSController}
            type="button"
          >
            Send image
          </button>

        </div>
          

        
        {/* only show the ws messages when connection is open */}
        {connection === "open" && (
          <div className="overflow-parent-container">
            <div className="websocket_message_container m-3">
              {combinedMessagesReactArr}
            </div>
          </div>
        )}
      <button className="button is-primary is-outlined is-small" onClick={exportChatLog} type="button">Export Log</button>
      </div>
    );
}

WebSocketWindow.propTypes = {
  outgoingMessages: PropTypes.array.isRequired,
  incomingMessages: PropTypes.array.isRequired,
  content: PropTypes.any.isRequired,
  connection: PropTypes.string.isRequired,
};

export default WebSocketWindow;
