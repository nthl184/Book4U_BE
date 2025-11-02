// 📘 src/pages/BorrowManage.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Badge,
  ButtonGroup,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Check, X, RefreshCcw, RotateCcw, Upload, Filter } from "lucide-react";
import Footer from "../components/Footer";
import borrowApi from "../api/borrowApi";

function BorrowManage() {
  const [borrowList, setBorrowList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch borrow list from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await borrowApi.getAll();
        setBorrowList(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching borrow list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Filter logic
  const filteredList = borrowList.filter((b) => {
    const matchSearch =
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.borrower?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filter === "All" ? true : b.status === filter;
    return matchSearch && matchFilter;
  });

  // ✅ Approve borrow request
  const handleApprove = async (id) => {
    try {
      await borrowApi.approve(id);
      setBorrowList((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "Borrowing" } : b))
      );
      showToast("✅ Approved successfully!");
    } catch (err) {
      console.error("❌ Approve failed:", err);
    }
  };

  // ✅ Mark as returned
  const handleReturn = async (id) => {
    try {
      await borrowApi.markReturned(id);
      setBorrowList((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "Returned" } : b))
      );
      showToast("📘 Marked as returned!");
    } catch (err) {
      console.error("❌ Return failed:", err);
    }
  };

  // ✅ Extend by 7 days
  const handleExtend = async (id) => {
    try {
      await borrowApi.extend(id);
      setBorrowList((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, extendedDays: (b.extendedDays || 0) + 7 } : b
        )
      );
      showToast("⏰ Extended 7 more days!");
    } catch (err) {
      console.error("❌ Extend failed:", err);
    }
  };

  // ✅ Delete record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this record?")) return;
    try {
      await borrowApi.delete(id);
      setBorrowList((prev) => prev.filter((b) => b.id !== id));
      showToast("🗑️ Deleted successfully!");
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // ✅ Sync data
  const handleSync = async () => {
    try {
      await borrowApi.syncAll();
      showToast("✅ Borrow data synced successfully!");
    } catch (err) {
      console.error("❌ Sync failed:", err);
    }
  };

  // ✅ Toast helper
  const showToast = (msg) => {
    const toast = document.createElement("div");
    toast.innerText = msg;
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "30px",
      right: "30px",
      background: "linear-gradient(90deg, #6f42c1, #9b59b6)",
      color: "white",
      padding: "10px 20px",
      borderRadius: "12px",
      fontSize: "0.9rem",
      fontWeight: "600",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      opacity: "0",
      transform: "translateY(10px)",
      transition: "all 0.4s ease",
      zIndex: "9999",
    });
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0)";
    }, 100);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
    }, 2500);
    setTimeout(() => toast.remove(), 3000);
  };

  // ✅ Helper: Remaining days
  const calcRemainingDays = (dueDate) => {
    if (!dueDate) return null;
    const diff = Math.ceil(
      (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Borrowing":
        return "info";
      case "Returned":
        return "success";
      case "Pending Approval":
        return "secondary";
      case "Overdue":
        return "danger";
      default:
        return "light";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f3e8ff 0%, #faf5ff 50%, #ffffff 100%)",
        padding: "4rem 1rem",
        marginTop: "-20px",
      }}
    >
      <div className="container">
        {/* Header section */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <h3 className="fw-bold text-gradient mb-0">Borrow Management</h3>

          <div className="d-flex gap-2 align-items-center">
            <InputGroup className="me-2">
              <Form.Control
                placeholder="Search by book or borrower..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <Button
              variant="outline-primary"
              className="border-gradient rounded-pill d-flex align-items-center gap-2"
              onClick={handleSync}
            >
              <Upload size={16} />
              Sync
            </Button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="text-center mb-3">
          <ButtonGroup>
            {[
              "All",
              "Pending Approval",
              "Borrowing",
              "Returned",
              "Overdue",
            ].map((tab) => (
              <Button
                key={tab}
                variant={filter === tab ? "primary" : "outline-primary"}
                onClick={() => setFilter(tab)}
                className="rounded-pill px-3"
              >
                {tab}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {loading ? (
          <p className="text-center text-muted">Loading borrow list...</p>
        ) : filteredList.length === 0 ? (
          <p className="text-center text-muted">
            No {filter === "All" ? "" : filter} records found.
          </p>
        ) : (
          <Table
            bordered
            hover
            responsive
            className="table-book4u align-middle"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>Book</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((book, index) => {
                const remaining = calcRemainingDays(book.dueDate);
                const isOverdue = remaining < 0;
                const color = isOverdue
                  ? "danger"
                  : remaining <= 3
                  ? "warning"
                  : "secondary";

                // 👉 Trích xuất MSSV từ email (dạng 22520350@gm.uit.edu.vn)
                const mssv = book.borrowerEmail?.split("@")[0] || "";

                return (
                  <tr key={book.id} className={isOverdue ? "table-danger" : ""}>
                    <td>{index + 1}</td>
                    <td>{book.title}</td>

                    {/* 🧑 Borrower info */}
                    <td>
                      <strong>{book.borrowerName}</strong>
                      <br />
                      <small className="text-muted">{mssv}</small>
                    </td>

                    <td>{book.borrowDate || "—"}</td>
                    <td>{book.dueDate || "—"}</td>
                    <td>
                      {remaining == null ? (
                        "-"
                      ) : (
                        <Badge bg={color}>
                          {isOverdue
                            ? `Overdue ${Math.abs(remaining)}d`
                            : `${remaining} days left`}
                        </Badge>
                      )}
                    </td>
                    <td>
                      <Badge bg={getStatusColor(book.status)}>
                        {book.status}
                      </Badge>
                    </td>

                    {/* Các nút action */}
                    <td className="d-flex gap-2 justify-content-center">
                      {book.status === "Pending Approval" && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleApprove(book.id)}
                        >
                          <Check size={14} />
                        </Button>
                      )}
                      {book.status === "Borrowing" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleExtend(book.id)}
                          >
                            <RefreshCcw size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => handleReturn(book.id)}
                          >
                            <RotateCcw size={14} />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(book.id)}
                      >
                        <X size={14} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default BorrowManage;
