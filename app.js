const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const middleware = require("./src/utils/middleware");
const cors = require("cors");
require("./src/model/dbConnection");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

const accountsRouter = require("./src/routes/account.routes");
const clientsRouter = require("./src/routes/client.routes");
const invoicesRouter = require("./src/routes/invoice.routes");

const app = express();

// Configuration CORS avec options spécifiques pour la production
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://santu-frontend.vercel.app", "https://santu-pro.vercel.app"]
      : "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

// Appliquer CORS comme premier middleware
app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(middleware.errorHandler);
app.use(middleware.requestLogger);

app.use("/api/accounts", accountsRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/invoices", invoicesRouter);

app.use(middleware.unknownEndpoint);

module.exports = app;
