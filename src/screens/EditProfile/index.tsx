import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import Button from "../../components/Button";
import SmallButton from "../../components/SmallButton";
import { deleteAccount, updateProfile, uploadProfile, verifyPassword } from "../../services/config/Api";
import { Toast } from "../../components/Toast";
import { useDispatch, useSelector } from "react-redux";
import { selectRole } from "../../Store/Role";
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import { selectUser, setUser } from "../../Store/userDataSlice";
import BottomToTopAnimation from "../../components/BottomToTopAnimation";
import RightToLeftAnimation from "../../components/RightToLeftAnimation";
import { handleLogout } from "../../components/SideBar";
import { useOutletContext } from "react-router-dom";

type Props = {};

const EditProfile = (props: Props) => {
  const { setShowLogoutModal } = useOutletContext<{ setShowLogoutModal: boolean }>();
  const role = useSelector(selectRole);
  const dispatch = useDispatch();
  const authToken = useSelector(selectAuthToken);
  const userData = useSelector(selectUser);

  const [selectedGender, setSelectedGender] = useState(null);
  const [serviceImageLoader, setServiceImageLoader] = useState<boolean>(false);
  const [loader, setLoader] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showDeleteAcountModal, setShowDeleteAcountModal] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [showPass, setShowPass] = useState<boolean>(false)
  const [verifyDelAccEmailLoader, setVerifyDelAccEmailLoader] = useState<boolean>(false)
  const [deletePassValid, setDeletePassValid] = useState<boolean>(false)

  const handleGenderToggle = (gender: any) => {
    setSelectedGender(selectedGender === gender ? null : gender);
  };

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const imageUrl = URL.createObjectURL(file);
  //     setSelectedImage(imageUrl);
  //   }
  // };

  const handleUploadProfile = async (e: any) => {
    try {
      setServiceImageLoader(true);
      const selectedFile = e.target.files[0];
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await uploadProfile(formData);
      if (response?.success) {
        setSelectedImage(response?.url);
        setServiceImageLoader(false);
      } else {
        Toast("error", response?.message);
        setServiceImageLoader(false);
      }
    } catch (error) {
      console.log(error);
      setServiceImageLoader(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoader(true);
      const userBody = {
        name,
        profile: selectedImage,
        // gender: selectedGender,
      };
      const BarberBody = {
        name,
        profile: selectedImage,
        phone,
        // gender: selectedGender,
        // description,
        // time: `${formatTime(startTime)} - ${formatTime(endTime)}`,
      };
      const response = (await updateProfile(
        role == "user" ? userBody : BarberBody,
        authToken
      )) as { status: any; data: any };
      if (response.status == 200) {
        setLoader(false);
        Toast("success", response?.data?.message);
        dispatch(setUser(response?.data?.updatedUser));
      } else {
        setLoader(false);
        Toast("error", response?.data?.message);
      }
    } catch (error: any) {
      setLoader(false);
      console.log(error);
      Toast("error", error?.message);
    }
  };

  useEffect(() => {
    if (userData) {
      if (role == "user") {
        setSelectedImage(userData?.profile);
        setEmail(userData?.email);
        setName(userData?.name);
      } else {
        setSelectedImage(userData?.profile);
        setEmail(userData?.email);
        setName(userData?.name);
        setPhone((userData as any).phone);
      }
    }
  }, [userData]);

  const handleVerifyPassword = async () => {
    try {
      if (!password) {
        return Toast("error", 'Please enter your password')
      }
      setVerifyDelAccEmailLoader(true)
      const body = { password }
      const response = await verifyPassword(body, authToken) as { status: any }
      if (response?.status === 200) {
        setVerifyDelAccEmailLoader(false)
        setDeletePassValid(true)
      } else {
        setVerifyDelAccEmailLoader(false)
        Toast("error", 'Invalid password')
      }
    } catch (error) {
      setVerifyDelAccEmailLoader(false)
      console.log(error);
      Toast('error', 'Something wents wrong, try again later')
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setVerifyDelAccEmailLoader(true)
      const response = await deleteAccount(authToken) as { status: any, data: any }
      if (response?.status === 200) {
        setVerifyDelAccEmailLoader(false)
        Toast("success", 'Your account has been deleted successfully.', () => {
          handleLogout(dispatch, setShowLogoutModal)
        })
      } else {
        setVerifyDelAccEmailLoader(false)
        Toast("error", response?.data?.message)
      }
    } catch (error) {
      setVerifyDelAccEmailLoader(false)
      console.log(error);
    }
  }

  return (
    <div className="px-4 md:px-10 mb-5">
      <div className="text-2xl font-bold border-b-2 pb-4">Edit Profile</div>
      <div className="mt-10">
        <div className="flex flex-col md:flex-row items-center ">
          <img
            src={
              selectedImage
                ? selectedImage
                : userData?.gender === "male"
                  ? images.male
                  : images.female
            }
            alt="ProfilePicture"
            className="w-20 h-20 rounded-full border object-cover"
          />
          <label
            htmlFor="upload-photo"
            className="flex flex-row items-center cursor-pointer active:opacity-20 mt-4 md:ml-5"
          >
            {serviceImageLoader ? (
              <div
                className="inline-block h-6 w-6 mr-2 animate-spin rounded-full border-[3px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
              ></div>
            ) : (
              <img
                src={images.uploadProfile}
                alt="UploadPhoto"
                className="w-6 mr-2"
              />
            )}

            <div className="text-2xl font-semibold underline underline-offset-2 ">
              Upload Photo
            </div>
            <input
              id="upload-photo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (!serviceImageLoader) {
                  handleUploadProfile(e);
                }
              }}
              className="hidden"
              disabled={serviceImageLoader}
            />
          </label>
        </div>
        <div className="mt-4 md:mt-10 flex flex-col items-center md:items-start">
          <div className="bg-inputGray flex flex-row items-center justify-start px-4 w-full max-w-[600px] rounded-lg mb-5">
            <img src={images.user} className="w-4 filter" />
            <input
              placeholder={"Name"}
              className="w-full bg-transparent h-12 focus:outline-none pl-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="bg-inputGray flex flex-row items-center justify-start px-4 w-full max-w-[600px] rounded-lg mb-5">
            <img src={images.email} className="w-4" />
            <input
              placeholder={"Email"}
              className="w-full bg-transparent h-12 focus:outline-none pl-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
          </div>
          {role === "barber" && (
            <div className="bg-inputGray flex flex-row items-center justify-start px-4 w-full max-w-[600px] rounded-lg mb-5">
              <img src={images.phone} className="w-4" />
              <input
                type="number"
                placeholder="Phone Number"
                className="w-full bg-transparent h-12 focus:outline-none pl-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex flex-row gap-2">
          <div
            className="bg-black w-full max-w-[160px] flex justify-center items-center rounded-lg h-10 mt-10 mx-auto md:mx-0 cursor-pointer active:opacity-10"
            onClick={handleUpdateProfile}
          >
            <SmallButton dark title="Save" loader={loader} />
          </div>
          <div
            className="bg-red-600 w-full max-w-[160px] flex justify-center items-center rounded-lg h-10 mt-10 mx-auto md:mx-0 cursor-pointer active:opacity-10"
            onClick={() => setShowDeleteAcountModal(true)}
          >
            <div className="text-white">Delete Account</div>
          </div>
        </div>

      </div>
      {
        showDeleteAcountModal &&
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 max-w-[2800px] mx-auto z-50 select-none">
          {
            deletePassValid ?
              <RightToLeftAnimation className="bg-white w-[90%] sm:w-4/5 md:w-2/3 lg:w-1/3 flex flex-col p-2 xs:p-6 rounded-xl shadow-lg">
                <div className="font-semibold text-black text-lg text-center">Delete Account</div>
                <div className="mt-2 text-black text-md text-center">
                  You're about to delete all th data in your TruBarber account. Are you absolute positive to delete your account? There is no option to undo.
                </div>

                <div className="flex flex-row items-center justify-between mt-4">
                  <div
                    onClick={() => !verifyDelAccEmailLoader && handleDeleteAccount()}
                    className="bg-red-600 w-[45%] xs:w-[35%] md:w-[40%] flex justify-center items-center rounded-lg h-10 cursor-pointer active:opacity-10 flex flex-row items-center">
                    {
                      verifyDelAccEmailLoader ?
                        <div
                          className={`inline-block h-5 w-5 animate-spin rounded-full border-[2px] border-white border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white`}
                          role="status">
                        </div> :
                        <div className="text-white">Delete Account</div>
                    }
                  </div>
                  <div className="w-[30%] sm:w-[20%] self-start">
                    <SmallButton title="Cancel" dark={false} onClick={() => {
                      if (!verifyDelAccEmailLoader) {
                        setDeletePassValid(false)
                        setShowDeleteAcountModal(false)
                        setPassword('')
                      }
                    }} />
                  </div>
                </div>
              </RightToLeftAnimation> :
              <BottomToTopAnimation className="bg-white w-[90%] sm:w-4/5 md:w-2/3 lg:w-1/3 flex flex-col p-2 xs:p-6 rounded-xl shadow-lg">
                <div className="font-semibold text-black text-lg text-center">Delete Account</div>
                <div className="mt-2 text-black text-md text-center">To confirm your account deletion, please verify you account password.</div>
                <div className='bg-inputGray flex flex-row items-center justify-start px-4 rounded-lg mt-2 sm:w-[80%] mx-auto mt-4'>
                  <img src={images.password} className='w-4' />
                  <input placeholder='Password' value={password} type={showPass ? 'text' : 'password'} className='w-full bg-transparent h-12 focus:outline-none pl-2' onChange={(e) => setPassword(e.target.value)} />
                  <img src={!showPass ? images.eyeOff : images.eye} className='w-5 cursor-pointer' onClick={() => setShowPass(!showPass)} />
                </div>
                <div className="flex flex-row items-center justify-between">
                  <div className="mt-4 w-[30%] sm:w-[20%] self-end">
                    <SmallButton title="Continue" dark onClick={handleVerifyPassword} loader={verifyDelAccEmailLoader} />
                  </div>
                  <div className="mt-4 w-[30%] sm:w-[20%] self-start">
                    <SmallButton title="Cancel" dark={false} onClick={() => {
                      if (!verifyDelAccEmailLoader) {
                        setDeletePassValid(false)
                        setShowDeleteAcountModal(false)
                        setPassword('')
                      }
                    }} />
                  </div>
                </div>
              </BottomToTopAnimation>
          }

        </div>
      }
    </div>
  );
};

export default EditProfile;
