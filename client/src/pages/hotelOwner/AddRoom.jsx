import { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddRoom = () => {

  // Destructuring assignment
  const { axios, getToken } = useAppContext()

  // Create State variable to store form data
  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  })

  // State variable to store input data
  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Wifi miễn phí": false,
      "Suất ăn sáng miễn phí": false,
      "Phục vụ tại phòng": false,
      "Bể bơi miễn phí": false,
      "Khung cảnh đẹp": false
    }
  })

  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    // Check if all inputs are filled
    if (!inputs.roomType || !inputs.pricePerNight || !inputs.amenities || !Object.values(images).some(image => image)) {
      toast.error("Vui lòng nhập đầy đủ thông tin phòng")
      return;
    }

    // Make setter function setLoading become true
    setLoading(true);

    try {
      const formData = new FormData()
      formData.append("roomType", inputs.roomType)
      formData.append("pricePerNight", inputs.pricePerNight)

      // Converting Amenities to Array & keeping only enabled Amenities
      const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key])
      formData.append("amenities", JSON.stringify(amenities))

      // Add Images to FormData
      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key])
      })

      const { data } = await axios.post(
        "/api/rooms/", 
        formData, 
        {headers: { Authorization: `Bearer ${await getToken()}` }}
      )

      if (data.success) {
        toast.success(data.message);
        setInputs({
          roomType: "",
          pricePerNight: 0,
          amenities: {
            "Wifi miễn phí": false,
            "Suất ăn sáng miễn phí": false,
            "Phục vụ tại phòng": false,
            "Bể bơi miễn phí": false,
            "Khung cảnh đẹp": false
          }
        });

        setImages({
          1: null,
          2: null,
          3: null,
          4: null
        });
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false);
    }
  }

  // Return statement
  return (
    <form onSubmit={onSubmitHandler}>
      <Title 
        align="left" 
        font="outfit" 
        title="Thêm phòng mới" 
        subTitle="Bạn có thể thêm mới các thông tin chi tiết và các tiện ích của phòng nghỉ 
        trước khi đăng tải chính thức lên Hikari."
      />

      {/* Upload Images */}
      <p className='text-gray-800 mt-10'>Hình ảnh</p>
      <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key) => (
          <label htmlFor={`roomImage-${key}`} key={key}>
            <img 
              src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt="" 
              className='max-h-13 cursor-pointer opacity-80'
            />
            <input 
              type="file" 
              accept='image/*' 
              id={`roomImage-${key}`} // Trong id không được chứa khoảng trắng
              hidden 
              onChange={e => setImages({...images, [key]: e.target.files[0]})}
            />
          </label>
        ))}
      </div>

      {/* New section to input some others like name, price, bla bla... */}
      <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
        {/* Select Card & Title Section to select room type */}
        <div className='flex-1 max-w-48'>
          <p className='text-gray-800 mt-4'>Loại phòng</p>
          {/* Trong onChange có setter function từ state variable thứ 2 phía trên, next là spread operator */}
          <select 
            value={inputs.roomType}
            onChange={e => setInputs({...inputs, roomType: e.target.value})}
            className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'
          >
            <option value="">Chọn loại phòng</option>
            <option value="Giường đơn">Giường đơn</option>
            <option value="Giường đôi">Giường đôi</option>
            <option value="Hikari - Luxury">Hikari - Luxury</option>
            <option value="Phòng gia đình">Phòng gia đình</option>
          </select>
        </div>

        {/* pricePerNight Input field */}
        <div>
          <p className='mt-4 text-gray-800'>
            Giá thuê phòng
            <span className='text-xs'>/Đêm</span>
          </p>
          <input 
            type="number" placeholder='0' 
            className='border border-gray-300 mt-1 rounded p-2'
            value={inputs.pricePerNight}
            onChange={e => setInputs({...inputs, pricePerNight: e.target.value})}
          />
        </div>
      </div>

      {/* Amenities Section Code Here */}
      <p className='text-gray-800 mt-4'>Thêm mới các tiện ích của phòng</p>
      <div className='flex flex-col flex-wrap mt-3 text-gray-400 max-w-sm'>
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index}>
            <input 
              type="checkbox" 
              id={`amenities-${index + 1}`} // Trong id không được chứa khoảng trắng
              // LƯU Ý ĐOẠN CODE BÊN DƯỚI: có checked, onChange, Spread operator (quan trọng trong JS & React)
              checked={inputs.amenities[amenity]} 
              onChange={() => setInputs({
                ...inputs, 
                amenities: {
                  ...inputs.amenities, 
                  [amenity] : !inputs.amenities[amenity]
                }
              })}
            />

            {/* Amenities Label Tag */}
            <label htmlFor={`amenities-${index + 1}`}> {amenity}</label>
          </div>
        ))}
      </div>

      {/* Button Add Room */}
      <button 
        className='bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer'
        disabled={loading}
      >
        { loading ? "Đang thêm..." : "Thêm phòng mới" }
      </button>
    </form>
  )
}

export default AddRoom