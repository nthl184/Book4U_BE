import { Card, Button } from "react-bootstrap";
import borrowApi from "../api/borrowApi"; // ✅ đảm bảo đường dẫn chính xác
import Swal from "sweetalert2";

function BookCard({ book }) {
  // ✅ Tạm thời chưa cần useAuth, test cứng userId để kiểm tra
  const userId = "student123"; // giá trị fake để test event có chạy
  const bookId = book?.id || book?._id;
  const cover =
    book?.img || book?.image || "https://via.placeholder.com/100x140?text=Book";

  const handleBorrow = async () => {
    console.log("📦 Borrow button clicked!", { userId, bookId });
    try {
      const res = await borrowApi.create(userId, bookId);
      console.log("✅ Borrow success:", res);
      Swal.fire("Success", "Borrow request created!", "success");
    } catch (err) {
      console.error("❌ Borrow failed:", err);
      Swal.fire(
        "Borrow failed!",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <Card className="book-card h-100 shadow-sm border-0">
      <div className="p-3 text-center">
        <img
          src={cover}
          alt={book.title}
          className="book-img mb-3"
          style={{ width: "100px", height: "140px", objectFit: "cover" }}
        />
      </div>
      <Card.Body>
        <Card.Title className="fw-semibold">{book.title}</Card.Title>
        <Card.Subtitle className="text-muted small mb-3">
          {book.author}
        </Card.Subtitle>
        <Card.Text className="small">
          {book.description?.slice(0, 80)}...
        </Card.Text>

        {/* ✅ Đây là dòng quan trọng nhất */}
        <Button
          variant="primary"
          className="btn-gradient w-100 rounded-pill"
          onClick={handleBorrow}
        >
          Borrow
        </Button>
      </Card.Body>
    </Card>
  );
}

export default BookCard;
