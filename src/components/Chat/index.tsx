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

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { selectUser } from '../../Store/userDataSlice';
import { useSelector } from 'react-redux';
import { FixedSizeList as List, VariableSizeList } from 'react-window';
import { motion, AnimatePresence } from "framer-motion";
import moment from 'moment';

type Props = {
  chatId: string | null;
};

const ChatMessage = ({ chatId }: Props) => {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<VariableSizeList>(null);

  const userData = useSelector(selectUser)

  const [chatName, setChatName] = useState<string>('')
  const [listHeight, setListHeight] = useState(0);

  const getDateHeader = (date: any) => {
    const today = moment().startOf('day');
    const messageDate = moment(date).startOf('day');

    if (today.isSame(messageDate, 'day')) {
      return 'TODAY';
    }

    const yesterday = today.clone().subtract(1, 'day');

    if (yesterday.isSame(messageDate, 'day')) {
      return 'YESTERDAY';
    }

    return messageDate.format('MMM D, YYYY');
  };

  const prepareData = () => {
    if (!chatId || !userData?.chat?.length) return [];

    return userData.chat
      .filter((chat: any) => chat?._id === chatId)
      .flatMap((chat: any) => chat?.messages)
      .reduce((acc: any, message: any, index: any, arr: any) => {
        const prevDate = arr[index - 1]?.createdAt;
        const currentDate = message?.createdAt;
        const currentHeader = getDateHeader(currentDate);
        const prevHeader = getDateHeader(prevDate);

        if (currentHeader !== prevHeader) {
          acc.push({ type: 'header', header: currentHeader });
        }
        acc.push({ type: 'message', ...message });
        return acc;
      }, [])
  };

  const messages = prepareData()

  useEffect(() => {
    const scrollToLastItem = () => {
      if (listRef.current) {
        listRef.current.scrollToItem(messages.length - 1, 'end');
      }
    };
    scrollToLastItem();
  }, [messages.length, listHeight, chatId]);

  useEffect(() => {
    if (chatId) {
      handleSetChatName()
    }
  }, [chatId]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatId]);

  useEffect(() => {
    const updateHeight = () => {
      if (messageContainerRef.current) {
        const parentHeight = messageContainerRef.current.clientHeight;
        setListHeight(parentHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, [chatId]);

  const handleSetChatName = async () => {
    const chat = userData?.chat?.find((chat: any) => chat?._id === chatId)
    userData?.role === 'user' ? setChatName(chat?.barber?.name) : setChatName(chat?.user?.name);
  }


  return (
    <div className='h-full'>
      {
        chatId ?
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
                type: 'tween',
                stiffness: 200,
              }}
              className='h-full'
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className="h-full w-full flex flex-col bg-red-500"
              >
                <div className=''>{chatName}</div>

                {/* <div
                  ref={messageContainerRef}
                  className="flex-1 overflow-auto bg-yellow-500 flex flex-col"
                > */}

                <div
                  ref={messageContainerRef}
                  className="flex-1 overflow-auto bg-red-500 flex flex-col "
                >
                  {
                    messages.map((item: any, index: number) => {
                      return (
                        <div key={index} 
                        className='flex flex-col'
                        // className="bg-blue-200 max-w-[70%] w-fit box-border"
                        >
                          {
                            item?.type === 'header' &&
                            <div className='bg-pink-100 text-center'>
                              {item.header}
                              </div>
                          }
                          {item.image?.length > 0 ? (
                            <div>POhoto</div>
                          ) : (
                            <div className='bg-pink-500 mt-2 w-fit max-w-[70%] self-end'>{item.text}</div>
                          )}
                        </div>
                      )
                    })
                  }
                </div>
                {/* <List
                    ref={listRef}
                    height={listHeight || 400}
                    itemCount={messages.length}
                    itemSize={50}
                    width="100%"
                    style={{ backgroundColor: 'green' }}
                  >
                    {({ index, style , item }) => (
                      <div style={{ ...style, padding: '10px', borderBottom: '1px solid #ccc' }}>
                        {'messages[index]'}
                      </div>
                    )}
                  </List>  */}

                {/* <List
                    ref={listRef}
                    height={listHeight || 400}
                    itemCount={messages.length}
                    itemSize={50}
                    width="100%"
                    style={{ backgroundColor: 'green' }}
                  >
                    {({ index, style }) => {
                      const item = messages[index]
                      console.log("item =--=>", item);

                      return (
                        <div style={{ ...style, padding: '10px', borderBottom: '1px solid #ccc' }}>
                          {
                            item?.type === 'header' && 
                            <div>{item.header}</div> 
                          }
                          {item.image?.length > 0 ? (
                            <div>POhoto</div>
                          ) : (
                            <div
                            >{item.text}</div>
                          )}
                        </div>
                      )
                    }}
                  </List> */}
                {/* <VariableSizeList
                    ref={listRef}
                    height={listHeight || 400}
                    itemCount={messages.length}
                    itemSize={getItemSize}
                    width="100%"
                    style={{ backgroundColor: 'green' }}
                  >
                    {({ index, style }) => {
                      const item = messages[index]
                      return (
                        <div style={{ ...style, borderBottom: '1px solid #ccc' }} className='bg-yellow-500'>
                          {
                            item?.type === 'header' && 
                            <div>{item.header}</div> 
                          }
                          {item.image?.length > 0 ? (
                            <div>POhoto</div>
                          ) : (
                            <div className='w-[50%] bg-red-800 mx-auto'
                            >{item.text}</div>
                          )}
                        </div>
                      )
                    }}
                  </VariableSizeList> */}


                {/* </div> */}

                <div className="bg-gray-200 flex items-center p-4">
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
              </motion.div>
            </motion.div>
          </AnimatePresence>
          : <div>no chat to show </div>
      }
    </div>
  );
};

export default ChatMessage;


{/* <List
                    ref={listRef}
                    height={listHeight || 400}
                    itemCount={messages.length}
                    itemSize={50}
                    width="100%"
                    style={{ backgroundColor: 'green' }}
                  >
                    {({ index, style }) => (
                      <div style={{ ...style, padding: '10px', borderBottom: '1px solid #ccc' }}>
                        {'messages[index]'}
                      </div>
                    )}
                  </List>  */}