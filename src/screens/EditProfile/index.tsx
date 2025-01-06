import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import Button from "../../components/Button";
import SmallButton from "../../components/SmallButton";
import { updateProfile, uploadProfile } from "../../services/config/Api";
import { Toast } from "../../components/Toast";
import { useDispatch, useSelector } from "react-redux";
import { selectRole } from "../../Store/Role";
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import { selectUser, setUser } from "../../Store/userDataSlice";

type Props = {};

const EditProfile = (props: Props) => {
  const role = useSelector(selectRole);
  const dispatch = useDispatch();
  const authToken = useSelector(selectAuthToken);
  const userData = useSelector(selectUser);
  console.log("userdatata ===>>", userData);

  const [selectedGender, setSelectedGender] = useState(null);
  const [serviceImageLoader, setServiceImageLoader] = useState<boolean>(false);
  const [loader, setLoader] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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
        console.log("response", response);
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
        {/* <div className="text-xl my-5 text-textGray text-center md:text-start">
          Select Your Gender
        </div>
        <div className="flex flex-row justify-between w-full max-w-[250px] mx-auto md:mx-0">
          <div
            className="flex flex-row items-center cursor-pointer"
            onClick={() => handleGenderToggle("male")}
          >
            <img
              src={
                selectedGender === "male"
                  ? images.checkboxMarked
                  : images.checkbox
              }
              className="w-5 mr-2"
            />
            <div className="text-textGray text-lg">Male</div>
          </div>
          <div
            className="flex flex-row items-center cursor-pointer"
            onClick={() => handleGenderToggle("female")}
          >
            <img
              src={
                selectedGender === "female"
                  ? images.checkboxMarked
                  : images.checkbox
              }
              className="w-5 mr-2"
            />
            <div className="text-textGray text-lg">Female</div>
          </div>
        </div> */}
        <div
          className="bg-black w-full max-w-[160px] flex justify-center items-center rounded-lg h-10 mt-10 mx-auto md:mx-0 cursor-pointer active:opacity-10"
          onClick={handleUpdateProfile}
        >
          {/* <div className="text-white text-lg">Save</div> */}
          <SmallButton dark title="Save" loader={loader} />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
