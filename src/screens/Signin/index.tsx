import React, { useState } from 'react'
import images from '../../services/config/images'
import { useDispatch, useSelector } from 'react-redux'
import { selectRole, setRole } from '../../Store/Role'
import Button from '../../components/Button'
import BackButton from '../../components/BackButton'

type Props = {}

const Signin = (props: Props) => {

    const dispatch = useDispatch()

    const role = useSelector(selectRole)

    const [loader, setLoader] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [showPass, setShowPass] = useState<boolean>(false)

    const handleSetRole = (role: string) => {
        dispatch(setRole(role))
    }

    const handleConfirm = async () => {

    }

    return (
        <div className='w-full lg:h-screen flex flex-col lg:flex-row items-start justify-between'>
            <div
                className="relative lg:h-full bg-white h-[40vh] md:h-[60vh] w-full lg:w-[85%] xl:w-[70%] flex flex-col items-start justify-between pl-4 py-4 lg:pl-10 lg:py-8 bg-cover md:bg-center lg:bg-contain xl:bg-cover bg-no-repeat">
                <img src={images.signinBG} className='w-full h-full absolute top-0 left-0 p-2 rounded-3xl shadow-xl' />
                <BackButton light={false}/>
                <div className='z-10 '>
                    <img src={images.truLogo} className='w-1/6 ' />
                    <div className='w-[95%] text-white mt-8  text-xs md:text-base lg:text-lg'>Join our community and stay connected. Whether you're here to book your next haircut, check your appointments, or manage your account, we’ve got you covered.</div>
                </div>
                {/* <div className='text-hoverGray mt-4 text-xs md:text-base z-10 w-[95%]'>By signing up I agree to the the Privacy Policy and Terms and Condition</div> */}
            </div>
            <div className='h-full lg:w-1/2 w-full flex flex-col items-center justify-center lg:justify-between py-8 md:py-14 lg:mt-0 ml-0 lg:ml-4 xl-ml-10'>
                <div className='w-full px-4 w-[100%] sm:w-[80%] md:w-[60%] lg:w-[90%]'>
                    <div className='flex'>
                        <div className='bg-inputGray p-2 rounded-lg flex flex-row items-center justify-center mx-auto w-auto mb-4'>
                            <div className={`w-28  text-center py-1 rounded-lg cursor-pointer ${role === 'user' && 'bg-black text-white'}`} onClick={() => handleSetRole('user')}>User</div>
                            <div className={`w-28  text-center py-1 rounded-lg cursor-pointer ${role === 'barber' && 'bg-black text-white'}`} onClick={() => handleSetRole('barber')}>Barber</div>
                        </div>
                    </div>
                    <div className='text-xl font-medium'>Sign In</div>
                    <div className='text-md md:text-xl lg:text-4xl xl:text-5xl mt-2 font-bold w-full'>Welcome Back to TRU Barber</div>
                    <div className='text-sm font-normal mt-2'>Log in to book appointments, check schedules, and keep your style sharp</div>
                    <div className='mt-4 lg:mt-8'>
                        <div className='bg-inputGray flex flel-row items-center justify-start pl-4 rounded-lg'>
                            <img src={images.email} className='w-4' />
                            <input placeholder='Email' className='w-full bg-transparent h-12 focus:outline-none pl-2' onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='bg-inputGray flex flel-row items-center justify-start px-4 rounded-lg mt-2'>
                            <img src={images.password} className='w-4' />
                            <input placeholder='Password' type={showPass ? 'text' : 'password'} className='w-full bg-transparent h-12 focus:outline-none pl-2' onChange={(e) => setPassword(e.target.value)} />
                            <img src={showPass ? images.eyeOff : images.eye} className='w-5 cursor-pointer' onClick={() => setShowPass(!showPass)} />
                        </div>
                    </div>
                    <div className='text-sm font-bold mt-4 text-right cursor-pointer'>Forgot password?</div>
                    <Button title='Sign In' onClick={handleConfirm} mt={"50px"} loader={loader} light={false} />
                </div>
                <div className='w-full px-4 w-[100%] sm:w-[80%] md:w-[60%] lg:w-[90%] mt-16 md-mt-0'>
                    <div className='text-center font-semibold text-hoverGray '>Don’t have an account?</div>
                    <Button title='Sign Up' onClick={handleConfirm} mt={"50px"} loader={loader} light />
                </div>
            </div>
        </div>
    )
}

export default Signin