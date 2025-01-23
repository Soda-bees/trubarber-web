import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import { selectUser, setUser } from "../../Store/userDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import {
  getAddressFromCoordinates,
  updateProfile,
} from "../../services/config/Api";
import TimePicker from "react-time-picker";
import SmallButton from "../../components/SmallButton";
import { Toast } from "../../components/Toast";

type Props = {};

const EditBusinessProfile = (props: Props) => {
  const userData = useSelector(selectUser);
  console.log("usrerererer", userData);

  const authToken = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const [instagram, setInstagram] = useState<string>("https://");
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [locationLoader, setLocationLoader] = useState(false);
  const [address, setAddress] = useState<any>(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [loader, setLoader] = useState(false);

  const [scheduleTiming, setScheduleTiming] = useState<any[]>([
    // {
    //   avaiable: true,
    //   day: "Monday",
    //   startTime: new Date(),
    //   endTime: new Date(),
    // },
    // {
    //   avaiable: true,
    //   day: "Tueday",
    //   startTime: new Date(),
    //   endTime: new Date(),
    // },
    // {
    //   avaiable: true,
    //   day: "Wednesday",
    //   startTime: new Date(),
    //   endTime: new Date(),
    // },
    // {
    //   avaiable: true,
    //   day: "Thursday",
    //   startTime: new Date(),
    //   endTime: new Date(),
    // },
    // {
    //   avaiable: true,
    //   day: "Friday",
    //   startTime: new Date(),
    //   endTime: new Date(),
    // },
    // {
    //   avaiable: true,
    //   day: "Saturday",
    //   startTime: new Date(),
    //   endTime: new Date(),
    // },
    // {
    //   avaiable: true,
    //   day: "Sunday",
    //   startTime: new Date(),
    //   endTime: new Date(),
    // },
  ]);

  const [selectedIndex, setSelectedIndex] = useState<any>({
    index: null,
    type: null,
  });

  useEffect(() => {
    if (userData) {
      setDescription(userData?.description);
      //   setTime(userData?.time);
      setLocation(userData?.location);
      setInstagram(userData?.instagram);
      //   setScheduleTiming(userData?.scheduled);
      //   setOffDays(userData?.offDays);
      //   setScheduleTiming(undoScheduledUpdate);
      const undoScheduledUpdate = userData?.scheduled.map((item: any) => {
        const { time, ...rest } = item;

        if (time) {
          const [startTime, endTime] = time.split(" - ");

          const formattedStartTime = convertToDate(startTime);
          const formattedEndTime = convertToDate(endTime);
          return {
            ...rest,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
          };
        }

        return {
          ...rest,
          startTime: null,
          endTime: null,
        };
      });
      setScheduleTiming(undoScheduledUpdate);
      console.log("yahooooooooooo", userData.scheduled);
    }
  }, [userData]);

  const convertToDate = (time: any) => {
    const today = new Date(); // Get today's date

    // Check if the time string is valid
    if (!time) return null;

    const timeDate = new Date(`${today.toDateString()} ${time}`);

    // Log to check what the created Date looks like
    console.log("Created Date:", timeDate);

    return isNaN(timeDate.getTime()) ? null : timeDate; // If it's invalid, return null
  };

  const getAddress = async (latitude: any, longitude: any) => {
    setLocationLoader(true);
    try {
      const response = await getAddressFromCoordinates(latitude, longitude);
      setAddress(response);
      setLocationLoader(false);
    } catch (error) {
      console.log("location errer", error);
      setLocationLoader(false);
    }
  };

  useEffect(() => {
    getAddress(userData?.location?.latitude, userData?.location?.longitude);
  }, []);

  const handleAvailabilityToggle = (index: number) => {
    setScheduleTiming((prevSchedule) =>
      prevSchedule.map((item, i) => {
        if (i === index) {
          // If 'available' is toggled to true, set current time for both start and end
          if (!item.available) {
            const now = new Date();

            const updatedStartTime = new Date(
              now.setHours(now.getHours(), now.getMinutes(), 0, 0)
            ); // Reset seconds & milliseconds
            const updatedEndTime = new Date(updatedStartTime); // Set end time same as start time (can be adjusted)

            return {
              ...item,
              available: true,
              startTime: updatedStartTime,
              endTime: updatedEndTime,
            };
          } else {
            // If 'available' is toggled to false, set start and end times to empty strings
            return {
              ...item,
              available: false,
              startTime: "",
              endTime: "",
            };
          }
        }

        return item;
      })
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

  const handleConfirm = async () => {
    const updatedScheduled = scheduleTiming.map((item) => {
      const formattedStartTime = formatTime(item?.startTime);
      const formattedEndTime = formatTime(item?.endTime);
      const { startTime, endTime, ...rest } = item;
      return {
        ...rest,
        time: item?.available
          ? `${formattedStartTime} - ${formattedEndTime}`
          : "",
      };
    });

    if (!instagram) {
      return Toast("error", "Please provide your instagram profile link");
    }
    if (!description) {
      return Toast("error", "Please fill the description");
    }
    try {
      setLoader(true);
      const body = {
        //   businessProfile: imgUri,
        description,
        //   location,
        instagram,
        //   offDays,
        scheduled: updatedScheduled,
      };
      const response = (await updateProfile(body, authToken)) as {
        status: any;
        data: any;
      };
      if (response.status == 200) {
        setLoader(false);
        Toast("success", response?.data?.message);
        dispatch(setUser(response?.data?.updatedUser));
      } else {
        setLoader(false);
        Toast("error", response?.data?.message);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  return (
    <div className="px-4 md:px-10 mb-5">
      <div className="text-2xl font-bold border-b-2 pb-4">
        Edit Business Profile
      </div>
      <div className="flex flex-col items-start py-3 px-4 mt-2 w-[50%] ">
        <div className="font-semibold">Instagram account</div>
        <div className="bg-inputGray flex flel-row items-center justify-start pl-4 rounded-xl w-full mt-2 h-16">
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
        <div className="bg-inputGray flex flex-col items-start justify-start pl-4 rounded-xl w-full mt-2 h-16 relative ">
          <div className="text-xs text-stone-500 mt-2">Location</div>

          <div className="text-lg text-black mt-1 font-semibold">
            {locationLoader ? (
              <div
                className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
              ></div>
            ) : (
              <> {address}</>
            )}
          </div>
        </div>
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 mt-5 w-full`}
      >
        {scheduleTiming.map((item: any, index) => {
          console.log("itemLog", scheduleTiming);

          return (
            <div key={index} className="flex flex-row items-center">
              <div
                className={`w-12 h-10 rounded-md flex flex-row items-center justify-center mr-2 cursor-pointer ${
                  item?.available ? "bg-inputGray" : "bg-disable"
                }`}
                onClick={() => handleAvailabilityToggle(index)}
              >
                <div
                  className={`w-[15px] h-[15px] rounded-sm ${
                    item?.available ? "bg-green" : "bg-red-500"
                  }`}
                ></div>
              </div>
              <div
                className={`h-10 w-full flex flex-row items-center justify-between rounded-md px-2 ${
                  item?.available ? "bg-inputGray" : "bg-disable"
                }`}
              >
                <div>{item?.day}</div>
                <div className="flex flex-row items-center">
                  {!item?.available ? (
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
                        {/* {item?.startTime} */}
                      </div>
                      <div className="mx-1">-</div>
                      <div
                        className="cursor-pointer"
                        onClick={() => handleSetSelectedIndex(index, "endTime")}
                      >
                        {/* {item?.endTime} */}
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
      <div className="my-10 w-[15%]">
        <SmallButton
          dark
          title="Save"
          onClick={() => handleConfirm()}
          loader={loader}
        />
      </div>

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

export default EditBusinessProfile;
