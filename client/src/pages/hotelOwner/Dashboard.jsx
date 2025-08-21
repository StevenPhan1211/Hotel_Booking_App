import { useState } from "react";
import Title from "../../components/Title";
import { assets, dashboardDummyData } from "../../assets/assets";

const Dashboard = () => {
  // Tạo state variable
  // Dùng useState khi re-render lại component khi dữ liệu thay đổi, api thay đổi data
  // Dữ liệu tĩnh, mảng thô thì có thể gọi thẳng không cần dùng useState
  const [dashboardData, setDashboardData] = useState(dashboardDummyData);

  return (
    <div>
      <Title
        align="left"
        font="Outfit"
        title="Dashboard"
        subTitle="Quản lý danh sách phòng của bạn, theo dõi các thông tin đặt phòng của khách hàng, phân tích,
            thống kê doanh thu theo thời gian thực ngay tại đây."
      />
      {/* ------ Tạo container cho 2 card ------ */}
      <div className="flex gap-4 my-8">
        {/* ------ Thống kê d.sách đặt phòng ------ */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalBookingIcon}
            alt=""
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Số lượng đặt phòng</p>
            <p className="text-neutral-400 text-base">
              {dashboardData.totalBookings}
            </p>
          </div>
        </div>

        {/* ------ Thống kê doanh thu ------ */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalRevenueIcon}
            alt=""
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Tổng doanh thu (VNĐ)</p>
            <p className="text-neutral-400 text-base">
              {dashboardData.totalRevenue} Đồng
            </p>
          </div>
        </div>
      </div>

      {/* ------ Danh sách đặt phòng gần đây ------ */}
      <h2 className="text-xl text-blue-950/70 font-medium mb-5">
        Lịch sử đặt phòng
      </h2>
      {/* --- Table design here --- */}
      <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
        <table className="w-full">
            {/* Table Head */}
            <thead className="bg-gray-50">
                <tr>
                    <th className="py-3 px-4 text-gray-800 font-medium">Tên người dùng</th>
                    <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">Tên phòng</th>
                    <th className="py-3 px-4 text-gray-800 font-medium text-center">Tổng doanh thu (VNĐ)</th>
                    <th className="py-3 px-4 text-gray-800 font-medium text-center">Tình trạng</th>
                </tr>
            </thead>
            {/* Body Table */}
            <tbody className="text-sm">
                {dashboardData.bookings.map((item, index) => (
                    <tr key={index}>
                        <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                            {item.user.username}
                        </td>

                        <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                            {item.room.roomType}
                        </td>

                        <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                            {item.totalPrice}
                        </td>

                        <td className="py-3 px-4 border-t border-gray-300 flex">
                          <button className={`py-1 px-3 text-xs rounded-full mx-auto ${item.isPaid ? "bg-green-200 text-green-600" : 
                            "bg-amber-200 text-yellow-600"
                          }`}>
                            {item.isPaid ? "Đã thanh toán" : "Đang chờ"}
                          </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
