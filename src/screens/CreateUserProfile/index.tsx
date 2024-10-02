import React, { useState } from 'react'
import BackButton from '../../components/BackButton'
import images from '../../services/config/images'
import SmallButton from '../../components/SmallButton'

type Props = {}

const CreateUserProfile = (props: Props) => {
    const [gender, setGender] = useState<string>('')
    const [survey, setSurvey] = useState([
        {
            question: 'How often do you typically visit a barber shop?',
            answers: [
                {
                    selected: false,
                    text: 'Once a month',
                },
                {
                    selected: false,
                    text: 'Every couple of months',
                },
                {
                    selected: false,
                    text: 'Once every two months',
                },
                {
                    selected: false,
                    text: 'Once every six months',
                },
            ]
        },
        {
            question: 'What services are you interested in? (Select all that apply)',
            answers: [
                {
                    selected: false,
                    text: 'Haircut',
                },
                {
                    selected: false,
                    text: 'Beard Trim',
                },
                {
                    selected: false,
                    text: 'Shave',
                },
                {
                    selected: false,
                    text: 'Hair styling',
                },
            ]
        },
        {
            question: 'What is your preferred method of communication for appointment reminders and updates?',
            answers: [
                {
                    selected: false,
                    text: 'Email',
                },
                {
                    selected: false,
                    text: 'SMS text messages',
                },
                {
                    selected: false,
                    text: 'Push notifications through the app',
                },
                {
                    selected: false,
                    text: 'Hair styling',
                },
            ]
        },
        {
            question: 'What factors influence your choice of a barber shop? (Select all that apply)',
            answers: [
                {
                    selected: false,
                    text: 'Location',
                },
                {
                    selected: false,
                    text: 'Price',
                },
                {
                    selected: false,
                    text: 'Reviews and ratings',
                },
                {
                    selected: false,
                    text: 'Atmosphere/Decor',
                },
            ]
        }
    ])

    const handleSetGender = (selected: string) => {
        setGender(selected)
    }
    return (
        <div className='px-4 py-4'>
            <BackButton light={true} title='Create Your Account' />
            <div className=' max-w-6xl mx-auto'>
                <div className='flex flex-row items-center justify-start gap-4'>
                    <div className='flex flex-col'>
                        <div className='text-lg font-semibold'>Upload your profile picture</div>
                        <div className='flex flex-row items-center p-3 border border-inputGray rounded-3xl mt-2'>
                            <img src={images.profileUpload} className='w-20 mr-10' />
                            <SmallButton title={'Upload Photo'} dark={true} image={images.uploadBtn} />
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='text-lg font-semibold'>Select Your Gender</div>
                        <div className='flex flex-row items-center p-8 border border-inputGray rounded-3xl mt-2 gap-8'>
                            <SmallButton title={'Male'} dark={gender === 'male' ? true : false} long={true} onClick={() => handleSetGender('male')} />
                            <SmallButton title={'Female'} dark={gender === 'female' ? true : false} long={true} onClick={() => handleSetGender('female')} />
                        </div>
                    </div>
                </div>
                <div>
                    <div>headig</div>
                    <div>sub headig</div>
                    <div className='p-3 border border-inputGray rounded-3xl p-6'>
                        {
                            survey?.map((item: any, index: number) => {
                                return (
                                    <div key={index} className={index !== 0 ? "mt-8" : ""}>
                                        <div className='text-lg font-semibold'>{item?.question}</div>
                                        <div className='flex flex-row items-center gap-4 mt-4'>
                                            {item?.answers?.map((item: any, secondIndex: number) => {
                                                return (
                                                    <div key={index} className=''>
                                                        <SmallButton title={item?.text} dark={item.selected ? true : false} />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CreateUserProfile