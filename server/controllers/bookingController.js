import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Function to check availability of room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        // Hàm này dùng để tìm tất cả Booking mà có thời gian check-in/out không bị trùng nhau?!
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate }, // $ lte: less than or equal
            checkOutDate: { $gte: checkInDate }  // $ gte: greater than or equal
        });

        const isAvailable = bookings.length === 0;
        return isAvailable;

    } catch (error) {
        console.error(error.message);
    }
};

// API to check availability of room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = checkAvailability({ checkInDate, checkOutDate, room });

        res.json({ success: true, isAvailable });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// API to create a new booking
// POST /api/bookings/book

// Tóm tắt quy trình:
// 1. Lấy thông tin phòng, ngày ở, số khách, và id người dùng từ request.
// 2. Kiểm tra phòng còn trống không (checkAvailability).
// 3. Nếu trống → lấy dữ liệu phòng + giá tiền.
// 4. Tính số đêm giữa check-in và check-out.
// 5. Nhân giá tiền × số đêm để ra totalPrice.
// 6. Tạo booking mới trong DB (lưu user, room, hotel, guests, dates, price).
// 7. Trả về kết quả thành công hoặc thất bại.

export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;

        // Check availability before booking
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });

        if (!isAvailable) {
            return res.json({ success: false, message: "Không tìm thấy phòng trống" });
        }

        // Get totalPrice from Room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        // Calculate totalPrice based on nights
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice *= nights;

        const booking = await Booking.create({  // Hàm này chưa đc gọi nhưng vẫn chạy nhờ Booking.create() tự lưu document vào mongoDB
            user,                               // id của người đặt
            room,                               // id của phòng
            hotel: roomData.hotel._id,          // id khách sạn (lấy từ populate)
            guests: +guests,                    // convert string from request into number
            checkInDate,
            checkOutDate,
            totalPrice,
        });

        res.json({
            success: true,
            message: "Đặt phòng thành công"
        });

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Đặt phòng thất bại",
            error: error.message                // Errors catch if function createBooking incorrect
        });
    }
};

// API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 });

        res.json({ success: true, bookings });

    } catch (error) {
        res.json({
            success: false,
            message: "Tải danh sách đặt phòng thất bại"
        });
    }
};

// API to get Bookings detail in dashboard
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId });

        if (!hotel) {
          return res.json({
            success: false,
            message: "Không tìm thấy khách sạn",
          });
        }

        const bookings = await Booking.find({ hotel: hotel._id })
          .populate("room hotel user")
          .sort({ createdAt: -1 });

        // Total Bookings
        const totalBookings = bookings.length;
        // Total Revenue
        const totalRevenue = bookings.reduce(
          (acc, booking) => acc + booking.totalPrice,
          0
        );

        res.json({
          success: true,
          dashboardData: { totalBookings, totalRevenue, bookings },
        });
    } catch (error) {
        res.json({
            success: false,
            message: "Tải danh sách đặt phòng thất bại"
        });
    }
};