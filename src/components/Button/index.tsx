import React from 'react'
import images from '../../services/config/images';

type Props = {
    title: string,
    onClick: () => void;
    mt: string,
    loader: boolean,
    light: boolean
}

const Button: React.FC<Props> = ({ title, onClick, mt, loader, light }) => {
    return (
        <div onClick={() => { if (!loader) onClick(); }}
            style={{ marginTop: mt }}
            className={`w-full bg-black font-medium flex flex-row items-center justify-between h-12 rounded-xl px-6 cursor-pointer shadow-md ${light ? 'bg-transparent border border-black text-black' : 'text-white border-none '} ${!loader && "active:opacity-50"}`}
        >{title}
            {
                loader ?
                    <div
                        className="inline-block h-7 w-7 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status">
                    </div>
                    :
                    <img src={light ? images.arrowBtnBlack : images.arrowBtn} className='w-3' />

            }
        </div>
    )
}

export default Button
