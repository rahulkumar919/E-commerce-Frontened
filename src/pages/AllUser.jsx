import React, { useEffect, useState } from "react";
import summaryApi from "../../common";
import { toast } from "react-toastify";
import moment from "moment";
import { MdEdit } from "react-icons/md";
import { ChangeRole } from "../components/ChangeRole";

const AllUser = () => {
  const [alluser, setAlluser] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [updateUserDetails, setUpdateUserDetails] = useState({
    name: "",
    email: "",
    role: "",
    _id: "",
    
  });

  const HandleAllUser = async () => {
    try {
      const fetchData = await fetch(summaryApi.AllUSer.url, {
        method: summaryApi.AllUSer.method,
        credentials: "include",
      });

      const dataResponse = await fetchData.json();

      if (dataResponse.success) {
        setAlluser(dataResponse.data);
      } else {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    HandleAllUser();
  }, []);

  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h1 className="text-lg font-semibold mb-4">All Registered Users</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-black text-white  text-left">
            <th className="py-2 px-4">Sr.</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Role</th>
            <th className="py-2 px-4">Created Date</th>
            <th className="py-2 px-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="font-semibold capitalize">
          {alluser.map((el, index) => (
            <tr
              key={el._id}
              className="hover:bg-gray-50 border-b border-gray-200 transition-all"
            >
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{el.name}</td>
              <td className="py-2 px-4">{el.email}</td>
              <td className="py-2 px-4">{el.role}</td>
              <td className="py-2 px-4">{moment(el.createdAt).format("L")}</td>
              <td
                className="text-center text-green-600 hover:text-white hover:bg-green-500 inline-block p-2 rounded-full cursor-pointer"
                onClick={() => {

                  setUpdateUserDetails(el);
                  setOpenUpdateRole(true);

                }}
              >
                <MdEdit />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openUpdateRole && (
        <ChangeRole
          userId={updateUserDetails._id}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          role={updateUserDetails.role}
          onClose={() => setOpenUpdateRole(false)}
          callFunc = {HandleAllUser} className = "bg-opacity-30"
        />
      )}
    </div>
  );
};

export default AllUser;
