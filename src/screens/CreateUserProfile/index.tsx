import React from 'react'
import BackButton from '../../components/BackButton'
import images from '../../services/config/images'

type Props = {}

const CreateUserProfile = (props: Props) => {
    return (
        <div className=''>
            <div className='flex flex-row items-center'>
                <BackButton light={true} />
                <div className='mx-auto pr-8 md:pr-10 text-xl font-bold'>
                    Create Your TRU Barber Account
                </div>
            </div>
            <div className='flex flex-row'>
                <div>Upload your profile picture</div>
                <div>
                    <img src={images.profileUpload} />
                    <div className='bg-black'>
                        <img src={images.uploadBtn} />
                        Upload Photo
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateUserProfile