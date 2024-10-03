import React, { useState } from 'react'
import BackButton from '../../components/BackButton'
import images from '../../services/config/images'
import SmallButton from '../../components/SmallButton'
import { Toast } from '../../components/Toast'

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
    const [tagSelection, setTagSelection] = useState<string[]>(['#OfferedServices', '#HaircutStyles', '#Prices', '#ConvenientBooking',
        '#CustomerFeedback', '#BeardTrim', '#Stylists', '#CustomerService'])
    const [selectedTagSelection, setSelectedTagSelection] = useState<string[]>([])
    const [selectedSurvey, setSelectedSurvey] = useState<any>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)

    const handleSetGender = (selected: string) => {
        setGender(selected)
    }

    const handleSetSurvey = (index: number, answerIndex: number) => {
        setSurvey((prevSurvey) =>
            prevSurvey.map((questionItem, qIndex) => {
                if (qIndex === index) {
                    return {
                        ...questionItem,
                        answers: questionItem.answers.map((answer, aIndex) => {
                            if (aIndex === answerIndex) {
                                return { ...answer, selected: !answer.selected };
                            }
                            return answer;
                        }),
                    };
                }
                return questionItem;
            })
        );
    }

    const handleSetTagSelection = (item: string) => {
        setSelectedTagSelection((prevSelectedTag) => {
            if (prevSelectedTag.includes(item)) {
                return prevSelectedTag.filter(tag => tag !== item)
            } else {
                return [...prevSelectedTag, item]
            }
        })

    }

    const validateSurvey = () => {
        let isValid = true;

        // Loop through each question in the survey
        survey.forEach((item) => {
            // Check if at least one answer is selected
            const isAnswerSelected = item.answers.some(answer => answer.selected);

            // If no answer is selected, show an error message
            if (!isAnswerSelected) {
                isValid = false;
            }
        });

        // You can return the validation status if needed
        return isValid;
    }

    const handleCreate = () => {
        if (!gender) {
            return Toast('error', "Gender required")
        }
        if (!validateSurvey()) {
            return Toast('error', "Survey required")
        }
        if (selectedTagSelection?.length <= 0) {
            return Toast('error', "Please select tags")
        }
        const newSurveyArray = survey.map((questionItem) => {
            const selectedAnswer = questionItem.answers
                .filter(answer => answer.selected)
                .map(answer => answer.text)
            return {
                question: questionItem.question,
                answer: selectedAnswer
            }
        })
        setSelectedSurvey(newSurveyArray)
        setIsModalOpen(true)
    }

    const handleConfirm = async () => {

        setLoader(true)
        setTimeout(() => {
            setLoader(false)
        }, 1500)
    }

    return (
        <div className='px-4 py-4'>
            <BackButton light={true} title='Create Your Account' />
            <div className=' max-w-6xl mx-auto max-h-[94vh] overflow-scroll hide-scrollbar'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-2 mt-10'>
                    <div className='flex flex-col md:col-span-2'>
                        <div className='text-lg font-semibold'>Upload your profile picture</div>
                        <div className='flex flex-row items-center p-3 border border-inputGray rounded-3xl mt-2 shadow-sm'>
                            <img src={images.profileUpload} className='w-20 mr-4 sm:mr-10' />
                            <SmallButton title={'Upload Photo'} dark={true} image={images.uploadBtn} />
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='text-lg font-semibold'>Select Your Gender</div>
                        <div
                            className='flex flex-row md:flex-col lg:flex-row items-center justify-evenly p-4 md:p-0  h-full border border-inputGray rounded-3xl mt-2  shadow-sm'
                        >
                            <SmallButton title={'Male'} dark={gender === 'male' ? true : false} long={true} onClick={() => handleSetGender('male')} />
                            <SmallButton title={'Female'} dark={gender === 'female' ? true : false} long={true} onClick={() => handleSetGender('female')} />
                        </div>
                    </div>
                </div>
                <div className='mt-10'>
                    <div className='text-lg font-semibold'>Customer Preferences Survey</div>
                    <div className='text-sm mt-1 text-textGray'>Help Us Tailor Your Barber Shop Experience: Take Our Quick Survey!</div>
                    <div className='p-3 border border-inputGray rounded-3xl p-6 mt-3 shadow-sm'>
                        {
                            survey?.map((item: any, index: number) => {
                                return (
                                    <div key={index} className={index !== 0 ? "mt-8" : ""}>
                                        <div className='text-lg font-semibold'>{item?.question}</div>
                                        <div className='flex flex-row items-center gap-4 mt-4 flex-wrap'>
                                            {item?.answers?.map((item: any, secondIndex: number) => {
                                                return (
                                                    <div key={secondIndex} className='' onClick={() => handleSetSurvey(index, secondIndex)}>
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
                <div className='mt-10'>
                    <div className='text-lg font-semibold'>Tag Selection</div>
                    <div className='text-sm mt-1 text-textGray'>Customize Your Experience: Choose Tags That Reflect Your Preferences!</div>
                    <div className='p-3 border border-inputGray rounded-3xl p-6 mt-3 flex flex-row items-center gap-2 flex-wrap shadow-sm'>
                        {
                            tagSelection?.map((item: string, index: number) => {
                                return (
                                    <div key={index}>
                                        <SmallButton title={item} dark={selectedTagSelection.includes(item) ? true : false} onClick={() => handleSetTagSelection(item)} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='mt-10 flex justify-center'>
                    <SmallButton title='Create' dark={true} long={true} onClick={handleCreate} />
                </div>
            </div>
            {
                isModalOpen &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => !loader && setIsModalOpen(false)}>
                    <div className='bg-white w-[95%] sm:w-[50%] lg:w-[30%] xl:w-[25%] flex flex-col items-center p-6 rounded-xl shadow-lg' onClick={(e) => e.stopPropagation()}>
                        <div className='text-xl font-bold'>Enhance Your Experience</div>
                        <img src={images.congratulations} className='w-[20%] mt-10' />
                        <div className='text-xl font-bold mt-4'>Congratulations!</div>
                        <div className='w-[50%] text-center text-sm text-textGray mt-2'>Your profile creation is now complete and ready to go.</div>
                        <div className='w-full mt-6'>
                            <SmallButton title='Get ready' dark={true} loader={loader} onClick={handleConfirm} />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default CreateUserProfile