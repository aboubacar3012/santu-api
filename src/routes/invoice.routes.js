const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Invoice = require("../model/invoice.model");
const Account = require("../model/account.model");
const Client = require("../model/client.model");

// Get all invoices
router.get("/dashboard/:accountId", async (request, response, next) => {
  try {

    const accountId = request.params.accountId;
    const account = await Account.findById(accountId)
      .populate("clients")
      .populate({
        "path": "clients",
        "populate": {
          "path": "invoices"
        }
      });
    
      console.log({account})

    if (!account) return response.status(200).json({ success: false, message: "Compte non trouvé" });
    // @ts-ignore
    const invoices = account.clients.map((client) => client.invoices).flat();
    // total aujourd'hui
    const today = new Date();
    // convertir en format: 2024-09-16
    const todayString = today.toISOString().split("T")[0];
    const todayInvoices = invoices.filter((invoice) => invoice.date === todayString);
    const totalToday = todayInvoices.reduce((acc, invoice) => acc + Number(invoice.amount), 0);
    const total = invoices.reduce((acc, invoice) => acc + Number(invoice.amount), 0);
    const invoicesCount = invoices.length;
    const clientsCount = account.clients.length;
    return response.status(200).json({ success: true,dashboardData: { invoices, total, invoicesCount, clientsCount, totalToday } });
  } catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});

// Get invoice by id
router.get("/:id", async (request, response, next) => {
  try {
    const invoice = await Invoice
    .findById(request.params.id)
    .populate("client");
    if (!invoice) {
      return response.status(200).json({ success: false, message: "Facture non trouvée" });
    }
    return response.status(200).json({ success: true, invoice });
  } catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});

// Get invoices by client id
router.get("/client/:clientId", async (request, response) => {
  try {
    const invoices = await Invoice.find({client: request.params.clientId});
    if (!invoices || invoices.length === 0) {
      return response.status(200).json({ success: false, message: "Aucune facture trouvée" });
    }
    return response.status(200).json({ success: true, invoices });
  } catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});


// Create a new invoice
router.post("/create", async (request, response, next) => {
  try {
    if (!request.body) {
      return response
        .status(200)
        .json({ success: false, message: "Veuillez remplir tous les champs" });
    }

    const accountId = request.body.accountId;
    const clientId = request.body.clientId;

    delete request.body.accountId;
    delete request.body.clientId;


    const invoice = new Invoice({
      ...request.body,
      account: accountId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });



    const client = await Client.findById(clientId)
    if (!client) {
      return response.status(200).json({
        success: false,
        message: "Client non trouvé",
      });
    }

    client.invoices.push(invoice._id);
    invoice.client = clientId;

    // utilise promise all
    await Promise.all([invoice.save(), client.save()]).then(async () => {
      const account = await Account.findById(accountId)
        // .populate("clients")
        // .populate({
        //   "path": "clients",
        //   "populate": {
        //     "path": "invoices"
        //   }
        // });
      return response.status(200).json({ success: true, account });
    });
  } catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});

module.exports = router;
