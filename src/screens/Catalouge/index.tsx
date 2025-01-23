import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import { useDispatch, useSelector } from "react-redux";
import { selectBarbers } from "../../Store/BarbersSlice";
import {
  deleteServiceRedux,
  selectUser,
  setUser,
  updateServiceRedux,
} from "../../Store/userDataSlice";
import SmallButton from "../../components/SmallButton";
import {
  addServices,
  deleteService,
  updateService,
  uploadMultiplesImages,
  uploadProfile,
} from "../../services/config/Api";
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import { Toast } from "../../components/Toast";

type Props = {};

const Catalouge = (props: Props) => {
  const barberData = useSelector(selectUser);
  const dispatch = useDispatch();
  const authToken = useSelector(selectAuthToken);
  const [selectedService, setSelectedService] = useState<any>();
  const [services, setServices] = useState<any>();
  const [haircutBeard, setHaircutBeard] = useState<any>("");
  const [deletePermission, setDeletePermission] = useState<any>("");
  const [loader, setLoader] = useState(false);
  const [deletedId, setDeleteId] = useState("");
  // const [services, setServices] = useState('')
  const [haircutService, setHaircutService] = useState<Service | null>(null);
  const [beardService, setBeardService] = useState<Service | null>(null);
  const [showUpdateServiceModal, setShowUpdateServiceModal] =
    useState<boolean>(false);
  const [addServiceModal, setAddServiceModal] = useState<boolean>(false);
  const [selectedServiceToUpdate, setSelectedServiceToUpdate] = useState<any>();
  const [isEditable, setIsEditable] = useState(false);
  const [description, setDescription] = useState(
    haircutService?.description || "No description available for haircut."
  );
  const [serviceImageLoader, setServiceImageLoader] = useState<boolean>(false);
  const [imgUri, setImgUri] = useState<any>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeServiceIndex, setActiveServiceIndex] = useState<any>(0);

  const hairIcon =
    "https://res.cloudinary.com/doohobw9k/image/upload/v1726222601/TruBarber/Services/ojjwvvfvc2ovrtrkjumo.png";

  const beardIcon =
    "https://res.cloudinary.com/doohobw9k/image/upload/v1726222538/TruBarber/Services/yvg6ctijk3ann6a0ty5i.png";

  interface Service {
    name: string;
    description: string;
    _id: string;
    pictures: any;
    options: any;
  }

  useEffect(() => {
    const services = barberData?.services || [];
    const filteredServices = ["haircut", "beard"].reduce(
      (acc: any, serviceName: string) => {
        acc[serviceName] =
          services.find(
            (service: Service) => service.name.toLowerCase() === serviceName
          ) || null; // Default to null if not found
        return acc;
      },
      {}
    );

    setServices(filteredServices);

    setHaircutService(filteredServices.haircut); // Could be null
    setBeardService(filteredServices.beard); // Could be null
  }, [barberData]);

  const handleDeleteService = async () => {
    try {
      setLoader(true);
      const deleteId =
        haircutBeard === "Haircut" ? haircutService?._id : beardService?._id;
      console.log("id hai bro", deleteId);
      const response = (await deleteService(authToken, deleteId)) as {
        status: any;
      };
      if (response?.status == 200) {
        dispatch(deleteServiceRedux(deleteId));
        setDeletePermission(false);
        setLoader(false);
        Toast("success", "Congratulation!");
      } else {
        setDeletePermission(false);
        setLoader(false);
        Toast("error", "Oops");
      }
    } catch (error) {
      setDeletePermission(false);
      setLoader(false);
      Toast("error", "Oops");
    }
  };

  const triggerUpdateServiceFileInput = () => {
    const fileInput = document.getElementById(
      "updateService"
    ) as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  const handleUploadServiceUpdateImg = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // const files = event.target.files;
    // if (files && files.length > 0) {
    //   setServiceImageLoader(true);

    //   const uploadedFiles = Array.from(files).map((file) =>
    //     URL.createObjectURL(file)
    //   );
    //   const updatedService = { ...selectedServiceToUpdate };

    //   updatedService.pictures = [
    //     ...(updatedService.pictures || []),
    //     ...uploadedFiles,
    //   ];

    //   setSelectedServiceToUpdate(updatedService);
    //   setServiceImageLoader(false);
    // }

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

      console.log(response.data);

      if (response?.status === 200) {
        const uploadedUrls = response?.data?.images || [];
        const updatedService = { ...selectedServiceToUpdate };

        updatedService.pictures = [
          ...(updatedService.pictures || []),
          ...uploadedUrls,
        ];

        setSelectedServiceToUpdate(updatedService);
        setServiceImageLoader(false);
      } else {
        setServiceImageLoader(false);
      }
    } else {
      setServiceImageLoader(false);
      console.log("No files selected");
    }
  };

  // const handleRemoveImageFromUpdate = (index: number) => {
  //   const updatedService = { ...selectedServiceToUpdate };

  //   updatedService.pictures.splice(index, 1);
  //   setSelectedServiceToUpdate(updatedService);
  // };

  const updateServiceOptionInUpdate = (
    index: number,
    name: string,
    price: string,
    time: string
  ) => {
    const updatedService = { ...selectedServiceToUpdate };

    updatedService.options[index] = { name, price, time };
    setSelectedServiceToUpdate(updatedService);
  };

  // const handleAddOptionInUpdate = () => {
  //   const updatedService = { ...selectedServiceToUpdate };

  //   if (!updatedService.options) {
  //     updatedService.options = [];
  //   }

  //   updatedService.options.push({ name: "", price: "", time: "" });
  //   setSelectedServiceToUpdate(updatedService);
  // };

  const handleAddOptionInUpdate = () => {
    // Create a deep copy of the `options` array or initialize it as an empty array
    const updatedService = {
      ...selectedServiceToUpdate,
      options: [...(selectedServiceToUpdate.options || [])], // Ensure a new array is created
    };
  
    // Add a new option to the copied array
    updatedService.options.push({ name: "", price: "", time: "" });
  
    // Update state with the new object
    setSelectedServiceToUpdate(updatedService);
  };
  
  const handleDeleteOptionInUpdate = (index: number) => {
    // Deep copy the `options` array
    const updatedService = { 
      ...selectedServiceToUpdate,
      options: [...selectedServiceToUpdate.options], // Create a new array copy
    };
  
    // Remove the specific option
    updatedService.options.splice(index, 1);
  
    // Update state
    setSelectedServiceToUpdate(updatedService);
  };
  
  const handleRemoveImageFromUpdate = (index: number) => {
    // Deep copy the `pictures` array
    const updatedService = { 
      ...selectedServiceToUpdate,
      pictures: [...selectedServiceToUpdate.pictures], // Create a new array copy
    };
  
    // Remove the specific image
    updatedService.pictures.splice(index, 1);
  
    // Update state
    setSelectedServiceToUpdate(updatedService);
  };
  
  const handleUpdateServiceDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const updatedService = { ...selectedServiceToUpdate };

    updatedService.description = event.target.value;
    setSelectedServiceToUpdate(updatedService);
  };




  const handleSaveBarberService = (options: any) => {
    if (!options || options.length === 0) {
      return { success: false, message: "At least one service is required." };
    }

    for (const [index, option] of options.entries()) {
      const { name, price, time } = option;

      if (name.trim() === "") {
        return {
          success: false,
          message: `Please add service ${index + 1} name`,
        };
      }
      if ("time" in option && time.trim() === "") {
        return {
          success: false,
          message: `Please add service ${index + 1} time`,
        };
      }
      if (price.trim() === "") {
        return {
          success: false,
          message: `Please add service ${index + 1} price`,
        };
      }
    }

    return { success: true, message: "" };
  };

  const handleConfirmAddeService = () => {
    console.log("Updated Service:", selectedServiceToUpdate);

    const isValid = handleSaveBarberService(selectedServiceToUpdate?.options);

    // Add logic to save the updated service (e.g., API call)
    // Close the modal after saving

    if (!selectedServiceToUpdate.description) {
      return Toast("error", "Please enter description");
    }
    if (selectedServiceToUpdate.pictures.length === 0) {
      return Toast("error", "Please select at least one picture");
    }

    if (!isValid?.success) {
      return Toast("error", isValid?.message);
    }
    handleAddService();
  };

  const handleAddService = async () => {
    try {
      setLoader(true);

      if (!selectedServiceToUpdate || !haircutBeard) {
        throw new Error("Service data is incomplete.");
      }

      const servicesData = [
        {
          name: haircutBeard,
          pictures: selectedServiceToUpdate.pictures,
          description: selectedServiceToUpdate.description,
          options: selectedServiceToUpdate.options,
          icon: haircutBeard.toLowerCase() === "haircut" ? hairIcon : beardIcon,
        },
      ];

      const body = { services: servicesData };

      const response = (await addServices(body, authToken)) as {
        status: number;
        data: any;
      };

      if (response?.status === 201) {
        Toast(
          "success",
          response?.data?.message || "Service added successfully!"
        );
        dispatch(setUser(response?.data?.updateUser));
      } else {
        Toast("error", response?.data?.message || "Failed to add service.");
      }
    } catch (error: any) {
      console.error("Error adding service:", error);
      Toast(
        "error",
        error.message ||
          "Could not add your service right now. Try again later!"
      );
    } finally {
      setLoader(false); // Ensure loader is stopped in both success and failure cases
      setAddServiceModal(false);
    }
  };


  const handleConfirmUpdateService = () => {
    console.log("Updated Service:", selectedServiceToUpdate);

    const isValid = handleSaveBarberService(selectedServiceToUpdate?.options);

    // Add logic to save the updated service (e.g., API call)
    // Close the modal after saving

    if (!selectedServiceToUpdate.description) {
      return Toast("error", "Please enter description");
    }
    if (selectedServiceToUpdate.pictures.length === 0) {
      return Toast("error", "Please select at least one picture");
    }

    if (!isValid?.success) {
      return Toast("error", isValid?.message);
    }
    handleUpdateService();
  };

  const handleUpdateService = async () => {
    try {
      setLoader(true);

      if (!selectedServiceToUpdate || !haircutBeard) {
        throw new Error("Service data is incomplete.");
      }

      const body =         {
        name: selectedServiceToUpdate.name,
        pictures: selectedServiceToUpdate.pictures,
        description: selectedServiceToUpdate.description,
        options: selectedServiceToUpdate.options,
        icon: selectedServiceToUpdate.icon,
        _id: selectedServiceToUpdate._id,
        barber: selectedServiceToUpdate.barber,
      }

      const response = (await updateService(body, authToken)) as {
        status: number;
        data: any;
      };

      console.log("Update api response",response.data);
      

      if (response?.status === 200) {
        Toast(
          "success",
          response?.data?.message || "Service Updated successfully!"
        );
        dispatch(updateServiceRedux(response?.data?.updatedService));
      } else {
        Toast("error", response?.data?.message || "Failed to add service.");
      }
    } catch (error: any) {
      console.error("Error adding service:", error);
      Toast(
        "error",
        error.message ||
          "Could not Updated your service right now. Try again later!"
      );
    } finally {
      setLoader(false); // Ensure loader is stopped in both success and failure cases
      setShowUpdateServiceModal(false);
    }
  };

  return (
    <div className="px-6">
      <div className="font-semibold text-xl mb-5">Catalouge</div>
      <div className="flex justify-between">
        <div>
          <div className="font-semibold text-lg">Services</div>
          <div className="text-sm ">Your Service Offerings</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div
          className={`border rounded-3xl p-5 shadow-sm flex flex-col justify-between relative ${
            haircutBeard === "Haircut" && "border-black"
          }`}
          onClick={() => setHaircutBeard("Haircut")}
        >
          <div className="flex">
            <div className="bg-inputGray p-6 rounded-md w-24 h-24 flex-shrink-0 flex items-center justify-center">
              <img src={images.haircutIcon} className="w-10 h-10" />
            </div>
            <div className="ml-4 flex-grow">
              <div className="text-lg font-bold break-words">Haircuts</div>
              <div className="text-textGray break-words overflow-hidden line-clamp-3 leading-5 max-h-[4.5rem]">
                {haircutService
                  ? haircutService.description
                  : "No description available for haircut."}
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border rounded-3xl p-5 shadow-sm flex flex-col justify-between relative ${
            haircutBeard === "Beard" && "border-black "
          }`}
          onClick={() => setHaircutBeard("Beard")}
        >
          <div className="flex">
            <div className="bg-inputGray p-6 rounded-md w-24 h-24 flex-shrink-0 flex items-center justify-center">
              <img src={images.beardIcon} className="w-10 h-10" />
            </div>
            <div className="ml-4 flex-grow">
              <div className="text-lg font-bold break-words">Beard</div>
              <div className="text-textGray break-words overflow-hidden line-clamp-3 leading-5 max-h-[4.5rem]">
                {beardService
                  ? beardService.description
                  : "No description available for beard."}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 mb-4">
        {haircutBeard && (
          <div className="border rounded-lg p-3">
            <div className="flex flex-row justify-between items-center">
              <div className="text-2xl font-semibold">
                {haircutBeard === "Haircut" ? "Hair Cuts" : "Beard"}
              </div>
              <div className="flex flex-row">
                {services[haircutBeard.toLowerCase()] ? (
                  <>
                    <img
                      src={images.edit}
                      className="w-4 h-5 active:opacity-50 cursor-pointer mr-6"
                      onClick={() => {
                        // edit
                        setSelectedServiceToUpdate(
                          services[haircutBeard.toLowerCase()]
                        );
                        setShowUpdateServiceModal(true);
                      }}
                    />
                    <img
                      src={images.deleteIcon}
                      className="w-4 h-5 active:opacity-50 cursor-pointer mr-3"
                      onClick={() => setDeletePermission(true)}
                    />
                  </>
                ) : (
                  <div
                    className="border px-6 h-10 rounded-xl flex items-center text-sm bg-black text-white active:opacity-50 cursor-pointer"
                    onClick={() => setAddServiceModal(true)}
                  >
                    + Add New Service
                  </div>
                )}
              </div>
            </div>
            {services[haircutBeard.toLowerCase()] && (
              <>
                <div className="border my-4" />

                <div className="flex flex-col sm:flex-row sm:px-4">
                  {/* Left Column */}
                  <div className="sm:w-[40%] mb-4 sm:mr-10">
                    <div className="text-base font-semibold mb-1">
                      Description
                    </div>
                    <div className="text-textGray break-words overflow-hidden line-clamp-3 leading-5 max-h-[4.5rem]">
                      {services[haircutBeard.toLowerCase()]
                        ?.description ||
                        `No description available for ${haircutBeard.toLowerCase()}.`}
                    </div>
                    <div className="text-base font-medium mt-6 mb-1">
                      Images
                    </div>
                    <div className="flex flex-row w-[85%] overflow-x-auto hide-scrollbar">
                      {services[haircutBeard.toLowerCase()]?.pictures
                        ?.length > 0 ? (
                          services[
                          haircutBeard.toLowerCase()
                        ].pictures.map((picture: any, item: any) => (
                          <img
                            key={item}
                            src={picture}
                            alt={`${haircutBeard} Image ${item + 1}`}
                            className="w-40 h-40 rounded-lg mr-2 mb-2 object-cover"
                          />
                        ))
                      ) : (
                        <div className="text-textGray">
                          No images available for {haircutBeard.toLowerCase()}.
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="sm:w-[50%] flex flex-col sm:flex-row">
                    <div className="sm:w-[30%] sm:mr-4 mb-4 sm:mb-0">
                      <div>
                        <div className="text-base font-semibold mb-1 ml-1">
                          {haircutBeard} Styles
                        </div>
                        {services[haircutBeard.toLowerCase()]?.options
                          ?.length > 0 ? (
                            services[
                            haircutBeard.toLowerCase()
                          ].options.map((option: any, item: any) => (
                            <div
                              key={item}
                              className="bg-slate-200 flex items-center rounded-lg px-2 mb-2 py-1 text-lg"
                            >
                              {option.name}
                            </div>
                          ))
                        ) : (
                          <div className="text-textGray">No styles.</div>
                        )}
                      </div>
                    </div>

                    <div className="sm:w-[30%] sm:mr-4 mb-4 sm:mb-0">
                      <div>
                        <div className="text-base font-semibold mb-1 ml-1">
                          Duration
                        </div>
                        {services[haircutBeard.toLowerCase()]?.options
                          ?.length > 0 ? (
                            services[
                            haircutBeard.toLowerCase()
                          ].options.map((option: any, item: any) => (
                            <div
                              key={item}
                              className="bg-slate-200 flex items-center rounded-lg px-2 mb-2 py-1 text-lg"
                            >
                              {option.time} mins
                            </div>
                          ))
                        ) : (
                          <div className="text-textGray">No prices.</div>
                        )}
                      </div>
                    </div>
                    <div className="sm:w-[30%]">
                      <div>
                        <div className="text-base font-semibold mb-1 ml-1">
                          Prices
                        </div>
                        {services[haircutBeard.toLowerCase()]?.options
                          ?.length > 0 ? (
                            services[
                            haircutBeard.toLowerCase()
                          ].options.map((option: any, item: any) => (
                            <div
                              key={item}
                              className="bg-slate-200 flex items-center rounded-lg px-2 mb-2 py-1 text-lg"
                            >
                              $ {option.price}
                            </div>
                          ))
                        ) : (
                          <div className="text-textGray">No prices.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {deletePermission && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 max-w-[2800px] mx-auto z-50 select-none">
          <div className="bg-white w-[90%] sm:w-4/5 md:w-2/3 lg:w-1/4 flex flex-col p-2 xs:p-6 rounded-xl shadow-lg flex items-center justify-center">
            <div className="text-lg font-medium text-gray-700">
              Are you sure you want to delete this service?
            </div>
            <div className="flex mt-4 space-x-4">
              <div className="w-24 h-10">
                <SmallButton
                  dark
                  title="Confirm"
                  onClick={handleDeleteService}
                />
              </div>

              <div className="w-24 h-10">
                <SmallButton
                  dark
                  title="Cancel"
                  onClick={() => setDeletePermission(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpdateServiceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white w-[95%] sm:w-[50%] lg:w-[30%] xl:w-[25%] flex flex-col rounded-xl p-4 shadow-lg max-h-[80vh] overflow-scroll hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center justify-between w-full font-bold text-lg">
              {selectedServiceToUpdate?.name || "Add New Service"}
            </div>

            {selectedServiceToUpdate?.pictures?.length > 0 ? (
              <div className="w-full overflow-x-auto flex gap-4 hide-scrollbar">
                {selectedServiceToUpdate.pictures.map(
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
                        onClick={() => handleRemoveImageFromUpdate(index)}
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
                    onClick={triggerUpdateServiceFileInput}
                  >
                    <img src={images.uploadGray} />
                    Add Service Pictures
                    <input
                      id="updateService"
                      type="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      multiple={true}
                      onChange={handleUploadServiceUpdateImg}
                    />
                  </div>
                )}
              </div>
            )}
            {selectedServiceToUpdate?.pictures?.length > 0 && (
              <div className="flex flex-row items-end justify-end mt-2">
                <SmallButton
                  title="Upload more Pictures"
                  dark={true}
                  image={images.addWhite}
                  smallImage={true}
                  imgLoader={serviceImageLoader}
                  onClick={() =>
                    !serviceImageLoader && triggerUpdateServiceFileInput()
                  }
                />
                <input
                  id="updateService"
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  multiple={true}
                  onChange={handleUploadServiceUpdateImg}
                />
              </div>
            )}
            {selectedServiceToUpdate?.options?.length > 0 ? (
              <div className="w-full mt-4">
                <div className="grid grid-cols-11 w-full gap-2">
                  <div></div>
                  <div className="col-span-4 font-semibold">{`${selectedServiceToUpdate?.name} style`}</div>
                  <div className="col-span-3 font-semibold">Time</div>
                  <div className="col-span-3 font-semibold">Price</div>
                </div>
                {selectedServiceToUpdate?.options?.map(
                  (item: any, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-11 w-full gap-2 mt-2"
                    >
                      <img
                        src={images.deleteService}
                        onClick={() => handleDeleteOptionInUpdate(index)}
                        className="w-[25px] cursor-pointer mx-auto"
                      />
                      <input
                        className="col-span-4 focus:outline-none border border-inputGray rounded-md pl-2 h-8"
                        onChange={(e) =>
                          updateServiceOptionInUpdate(
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
                          updateServiceOptionInUpdate(
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
                        onChange={(e) => {
                          const valueWithoutDollar = e.target.value.replace(
                            /[^0-9.]/g,
                            ""
                          );
                          updateServiceOptionInUpdate(
                            index,
                            item.name,
                            valueWithoutDollar,
                            item.time
                          );
                        }}
                      />
                    </div>
                  )
                )}

                <div className="flex flex-row items-end justify-end mt-2">
                  <SmallButton
                    title="Add more"
                    dark={true}
                    image={images.addWhite}
                    smallImage={true}
                    onClick={handleAddOptionInUpdate}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4 w-full">
                <SmallButton
                  smallImage={true}
                  image={images.addWhite}
                  title={`Add ${selectedServiceToUpdate?.name} style`}
                  dark={true}
                  onClick={handleAddOptionInUpdate}
                />
              </div>
            )}
            <div className="w-full mt-4">
              <div className="font-semibold">Description</div>
              <textarea
                onChange={handleUpdateServiceDescription}
                value={selectedServiceToUpdate?.description}
                placeholder="Description"
                className="bg-inputGray w-full mt-2 rounded-xl px-4 py-2 focus:outline-none resize-none h-32"
              ></textarea>
            </div>
            <div className="mx-auto my-5">
              <SmallButton
                title="Save Changes"
                dark={true}
                long={true}
                onClick={handleConfirmUpdateService}
                imgLoader={loader}

              />
            </div>
          </div>
        </div>
      )}

      {addServiceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white w-[95%] sm:w-[50%] lg:w-[30%] xl:w-[25%] flex flex-col rounded-xl p-4 shadow-lg max-h-[80vh] overflow-scroll hide-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center justify-between w-full font-bold text-lg">
              {selectedServiceToUpdate?.name || "Add New Service"}
            </div>

            {selectedServiceToUpdate?.pictures?.length > 0 ? (
              <div className="w-full overflow-x-auto flex gap-4 hide-scrollbar">
                {selectedServiceToUpdate.pictures.map(
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
                        onClick={() => handleRemoveImageFromUpdate(index)}
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
                    onClick={triggerUpdateServiceFileInput}
                  >
                    <img src={images.uploadGray} />
                    Add Service Pictures
                    <input
                      id="updateService"
                      type="file"
                      style={{ display: "none" }}
                      accept="image/*"
                      multiple={true}
                      onChange={handleUploadServiceUpdateImg}
                    />
                  </div>
                )}
              </div>
            )}
            {selectedServiceToUpdate?.pictures?.length > 0 && (
              <div className="flex flex-row items-end justify-end mt-2">
                <SmallButton
                  title="Upload more Pictures"
                  dark={true}
                  image={images.addWhite}
                  smallImage={true}
                  imgLoader={serviceImageLoader}
                  onClick={() =>
                    !serviceImageLoader && triggerUpdateServiceFileInput()
                  }
                />
                <input
                  id="updateService"
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  multiple={true}
                  onChange={handleUploadServiceUpdateImg}
                />
              </div>
            )}
            {selectedServiceToUpdate?.options?.length > 0 ? (
              <div className="w-full mt-4">
                <div className="grid grid-cols-11 w-full gap-2">
                  <div></div>
                  <div className="col-span-4 font-semibold">{`${selectedServiceToUpdate?.name} style`}</div>
                  <div className="col-span-3 font-semibold">Time</div>
                  <div className="col-span-3 font-semibold">Price</div>
                </div>
                {selectedServiceToUpdate?.options?.map(
                  (item: any, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-11 w-full gap-2 mt-2"
                    >
                      <img
                        src={images.deleteService}
                        onClick={() => handleDeleteOptionInUpdate(index)}
                        className="w-[25px] cursor-pointer mx-auto"
                      />
                      <input
                        className="col-span-4 focus:outline-none border border-inputGray rounded-md pl-2 h-8"
                        onChange={(e) =>
                          updateServiceOptionInUpdate(
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
                          updateServiceOptionInUpdate(
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
                        onChange={(e) => {
                          const valueWithoutDollar = e.target.value.replace(
                            /[^0-9.]/g,
                            ""
                          );
                          updateServiceOptionInUpdate(
                            index,
                            item.name,
                            valueWithoutDollar,
                            item.time
                          );
                        }}
                      />
                    </div>
                  )
                )}

                <div className="flex flex-row items-end justify-end mt-2">
                  <SmallButton
                    title="Add more"
                    dark={true}
                    image={images.addWhite}
                    smallImage={true}
                    onClick={handleAddOptionInUpdate}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4 w-full">
                <SmallButton
                  smallImage={true}
                  image={images.addWhite}
                  title={`Add ${haircutBeard} style`}
                  dark={true}
                  onClick={handleAddOptionInUpdate}
                />
              </div>
            )}
            <div className="w-full mt-4">
              <div className="font-semibold">Description</div>
              <textarea
                onChange={handleUpdateServiceDescription}
                value={selectedServiceToUpdate?.description}
                placeholder="Description"
                className="bg-inputGray w-full mt-2 rounded-xl px-4 py-2 focus:outline-none resize-none h-32"
              ></textarea>
            </div>
            <div className="mx-auto my-5">
              <SmallButton
                title="Save Changes"
                dark={true}
                long={true}
                imgLoader={loader}
                onClick={handleConfirmAddeService}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalouge;
