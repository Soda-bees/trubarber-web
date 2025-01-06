import React, { useRef, useState } from "react";
import BackButton from "../../components/BackButton";
import images from "../../services/config/images";
import SmallButton from "../../components/SmallButton";
import { Toast } from "../../components/Toast";
import TimePicker from "react-time-picker";
import moment from "moment";
import { useLocation } from "react-router-dom";
import {
  handleBarberSignup,
  uploadMultiplesImages,
  uploadProfile,
} from "../../services/config/Api";
import { useDispatch, useSelector } from "react-redux";
import { selectLocation, setLocation } from "../../Store/LocationSlice";
import { setUser } from "../../Store/userDataSlice";
import { setAuthToken } from "../../Store/AuthTokenSlice";
import { setRole } from "../../Store/Role";

type Props = {};

const CreateBarberProfile = (props: Props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const reduxLocation = useSelector(selectLocation);
  // console.log("location from Redux ==========>>", reduxLocation);

  const userData = location.state?.userData;
  // console.log('data from previous screen', userData);

  const [gender, setGender] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [tagSelection, setTagSelection] = useState<string[]>([
    "#OfferedServices",
    "#HaircutStyles",
    "#Prices",
    "#ConvenientBooking",
    "#CustomerFeedback",
    "#BeardTrim",
    "#Stylists",
    "#CustomerService",
  ]);
  const [selectedTagSelection, setSelectedTagSelection] = useState<string[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [days, setDays] = useState<string[]>([
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ]);
  const [offDays, setOffDays] = useState<string[]>([]);
  const [servicesData, setserviceData] = useState([
    {
      icon: "https://res.cloudinary.com/doohobw9k/image/upload/v1726222601/TruBarber/Services/ojjwvvfvc2ovrtrkjumo.png",
      name: "Haircut",
    },
    {
      icon: "https://res.cloudinary.com/doohobw9k/image/upload/v1726222538/TruBarber/Services/yvg6ctijk3ann6a0ty5i.png",
      name: "Beard",
    },
  ]);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [activeServiceIndex, setActiveServiceIndex] = useState<any>();
  const [showUpdateServiceModal, setShowUpdateServiceModal] =
    useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [serviceImageLoader, setServiceImageLoader] = useState<boolean>(false);
  const [instagram, setInstagram] = useState<string>("https://");
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<any>({
    index: null,
    type: null,
  });
  const [imgUri, setImgUri] = useState<any>("");

  const handleSetGender = (selected: string) => {
    setGender(selected);
  };

  const handleSetTagSelection = (item: string) => {
    setSelectedTagSelection((prevSelectedTag) => {
      if (prevSelectedTag.includes(item)) {
        return prevSelectedTag.filter((tag) => tag !== item);
      } else {
        return [...prevSelectedTag, item];
      }
    });
  };

  const [currentPosition, setCurrentPosition] = useState({
    lat: 30.8157976264542,
    lng: 70.04061958392309,
  });

  const handleAccessLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log("Current Position:", newPosition);
          dispatch(setLocation(newPosition));
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            Toast(
              "error",
              "Location access denied. Please enable location access in your browser settings."
            );
          } else {
            Toast("error", `Error fetching location: ${error.message}`);
          }
        }
      );
    } else {
      Toast("error", "Geolocation is not supported by this browser.");
    }
  };

  const handleSelectDays = async (item: string) => {
    setOffDays((prevOffDays) => {
      if (prevOffDays.includes(item)) {
        return prevOffDays.filter((day) => day !== item);
      } else {
        return [...prevOffDays, item];
      }
    });
  };

  const handleServicePressed = (service: any) => {
    const updatedService = {
      ...service,
      pictures: [],
      description: "",
      options: [{ name: "", price: "", time: "" }],
    };

    setSelectedServices((prevSelecteditem) => {
      const index = prevSelecteditem.findIndex(
        (item: any) => item.name === updatedService.name
      );

      if (index !== -1) {
        setActiveServiceIndex(index);
        setShowUpdateServiceModal(true);
        return prevSelecteditem;
      } else {
        const newIndex = prevSelecteditem.length;
        setActiveServiceIndex(newIndex);
        setShowUpdateServiceModal(true);

        return [...prevSelecteditem, updatedService];
      }
    });
  };

  const handleUpdateService = async (index: number) => {
    setActiveServiceIndex(index);
    setShowUpdateServiceModal(true);
  };

  const handleDeleteService = async (index: number) => {
    const updatedService = selectedServices.filter((_, i) => i !== index);
    setSelectedServices(updatedService);
  };

  const handleAddOptionInService = () => {
    setSelectedServices((prevServices) => {
      const newServices = [...prevServices];
      newServices[activeServiceIndex] = {
        ...newServices[activeServiceIndex],
        options: [
          ...newServices[activeServiceIndex].options,
          { name: "", price: "", time: "" },
        ],
      };
      return newServices;
    });
  };

  const handleDeleteOptionInService = (optionsArrayIndex: number) => {
    setSelectedServices((prevServices) => {
      const newServices = [...prevServices];
      const updatedOptions = newServices[activeServiceIndex].options.filter(
        (_: any, idx: any) => idx !== optionsArrayIndex
      );
      newServices[activeServiceIndex] = {
        ...newServices[activeServiceIndex],
        options: updatedOptions,
      };
      return newServices;
    });
  };

  const updateServiceOption = (
    optionsArrayIndex: number,
    newName: string,
    newPrice: string,
    newTime: string
  ) => {
    console.log(newPrice);

    const sanitizedPrice = newPrice;
    setSelectedServices((prevServices) => {
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
    const newDescription = e.target.value;
    setSelectedServices((prevServices) => {
      const newServices = [...prevServices];
      newServices[activeServiceIndex] = {
        ...newServices[activeServiceIndex],
        description: newDescription,
      };
      return newServices;
    });
  };

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [scheduleTiming, setScheduleTiming] = useState<any[]>([
    {
      avaiable: true,
      day: "Monday",
      startTime: new Date(),
      endTime: new Date(),
    },
    {
      avaiable: true,
      day: "Tueday",
      startTime: new Date(),
      endTime: new Date(),
    },
    {
      avaiable: true,
      day: "Wednesday",
      startTime: new Date(),
      endTime: new Date(),
    },
    {
      avaiable: true,
      day: "Thursday",
      startTime: new Date(),
      endTime: new Date(),
    },
    {
      avaiable: true,
      day: "Friday",
      startTime: new Date(),
      endTime: new Date(),
    },
    {
      avaiable: true,
      day: "Saturday",
      startTime: new Date(),
      endTime: new Date(),
    },
    {
      avaiable: true,
      day: "Sunday",
      startTime: new Date(),
      endTime: new Date(),
    },
  ]);

  const handleAvailabilityToggle = (index: number) => {
    setScheduleTiming((prevSchedule) =>
      prevSchedule.map((item, i) =>
        i === index ? { ...item, avaiable: !item.avaiable } : item
      )
    );
  };

  const handleSetSelectedIndex = (index: number, type: string) => {
    setSelectedIndex({ index, type });
    setShowTimeModal(true);
  };

  const handleCloseModal = () => {
    setShowTimeModal(false);
  };

  const formatTime = (time: any) => {
    if (!time) return "Invalid Time";
    const date = typeof time === "string" ? new Date(time) : time;
    if (isNaN(date.getTime())) return "Invalid Time";

    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleTimeChange = (time: string | null) => {
    if (time !== null) {
      const [hours, minutes] = time.split(":").map(Number);

      if (isNaN(hours) || isNaN(minutes)) {
        console.error("Invalid time format");
        return;
      }

      const currentDate = new Date();
      currentDate.setHours(hours);
      currentDate.setMinutes(minutes);
      currentDate.setSeconds(0);
      currentDate.setMilliseconds(0);

      const updatedScheduleTiming = [...scheduleTiming];
      if (selectedIndex?.index !== null) {
        updatedScheduleTiming[selectedIndex.index] = {
          ...updatedScheduleTiming[selectedIndex.index],
          [selectedIndex.type]: currentDate,
        };
      }

      console.log("Parsed Time:", currentDate);
      console.log("Updated Schedule Timing:", updatedScheduleTiming);

      setScheduleTiming(updatedScheduleTiming);
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput")?.click();
  };

  const handleUploadProfile = async (e: any) => {
    try {
      setServiceImageLoader(true);
      const selectedFile = e.target.files[0];
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await uploadProfile(formData);
      if (response?.success) {
        setProfileImage(response?.url);
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

  const handleUploadServiceImg = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });
      setServiceImageLoader(true);
      const response = (await uploadMultiplesImages(formData)) as {
        status: any;
        data: any;
      };
      if (response?.status === 200) {
        const uploadedUrls = response?.data?.images || [];
        setSelectedServices((prevServices) => {
          const newServices = [...prevServices];
          newServices[activeServiceIndex] = {
            ...newServices[activeServiceIndex],
            pictures: [
              ...newServices[activeServiceIndex].pictures,
              ...uploadedUrls,
            ],
          };
          return newServices;
        });
        setServiceImageLoader(false);
      } else {
        setServiceImageLoader(false);
      }
    } else {
      setServiceImageLoader(false);
      console.log("No files selected");
    }
  };

  const triggerServiceFileInput = () => {
    document.getElementById("service")?.click();
  };

  const handleRemoveImage = (pictureIndex: any) => {
    setSelectedServices((prevServices) => {
      const newServices = [...prevServices];
      newServices[activeServiceIndex] = {
        ...newServices[activeServiceIndex],
        pictures: newServices[activeServiceIndex].pictures.filter(
          (_: any, idx: any) => idx !== pictureIndex
        ),
      };
      return newServices;
    });
  };

  const handleSaveBarberService = (options: any) => {
    if (!options || options.length === 0) {
      return { success: false, message: "At least one catogery is required." };
    }

    for (const [index, option] of options.entries()) {
      const { name, price, time } = option;

      if (name.trim() === "") {
        return {
          success: false,
          message: `Please add catogery ${index + 1} name`,
        };
      }
      if ("time" in option && time.trim() === "") {
        return {
          success: false,
          message: `Please add catogery ${index + 1} time`,
        };
      }
      if (price.trim() === "") {
        return {
          success: false,
          message: `Please add catogery ${index + 1} price`,
        };
      }
    }

    return { success: true, message: "" };
  };

  const handleConfirmService = () => {
    const isValid = handleSaveBarberService(
      selectedServices[activeServiceIndex]?.options
    );
    if (selectedServices[activeServiceIndex].pictures?.length === 0) {
      return Toast("error", "Please upload at least one picture");
    }
    if (!isValid?.success) {
      return Toast("error", isValid?.message);
    }
    if (!selectedServices[activeServiceIndex].description) {
      return Toast("error", "Please add service description");
    } else {
      setShowUpdateServiceModal(false);
    }
  };

  const isValidInstagramLink = (url: any) => {
    const instagramRegex =
      /^(https?:\/\/)?(www\.)?instagram\.com\/([a-zA-Z0-9._]+)/;

    // Test the URL against the regex pattern
    return instagramRegex.test(url);
  };

  const handleCreate = () => {
    if (!reduxLocation) {
      Toast("error", "Please enable current Location");
      handleAccessLocation();
      return;
    }
    if (!profileImage) {
      return Toast("error", "Please upload Profile picture");
    }
    if (!gender) {
      return Toast("error", "Gender required");
    }
    if (!instagram) {
      return Toast("error", "Please provide your instagram profile link");
    }
    if (!isValidInstagramLink(instagram)) {
      return Toast(
        "error",
        "Please provide your correct instagram profile link"
      );
    }
    if (!description) {
      return Toast("error", "Please enter description");
    }
    if (!selectedServices[activeServiceIndex]) {
      return Toast("error", "Please select service");
    }
    if (selectedTagSelection?.length <= 0) {
      return Toast("error", "Please select tags");
    }
    if (!imgUri) {
      return Toast("error", "Please complete Business Verification");
    }
    setIsModalOpen(true);
  };

  const triggerBusinessFileInput = () => {
    document.getElementById("business")?.click();
  };

  const handleBusinessProfile = async (e: any) => {
    try {
      setServiceImageLoader(true);
      const selectedFile = e.target.files[0];
      const formData = new FormData();
      formData.append("image", selectedFile);
      const response = await uploadProfile(formData);
      if (response?.success) {
        setImgUri(response?.url);
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

  const handleSignUp = async () => {
    const updatedScheduled = scheduleTiming.map((item) => {
      const formattedStartTime = formatTime(item?.startTime);
      const formattedEndTime = formatTime(item?.endTime);
      const { startTime, endTime, ...rest } = item;
      console.log("format", formattedStartTime);

      return {
        ...rest,
        time: item?.avaiable
          ? `${formattedStartTime} - ${formattedEndTime}`
          : "",
      };
    });
    // console.log("updatedScheduled", updatedScheduled);
    try {
      setLoader(true);
      const updatedUserData = {
        ...userData,
        location: reduxLocation,
        gender,
        description,
        instagram,
        services: selectedServices,
        tagSelection: selectedTagSelection,
        businessVerification: imgUri,
        scheduled: updatedScheduled,
      };
      // console.log("userData", userData);
      // console.log("updatedUserData", updatedUserData);

      const response = (await handleBarberSignup(updatedUserData)) as {
        data: any;
        status: any;
      };

      if (response.status == 201) {
        setLoader(false);
        dispatch(setUser(response?.data?.barber));
        dispatch(setAuthToken(response?.data?.token));
        dispatch(setRole(response?.data?.barber?.role));
        console.log("signup ka res", response);
      } else {
        setLoader(false);
        Toast("error", response?.data?.message);
      }
    } catch (error: any) {
      setLoader(false);
      Toast("error", error?.message);
    }
  };

  // const handleConfirm = async () => {
  //   setLoader(true);
  //   setTimeout(() => {
  //     setLoader(false);
  //   }, 1500);
  // };

  return (
    <div className="px-4 py-4 w-full">
      <BackButton light={true} title="Create Your Barber Account" />
      <div className=" max-w-6xl mx-auto max-h-[94vh] overflow-scroll hide-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-10">
          <div className="flex flex-col md:col-span-2">
            <div className="text-lg font-semibold">
              Upload your profile picture
            </div>
            <div className="flex flex-row items-center p-3 border border-inputGray rounded-3xl mt-2 shadow-sm">
              <img
                src={profileImage || images.profileUpload}
                className="w-20 mr-4 sm:mr-10 rounded-3xl h-20"
              />
              <input
                id="fileInput"
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleUploadProfile}
              />
              <SmallButton
                title={"Upload Photo"}
                dark={true}
                image={images.uploadBtn}
                imgLoader={serviceImageLoader}
                onClick={triggerFileInput}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-lg font-semibold">Select Your Gender</div>
            <div className="flex flex-row md:flex-col lg:flex-row items-center justify-evenly p-4 md:p-0  h-full border border-inputGray rounded-3xl mt-2  shadow-sm">
              <SmallButton
                title={"Male"}
                dark={gender === "male" ? true : false}
                long={true}
                onClick={() => handleSetGender("male")}
              />
              <SmallButton
                title={"Female"}
                dark={gender === "female" ? true : false}
                long={true}
                onClick={() => handleSetGender("female")}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-10">
          <div className="flex flex-col md:col-span-2">
            <div className="text-lg font-semibold">Set-Up Business Profile</div>
            <div className="flex flex-col items-start py-3 px-4 border border-inputGray rounded-3xl mt-2 shadow-sm ">
              <div className="font-semibold">Instagram account</div>
              <div className="bg-inputGray flex flel-row items-center justify-start pl-4 rounded-xl w-full mt-2">
                <img src={images.instagram} className="w-4" />
                <input
                  placeholder="Add Link"
                  className="w-full bg-transparent text-sm h-10 focus:outline-none pl-2"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>
              <textarea
                placeholder="Description"
                className="bg-inputGray w-full mt-2 rounded-xl px-4 py-2 focus:outline-none resize-none h-36"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 gap-4 mt-5 w-full`}
              >
                {scheduleTiming.map((item, index) => {
                  return (
                    <div key={index} className="flex flex-row items-center">
                      <div
                        className={`w-12 h-10 rounded-md flex flex-row items-center justify-center mr-2 cursor-pointer ${
                          item?.avaiable ? "bg-inputGray" : "bg-disable"
                        }`}
                        onClick={() => handleAvailabilityToggle(index)}
                      >
                        <div
                          className={`w-[15px] h-[15px] rounded-sm ${
                            item?.avaiable ? "bg-green" : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                      <div
                        className={`h-10 w-full flex flex-row items-center justify-between rounded-md px-2 ${
                          item?.avaiable ? "bg-inputGray" : "bg-disable"
                        }`}
                      >
                        <div>{item?.day}</div>
                        <div className="flex flex-row items-center">
                          {!item?.avaiable ? (
                            <div className="text-sm text-black font-semibold">
                              Closed
                            </div>
                          ) : (
                            <>
                              <div
                                className="cursor-pointer"
                                onClick={() =>
                                  handleSetSelectedIndex(index, "startTime")
                                }
                              >
                                {formatTime(item?.startTime)}
                              </div>
                              <div className="mx-1">-</div>
                              <div
                                className="cursor-pointer"
                                onClick={() =>
                                  handleSetSelectedIndex(index, "endTime")
                                }
                              >
                                {formatTime(item?.endTime)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-lg font-semibold">Set-Up Services</div>
            <div className="flex flex-col items-center h-full border border-inputGray rounded-3xl mt-2 p-4 shadow-sm">
              <div className="text-textGray font-semibold">
                Choose from the options below to set up the services offered at
                your barber shop
              </div>
              {servicesData?.map((item: any, index: number) => {
                return (
                  <div
                    onClick={() => handleServicePressed(item)}
                    key={index}
                    className="bg-inputGray w-full py-6 mt-4 rounded-xl flex flex-col items-center justify-center font-semibold cursor-pointer"
                  >
                    <img src={item?.icon} className="w-14 mb-2" />
                    {item?.name}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {selectedServices?.length > 0 && (
          <div className="mt-10">
            <div className="text-lg font-semibold">Services Added</div>
            <div className="text-sm mt-1 text-textGray">
              Your service has been added successfully
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedServices?.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="border border-inputGray rounded-3xl p-4 shadow-sm flex flex-col justify-between relative"
                  >
                    <div className="flex">
                      <div className="bg-inputGray p-6 rounded-md w-24 h-24 flex-shrink-0">
                        <img src={item?.icon} className="w-10 h-10" />
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="text-lg font-bold break-words">
                          {`${item?.name} (${item?.options?.length} style)`}
                        </div>
                        <div className="text-textGray break-words overflow-hidden line-clamp-3 leading-5 max-h-[4.5rem]">
                          {item?.description}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-4">
                      <img
                        src={images.edit}
                        onClick={() => handleUpdateService(index)}
                        className="w-4 h-5 active:opacity-50 cursor-pointer"
                      />
                      <img
                        src={images.deleteIcon}
                        onClick={() => handleDeleteService(index)}
                        className="w-4 h-5 active:opacity-50 cursor-pointer"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-10">
          <div className="text-lg font-semibold">Outlet Tags</div>
          <div className="text-sm mt-1 text-textGray">
            Tailor Your Profile: Choose Tags That Represent Your Barbering
            Style!
          </div>
          <div className="p-3 border border-inputGray rounded-3xl p-6 mt-3 flex flex-row items-center gap-2 flex-wrap shadow-sm">
            {tagSelection?.map((item: string, index: number) => {
              return (
                <div key={index}>
                  <SmallButton
                    title={item}
                    dark={selectedTagSelection.includes(item) ? true : false}
                    onClick={() => handleSetTagSelection(item)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-10">
          <div className="text-lg font-semibold">Business Verification</div>
          <div className="text-sm mt-1 text-textGray">
            Verify Your Business: Upload Required Documents
          </div>
          <div className="p-3 border border-inputGray rounded-3xl p-6 mt-3 items-center gap-4 shadow-sm flex flex-col">
            <div className="w-full flex flex-wrap gap-4 justify-center"></div>
            {serviceImageLoader ? (
              <div
                className="inline-block h-10 w-10 animate-spin rounded-full border-[3px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
              ></div>
            ) : (
              <>
                <img
                  src={imgUri || images.businessImage}
                  alt="Placeholder"
                  className="w-20 h-20 object-contain mb-2"
                />
              </>
            )}
            <div className="text-textGray break-words w-[90%] text-sm text-center">
              Please attach your Business License or Registration Certificate
              for verification
            </div>
            <div className="text-textGray break-words w-[90%] text-sm text-center flex flex-row justify-center">
              Drag and drop your files here or
              <div
                className="font-bold text-black underline cursor-pointer ml-1"
                onClick={triggerBusinessFileInput}
              >
                choose files
              </div>
              <input
                id="business"
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleBusinessProfile}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <SmallButton
            title="Create"
            dark={true}
            long={true}
            onClick={handleCreate}
          />
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => !loader && setIsModalOpen(false)}
        >
          <div
            className="bg-white w-[95%] sm:w-[50%] lg:w-[30%] xl:w-[25%] flex flex-col items-center p-6 rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xl font-bold">Enhance Your Experience</div>
            <img src={images.congratulations} className="w-[20%] mt-10" />
            <div className="text-xl font-bold mt-4">Congratulations!</div>
            <div className="w-[50%] text-center text-sm text-textGray mt-2">
              Your Barber profile creation is now complete and ready to go.
            </div>
            <div className="w-full mt-6">
              <SmallButton
                title="Get ready"
                dark={true}
                loader={loader}
                onClick={handleSignUp}
              />
            </div>
          </div>
        </div>
      )}
      {showUpdateServiceModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          // onClick={() => !loader && setShowUpdateServiceModal(false)}
        >
          <div
            className="bg-white w-[95%] sm:w-[50%] lg:w-[30%] xl:w-[25%] flex flex-col rounded-xl p-4 shadow-lg max-h-[80vh] overflow-scroll hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center justify-between w-full font-bold text-lg">
              {selectedServices[activeServiceIndex]?.name}
              {/* <img src={images.cross} className='w-4 cursor-pointer' /> */}
            </div>
            {/* {selectedServices[activeServiceIndex].pictures?.length > 0 ? (
              <div>{selectedServices[activeServiceIndex].pictures?.length}</div>
            ) : (
              <div>
                <div className="bg-inputGray flex items-center justify-center py-2 px-2 rounded-xl mt-6">
                  <div className="w-full overflow-x-auto flex gap-4 hide-scrollbar">
                    {uploadServiceImages.length > 0 ? (
                      uploadServiceImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative flex-shrink-0 w-48 h-48"
                        >
                          <img
                            src={image}
                            alt={`Uploaded ${index}`}
                            className="w-full h-full rounded bg-no-repeat object-cover"
                          />
                          <div
                            className="absolute top-2 right-2 bg-black text-white rounded-full p-1 cursor-pointer"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <img
                              src={images.cross}
                              className="filter invert dark-0 w-2"
                              alt="Remove"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <img
                        src={images.uploadGray}
                        className="w-18 h-18 object-cover flex self-center ml-48 my-9"
                        alt="Placeholder"
                      />
                    )}
                    <input
                      id="service"
                      type="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      multiple={true}
                      onChange={handleUploadServiceImg}
                    />
                  </div>
                </div>

                <div className="flex flex-row items-end justify-end mt-2">
                  <SmallButton
                    title="Add Service Pictures"
                    dark={true}
                    image={images.addWhite}
                    smallImage={true}
                    onClick={triggerServiceFileInput}
                  />
                </div>
              </div>
            )} */}
            {selectedServices[activeServiceIndex].pictures?.length > 0 ? (
              <div className="w-full overflow-x-auto flex gap-4 hide-scrollbar">
                {selectedServices[activeServiceIndex].pictures.map(
                  (image: any, index: number) => (
                    <div
                      key={index}
                      className="relative flex-shrink-0 w-48 h-48"
                    >
                      <img
                        src={image}
                        alt={`Uploaded ${index}`}
                        className="w-full h-full rounded bg-no-repeat object-cover"
                      />
                      <div
                        className="absolute top-2 right-2 bg-black text-white rounded-full p-1 cursor-pointer"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <img
                          src={images.cross}
                          className="filter invert dark-0 w-2"
                          alt="Remove"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="bg-inputGray w-full flex flex-col items-center justify-center py-10 rounded-xl mt-6">
                {serviceImageLoader ? (
                  <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                  ></div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer active:opacity-50"
                    onClick={triggerServiceFileInput}
                  >
                    <img src={images.uploadGray} />
                    Add Service Pictures
                    <input
                      id="service"
                      type="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      multiple={true}
                      onChange={handleUploadServiceImg}
                    />
                  </div>
                )}
              </div>
            )}
            {selectedServices[activeServiceIndex]?.pictures?.length > 0 && (
              <div className="flex flex-row items-end justify-end mt-2">
                <div
                  className=""
                  // onClick={triggerServiceFileInput}
                >
                  <SmallButton
                    title="Upload more Pictures"
                    dark={true}
                    image={images.addWhite}
                    smallImage={true}
                    imgLoader={serviceImageLoader}
                    onClick={() =>
                      !serviceImageLoader && triggerServiceFileInput()
                    }
                  />
                </div>
                <input
                  id="service"
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  multiple={true}
                  onChange={handleUploadServiceImg}
                />
              </div>
            )}
            {selectedServices[activeServiceIndex].options?.length > 0 ? (
              <div className="w-full mt-4">
                <div className="grid grid-cols-11 w-full gap-2">
                  <div></div>
                  <div className="col-span-4  font-semibold">{`${selectedServices[activeServiceIndex]?.name} style`}</div>
                  <div className="col-span-3 font-semibold">Time</div>
                  <div className="col-span-3 font-semibold">Price</div>
                </div>
                {selectedServices[activeServiceIndex]?.options?.map(
                  (item: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className="grid grid-cols-11 w-full gap-2 mt-2"
                      >
                        <img
                          src={images.deleteService}
                          onClick={() => handleDeleteOptionInService(index)}
                          className="w-[25px] cursor-pointer mx-auto"
                        />
                        <input
                          className="col-span-4 focus:outline-none border border-inputGray rounded-md pl-2 h-8"
                          onChange={(e) =>
                            updateServiceOption(
                              index,
                              e.target.value,
                              item.price,
                              item.time
                            )
                          }
                          value={item.name}
                          placeholder="Name"
                        />
                        <input
                          className="col-span-3 focus:outline-none border border-inputGray rounded-md pl-2 h-8"
                          value={item?.time}
                          placeholder="Minutes"
                          onChange={(e) =>
                            updateServiceOption(
                              index,
                              item.name,
                              item.price,
                              e.target.value
                            )
                          }
                        />
                        <input
                          className="col-span-3 focus:outline-none border border-inputGray rounded-md pl-2 h-8"
                          value={`$ ${item.price}`}
                          placeholder=""
                          // onChange={(e) => updateServiceOption(index, item.name, e.target.value, item.time)}
                          onChange={(e) => {
                            // Remove the '$' sign and pass the numeric value for further updates
                            const valueWithoutDollar = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            ); // Allow only numbers and a dot
                            updateServiceOption(
                              index,
                              item.name,
                              valueWithoutDollar,
                              item.time
                            );
                          }}
                        />
                      </div>
                    );
                  }
                )}

                <div className="flex flex-row items-end justify-end mt-2">
                  <SmallButton
                    title="Add more"
                    dark={true}
                    image={images.addWhite}
                    smallImage={true}
                    onClick={handleAddOptionInService}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4 w-full">
                <SmallButton
                  smallImage={true}
                  image={images.addWhite}
                  title={`Add ${selectedServices[activeServiceIndex]?.name} style`}
                  dark={true}
                  onClick={handleAddOptionInService}
                />
              </div>
            )}
            <div className="w-full mt-4">
              <div className="font-semibold">Description</div>
              <textarea
                onChange={handleChangeServiceDescription}
                value={selectedServices[activeServiceIndex]?.description}
                placeholder="Description"
                className="bg-inputGray w-full mt-2 rounded-xl px-4 py-2 focus:outline-none resize-none h-32"
              ></textarea>
            </div>
            <div className="mx-auto my-5">
              <SmallButton
                title="Save Changes"
                dark={true}
                long={true}
                onClick={handleConfirmService}
              />
            </div>
          </div>
        </div>
      )}
      {showTimeModal && (
        <div className="time-modal fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-75 z-50 px-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg flex flex-col items-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
              {selectedIndex.type === "startTime"
                ? "Select Opening Time"
                : "Select Closing Time"}
            </h2>
            <TimePicker
              value={
                selectedIndex.type === "startTime"
                  ? scheduleTiming[selectedIndex.index]?.startTime
                  : scheduleTiming[selectedIndex.index]?.endTime
              }
              disableClock={true}
              clearIcon={null}
              onChange={handleTimeChange}
              format="hh:mm a"
              className="w-40 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 flex justify-center"
            />
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-4 justify-center w-full">
              <button
                onClick={handleCloseModal}
                className="flex-1 py-2 bg-white text-black border rounded-md transition duration-200 px-4 sm:px-6"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 py-2 bg-black text-white rounded-md transition duration-200 px-4 sm:px-6"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBarberProfile;
