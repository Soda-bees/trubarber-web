import React from 'react'

type Props = {
    title: string,
    image?: any,
    dark: boolean,
    onClick?: () => void;
    long?: boolean
}

const SmallButton: React.FC<Props> = ({ title, image, dark, onClick, long }) => {
    return (
        <div
            className={
                dark
                    ? long ? `bg-black text-white flex flex-row items-center py-2 rounded-xl cursor-pointer active:opacity-50 px-14` : `bg-black text-white flex flex-row items-center py-2 rounded-xl cursor-pointer active:opacity-50 px-3`
                    : long ? `bg-inputGray text-black flex flex-row items-center py-2 rounded-xl cursor-pointer active:opacity-50 px-14` : `bg-inputGray text-black flex flex-row items-center py-2 rounded-xl cursor-pointer active:opacity-50 px-3`
            }
            onClick={onClick}
        >
            {image && <img src={image} className='w-6 mr-3' />}
            {title}
        </div>
    )
}

export default SmallButton