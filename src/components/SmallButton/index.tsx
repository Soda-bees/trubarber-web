import React from 'react'

type Props = {
    title: string,
    image?: any,
    dark: boolean,
    onClick?: () => void;
    long?: boolean,
    loader?: boolean,
    smallImage?: boolean,
    imgLoader?: boolean,
    disable?: boolean
}

const SmallButton: React.FC<Props> = ({ title, image, dark, onClick, long, loader, smallImage, imgLoader, disable }) => {
    return (
        <div
            className={
                dark
                    ? long ? `${disable ? 'bg-appGray text-black cursor-no-drop' : 'bg-black text-white cursor-pointer'} flex flex-row items-center justify-center py-2 rounded-xl ${!disable && 'active:opacity-50'} px-10 sm:px-14 select-none` 
                    : `${disable ? 'bg-appGray text-black cursor-no-drop' : 'bg-black text-white cursor-pointer'} flex flex-row items-center justify-center py-2 rounded-xl ${!disable && 'active:opacity-50'} px-3 select-none`
                    : long ? `${disable ? 'bg-appGray text-white cursor-no-drop' : 'bg-inputGray text-black cursor-pointer'} flex flex-row items-center justify-center py-2 rounded-xl ${!disable && 'active:opacity-50'} px-10 sm:px-14 select-none` 
                    : `${disable ? 'bg-appGray text-white cursor-no-drop' : 'bg-inputGray text-black cursor-pointer'} flex flex-row items-center justify-center py-2 rounded-xl ${!disable && 'active:opacity-50'} px-3 select-none`
            }
            onClick={() => !disable && onClick && onClick()}
        >
            {
                imgLoader ? <div
                    className="inline-block h-4 w-4 mr-3 animate-spin rounded-full border-[2px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status">
                </div> :
                    image && <img src={image} className={smallImage ? "w-2 mr-2" : 'w-4 mr-3'} />
            }
            {/* {image && <img src={image} className={smallImage ? "w-2 mr-2" : 'w-4 mr-3'} />} */}
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