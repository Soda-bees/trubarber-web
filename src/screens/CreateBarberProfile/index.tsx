import React, { useState } from 'react'
import BackButton from '../../components/BackButton'
import images from '../../services/config/images'
import SmallButton from '../../components/SmallButton'
import { Toast } from '../../components/Toast'

type Props = {}

const CreateBarberProfile = (props: Props) => {
    const [gender, setGender] = useState<string>('')
    const [tagSelection, setTagSelection] = useState<string[]>(['#OfferedServices', '#HaircutStyles', '#Prices', '#ConvenientBooking',
        '#CustomerFeedback', '#BeardTrim', '#Stylists', '#CustomerService'])
    const [selectedTagSelection, setSelectedTagSelection] = useState<string[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [days, setDays] = useState<string[]>(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
    const [offDays, setOffDays] = useState<string[]>([])
    const [servicesData, setserviceData] = useState([
        {
            icon: 'https://res.cloudinary.com/doohobw9k/image/upload/v1726222601/TruBarber/Services/ojjwvvfvc2ovrtrkjumo.png',
            name: 'Haircut',
        },
        {
            icon: 'https://res.cloudinary.com/doohobw9k/image/upload/v1726222538/TruBarber/Services/yvg6ctijk3ann6a0ty5i.png',
            name: 'Beard',
        },
    ]);
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const [activeServiceIndex, setActiveServiceIndex] = useState<any>()
    const [showUpdateServiceModal, setShowUpdateServiceModal] = useState<boolean>(false)


    const handleSetGender = (selected: string) => {
        setGender(selected)
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


    const handleCreate = () => {
        if (!gender) {
            return Toast('error', "Gender required")
        }
        if (selectedTagSelection?.length <= 0) {
            return Toast('error', "Please select tags")
        }

        setIsModalOpen(true)
    }

    const handleConfirm = async () => {

        setLoader(true)
        setTimeout(() => {
            setLoader(false)
        }, 1500)
    }

    const handleSelectDays = async (item: string) => {
        setOffDays(prevOffDays => {
            if (prevOffDays.includes(item)) {
                return prevOffDays.filter(day => day !== item);
            } else {
                return [...prevOffDays, item];
            }
        });

    }

    const handleServicePressed = (service: any) => {
        const updatedService = {
            ...service,
            pictures: [],
            description: '',
            options: [{ name: '', price: '', time: '' }],
        };

        setSelectedServices((prevSelecteditem) => {
            // Find the index of the service by 'name'
            const index = prevSelecteditem.findIndex(
                (item: any) => item.name === updatedService.name // Assuming 'name' is unique
            );

            if (index !== -1) {
                // Service is already added, log the index
                console.log(`Service already selected at index: ${index}`);
                setActiveServiceIndex(index)
                setShowUpdateServiceModal(true)
                return prevSelecteditem; // No change in state
            } else {
                // Service is not added yet, log the new index
                const newIndex = prevSelecteditem.length; // New service will be added at the end
                console.log(`Service added at index: ${newIndex}`);
                setActiveServiceIndex(newIndex)
                setShowUpdateServiceModal(true)

                return [...prevSelecteditem, updatedService]; // Add the new service
            }
        });
    }

    const handleAddOptionInService = () => {
        setSelectedServices(prevServices => {
            const newServices = [...prevServices];
            newServices[activeServiceIndex] = {
                ...newServices[activeServiceIndex],
                options: [
                    ...newServices[activeServiceIndex].options,
                    { name: '', price: '', time: '' },
                ],
            };
            return newServices;
        });
    }

    const handleDeleteOptionInService = (optionsArrayIndex: number) => {
        setSelectedServices(prevServices => {
            const newServices = [...prevServices];
            const updatedOptions = newServices[activeServiceIndex].options.filter(
                (_: any, idx: any) => idx !== optionsArrayIndex,
            );
            newServices[activeServiceIndex] = {
                ...newServices[activeServiceIndex],
                options: updatedOptions,
            };
            return newServices;
        });
    }

    const updateServiceOption = (optionsArrayIndex: number, newName: string, newPrice: string, newTime: string) => {
        console.log(newPrice);

        const sanitizedPrice = newPrice
        setSelectedServices(prevServices => {
            const newServices = [...prevServices];
            const updatedOptions = [...newServices[activeServiceIndex].options];
            updatedOptions[optionsArrayIndex] = {
                ...updatedOptions[optionsArrayIndex],
                name: newName,
                price: sanitizedPrice,
                time: newTime,
            };
            newServices[activeServiceIndex] = {
                ...newServices[activeServiceIndex],
                options: updatedOptions,
            };
            return newServices;
        });
    };

    const handleChangeServiceDescription = (e: any) => {
        const newDescription = e.target.value
        setSelectedServices(prevServices => {
            const newServices = [...prevServices];
            newServices[activeServiceIndex] = {
                ...newServices[activeServiceIndex],
                description: newDescription,
            };
            return newServices;
        });
    }

    return (
        <div className='px-4 py-4'>
            <BackButton light={true} title='Create Your Barber Account' />
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
                <div className='grid grid-cols-1 md:grid-cols-3 gap-2 mt-10'>
                    <div className='flex flex-col md:col-span-2'>
                        <div className='text-lg font-semibold'>Set-Up Business Profile</div>
                        <div className='flex flex-col items-start py-3 px-4 border border-inputGray rounded-3xl mt-2 shadow-sm '>
                            <div className='font-semibold'>Instagram account</div>
                            <div className='bg-inputGray flex flel-row items-center justify-start pl-4 rounded-xl w-full mt-2'>
                                <img src={images.instagram} className='w-4' />
                                <input placeholder='Add Link' className='w-full bg-transparent text-sm h-10 focus:outline-none pl-2' />
                            </div>
                            <textarea placeholder='Description' className='bg-inputGray w-full mt-2 rounded-xl px-4 py-2 focus:outline-none resize-none h-36'></textarea>
                            <div className='bg-inputGray flex flel-row items-center justify-between px-4 py-1 rounded-xl w-full mt-2'>
                                <div className=''>
                                    <div className='text-sm text-textGray'>Time</div>
                                    <div className='font-semibold'>06:00 AM - 10:00 PM</div>
                                </div>
                                <img src={images.clock} className='w-6' />
                            </div>
                            <div className='mt-6'>
                                <div className='text-textGray text-sm'>Choose your day off from work</div>
                                <div className='flex flex-row items-center gap-4 mt-2 flex-wrap'>
                                    {
                                        days?.map((item: string, index: number) => {
                                            return (
                                                <div key={index}>
                                                    <SmallButton title={item} dark={offDays.includes(item) ? true : false} onClick={() => handleSelectDays(item)} />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <div className='text-lg font-semibold'>Set-Up Services</div>
                        <div
                            className='flex flex-col items-center h-full border border-inputGray rounded-3xl mt-2 p-4 shadow-sm'
                        >
                            <div className='text-textGray font-semibold'>Choose from the options below to set up the services offered at your barber shop</div>
                            {
                                servicesData?.map((item: any, index: number) => {
                                    return (
                                        <div
                                            onClick={() => handleServicePressed(item)}
                                            key={index} className='bg-inputGray w-full py-6 mt-4 rounded-xl flex flex-col items-center justify-center font-semibold cursor-pointer'>
                                            <img src={item?.icon} className='w-14 mb-2' />
                                            {item?.name}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='mt-10'>
                    <div className='text-lg font-semibold'>Services Added</div>
                    <div className='text-sm mt-1 text-textGray'>Your service have been added successfully</div>
                    <div className='grid grid-cols-2 gap-2'>
                        {
                            selectedServices?.map((item: any, index: number) => {
                                return (
                                    <div key={index} className='border flex flex-row items-center justify-between border-inputGray rounded-3xl mt-2 p-4 shadow-sm'>
                                        <div className='flex flex-row'>
                                            <div className='bg-inputGray p-6 rounded-md'>
                                                <img src={item?.icon} className="w-10" />
                                            </div>
                                            <div className='ml-4'>
                                                <div className='text-lg font-bold'>{item?.name}</div>
                                                <div className='text-textGray bg-red-500 w-[90%] overflow-hidden break-words whitespace-normal'>{item?.description}</div>
                                            </div>
                                        </div>
                                        <div>icon</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='mt-10'>
                    <div className='text-lg font-semibold'>Outlet Tags</div>
                    <div className='text-sm mt-1 text-textGray'>Tailor Your Profile: Choose Tags That Represent Your Barbering Style!</div>
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
            {
                showUpdateServiceModal &&
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => !loader && setShowUpdateServiceModal(false)}>
                    <div className='bg-white w-[95%] sm:w-[50%] lg:w-[30%] xl:w-[25%] flex flex-col items-start rounded-xl p-4 shadow-lg max-h-[80vh] overflow-scroll hide-scrollbar' onClick={(e) => e.stopPropagation()}>
                        <div className='flex flex-row items-center justify-between w-full font-bold text-lg'>
                            {selectedServices[activeServiceIndex]?.name}
                            {/* <img src={images.cross} className='w-4 cursor-pointer' /> */}
                        </div>
                        {
                            selectedServices[activeServiceIndex].pictures?.length > 0 ? (
                                <div> {selectedServices[activeServiceIndex].pictures?.length}</div>
                            ) : (
                                <div className='bg-inputGray cursor-pointer active:opacity-50 w-full flex flex-col items-center justify-center py-10 rounded-xl mt-6'>
                                    <img src={images.uploadGray} />
                                    Add Service Pictures
                                </div>
                            )
                        }
                        {
                            selectedServices[activeServiceIndex].options?.length > 0 ? (
                                <div className='w-full mt-4'>
                                    <div className='grid grid-cols-11 w-full gap-2'>
                                        <div></div>
                                        <div className='col-span-4  font-semibold'>{`${selectedServices[activeServiceIndex]?.name} style`}</div>
                                        <div className='col-span-3 font-semibold'>Time</div>
                                        <div className='col-span-3 font-semibold'>Price</div>
                                    </div>
                                    {
                                        selectedServices[activeServiceIndex]?.options?.map((item: any, index: number) => {
                                            return (
                                                <div key={index}
                                                    className='grid grid-cols-11 w-full gap-2 mt-2'
                                                >
                                                    <img src={images.deleteService}
                                                        onClick={() => handleDeleteOptionInService(index)}
                                                        className='w-[25px] cursor-pointer mx-auto' />
                                                    <input className='col-span-4 focus:outline-none border border-inputGray rounded-md pl-2 h-8'
                                                        onChange={(e) => updateServiceOption(index, e.target.value, item.price, item.time)} value={item.name} placeholder='Name' />
                                                    <input className='col-span-3 focus:outline-none border border-inputGray rounded-md pl-2 h-8' value={item?.time} placeholder='Minutes'
                                                        onChange={(e) => updateServiceOption(index, item.name, item.price, e.target.value)}
                                                    />
                                                    <input className='col-span-3 focus:outline-none border border-inputGray rounded-md pl-2 h-8' value={`$ ${item.price}`} placeholder=''
                                                        // onChange={(e) => updateServiceOption(index, item.name, e.target.value, item.time)}
                                                        onChange={(e) => {
                                                            // Remove the '$' sign and pass the numeric value for further updates
                                                            const valueWithoutDollar = e.target.value.replace(/[^0-9.]/g, ''); // Allow only numbers and a dot
                                                            updateServiceOption(index, item.name, valueWithoutDollar, item.time);
                                                        }}
                                                    />
                                                </div>
                                            )
                                        })
                                    }

                                    <div className='flex flex-row items-end justify-end mt-2'>
                                        <SmallButton title='Add more' dark={true} image={images.addWhite} smallImage={true} onClick={handleAddOptionInService} />
                                    </div>
                                </div>
                            ) : (
                                <div className='mt-4 w-full'>
                                    <SmallButton smallImage={true} image={images.addWhite} title={`Add ${selectedServices[activeServiceIndex]?.name} style`} dark={true} onClick={handleAddOptionInService} />
                                </div>
                            )
                        }
                        <div className='w-full mt-4'>
                            <div className='font-semibold'>Description</div>
                            <textarea
                                onChange={handleChangeServiceDescription}
                                value={selectedServices[activeServiceIndex]?.description} placeholder='Description' className='bg-inputGray w-full mt-2 rounded-xl px-4 py-2 focus:outline-none resize-none h-32'></textarea>
                        </div>
                        {/* <div className='mx-auto'>
                            <SmallButton title='Save Changes' dark={true} long={true}/>
                        </div> */}
                    </div>
                </div>
            }
        </div>
    )
}

export default CreateBarberProfile