import React, { useState, useRef, useEffect, useCallback } from 'react';
import { selectUser, setSeenTrueRedux } from '../../Store/userDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FixedSizeList as List, VariableSizeList } from 'react-window';
import { motion, AnimatePresence } from "framer-motion";
import moment from 'moment';
import { Gallery } from "react-grid-gallery";
import ImageGrid from '../ImageGrid';
import images from '../../services/config/images';
import { useNavigate } from 'react-router-dom';
import { sendMessage, setSeenTrue, uploadMultiplesChatImagesApi } from '../../services/config/Api';
import { selectAuthToken } from '../../Store/AuthTokenSlice';
import { Toast } from '../Toast';
import LeftToRightAnimation from '../LeftToRightAnimation';
import RightToLeftAnimation from '../RightToLeftAnimation';
import AnimatedImage from '../AnimatedImage';

type Props = {
  chatId: string | null;
  isSmallScreen: boolean;
  setChatId: React.Dispatch<React.SetStateAction<string | null>>;
  text: string,
  setText: React.Dispatch<React.SetStateAction<string>>;
  selectedImage: string[];
  setSelectedImage: React.Dispatch<React.SetStateAction<string[]>>
  showImageScreen: boolean;
  setShowImageScreen: React.Dispatch<React.SetStateAction<boolean>>
  isDeleted: boolean | null
};

const ChatMessage = ({ chatId, isSmallScreen, setChatId, text, setText, selectedImage, setSelectedImage, showImageScreen, setShowImageScreen, isDeleted }: Props) => {
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendMessageImageScrollRef = useRef<HTMLDivElement>(null);

  const userData = useSelector(selectUser)
  const authToken = useSelector(selectAuthToken)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [chatName, setChatName] = useState<string>('')
  const [listHeight, setListHeight] = useState(0);
  // const [text, setText] = useState<string>('')
  // const [selectedImage, setSelectedImage] = useState<string[]>([])
  // const [showImageScreen, setShowImageScreen] = useState<boolean>(false)
  const [imageUploadLoader, setImageUploadLoader] = useState<boolean>(false)
  const [sendMessageImgSelectedIndex, setSendMessageImgSelectedIndex] = useState<number>(0)

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

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    if (chatId) {
      handleSetChatName()
      handleUpdateSeen(chatId)
    }
  }, [chatId, messages.length]);


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

  const handleUpdateSeen = async (chatRoomId: any) => {
    try {

      let filteredMessages = [];
      filteredMessages = userData?.chat
        ?.find((chat: any) => chat?._id === chatRoomId)
        ?.messages?.filter(
          (message: any) =>
            message?.sender !== userData?._id && message.seen === false,
        )
        ?.map((message: any) => message._id) || [];
      if (filteredMessages?.length > 0) {
        dispatch(setSeenTrueRedux({ chatRoomId, messageIds: filteredMessages }));
        const response = await setSeenTrue(authToken, filteredMessages);
      }
    } catch (error) {
      console.log(error);

    }
  }

  const handleSetChatName = async () => {
    const chat = userData?.chat?.find((chat: any) => chat?._id === chatId)
    userData?.role === 'user' ? setChatName(chat?.barber?.name) : setChatName(chat?.user?.name);
    console.log("handleSetChatName", chat);

  }

  const handleButtonClick = () => {
    fileInputRef?.current?.click()
  };


  const handleUploadChatImages = async (e: any) => {
    try {
      setShowImageScreen(true)
      setImageUploadLoader(true)
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
          formData.append('images', selectedFiles[i]);
        }
        const response = await uploadMultiplesChatImagesApi(formData, authToken) as { status: number, data: any }
        if (response.status == 200) {
          setImageUploadLoader(false)
          setSelectedImage((prevImg: any) => [...prevImg, ...response?.data?.images])
          return
        }
        setImageUploadLoader(false)
        setShowImageScreen(false)
        setSelectedImage([])
        Toast('error', response?.data?.message || 'Something wents wrong, Try again!')
        return
      } else {
        setShowImageScreen(false)
        setImageUploadLoader(false)
        console.log("No files selected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const removeSpacificImage = (index: number) => {
    setSelectedImage((prevImages) => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      if (updatedImages?.length == 0) {
        setShowImageScreen(false)
      }
      return updatedImages;
    });
  }

  const handleSendMessage = async () => {
    try {
      setText('')
      setSelectedImage([])
      setShowImageScreen(false)
      const body = { text, image: selectedImage }
      const response = await sendMessage(authToken, body, chatId)
    } catch (error) {
      console.log(error);
    }
  }

  const handleSwipeDirection = (e: any) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchEnd = (e: any) => {
      const touchEnd = e.changedTouches[0];
      const deltaX = touchEnd.clientX - startX;

      if (Math.abs(deltaX) > Math.abs(touchEnd.clientY - touch.clientY)) {
        if (deltaX > 0) {
          setSendMessageImgSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else {
          setSendMessageImgSelectedIndex((prevIndex) => Math.min(prevIndex + 1, selectedImage.length - 1));
        }
      }

      if (sendMessageImageScrollRef.current) {
        sendMessageImageScrollRef.current.removeEventListener('touchend', handleTouchEnd);
      }
    };

    if (sendMessageImageScrollRef.current) {
      sendMessageImageScrollRef.current.addEventListener('touchend', handleTouchEnd);
    }
  };


  return (
    <div className='h-full select-none'>
      {
        chatId ?
          showImageScreen ? (
            imageUploadLoader ? (
              <div className='h-full inset-0 bg-black bg-opacity-85 flex items-center justify-center'>
                <RightToLeftAnimation>
                  <div
                    className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-white border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status">
                  </div>
                </RightToLeftAnimation>
              </div>
            ) : (
              <RightToLeftAnimation className='h-full inset-0 bg-black bg-opacity-85 relative w-full h-full flex items-center justify-center'>
                <div className='bg-white absolute top-4 left-4 p-2 rounded-full cursor-pointer active:opacity-50 z-10' onClick={() => {
                  setShowImageScreen(false)
                  setSelectedImage([])
                }}>
                  <motion.img
                    src={images.cross}
                    className="w-4 cursor-pointer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 1.5 }}
                  />
                </div>
                <div
                  ref={sendMessageImageScrollRef}
                  className="flex overflow-hidden w-full h-full relative"
                  style={{ position: 'relative', scrollSnapType: 'x mandatory', touchAction: 'pan-x', }}
                  onTouchStart={handleSwipeDirection}
                >
                  <div className="flex justify-center items-center snap-center min-w-[100%] h-[100%]">
                    <img
                      src={selectedImage[sendMessageImgSelectedIndex]}
                      className="object-contain max-h-[70%] max-w-[90%] rounded-md"
                    />
                  </div>
                </div>
                <div className="absolute bottom-5 flex flex-row gap-3 items-center overflow-x-auto max-w-[90%] hide-scrollbar">
                  {
                    selectedImage?.map((item, index) => {
                      return (
                        <div key={index} className="flex-shrink-0">
                          <img
                            src={item}
                            className={index === sendMessageImgSelectedIndex
                              ? 'w-20 h-20 cursor-pointer border-2 border-white rounded-md relative'
                              : 'w-16 h-16 cursor-pointer rounded-md relative'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSendMessageImgSelectedIndex(index);
                            }}
                          />
                          {
                            index === sendMessageImgSelectedIndex && (
                              <div
                                className="bg-black bg-opacity-30 p-2 absolute top-0 cursor-pointer active:opacity-70 w-20 h-20 flex items-center justify-center rounded-md"
                                onClick={() => removeSpacificImage(index)}
                              >
                                <img
                                  src={images.deleteIcon}
                                  className="absolute w-8 h-8 invert brightness-0"
                                />
                              </div>
                            )
                          }
                        </div>
                      );
                    })
                  }
                  <div
                    className="w-20 h-20 cursor-pointer rounded-md flex items-center justify-center border-2 border-white active:opacity-70 flex-shrink-0"
                    onClick={handleButtonClick}
                  >
                    <input
                      id="fileInput"
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleUploadChatImages}
                      accept=".png, .jpg, .jpeg"
                      multiple
                    />
                    <img src={images.cross} className="w-10 h-10 rotate-45 filter invert brightness-0" />
                  </div>
                </div>
                <div className='bg-white absolute bottom-4 right-4 p-2 rounded-full active:opacity-70 ' onClick={handleSendMessage}>
                  <AnimatedImage src={images.arrowBlackIcon} className='cursor-pointer w-6 ' />
                </div>
              </RightToLeftAnimation>
            )
          ) : (
            <RightToLeftAnimation
              key={chatId}
              className="h-full w-full flex flex-col bg-white shadow-md rounded-md">
              <div className='px-2 py-1 text-lg font-semibold flex flex-row items-center' onClick={() => setChatId(null)}>
                {isSmallScreen && <img src={images.arrowBtnBlack} className='rotate-180 w-4 h-6  cursor-pointer active:opacity-50' />}
                <div className={isSmallScreen ? 'ml-3' : ''}>
                  {chatName}
                </div>
              </div>

              <div
                ref={messageContainerRef}
                className="flex-1 overflow-auto flex flex-col chatScrollbar p-2 relative"
              >
                {
                  messages?.length === 0 &&
                  <div className='mt-40 text-center text-black font-semibold'>
                     You're starting a new conversation. Say hi!
                  </div>
                }
                {
                  messages.map((item: any, index: number) => {
                    if (item?.type === 'header') {
                      return (
                        <div className='flex flex-row items-center justify-between w-full mt-1' key={index}>
                          <div className='h-[2px] w-[35%] sm:w-[40%] md:w-[42%] lg:w-[45%] bg-inputGray'></div>
                          <div className='text-black text-xs md:text-sm'>{item.header}</div>
                          <div className='h-[2px] w-[35%] sm:w-[40%] md:w-[42%] lg:w-[45%] bg-inputGray'></div>
                        </div>
                      )
                    }
                    return (
                      item.image?.length > 0 ? <div
                        key={index}
                        className={
                          item?.sender === userData?._id ?
                            'bg-white mt-1 p-1 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[70%] xl:w-[40%] 2xl:w-[30%] self-end rounded-t-md rounded-bl-md border border-appGray' :
                            'bg-appGray mt-1 p-1 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[70%] xl:w-[40%] 2xl:w-[30%] self-start rounded-t-md rounded-br-md'
                        }
                      >
                        <ImageGrid images={item?.image} isSmallScreen={isSmallScreen} />
                      </div> :
                        <div
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
              {
                isDeleted ? (
                  <div className='text-red-500 p-2 font-semibold text-center bg-transparent'> This account is no longer available </div>
                ) : (

                  < div className="flex items-center bg-white border cursor-text w-full border border-appGray rounded-lg pr-2 w-[99%] mx-auto mb-2" onClick={handleDivClick}>
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
                        <img src={images.arrowBlackIcon} className='cursor-pointer w-8 active:opacity-70' onClick={handleSendMessage} />
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
                )}

            </RightToLeftAnimation>
          )
          : <div>no chat to show </div>
      }
    </div >
  );
};

export default ChatMessage;
