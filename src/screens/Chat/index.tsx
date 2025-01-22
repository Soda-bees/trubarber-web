import React, { useEffect, useState } from 'react'
import ChatMessage from '../../components/Chat'
import { useLocation, useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../Store/userDataSlice'
import moment from 'moment'
import images from '../../services/config/images'
import { motion } from 'framer-motion';
import LeftToRightAnimation from '../../components/LeftToRightAnimation'

type Props = {}

const Chat = (props: Props) => {
  const { search, headerFooterHeight, headerHeight } =
    useOutletContext<{ search: string, headerFooterHeight: number, headerHeight: number }>()

  const location = useLocation();
  const userData = useSelector(selectUser)
  const chatRoomId = location?.state?.chatRoomId ?? null;

  useEffect(() => {
    console.log("chat room id", chatRoomId);

    if (chatRoomId) {
      setChatId(chatRoomId)
    }
  }, [chatRoomId])

  const [chatId, setChatId] = useState<string | null>(null)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 1024)
  const [text, setText] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<string[]>([])
  const [showImageScreen, setShowImageScreen] = useState<boolean>(false)
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleScreenResize = (event: MediaQueryListEvent) => {
      setIsSmallScreen(!mediaQuery.matches);


    };
    mediaQuery.addEventListener("change", handleScreenResize);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenResize);
    };
  }, []);

  const calculateTimeAgo = (time: any) => {
    const now = moment();
    const timeMoment = moment(time);

    if (now.isSame(timeMoment, 'minute')) {
      return 'Now';
    } else if (now.isSame(timeMoment, 'day')) {
      return timeMoment.format('h:mm A');
    } else if (now.subtract(1, 'days').isSame(timeMoment, 'day')) {
      return 'Yesterday';
    } else {
      return timeMoment.format('DD/MMM');
    }
  };

  const availableHeightInVH = 100 - headerHeight || 100

  return (
    <div className={`flex flex-row items-start px-4 flex-1 select-none gap-2 pb-2 `} style={{
      minHeight: `${availableHeightInVH}vh`,
      maxHeight: `${availableHeightInVH}vh`,
    }}>
      {
        (isSmallScreen && !chatId) || !isSmallScreen ? (
          <div className='w-full lg:w-[50%] xl:w-[40%] h-full overflow-y-auto hide-scrollbar'>
            {
              userData?.chat?.filter((item: any) => item?.messages?.length > 0)?.length > 0 ? (
                <div className='flex flex-col gap-2'>
                  {
                    userData?.chat?.filter((item: any) => item?.messages?.length > 0)
                      ?.filter((item: any) => {
                        if (search.trim() === '') return true;
                        const searchLowerCase = search.trim().toLowerCase();
                        const participantName = userData.role === 'user' ? item?.barber?.name : item?.user?.name;
                        return participantName.toLowerCase().includes(searchLowerCase);
                      })
                      ?.sort((a: any, b: any) => {
                        const lastMessageA = a.messages[a.messages.length - 1];
                        const lastMessageB = b.messages[b.messages.length - 1];

                        const dateA = new Date(lastMessageA?.createdAt || a.createdAt).getTime();
                        const dateB = new Date(lastMessageB?.createdAt || b.createdAt).getTime();

                        return dateB - dateA;
                      })
                      ?.map((item: any, index: any) => {
                        const isDeleted = userData?.role === 'user' ? item?.barber?.isDeleted : item?.user?.isDeleted
                        const lastMessage = item?.messages?.length > 0 ? item?.messages[item?.messages?.length - 1] : ''
                        const timeAgo = calculateTimeAgo(lastMessage?.createdAt ? lastMessage?.createdAt : item?.createdAt)
                        const messages = item?.messages || []
                        const oppositeMessage = messages.filter((obj: any) => obj?.sender !== userData?._id);
                        const unseenMessages = oppositeMessage.filter((obj: any) => obj.seen === false)
                        return (
                          <LeftToRightAnimation
                            custom={index}
                            key={index}
                            className="flex flex-row items-start justify-between cursor-pointer"
                          >
                            <motion.div
                              onClick={() => {
                                setText('')
                                setSelectedImage([])
                                setShowImageScreen(false)
                                setChatId(item?._id)
                                setIsDeleted(isDeleted)
                              }}
                              whileHover={{
                                scale: 0.98,
                                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                              }}
                              transition={{ duration: 0.1 }}
                              className="flex flex-row items-start justify-between w-full bg-inputGray px-3 py-2 rounded-xl"
                            >
                              <div className="flex flex-row items-center">
                                <img
                                  src={
                                    userData?.role === "user"
                                      ? item?.barber?.profile
                                        ? item?.barber?.profile
                                        : item?.barber?.gender === "male"
                                          ? images.male
                                          : images.female
                                      : item?.user?.profile
                                        ? item?.user?.profile
                                        : item?.user?.gender === "male"
                                          ? images.male
                                          : images.female
                                  }
                                  className='w-12 h-12 rounded-full'
                                />
                                <div className="ml-2 w-full">
                                  <div className="font-semibold leading-5">
                                    {userData?.role == "user" ? item?.barber.name : item?.user?.name}
                                  </div>
                                  <div className={`overflow-hidden line-clamp-1 text-sm`}>
                                    {lastMessage?.image?.length > 0 ? "Photo" : lastMessage?.text}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end justify-between">
                                <div className="text-sm font-semibold whitespace-nowrap">{timeAgo}</div>
                                {unseenMessages?.length > 0 ? (
                                  <div className="text-xs text-semibold bg-white text-black mt-1 mr-2 h-5 w-5 rounded-full flex items-center justify-center">
                                    {unseenMessages?.length}
                                  </div>
                                ) : null}
                              </div>
                            </motion.div>
                          </LeftToRightAnimation>
                        )
                      })
                  }
                </div>
              ) : (
                <div className='font-semibold text-center md:text-start'>There is currently no chat to show</div>
              )
            }
          </div>
        ) : null
      }
      {/* {
          isSmallScreen ? chatId : (
            <div className="w-full lg:w-[75%] h-full">
              <ChatMessage
                chatId={chatId} isSmallScreen={isSmallScreen}
                setChatId={setChatId}
                text={text} setText={setText}
                selectedImage={selectedImage} setSelectedImage={setSelectedImage}
                showImageScreen={showImageScreen} setShowImageScreen={setShowImageScreen} isDeleted={isDeleted}
              />
            </div>
          )
        } */}

      {
        (!isSmallScreen || chatId) && (
          <div className={isSmallScreen ? 'w-full h-full' : 'w-full lg:w-[75%] h-full'}>
            <ChatMessage
              chatId={chatId}
              isSmallScreen={isSmallScreen}
              setChatId={setChatId}
              text={text}
              setText={setText}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              showImageScreen={showImageScreen}
              setShowImageScreen={setShowImageScreen}
              isDeleted={isDeleted}
            />
          </div>
        )
      }

    </div>
  )
}

export default Chat