// 📘 src/pages/BookDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Spinner, Row, Col } from "react-bootstrap";
import { ArrowLeft, Bookmark, BookOpen } from "lucide-react";
import Footer from "../components/Footer";
import bookApi from "../api/bookApi";
import borrowApi from "../api/borrowApi";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch current book
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await bookApi.getById(id);
        setBook(res.data);
      } catch (err) {
        console.error("❌ Error fetching book detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  // ✅ Fetch related books (same category)
  useEffect(() => {
    const fetchRelated = async () => {
      if (!book?.category) return;
      try {
        const res = await bookApi.getAll();
        const list = res.data
          ?.filter((b) => b.category === book.category && b._id !== book._id)
          ?.slice(0, 3);
        setRelatedBooks(list);
      } catch (err) {
        console.error("⚠️ Failed to load related books:", err);
      }
    };
    fetchRelated();
  }, [book]);

  // ✅ Handle borrow via backend
  const handleBorrow = async () => {
    const role = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id || user?.id;

    if (role !== "student") {
      alert("⚠️ Only students can borrow books!");
      return;
    }

    if (!userId) {
      alert("⚠️ Please log in before borrowing!");
      return;
    }

    try {
      const res = await borrowApi.create(userId, id);
      console.log("✅ Borrow request:", res.data);
      alert("✅ Borrow request submitted! Please wait for admin approval.");
    } catch (err) {
      console.error("❌ Borrow failed:", err);
      alert(
        "❌ Borrow failed! " +
          (err.response?.data?.message || "Please check the console.")
      );
    }
  };

  // ✅ Save to local history
  useEffect(() => {
    if (book) {
      const history = JSON.parse(localStorage.getItem("bookHistory")) || [];
      const existing = history.find((b) => b.id === book._id);
      const newEntry = {
        id: book._id,
        title: book.title,
        img: book.img,
        lastVisited: new Date().toISOString(),
      };
      if (!existing) history.unshift(newEntry);
      localStorage.setItem("bookHistory", JSON.stringify(history.slice(0, 10)));
    }
  }, [book]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" /> Loading book...
      </div>
    );

  if (!book)
    return <h3 className="text-center mt-5 text-danger">Book not found!</h3>;

  return (
    <div
      className="book-detail-page d-flex flex-column align-items-center"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f3e8ff 0%, #faf5ff 50%, #ffffff 100%)",
        padding: "4rem 1rem",
        marginTop: "-20px",
      }}
    >
      <div className="container" style={{ maxWidth: "900px" }}>
        {/* Back Button */}
        <Button
          variant="outline-secondary"
          className="rounded-pill mb-4 border-gradient"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="me-1" /> Back
        </Button>

        {/* Book Info */}
        <Card className="shadow-sm border-0 rounded-4 p-3 mb-5">
          <div className="text-center mb-4">
            <img
              src={book.img || book.image}
              alt={book.title}
              className="rounded shadow"
              style={{ height: "320px", objectFit: "cover" }}
            />
          </div>

          <h2 className="fw-bold text-gradient mb-1">{book.title}</h2>
          <p className="text-muted">{book.author}</p>
          <span className="badge bg-light text-primary border border-primary mb-3">
            {book.category}
          </span>

          {/* === Preview Section === */}
          <div className="preview-box p-3 rounded bg-light-subtle">
            <h5 className="fw-semibold text-purple mb-2">📖 Preview</h5>
            <p>{book.description || book.intro}</p>
            <p className="text-muted small">
              — End of preview. Borrow to continue reading full content —
            </p>
          </div>

          {/* Borrow Button */}
          <div className="mt-4 text-center">
            <Button
              className="btn-gradient rounded-pill px-4"
              onClick={handleBorrow}
            >
              <Bookmark size={18} className="me-1" /> Borrow This Book
            </Button>
          </div>
        </Card>

        {/* === Related Books Section === */}
        {relatedBooks.length > 0 && (
          <div className="related-section mb-5">
            <h4 className="fw-bold text-gradient mb-4 text-center">
              📚 Related Books — You might also like
            </h4>
            <Row className="g-4 justify-content-center">
              {relatedBooks.map((b) => (
                <Col key={b._id} xs={10} sm={6} md={4}>
                  <Card
                    className="h-100 shadow-sm border-0 book-card"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/book/${b._id}`)}
                  >
                    <Card.Img
                      variant="top"
                      src={b.img || b.image}
                      alt={b.title}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title className="fw-semibold">{b.title}</Card.Title>
                      <Card.Text className="text-muted small mb-1">
                        {b.author}
                      </Card.Text>
                      <Badge
                        bg="light"
                        text="dark"
                        className="border border-primary"
                      >
                        {b.category}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default BookDetail;
