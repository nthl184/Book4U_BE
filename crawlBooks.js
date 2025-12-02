import axios from "axios";
import mongoose from "mongoose";
import Book from "./src/models/bookModel.js"; 
import dotenv from "dotenv";

// 1. Kích hoạt biến môi trường để lấy MONGO_URI
dotenv.config();

const GOOGLE_API = "https://www.googleapis.com/books/v1/volumes";

const categories = [
  "programming",
  "fiction",
  "romance",
  "history",
  "fantasy",
  "science",
  "technology",
];

const LIMIT = 20; // Mỗi lần gọi Google lấy 20 cuốn
const PAGES_TO_CRAWL = 2; //lấy 2 trang đầu cho mỗi chủ đề

// Hàm crawl từng chủ đề (có phân trang)
const crawlCategory = async (keyword) => {
  console.log(`\n--- Bắt đầu tìm sách chủ đề: ${keyword} ---`);

  // Chạy vòng lặp số trang muốn lấy
  for (let page = 0; page < PAGES_TO_CRAWL; page++) {
    try {
      // Tính toán vị trí bắt đầu (startIndex). 
      // Trang 0 bắt đầu từ 0. Trang 1 bắt đầu từ 20...
      const startIndex = page * LIMIT;
      
      // Tạo URL gọi API
      const url = `${GOOGLE_API}?q=${encodeURIComponent(keyword)}&maxResults=${LIMIT}&startIndex=${startIndex}`;
      
      // Gọi Google API
      const res = await axios.get(url);
      const items = res.data.items || [];

      // Nếu trang này không có sách nào thì dừng lại
      if (items.length === 0) {
        console.log(`Hết sách ở trang ${page + 1}.`);
        break;
      }

      const booksToInsert = [];

      // --- VÒNG LẶP XỬ LÝ & LỌC DỮ LIỆU ---
      for (const item of items) {
        const info = item.volumeInfo;

        // Nếu sách không có description thì BỎ QUA 
        // Nếu sách không có ảnh bìa thì BỎ QUA
        if (!info.description || (!info.imageLinks?.thumbnail && !info.imageLinks?.smallThumbnail)) {
          continue; 
        }

        //bắt đầu tạo object sách
        const book = {
          title: info.title,
          author: info.authors?.join(", ") || "Unknown", // Nối tên tác giả nếu có nhiều người
          category: keyword.toLowerCase(),
          description: info.description, // Chắc chắn có dữ liệu
          // Ưu tiên lấy ảnh to, không có thì lấy ảnh nhỏ
          coverImage: info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail,
          fileUrl: info.previewLink || info.infoLink || "", 
          pages: info.pageCount || 10, // Nếu không có số trang, để mặc định 10
          availableCopies: Math.floor(Math.random() * 5) + 1, // Giả lập số lượng kho
        };

        booksToInsert.push(book);
      }

      // --- LƯU VÀO DB ---
      if (booksToInsert.length > 0) {
        await Book.insertMany(booksToInsert);
        console.log(`   + Trang ${page + 1}: Lấy về ${items.length} cuốn, nhưng lọc được ${booksToInsert.length}.`);
      } else {
        console.log(`   + Trang ${page + 1}: không lưu cuốn nào.`);
      }

    } catch (error) {
      console.error(` Lỗi khi tải trang ${page + 1}:`, error.message);
    }
  }
};

const startCrawling = async () => {
  try {
    // Kiểm tra xem đã có link DB chưa
    if (!process.env.MONGO_URI) {
        throw new Error("Chưa cấu hình MONGO_URI trong file .env");
    }
    
    // Kết nối MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected! Bắt đầu quá trình lọc sách...");

    // (Tùy chọn) Xóa sạch dữ liệu cũ 
    // await Book.deleteMany({});
    // console.log("DELETED!");

    // Duyệt qua từng chủ đề trong danh sách
    for (const cate of categories) {
      await crawlCategory(cate);
    }

    console.log("\nDONE!");
    process.exit(); // Thoát chương trình khi xong
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
};

startCrawling();