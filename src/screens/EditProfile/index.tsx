import React, { useState } from "react";
import images from "../../services/config/images";
import Button from "../../components/Button";
import SmallButton from "../../components/SmallButton";

type Props = {};

const EditProfile = (props: Props) => {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleGenderToggle = (gender: any) => {
    setSelectedGender(selectedGender === gender ? null : gender);
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="px-4 md:px-10 mb-5">
      <div className="text-2xl font-bold border-b-2 pb-4">
        Edit Profile
      </div>
      <div className="mt-10">
        <div className="flex flex-col md:flex-row items-center ">
          <img
            src={selectedImage || images.reviewBarber}
            alt="ProfilePicture"
            className="w-20 h-20 rounded-full border object-cover"
          />
          <label
            htmlFor="upload-photo"
            className="flex flex-row items-center cursor-pointer active:opacity-20 hover:bg-gray-100 mt-4 md:ml-5"
          >
            <img
              src={images.uploadProfile}
              alt="UploadPhoto"
              className="w-6 mr-2"
            />
            <div className="text-2xl font-semibold underline underline-offset-2 ">
              Upload Photo
            </div>
            <input
              id="upload-photo"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        <div className="mt-4 md:mt-10 flex flex-col items-center md:items-start">
          <div className="bg-inputGray flex flex-row items-center justify-start px-4 w-full max-w-[600px] rounded-lg mb-5">
            <img src={images.user} className="w-4 filter" />
            <input
              placeholder="Name"
              className="w-full bg-transparent h-12 focus:outline-none pl-2"
            />
          </div>
          <div className="bg-inputGray flex flex-row items-center justify-start px-4 w-full max-w-[600px] rounded-lg mb-5">
            <img src={images.email} className="w-4" />
            <input
              placeholder="Email"
              className="w-full bg-transparent h-12 focus:outline-none pl-2"
            />
          </div>
        </div>
        <div className="text-xl my-5 text-textGray text-center md:text-start">
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
        </div>
        <div className="bg-black w-full max-w-[160px] flex justify-center items-center rounded-lg h-10 mt-10 mx-auto md:mx-0 cursor-pointer active:opacity-10">
          <div className="text-white text-lg">Save</div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
