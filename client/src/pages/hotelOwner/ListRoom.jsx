import { useEffect, useState } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListRoom = () => {

  // Create State variable
  const [rooms, setRooms] = useState([]);

  // Destructuring assignment
  const { axios, currency, getToken, user, formatPrice } = useAppContext();

  // Fetch Rooms for Hotel Owner
  const fetchRooms = async () => {
    try {
      // Destructuring Assignment
      // Cú pháp cho phép bóc tách các thuộc tính từ object/array thành các biến riêng biệt, const { data }
      const { data } = await axios.get(
        "/api/rooms/owner", 
        {headers: { Authorization: `Bearer ${await getToken()}` }}
      )

      if (data.success) {
        setRooms(data.rooms)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Toggle Availability of the room
  const toggleAvailability = async (roomId) => {
    const { data } = await axios.post(
      "/api/rooms/toggle-availability",
      { roomId },
      {headers: { Authorization: `Bearer ${await getToken()}` }}
    )

    if (data.success) {
      toast.success(data.message)
      fetchRooms()
    } else {
      toast.error(data.message)
    }
  }

  // useEffect
  useEffect(() => {
    if (user) {
      fetchRooms()
    }
  }, [user])

  // return statement
  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Quản lý phòng của bạn"
        subTitle="Bạn có thể xem, chỉnh sửa và quản lý toàn bộ phòng nghỉ đã đăng tải lên Hikari."
      />
      <p className="text-gray-500 mt-8">Danh sách phòng đã đăng ký cho thuê</p>

      {/* Table List Room */}
      <div className="w-full max-w-4xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
        <table className="w-full table-fixed">
          {/* Table Head */}
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">
                Tên phòng
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Các tiện ích
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Giá thuê / Đêm
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Điều chỉnh
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-sm">
            {/* map method to load data from arrays that in state: rooms */}
            {
              rooms.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {item.roomType}
                  </td>

                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                    {item.amenities.join(", ")}
                  </td>

                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                    {formatPrice(item.pricePerNight)} {currency}
                  </td>

                  {/* Custom Button */}
                  <td className="py-3 px-4 text-red-500 border-t border-gray-300 text-sm text-center">
                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                      <input 
                        onChange={() => toggleAvailability(item._id)}
                        type="checkbox" 
                        className="sr-only peer"
                        checked={item.isAvailable}
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200">

                      </div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 
                      ease-in-out peer-checked:translate-x-5">

                      </span>
                    </label>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRoom;
