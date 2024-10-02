import React from 'react'
import images from '../../services/config/images'

type Props = {
    light: boolean,
}

const BackButton: React.FC<Props> = ({ light }) => {
    return (
        // <div >
            <img src={!light ? images.backBtnLight : images.backBtnDark} className='w-8 md:w-10 cursor-pointer z-10 active:opacity-50' onClick={() => alert('Back paressed')}/>
        // </div>
    )
}

export default BackButton