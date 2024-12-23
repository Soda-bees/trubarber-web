import React from 'react'
import ChatMessage from '../../components/Chat'
import { useOutletContext } from 'react-router-dom'

type Props = {}

const Chat = (props: Props) => {
  const { isSmallScreen } = useOutletContext<{ isSmallScreen: any }>()
  return (
    <div className='flex flex-row items-center px-4'>
      <div className='bg-blue-200 w-full md:w-[40%] lg:w-[30%] xl:w-[25%]'>inbox </div>
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