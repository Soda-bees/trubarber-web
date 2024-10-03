import React from 'react'

type Props = {
    title: string,
    image?: any,
    dark: boolean,
    onClick?: () => void;
    long?: boolean,
    loader?: boolean
}

const SmallButton: React.FC<Props> = ({ title, image, dark, onClick, long, loader }) => {
    return (
        <div
            className={
                dark
                    ? long ? `bg-black text-white flex flex-row items-center justify-center py-2 rounded-xl cursor-pointer active:opacity-50 px-10 sm:px-14` : `bg-black text-white flex flex-row items-center justify-center py-2 rounded-xl cursor-pointer active:opacity-50 px-3`
                    : long ? `bg-inputGray text-black flex flex-row items-center justify-center py-2 rounded-xl cursor-pointer active:opacity-50 px-10 sm:px-14` : `bg-inputGray text-black flex flex-row items-center justify-center py-2 rounded-xl cursor-pointer active:opacity-50 px-3`
            }
            onClick={onClick}
        >
            {image && <img src={image} className='w-6 mr-3' />}
            {
                loader ?
                    <div
                        className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status">
                    </div> : <div>{title}</div>
            }
        </div>
    )
}

export default SmallButton