const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  type:{
    type: String,
    required: true,
    enum: ["PARTICULAR", "COMPANY"],
  },
  company: {
    type: String,
    required: false,
    default: "",
  },
  firstName: {
    type: String,
    required: false,
    default: "",
  },
  lastName: {
    type: String,
    required: false,
    default: "",
  },
  logo: {
    type: String,
    required: false,
    default: "",
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    unique: true,
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: false,
    default: "",
  },
  invoices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoices",
    },
  ],
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

// clientSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

module.exports = mongoose.model("clients", clientSchema);
