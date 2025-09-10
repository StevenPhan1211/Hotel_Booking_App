import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";

// API endpoint to create a Room (POST)
export const createRoom = async (req, res) => {
    try {
        const {roomType, pricePerNight, amenities} = req.body;
        const hotel = await Hotel.findOne({
            owner: req.auth.userId
        })

        if (!hotel) return res.json ({
            success: false,
            message: "Không tìm thấy khách sạn"
        });

        // Up ảnh & lưu trên cloudinary
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        });

        // await bất đồng bộ để đợi upload ảnh hoàn tất
        const images = await Promise.all(uploadImages)

        // Dữ liệu được gửi từ client qua http request đều là dạng string
        // Có 3 cách chuyển từ string qua number trong JS: dùng dấu + (unary plus operator), Number(), parseInt()
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight, // Đây là cách 1: unary plus operator
            amenities: JSON.parse(amenities),
            images,
        });

        res.json({
            success: true,
            message: "Thêm phòng mới thành công!"
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

// endpoint to get all Rooms (GET)
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({isAvailable: true}).populate({
            path: "hotel",
            populate: {
                path: "owner",
                select: "image"
            }
        }).sort({ createdAt: -1 })

        res.json({ success: true, rooms });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// endpoint to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.auth.userId })
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate("hotel");

        res.json({ success: true, rooms});

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

// endpoint to toggle availability of a room
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);

        // Toggle Room's availability - chuyển đổi trạng thái phòng true <-> false
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save(); // await save to database

        // Tunary Operator to send different message when toggle availability
        const message = roomData.isAvailable 
            ? "Phòng đã được mở cho thuê" 
            : "Phòng đã tạm ngừng cho thuê";
        
        res.json({
            success: true,
            message
        })

        // Có thể dùng cách này để trả response tương ứng sau mỗi lần toggle - chuyển trạng thái
        // if (roomData.isAvailable) {
        //     res.json({
        //       success: true,
        //       message: "mở thành công",
        //     });
        // } else {
        //     res.json({
        //       success: true,
        //       message: "đã tắt thành công",
        //     });
        // }


    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}