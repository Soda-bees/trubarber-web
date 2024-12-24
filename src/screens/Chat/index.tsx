import React, { useEffect, useState } from 'react'
import ChatMessage from '../../components/Chat'
import { useOutletContext } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../Store/userDataSlice'
import moment from 'moment'
import images from '../../services/config/images'

type Props = {}

const Chat = (props: Props) => {
  const { isSmallScreen, search } = useOutletContext<{ isSmallScreen: any, search: string }>()
  const userData = useSelector(selectUser)

  const calculateTimeAgo = (time: any) => {
    const now = moment();
    const timeMoment = moment(time);

    if (now.isSame(timeMoment, 'day')) {
      return timeMoment.format('h:mm A');
    } else if (now.subtract(1, 'days').isSame(timeMoment, 'day')) {
      return 'Yesterday';
    } else {
      return timeMoment.format('DD/MMM');
    }
  };


  return (
    <div className='flex flex-row items-start px-4'>
      <div className='w-full md:w-[40%] lg:w-[30%] xl:w-[25%]'>
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
                    // Get the createdAt of the last message in each chat
                    const lastMessageA = a.messages[a.messages.length - 1];
                    const lastMessageB = b.messages[b.messages.length - 1];

                    // Convert to timestamps and sort based on the createdAt of the last message (descending)
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
                      <div key={index} className='flex flex-row items-start justify-between bg-inputGray px-3 py-2 rounded-xl'>
                        <div className='flex flex-row items-center w-[80%]'>
                          <img src={userData?.role === 'user' ? item?.barber?.profile ? item?.barber?.profile : item?.barber?.gender === 'male' ? images.male :
                            images.female : item?.user?.profile ? item?.user?.profile : item?.user?.gender === 'male' ? images.male : images.female}
                            className='w-12 h-12 rounded-full'
                          />
                          <div className='ml-2'>
                            <div className='font-semibold leading-5'>  {userData?.role == 'user' ? item?.barber.name : item?.user?.name}</div>
                            <div className={`overflow-hidden  line-clamp-1 text-sm`}> {lastMessage?.image?.length > 0 ? "Photo" : lastMessage?.text}</div>
                          </div>
                        </div>
                        <div>
                          <div className='text-sm font-semibold'>{timeAgo}</div>
                          <div>unseen</div>
                        </div>
                      </div>
                    )
                  })
              }
            </div>
          ) : (
            <div></div>
          )
        }
      </div>
      {
        !isSmallScreen &&
        <div className='bg-pink-500 w-[75%]'>
          <ChatMessage />
        </div>
      }
      {/* <div>chat</div> */}
    </div>
  )
}

export default Chat