import React, { useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { useSelector } from "react-redux";
import ROLE from "../../common/role";
import summaryApi from "../../common";
import { toast } from "react-toastify";

export const ChangeRole = ({ userId, name, email, role: currentRole, onClose, callFunc }) => {
  const [userRole, setUserRole] = useState(currentRole || "");
  const user = useSelector((state) => state?.user?.user);

  const handleOnChangeSelect = (e) => {
    setUserRole(e.target.value);
    console.log("Selected Role:", e.target.value);
  };

  const changeUserRole = async () => {
    try {
      const res = await fetch(summaryApi.UpdateAlluser.url, {
        method: summaryApi.UpdateAlluser.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          role: userRole,
        }),
      });

      const dataResponse = await res.json();
      console.log("Update Response:", dataResponse);

      if (dataResponse.success) {
        toast.success(" User Role Updated successfully!");
        await callFunc?.(); // ✅ properly call refresh function
        onClose(); // close modal
      } else {
        toast.error(dataResponse.message || "❌ Failed to update role");
      }

    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative bg-white shadow-xl rounded-xl p-6 w-full max-w-md transition-all duration-300 transform animate-fadeIn">
        {/* ❌ Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
          title="Close"
          onClick={onClose}
        >
          <GiCancel size={22} />
        </button>

        {/* 🧑‍💼 User Info */}
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full shadow-inner ">
            <FaUserShield size={22} />
          </div>
          <div>
            <h2 className="text-lg  font-mono capitalize font-semibold text-gray-800">Name  : {name || "Unknown User"}</h2>
            <p className="text-lg font-mono"> Email :  {email || "No Email"}</p>
          </div>
        </div>

        {/* 🔽 Role Dropdown */}
        <div className="mb-6">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select User Role
          </label>

          <select
            id="role"
            value={userRole}
            onChange={handleOnChangeSelect}
            className="border border-gray-300 text-sm text-gray-700 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            {Object.values(ROLE).map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* 🔘 Change Role Button */}
        <button
          onClick={changeUserRole}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-md shadow hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
        >
          Change Role
        </button>
      </div>
    </div>
  );
};
