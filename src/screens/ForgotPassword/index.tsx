import React, { useState } from 'react'
import BackButton from '../../components/BackButton'
import { useNavigate } from 'react-router-dom'
import images from '../../services/config/images'
import Button from '../../components/Button'
import { useSelector } from 'react-redux'
import { selectRole } from '../../Store/Role'
import { handleForgotPass } from '../../services/config/Api'
import { Toast } from '../../components/Toast'
import OtpInput from 'react-otp-input';

type Props = {}

const ForgotPassword = (props: Props) => {
    const navigate = useNavigate()
    const role = useSelector(selectRole)

    const [email, setEmail] = useState<string>('')
    const [loader, setLoader] = useState<boolean>(false)
    const [otp, setOtp] = useState<string>('')

    const handleConfirm = async () => {
        try {
            if (!email) {
                return Toast('error', "Enter email")
            }
            setLoader(true)
            const body = { email, role }
            const response = await handleForgotPass(body) as { status: any, data: any }
            if (response?.status == 200) {
                setLoader(false)
                console.log("=--=-=-=-=asd", response?.data?.otp);
                //   navigation.navigate('Otp', { email, otp: response?.data?.otp })
            } else {
                setLoader(false)
                Toast('error', response?.data?.message)
            }
        } catch (error) {
            setLoader(false)
            console.log(error);
            Toast('error', 'something wants wrong')
        }
    }
    return (
        <div className='w-full lg:h-screen flex flex-col lg:flex-row items-center justify-between'>
            <div
                className="relative lg:h-full bg-white h-[40vh] md:h-[60vh] w-full lg:w-[85%] xl:w-[70%] flex flex-col items-start justify-between pl-4 py-4 lg:pl-10 lg:py-8 bg-cover md:bg-center lg:bg-contain xl:bg-cover bg-no-repeat">
                <img src={images.signinBG} className='w-full h-full absolute top-0 left-0 p-2 rounded-3xl ' />
                <BackButton light={false} />
                <div className='z-10 '>
                    <img src={images.truLogo} className='w-1/6 cursor-pointer' onClick={() => navigate('/')} />
                    <div className='w-[95%] text-white mt-8  text-xs md:text-base lg:text-lg'>Join our community and stay connected. Whether you're here to book your next haircut, check your appointments, or manage your account, we’ve got you covered.</div>
                </div>
            </div>
            <div className='h-full lg:w-1/2 w-full flex flex-col items-center justify-center lg:justify-between py-8 md:py-14 lg:mt-0 ml-0 lg:ml-4 xl-ml-10 h-[60%]'>
                <div className='w-full px-4 w-[100%] sm:w-[80%] md:w-[60%] lg:w-[90%]'>
                    <div className='text-xl font-medium'>Forgot password ?</div>
                    <div className='text-sm font-normal mt-2'>Please enter your email to receive a verification code</div>
                    <div className='mt-4 lg:mt-8'>
                        <div className='bg-inputGray flex flel-row items-center justify-start pl-4 rounded-lg'>
                            <img src={images.email} className='w-4' />
                            <input placeholder='Email' className='w-full bg-transparent h-12 focus:outline-none pl-2'
                                onChange={(e) => setEmail(e.target.value)} value={email}
                            />
                        </div>
                    </div>
                </div>
                <div className='w-full px-4 w-[100%] sm:w-[80%] md:w-[60%] lg:w-[90%]'>
                    <div className='flex flex-row justify-center'>
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={4}
                            renderInput={(props) => <input {...props} />}
                            inputStyle={{ width: '50px', height: '50px', backgroundColor: '#E2E2E2', outline: 'none', borderRadius: '10px', fontSize: '20px' }}
                            containerStyle={{ display: 'flex', gap: 10 }}
                        />
                    </div>
                </div>
                <div className='w-full px-4 w-[100%] sm:w-[80%] md:w-[60%] lg:w-[90%] mt-16 md-mt-0'>
                    <Button title='Next'
                        onClick={handleConfirm}
                        mt={"50px"} light={false} loader={loader} />
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword