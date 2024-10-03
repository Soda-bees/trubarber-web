import React from 'react'
import images from '../../services/config/images'
import useNavigate from '../ScrollToTopNavigate'

type Props = {
    light: boolean,
    title?: string
}

const BackButton: React.FC<Props> = ({ light, title }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    }

    return (
        <div className='flex flex-row items-center w-full'>
            <img src={!light ? images.backBtnLight : images.backBtnDark} className='w-8 md:w-10 cursor-pointer z-10 active:opacity-50' onClick={handleBack} />
            <div className='mx-auto pr-8 md:pr-10 text-base sm:text-xl md:text-2xl lg:text-3xl font-bold'>
                {title}
            </div>
        </div>
    )
}

export default BackButton