import { assets, cities } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 
    xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover
    bg-center h-screen'>
        <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>
            Trải nghiệm nghỉ dưỡng 5 sao đỉnh cao nhất
        </p>
        <h1 className='font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>
            Viên ngọc lấp lánh nằm giữa lòng đô thị
        </h1>
        <p className='max-w-130 mt-2 text-sm md:text-base'>
            Sự cân bằng hoàn hảo giữa tiện nghi và sang trọng tại một trong những khách sạn
            cao cấp nhất thế giới.
        </p>

        {/* Find Room Form from PrebuiltUI */}
        <form className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon} alt="" className='h-4' />
                    <label htmlFor="destinationInput">Điểm đến</label>
                </div>
                <input list='destinations' id="destinationInput" type="text" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder="Type here" required />
                <datalist id='destinations'>
                    {/* hàm .map() lặp qua từng thành phố (phần tử) trong mảng cities nằm bên assets/assets.js */}
                    {cities.map((city, index) => (
                        // mỗi lần lặp sẽ tạo 1 thẻ option có value là tên thành phố để làm gợi ý khi user nhập
                        // value: lặp qua từng dữ liệu trong mảng cities 
                        // key: giúp react nhận diện từng phần tử khi dùng .map(), quản lý các phần tử khi dùng hàm map để tránh lỗi
                        <option value={city} key={index} /> 
                    ))}
                </datalist>
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon} alt="" className='h-4' />
                    <label htmlFor="checkIn">Ngày đặt phòng</label>
                </div>
                <input id="checkIn" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon} alt="" className='h-4' />
                    <label htmlFor="checkOut">Ngày trả phòng</label>
                </div>
                <input id="checkOut" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                <label htmlFor="guests">Số lượng</label>
                <input min={1} max={4} id="guests" type="number" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
            </div>

            <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                <img src={assets.searchIcon} alt="searchIcon" className='h-7' />
                <span>Tìm phòng</span>
            </button>
        </form>
    </div>
  )
}

export default Hero