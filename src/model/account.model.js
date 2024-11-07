const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ["ADMIN", "PARTNER", "ACCOUNT"],
    default: "ACCOUNT",
    required: true,
  },
  logo: {
    type: String,
    required: false,
    default: "",
  },
  phone: {
    type: String,
    required: false,
    default: "",
  },
  email: {
    unique: true,
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
    default: "",
  },
  isFirstLogin: {
    type: Boolean,
    required: true,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clients",
    },
  ],
  currency: {
    type: String,
    required: false,
    default: "GNF",
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

// accountSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

module.exports = mongoose.model("accounts", accountSchema);
