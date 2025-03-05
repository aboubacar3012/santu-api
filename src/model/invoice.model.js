const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
    default: "1",
  },
  price: {
    type: String,
    required: true,
  },
  createdAt: {
    default: Date.now,
    type: Date,
    required: true,
  },
  updatedAt: {
    default: Date.now,
    type: Date,
    required: true,
  },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
    default: "",
  },
  date: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  paymentMode: {
    type: String,
    required: true,
    enum: ["CASH", "OM", "CB", "VIREMENT"],
  },
  status: {
    type: String,
    required: true,
    enum: ["DRAFT", "SENT", "PAID", "CANCELLED"],
    default: "DRAFT",
  },
  paymentCondition: {
    type: String,
    required: true,
    enum: ["NOW", "15", "30", "45", "60", "UPONRECEIPT"],
  },
  tva: {
    type: String,
    required: false,
  },
  remark: {
    type: String,
    required: false,
  },
  articles: [articleSchema],
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "clients",
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accounts",
    required: true,
  },
  createdAt: {
    default: Date.now,
    type: Date,
    required: true,
  },
  updatedAt: {
    default: Date.now,
    type: Date,
    required: true,
  },
});

// invoiceSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

module.exports = mongoose.model("invoices", invoiceSchema);
