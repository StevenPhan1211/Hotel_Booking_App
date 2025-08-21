import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData, roomsDummyData } from "../assets/assets";
import StarRating from "../components/StarRating";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const room = roomsDummyData.find(room => room._id === id)
    room && setRoom(room)
    room && setMainImage(room.images[0])
  }, []);

  return room && (
    <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Room Details */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
            <h1 className="text-3xl md:text-4xl font-playfair">
                {room.hotel.name}
                <span className="text-sm"> ({room.roomType})</span>
            </h1>
            <p className="text-xs py-1.5 px-3 text-white bg-orange-500 rounded-full">
              Giảm 20%
            </p>
        </div>

        {/* Room Rating */}
        <div className="flex items-center gap-1 mt-2">
          <StarRating />
          <p className="ml-2">Trên 200 bài đánh giá</p>
        </div>

        {/* Room Address */}
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.hotel.address}</span>
        </div>

        {/* Room Images */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          {/* Main Image */}
          <div className="lg:w-1/2 w-full">
            <img src={mainImage} alt="Room Image" className="w-full rounded-xl shadow-lg object-cover" />
          </div>
          {/* Other Images */}
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images.length > 1 && room.images.map((image, index) => (
              <img 
                onClick={() => setMainImage(image)} 
                key={index} src={image} alt="Room Image" 
                className={`w-full rounded-xl shadow-md object-cover 
                  cursor-pointer ${mainImage === image && "outline-3 outline-orange-500"}`}
              />
            ))}
          </div>
        </div>

        {/* Room Highlights */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">Midnight Lullaby Villa</h1>
            {/* Thẻ div hiện các tiện ích phòng */}
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100">
                  <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Room Price */}
          <p className="text-2xl font-medium">{room.pricePerNight} VNĐ/Đêm</p>
        </div>

        {/* Check In/Out Form */}
        <form className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white
        shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl">
          {/* Input field */}
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            {/* Check-in Input */}
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">Ngày nhận phòng</label>
              <input 
                type="date" id="checkInDate" placeholder="Ngày nhận phòng"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none" 
                required
              />
            </div>

            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            {/* Check-out Input */}
            <div className="flex flex-col">
              <label htmlFor="checkOutDate" className="font-medium">Ngày trả phòng</label>
              <input 
                type="date" id="checkOutDate" placeholder="Ngày trả phòng"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none" 
                required
              />
            </div>

            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            {/* Guests Input */}
            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">Số lượng khách</label>
              <input 
                type="number" id="guests" placeholder="0"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none" 
                required
              />
            </div>
          </div>

          {/* Check Availability Button */}
          <button type="submit" className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md
          max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer">
            Tìm phòng trống
          </button>
        </form>

        {/* Đặc điểm nổi bật */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img src={spec.icon} alt={`${spec.title}-icon`} className="w-6.5" />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mô tả chung */}
        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>
            Được xây dựng theo kiến trúc hiện đại nhưng vẫn mang nét đặc sắc truyền thống vùng Skibidinian. Đến với Lullaby Villa,
            bạn sẽ được đắm chìm trong không gian nghỉ dưỡng hiện đại, cao cấp đi kèm với những dịch vụ miễn phí đặc trưng của Lullaby,
            khách hàng chọn nghỉ dưỡng vào cuối tuần sẽ được tặng dịch vụ mát xa miễn phí mỗi người, vé ăn sáng giảm giá khi đi từ 4 người
            trở lên, và vô vàn những khuyến mãi đặc biệt khác chỉ có tại Lullaby Villa.
          </p>
        </div>

        {/* Hosted by - Chủ khách sạn/bài đăng */}
        {/* Backup Owner Image: {room.hotel.owner.image} */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-4">
            <img src={assets.arisu} alt="Host" className="h-14 w-14 md:h-18 md:w-18 rounded-full" />
            {/* Owner Name */}
            <div>
              <p className="text-lg md:text-xl">Đăng bởi {room.hotel.name}</p>
              <div className="flex items-center mt-1">
                <StarRating />
                <p className="ml-2">Trên 69 bài đánh giá</p>
              </div>
            </div>
          </div>
          {/* Contact now Button */}
          <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
            Liên hệ đặt phòng
          </button>
        </div>
    </div>
  );
};

export default RoomDetails;
