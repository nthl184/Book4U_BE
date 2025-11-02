// 📘 src/pages/Books.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Modal,
} from "react-bootstrap";
import {
  Search,
  ArrowUp,
  BookOpen,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import bookApi from "../api/bookApi";
import borrowApi from "../api/borrowApi";

function Books() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "guest";

  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    category: "",
    img: "",
    description: "",
  });

  // ✅ Fetch book list
  const fetchBooks = async () => {
    try {
      const res = await bookApi.getAll();
      setBooksData(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 📘 View details
  const handleViewDetail = (id) => navigate(`/book/${id}`);

  // ✅ Borrow (for students)
  const handleBorrow = async (bookId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.id || user?._id;

      if (!userId) {
        alert("⚠️ Please log in before borrowing!");
        return;
      }

      await borrowApi.create(userId, bookId);
      alert("✅ Borrow request created successfully!");
      fetchBooks();
    } catch (err) {
      console.error("❌ Borrow failed:", err.response?.data || err);
      alert(
        "❌ Borrow failed! " +
          (err.response?.data?.message || "Please check console.")
      );
    }
  };

  // === Admin CRUD ===
  const handleOpenModal = (book = null) => {
    setEditMode(!!book);
    setBookForm(
      book || { title: "", author: "", category: "", img: "", description: "" }
    );
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editMode) {
        await bookApi.update(bookForm.id, bookForm);
        alert("✅ Book updated successfully!");
      } else {
        await bookApi.create(bookForm);
        alert("✅ Book added successfully!");
      }
      setShowModal(false);
      fetchBooks();
    } catch (err) {
      console.error("❌ Save failed:", err);
      alert("❌ Failed to save book!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookApi.delete(id);
        fetchBooks();
      } catch (err) {
        console.error("❌ Delete failed:", err);
      }
    }
  };

  const filteredBooks = booksData.filter((b) => {
    const matchSearch =
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory =
      filterCategory === "All" || b.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="books-page">
      <div className="content-wrapper">
        <div className="search-container mb-4 position-relative">
          <h3 className="fw-bold mb-3 text-gradient">Find Your Book</h3>

          <Row className="justify-content-center g-3 align-items-center">
            <Col md={7}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <Search color="#9b59b6" size={18} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by title or author..."
                  className="search-bar border-start-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>

            <Col md={2}>
              <Form.Select
                className="rounded-pill"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option>All</option>
                <option>Classic</option>
                <option>Programming</option>
                <option>Self-Help</option>
              </Form.Select>
            </Col>

            {role === "admin" && (
              <Col md="auto">
                <Button
                  className="btn-gradient rounded-pill px-4"
                  onClick={() => handleOpenModal()}
                >
                  <PlusCircle size={18} className="me-1" /> Add Book
                </Button>
              </Col>
            )}
          </Row>
        </div>

        {loading ? (
          <p className="text-center text-muted">Loading books...</p>
        ) : (
          <Row className="g-4 justify-content-center">
            {filteredBooks.map((book) => (
              <Col key={book.id} xs={10} sm={6} md={4} lg={3}>
                <Card className="book-card h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={book.img || book.image}
                    alt={book.title}
                    className="book-img"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleViewDetail(book.id)}
                  />
                  <Card.Body>
                    <Card.Title className="fw-semibold">
                      {book.title}
                    </Card.Title>
                    <Card.Text className="text-muted mb-2">
                      {book.author}
                    </Card.Text>
                    <span className="badge bg-light text-primary border border-primary mb-2">
                      {book.category}
                    </span>

                    {/* Role-based actions */}
                    {role === "student" && (
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          size="sm"
                          className="btn-gradient rounded-pill px-3"
                          onClick={() => handleViewDetail(book.id)}
                        >
                          <BookOpen size={16} className="me-1" /> View
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="border-gradient rounded-pill px-3"
                          onClick={() => handleBorrow(book.id)}
                        >
                          Borrow
                        </Button>
                      </div>
                    )}

                    {role === "admin" && (
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          size="sm"
                          variant="outline-success"
                          className="rounded-pill px-3"
                          onClick={() => handleOpenModal(book)}
                        >
                          <Edit size={16} className="me-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          className="rounded-pill px-3"
                          onClick={() => handleDelete(book.id)}
                        >
                          <Trash2 size={16} className="me-1" /> Delete
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Scroll to top */}
      <Button
        className="scroll-top-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={20} />
      </Button>

      <Footer />

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Book" : "Add New Book"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {["title", "author", "category", "img", "description"].map(
              (field) => (
                <Form.Group className="mb-3" key={field}>
                  <Form.Label className="text-capitalize">{field}</Form.Label>
                  <Form.Control
                    type="text"
                    value={bookForm[field] || ""}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, [field]: e.target.value })
                    }
                    placeholder={`Enter ${field}`}
                  />
                </Form.Group>
              )
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className="btn-gradient" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Books;
