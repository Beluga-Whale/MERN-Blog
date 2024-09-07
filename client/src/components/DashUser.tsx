import axios from "axios";
import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { Table } from "flowbite-react";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { FaCheck, FaTimes } from "react-icons/fa";
interface User {
  _id?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const DashUser = () => {
  const { currentUser, currentUserGoogle } = useAppSelector(
    (state) => state.user
  );
  const [user, setUsers] = useState<User[]>([]);
  const [showMore, setShowMore] = useState<boolean>(true);

  // NOTE - Show more
  const handleShowMore = async () => {
    const startIndex = user.length;
    try {
      const res = await axios.get(
        `/api/user/getusers?startIndex=${startIndex}`
      );

      if (res.status === 200) {
        setUsers((prev) => [...prev, ...res.data.user]);
        if (res?.data.user.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // NOTE - Delete user
  const handledDelete = async (userId: string, userName: string) => {
    try {
      Swal.fire({
        title: "คุณต้องการลบ ?",
        text: userName,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่, ต้องการลบ",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // NOTE - ถ้ากดตกลง จำทะการ delete

          const res = await axios.delete(`/api/user/deleteuser/${userId}`);

          if (res?.status === 200) {
            // NOTE - ทำการ fillter user ที่ไม่เท่ากับที่ลบ ออกไป

            Swal.fire({
              position: "center",
              icon: "success",
              title: res?.data,
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              setUsers((prev) => prev.filter((user) => user._id !== userId));
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`/api/user/getusers`);

        if (res.status == 200) {
          setUsers(res.data?.user);
          if (res?.data?.user.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser?.isAdmin || currentUserGoogle?.isAdmin) {
      fetchUsers();
    }
  }, [currentUser?._id, currentUserGoogle?._id]);

  return (
    <div className="table-auto w-full p-5  md:mx-auto overflow-x-auto  ">
      {(currentUser?.isAdmin || currentUserGoogle?.isAdmin) &&
      user.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {user?.map((users: User) => (
              <Table.Body key={users?._id}>
                <Table.Row>
                  <Table.Cell>
                    {dayjs(users?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      className="w-10 h-10 object-cover rounded-full  "
                      src={users?.profilePicture}
                      alt={users?.username}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <p>{users?.username}</p>
                  </Table.Cell>
                  <Table.Cell>{users?.email}</Table.Cell>
                  <Table.Cell>
                    {users?.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <p
                      className="hover:underline text-red-500 cursor-pointer font-bold "
                      onClick={() =>
                        handledDelete(users._id ?? "", users?.username ?? "")
                      }
                      hidden={users?.isAdmin}
                    >
                      Delete
                    </p>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              className="self-center w-full text-blue-500 hover:underline py-5 "
              onClick={handleShowMore}
            >
              Show more{" "}
            </button>
          )}
        </>
      ) : (
        <p>No posts</p>
      )}
    </div>
  );
};

export default DashUser;
