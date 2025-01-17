import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Myprofile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [image, setImage] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Function to format date to yyyy-MM-dd
  const formatDateForInput = (date) => {
    if (!date) return '';
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  };

  // Function to format date back to dd-MM-yyyy
  const formatDateForDisplay = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('dob', userData.dob);
      formData.append('gender', userData.gender);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));

      if (image) formData.append('image', image);

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="mt-28">
        <div className="max-w-lg flex flex-col gap-2 text-sm m-auto">
          {isEdit ? (
            <label htmlFor="">
              <div className="inline-block relative cursor-pointer">
                <img
                  className="w-36 rounded opacity-75"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt=""
                />
                <img
                  className="w-10 absolute bottom-12 right-12"
                  src={image ? '' : assets.upload_icon}
                  alt=""
                />
              </div>
              <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </label>
          ) : (
            <img src={userData.image} className="rounded-lg w-36" alt="user profile pic" />
          )}

          {isEdit ? (
            <input
              type="text"
              className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
              placeholder="Enter your name"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <p className="text-3xl font-medium text-neutral-800 mt-4">{userData.name}</p>
          )}

          <hr className="bg-zinc-400 h-[1px] border-none" />

          <div className="mt-3">
            <p className="text-neutral-500 text-lg underline">CONTACT INFORMATION</p>
            <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
              <p className="font-medium">Email:</p>
              <p className="text-blue-500">{userData.email}</p>

              <p className="font-medium">Phone:</p>
              {isEdit ? (
                <input
                  type="number"
                  placeholder="Enter your phone number"
                  className="text-blue-500"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <p className="text-blue-500">{userData.phone}</p>
              )}

              <p className="font-medium">Address:</p>
              {isEdit ? (
                <p>
                  <input
                    type="text"
                    placeholder="Enter your address line 1"
                    className="bg-gray-50"
                    value={userData.address.line1}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                  <br />
                  <input
                    type="text"
                    placeholder="Enter your address line 2"
                    className="bg-gray-50"
                    value={userData.address.line2}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                </p>
              ) : (
                <p className="text-gray-500">
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3">
            <p className="text-neutral-500 text-lg underline">BASIC INFORMATION</p>
            <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
              <p className="font-medium">Gender:</p>
              {isEdit ? (
                <select
                  className="max-w-28 rounded-lg py-0.5 bg-gray-100"
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                >
                  <option>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="text-gray-400">{userData.gender}</p>
              )}

              <p className="font-medium">Birthday:</p>
              {isEdit ? (
                <input
                  className="max-w-28 rounded-lg py-0.5 bg-gray-100"
                  type="date"
                  value={formatDateForInput(userData.dob)}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: formatDateForDisplay(e.target.value) }))
                  }
                />
              ) : (
                <p className="text-gray-400">{userData.dob}</p>
              )}
            </div>
          </div>

          <div className="mt-10">
            {isEdit ? (
              <button
                className="border border-primary rounded-full px-8 py-2 hover:bg-primary hover:text-white transition-all duration-150 hover:scale-110"
                onClick={updateUserProfileData}
              >
                Save Information
              </button>
            ) : (
              <button
                className="border border-primary rounded-full px-8 py-2 hover:bg-primary hover:text-white transition-all duration-150 hover:scale-110"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Myprofile;
