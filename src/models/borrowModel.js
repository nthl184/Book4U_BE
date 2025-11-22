import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrower: String,
    borrowDate: { type: Date, default: Date.now },
    dueDate: {
      type: Date,
      default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
    }, // +7 ngày
    status: {
      type: String,
      enum: [
        "Pending Approval",
        "Borrowing",
        "Returned",
        "Overdue",
        "Rejected",
      ],
      default: "Pending Approval",
    },

    extendedDays: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Borrow = mongoose.model("Borrow", borrowSchema);
export default Borrow;
