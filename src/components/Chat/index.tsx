import React, { useState, useRef, useEffect, useCallback } from 'react';
import { selectUser } from '../../Store/userDataSlice';
import { useSelector } from 'react-redux';
import { FixedSizeList as List, VariableSizeList } from 'react-window';
import { motion, AnimatePresence } from "framer-motion";
import moment from 'moment';
import { Gallery } from "react-grid-gallery";
import ImageGrid from '../ImageGrid';
import images from '../../services/config/images';
import { useNavigate } from 'react-router-dom';
import { uploadMultiplesChatImagesApi } from '../../services/config/Api';
import { selectAuthToken } from '../../Store/AuthTokenSlice';

type Props = {
  chatId: string | null;
  isSmallScreen: boolean;
  setChatId: React.Dispatch<React.SetStateAction<string | null>>;
};

const ChatMessage = ({ chatId, isSmallScreen, setChatId }: Props) => {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<VariableSizeList>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userData = useSelector(selectUser)
  const authToken = useSelector(selectAuthToken)
  const navigate = useNavigate()

  const [chatName, setChatName] = useState<string>('')
  const [listHeight, setListHeight] = useState(0);
  const [text, setText] = useState<string>('')

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isSmallScreen && chatId) {
        // Clear chatId and prevent navigation back
        setChatId(null);
        // window.history.pushState(null, document.title, window.location.href);
      } else {
        // Normal back navigation
        navigate(-1);
      }
    };

    // Push a dummy state to handle popstate event
    window.history.pushState(null, document.title, window.location.href);

    window.addEventListener("popstate", handlePopState);

    return () => {
      // Cleanup event listener
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isSmallScreen, chatId, setChatId, navigate]);


  const handleDivClick = () => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

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

  const handleButtonClick = () => {
    fileInputRef?.current?.click(); // Manually trigger file input click
  };


  const handleUploadChatImages = async (e: any) => {
    try {
      const selectedFiles = e.target.files;  // Get all selected files
      const formData = new FormData();

      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i]);  // Append each file
      }
      const response = await uploadMultiplesChatImagesApi(formData, authToken)
      
      console.log("formData-=-=-=-=>", response);
      // setImageUploadLoader(true)
      // const selectedFile = e.target.files[0];
      // const formData = new FormData();
      // formData.append('image', selectedFile);
      // const response = await uploadProfile(formData)
      // if (response?.success) {
      //     setImgUri(response?.url)
      //     setImageUploadLoader(false)
      // } else {
      //     Toast('error', response?.message)
      //     setImageUploadLoader(false)
      // }
    } catch (error) {
      console.log(error);
      // setImageUploadLoader(false)
    }
  }

  return (
    <div className='h-full select-none'>
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
                className="h-full w-full flex flex-col bg-white shadow-md rounded-md"
              >
                <div className='px-2 py-1 text-lg font-semibold flex flex-row items-center' onClick={() => setChatId(null)}>
                  {isSmallScreen && <img src={images.arrowBtnBlack} className='rotate-180 w-4 h-6  cursor-pointer active:opacity-50' />}
                  <div className={isSmallScreen ? 'ml-3' : ''}>
                    {chatName}
                  </div>
                </div>

                <div
                  ref={messageContainerRef}
                  className="flex-1 overflow-auto flex flex-col chatScrollbar p-2"
                >
                  {
                    messages.map((item: any, index: number) => {
                      if (item?.type === 'header') {
                        return (
                          <div className='flex flex-row items-center justify-between w-full mt-1'>
                            <div className='h-[2px] w-[35%] sm:w-[40%] md:w-[42%] lg:w-[45%] bg-inputGray'></div>
                            <div className='text-black text-xs md:text-sm'>{item.header}</div>
                            <div className='h-[2px] w-[35%] sm:w-[40%] md:w-[42%] lg:w-[45%] bg-inputGray'></div>
                          </div>
                        )
                      }
                      return (
                        item.image?.length > 0 ? <div
                          className={
                            item?.sender === userData?._id ?
                              'bg-white mt-1 p-1 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[70%] xl:w-[40%] 2xl:w-[30%] self-end rounded-t-md rounded-bl-md border border-appGray' :
                              'bg-appGray mt-1 p-1 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[70%] xl:w-[40%] 2xl:w-[30%] self-start rounded-t-md rounded-br-md'
                          }
                        >
                          <ImageGrid images={item?.image} />
                        </div> :
                          <div key={index}
                            className={
                              item?.sender === userData?._id ?
                                'bg-white mt-1 p-1  max-w-[90%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[80%] xl:max-w-[50%] 2xl:max-w-[40%] self-end rounded-t-md rounded-bl-md border border-appGray' :
                                'bg-appGray mt-1 p-1 max-w-[90%] sm:max-w-[70%] md:max-w-[60%] lg:max-w-[80%] xl:max-w-[50%] 2xl:max-w-[40%] self-start rounded-t-md rounded-br-md'
                            }
                          >
                            <div>{item.text}</div>
                          </div>
                      )
                    })
                  }
                </div>
                <div className="flex items-center bg-white border cursor-text w-full border border-appGray rounded-lg pr-2 w-[99%] mx-auto mb-2" onClick={handleDivClick}>
                  <textarea
                    placeholder="Write Message.."
                    className="w-full p-2 resize-none hide-scrollbar focus:outline-none bg-transparent"
                    rows={2}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  >
                  </textarea>
                  {
                    text ?
                      <img src={images.arrowBlackIcon} className='cursor-pointer w-8 active:opacity-70' />
                      :
                      <img src={images.chatImg} className='cursor-pointer w-8 active:opacity-70' onClick={handleButtonClick} />
                  }
                  <input
                    id='fileInput'
                    ref={fileInputRef}
                    type='file'
                    className='hidden'
                    onChange={handleUploadChatImages}
                    accept='.png, .jpg, .jpeg'
                    multiple
                  />
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
