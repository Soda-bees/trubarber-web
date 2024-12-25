// import React from 'react'

// type Props = {
//   chatId: string | null
// }

// const ChatMessage = ({ chatId }: Props) => {
//   return (
//     <div className='bg-yellow-500 w-full h-full '>
//       {`ChatMessage ${chatId}`}
//     </div>
//   )
// }

// export default ChatMessage



// import React, { useState, useRef, useEffect } from 'react';

// type Props = {
//   chatId: string | null;
// };

// const ChatMessage = ({ chatId }: Props) => {
//   const messageInputRef = useRef<HTMLInputElement>(null);
//   const messageContainerRef = useRef<HTMLDivElement>(null);

//   // Function to scroll to the bottom of the messages
//   const scrollToBottom = () => {
//     if (messageContainerRef.current) {
//       messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, []);

//   return (
//     <div className="h-full w-full flex flex-col">
//       {/* Header with user name */}
//       <div className="bg-blue-500 py-4 px-6">
//         <h1 className="text-white text-xl font-bold">{"userName"}</h1>
//       </div>

//       {/* Scrollable message section */}
//       <div
//         ref={messageContainerRef}
//         className="flex-1 p-4 overflow-auto bg-red-500"
//       >
//         {/* Replace with dynamic messages */}
//         {
//           [...Array(2)].map((_, index) => (
//             <div key={index} className="mb-2">message {index + 1}</div>
//           ))
//         }
//       </div>

//       {/* Bottom send message section */}
//       <div className="bg-gray-200 flex items-center p-4">
//         <input
//           type="text"
//           placeholder="Type a message"
//           ref={messageInputRef}
//           className="flex-1 border rounded p-2 mr-2"
//         />
//         <button
//           onClick={() => console.log('Send message')}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;

import React, { useState, useRef, useEffect } from 'react';
import { selectUser } from '../../Store/userDataSlice';
import { useSelector } from 'react-redux';

type Props = {
  chatId: string | null;
};

const ChatMessage = ({ chatId }: Props) => {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const userData = useSelector(selectUser)

  const [chatName, setChatName] = useState<string>('')

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    if (chatId) {
      handleSetChatName()
    }
  }, [chatId]);

  const handleSetChatName = async () => {
    const chat = userData?.chat?.find((chat: any) => chat?._id === chatId)
    userData?.role === 'user' ? setChatName(chat?.barber?.name) : setChatName(chat?.user?.name);
  }

  const rowRenderer = ({ index, style }: { index: number; style: any }) => (
    <div style={style} className="mb-2">
      {`message ${index + 1}`}
    </div>
  );

  const rowCount = 10000; // Number of messages you want to load at a time
  const rowHeight = 50;   // Height of each row/message

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header with user name */}
      <div className="bg-blue-500 py-4 px-6">
        <h1 className="text-white text-xl font-bold">{chatName}</h1>
      </div>

      {/* Scrollable message section */}
      <div
        ref={messageContainerRef}
        className="flex-1 p-4 overflow-auto bg-red-500 flex flex-col"
      >
        {
          [...Array(200)].map((_, index) => (
            <div key={index} className="mb-2">message {index + 1}</div>
          ))
        }
      </div>

      {/* Bottom send message section */}
      <div className="bg-gray-200 flex items-center p-4">
        <div className="flex-1"></div> {/* Spacer for remaining space */}
        <input
          type="text"
          placeholder="Type a message"
          ref={messageInputRef}
          className="border rounded p-2 mr-2"
        />
        <button
          onClick={() => console.log('Send message')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
