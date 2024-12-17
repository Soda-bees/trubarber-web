import React from 'react'
import images from '../../services/config/images';

type Props = {
    title: string,
    onClick: () => void;
    mt?: string,
    loader?: boolean,
    light: boolean,
    fontSize?: string,
    px?: string,
    disable?: boolean,
    hideImg?: boolean
}

const Button: React.FC<Props> = ({ title, onClick, mt, loader, light, fontSize, px, disable, hideImg }) => {
    return (
        <div onClick={() => { if (!loader && !disable) onClick(); }}
            style={{
                marginTop: mt,
                fontSize: fontSize ? fontSize : '16px',
                paddingLeft: px ? px : '24px',
                paddingRight: px ? px : '24px'
            }}
            // ${disable ? 'bg-appGray text-black' : 'bg-black text-white'} 
            className={`w-full 
                font-medium flex flex-row items-center ${hideImg ? 'justify-center' : 'justify-between'} h-12 rounded-xl shadow-md
             ${light ? disable ? 'bg-transparent border border-appGray text-black cursor-no-drop' : 'bg-transparent border border-black text-black cursor-pointer' : disable ? 'text-black bg-appGray cursor-no-drop' : 'text-white bg-black border-none cursor-pointer'} 
             ${!loader && !disable && "active:opacity-50"}`}
        >{title}
            {
                loader ?
                    <div
                        className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status">
                    </div>
                    :
                    // <img src={light ? images.arrowBtnBlack : images.arrowBtn} className={`w-3 ${disable && 'filter brightness-0'}`} />
                    hideImg ? (
                        null
                    ) : <img src={light ? images.arrowBtnBlack : images.arrowBtn} className={`w-3 ${disable && 'filter brightness-0'}`} />
            }
        </div>
    )
}

export default Button
