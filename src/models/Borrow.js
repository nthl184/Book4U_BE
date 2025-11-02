import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const borrowSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "User", required: true, index: true },
  book: { type: ObjectId, ref: "Book", required: true, index: true },
  status: { 
    type: String, 
    enum: ["pending", "approved", "borrowed", "returned", "overdue", "rejected"], 
    default: "pending" 
  },
  requestDate: { type: Date, default: Date.now },
  approveDate: { type: Date },
  borrowDate: { type: Date },
  dueDate: { type: Date },
  returnDate: { type: Date },
  extensions: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Borrow", borrowSchema);
