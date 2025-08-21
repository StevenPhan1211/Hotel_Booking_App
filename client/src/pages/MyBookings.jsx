import Title from "../components/Title";
import { assets, userBookingsDummyData } from "../assets/assets";
import { useState } from "react";

const MyBookings = () => {
    // Create state variable
    const [bookings, setBookings] = useState(userBookingsDummyData)

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="Danh sách đặt phòng"
        subTitle="Bạn có thể dễ dàng quản lý danh sách phòng đặt trước cũng như có thể lưu trữ lịch sử đặt phòng tại đây"
        align="left"
      />

      {/* Booking Data */}
      {/* fr: fractional unit - đơn vị phân số, dùng để tuỳ chỉnh số cột & chia tỉ lệ cột trong kh.gian container, bảng... */}
      {/* 3fr + 2fr + 1fr = 6fr => Cột 1: tỉ lệ 3/6, Cột 2: 2/6, Cột 3: 1/6 */}
      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
            <div className="w-1/3">Phòng đã đặt</div>
            <div className="w-1/2">Ngày nhận/trả phòng</div>
            <div className="w-1/2">Trạng thái</div>
        </div>
        {/* ph.thức map(), arrow function gọi mảng load ra client */}
        {bookings.map((booking) => (
            <div key={booking._id} className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t">
                {/* ----- Hotels Details ----- */}
                <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <img src={booking.room.images[0]} alt="hotel-img" className="min-md:w-44 rounded shadow object-cover" />
                    <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                        {/* Name, Type */}
                        <p className="font-playfair text-2xl">
                            {booking.hotel.name}
                            <span className="text-sm"> ({booking.room.roomType})</span>
                        </p>
                        {/* Address */}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <img src={assets.locationIcon} alt="location-icon" />
                            <span>{booking.hotel.address}</span>
                        </div>
                        {/* Guests */}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <img src={assets.guestsIcon} alt="guests-icon" />
                            <span>Số lượng: {booking.guests} người</span>
                        </div>
                        {/* Price */}
                        <p className="text-base font-semibold">Tổng tiền: {booking.totalPrice} VNĐ</p>
                    </div>
                </div>
                {/* ----- Date & Timings ----- */}
                <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                    <div>
                        <p>Ngày nhận phòng:</p>
                        <p className="text-gray-500 text-sm">
                            {new Date(booking.checkInDate).toDateString()}
                        </p>
                    </div>
                    <div>
                        <p>Ngày trả phòng:</p>
                        <p className="text-gray-500 text-sm">
                            {new Date(booking.checkOutDate).toDateString()}
                        </p>
                    </div>
                </div>
                {/* ----- Payment Status ----- */}
                <div className="flex flex-col items-start justify-center pt-3">
                    <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                        <p className={`text-sm ${booking.isPaid ? "text-green-500" : "text-red-500"}`}>
                            {booking.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                        </p>
                    </div>
                    {/* Button Thanh toán ngay */}
                    {!booking.isPaid && (
                        <button className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full 
                        hover:bg-gray-50 transition-all cursor-pointer">
                            Thanh toán ngay
                        </button>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
