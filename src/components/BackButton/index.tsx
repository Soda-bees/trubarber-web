import React from 'react'
import images from '../../services/config/images'

type Props = {
    light: boolean,
    title?: string
}

const BackButton: React.FC<Props> = ({ light , title}) => {
    return (
        <div className='flex flex-row items-center w-full'>
            <img src={!light ? images.backBtnLight : images.backBtnDark} className='w-8 md:w-10 cursor-pointer z-10 active:opacity-50' onClick={() => alert('Back paressed')} />
            <div className='mx-auto pr-8 md:pr-10 text-3xl font-bold'>
                {title}
            </div>
        </div>
    )
}

export default BackButton