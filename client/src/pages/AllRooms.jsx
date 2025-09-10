import { useSearchParams } from "react-router-dom";
import { assets, facilityIcons, roomsDummyData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";

// component CheckBox
const CheckBox = ({label, selected = false, onChange = () => {}}) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input type="checkbox" checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
      <span className="font-light select-none">{label}</span>
    </label>
  )
}

// component RadioButton
const RadioButton = ({label, selected = false, onChange = () => {}}) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input type="radio" name="sortOption" checked={selected} onChange={() => onChange(label)} />
      <span className="font-light select-none">{label}</span>
    </label>
  )
}

const AllRooms = () => {

  const [searchParams, setSearchParams] = useSearchParams()
  // call API data from useAppContext()
  const { rooms, navigate, currency } = useAppContext();
  
  // tạo hàm dùng useState bằng: const [giá trị hiện tại, hàm thay đổi(set function)] = useState()
  // useState() có thể truyền các giá trị trong JS như boolean, string, number, array, object
  // Khởi tạo state openFilters với giá trị ban đầu là false (đang ẩn Bộ lọc)
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  });
  const [selectedSort, setSelectedSort] = useState("");

  const roomTypes = [
    "Giường đơn",
    "Giường đôi",
    "Hikari - Luxury",
    "Phòng Gia đình",
  ];

  const priceRanges = [
    '0 đến 1.000.000',
    '1.000.000 đến 2.000.000',
    '2.000.000 đến 4.000.000',
    'Trên 4.000.000',
  ];

  const sortOptions = [
    "Giá tiền từ thấp đến cao",
    "Giá tiền từ cao đến thấp",
    "Mới đăng gần đây",
  ];

  // Handle changes for filters and sorting 9 05 00
  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = {...prevFilters};

      if (checked) {
        updatedFilters[type].push(value)
      } else {
        updatedFilters[type] = updatedFilters[type].filter(item => item !== value)
      }

      return updatedFilters;
    })
  }

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  }

  // Function to check if a room matches the selected Room types
  const matchesRoomType = (room) => {
    return selectedFilters.roomType.length === 0 || selectedFilters.roomType.includes(room.roomType);
  }

  // Function to check if a room matches the selected price ranges
  const matchesPriceRange = (room) => {
    return selectedFilters.priceRange.length === 0 || selectedFilters.priceRange.some(range => {
      const [min, max] = range.split(" to ").map(Number);
      return room.pricePerNight >= min && room.pricePerNight <= max;
    })
  }

  // Function to sort rooms based on the selected sort option
  const sortRooms = (a, b) => {
    if (selectedSort === "Giá tiền từ thấp đến cao") {
      return a.pricePerNight - b.pricePerNight;
    }

    if (selectedSort === "Giá tiền từ cao đến thấp") {
      return b.pricePerNight - a.pricePerNight;
    }

    if (selectedSort === "Mới đăng gần đây") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    return 0;
  }

  // Filter Destination
  const filterDestination = (room) => {
    const destination = searchParams.get("destination");
    if (!destination) return true;
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase())
  }

  // Hàm lọc danh sách phòng dựa vào những gì user chọn trong Bộ lọc
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => matchesRoomType(room) && matchesPriceRange(room) && filterDestination(room)).sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, searchParams])

  // Function to clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      roomType: [],
      priceRange: []
    });
    setSelectedSort("");
    setSearchParams({});
  }

  // Return statement
  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between
    pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Cột bên trái Web là list danh sách phòng và 2 thẻ tiêu đề h1, p */}
      <div>
        <div className="flex flex-col items-start text-left">
            <h1 className="font-playfair text-4xl md:text-[40px]">
                Danh sách phòng
            </h1>
            <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
                Cùng Hikari khám phá vô vàn lựa chọn nghỉ dưỡng phù hợp với bạn nhất nhé
            </p>
        </div>

        {/* map method lấy ds phòng */}
        {filteredRooms.map((room) => (
            <div key={room._id} className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 
            last:pb-30 last:border-0">
                {/* Nhóm con bên trái lấy hình khách sạn */}
                <img 
                onClick={() => {navigate(`/rooms/${room._id}`); scrollTo(0,0)}} 
                src={room.images[0]} alt="hotel-img" title="View Room Details"
                className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer" />

                {/* Nhóm con bên phải chứa tên, địa chỉ, review khách sạn */}
                <div className="md:w-1/2 flex flex-col gap-2">
                    <p className="text-gray-500">{room.hotel.city}</p>
                    <p onClick={() => {navigate(`/rooms/${room._id}`); scrollTo(0,0)}} 
                    className="text-gray-800 text-3xl font-playfair cursor-pointer">{room.hotel.name}</p>

                    {/* Review khách sạn */}
                    <div className="flex items-center">
                        <StarRating />
                        <p className="ml-2">Trên 200 bài đánh giá</p>
                    </div>

                    {/* Thẻ div gắn icon và gọi địa chỉ */}
                    <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                      <img src={assets.locationIcon} alt="location-icon" />
                      <span>{room.hotel.address}</span>
                    </div>

                    {/* Thẻ div có hàm map, bên trong là arrow function render các tiện ích khách sạn */}
                    <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                      {room.amenities.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70">
                          <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                          <p className="text-xs">{item}</p>
                        </div>
                      ))}
                    </div>

                    {/* Giá thuê phòng */}
                    <p className="text-xl font-medium text-gray-700">{room.pricePerNight} VNĐ/Đêm</p>
                </div>
            </div>
        ))}
      </div>

      {/* Cột Filters nằm bên phải Web */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16">
        {/* Div chứa Title BỘ LỌC và 2 span button */}
        <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && "border-b"}`}>
          <p className="text-base font-medium text-gray-800">BỘ LỌC</p>
          {/* Thẻ div bọc 2 span button: ẨN/MỞ BỘ LỌC trên small screen, XOÁ BỘ LỌC trên large screen */}
          <div className="text-xs cursor-pointer">
            {/* Arrow function trong span, span này chỉ hiện trên màn hình nhỏ (điện thoại) */}
            {/* Khi click vào chạy hàm setOpenFilters cập nhật state, truyền !openFilters để đảo ngược giá trị mỗi khi click vào */}
            {/* Nếu openFilters đang False, click vào đảo thành True => Bộ lọc mở, chuyển qua nút ẨN */}
            <span onClick={() => setOpenFilters(!openFilters)} className="lg:hidden">
              {/* Ternary Operator rút gọn if else */}
              {/* openFilters là trạng thái Bộ lọc đang bật, nếu true => hiện nút ẨN BỚT, false => hiện nút MỞ BỘ LỌC */}
              {openFilters ? 'ẨN BỚT' : 'MỞ BỘ LỌC'}
            </span>
            {/* Nếu large screen thì react bỏ qua span button bên trên và hiện span button này */}
            <span className="hidden lg:block">XOÁ BỘ LỌC</span>
          </div>
        </div>

        {/* Filters Options */}
        <div className={`${openFilters ? 'h-auto' : "h-0 lg:h-auto"} overflow-hidden transition-all duration-700`}>
          {/* Room types */}
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Chọn loại phòng</p>
            {roomTypes.map((room, index) => (
              <CheckBox 
                key={index} 
                label={room} 
                selected={selectedFilters.roomType.includes(room)}
                onChange={(checked) => handleFilterChange(checked, room, "roomType")}
              />
            ))}
          </div>

          {/* Price range */}
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Mức giá</p>
            {priceRanges.map((range, index) => (
              <CheckBox 
                key={index} 
                label={`${range} ${currency}`} 
                selected={selectedFilters.priceRange.includes(range)}
                onChange={(checked) => handleFilterChange(checked, range, "priceRange")}
              />
            ))}
          </div>

          {/* Sort by */}
          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sắp xếp</p>
            {sortOptions.map((option, index) => (
              <RadioButton 
                key={index} 
                label={option} 
                selected={selectedSort === option}
                onChange={() => handleSortChange(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
