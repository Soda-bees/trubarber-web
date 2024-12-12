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
    disable?: boolean
}

const Button: React.FC<Props> = ({ title, onClick, mt, loader, light, fontSize, px, disable }) => {
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
                font-medium flex flex-row items-center justify-between h-12 rounded-xl cursor-pointer shadow-md
             ${light ? disable ? 'bg-transparent border border-appGray text-black' : 'bg-transparent border border-black text-black' : disable ? 'text-black bg-appGray' : 'text-white bg-black border-none '} ${!loader || !disable && "active:opacity-50"}`}
        >{title}
            {
                loader ?
                    <div
                        className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status">
                    </div>
                    :
                    <img src={light ? images.arrowBtnBlack : images.arrowBtn} className={`w-3 ${disable && 'filter brightness-0'}`} />
            }
        </div>
    )
}

export default Button
