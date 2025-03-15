const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Invoice = require("../model/invoice.model");
const Account = require("../model/account.model");
const Client = require("../model/client.model");

// Fonction pour filtrer les factures par période
const filterByPeriod = (invoices, period) => {
  if (!period || period === "all") return invoices;

  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  switch (period) {
    case "today":
      return invoices.filter((invoice) => invoice.date === todayString);
    case "week":
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfWeekString = startOfWeek.toISOString().split("T")[0];
      return invoices.filter((invoice) => invoice.date >= startOfWeekString);
    case "month":
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfMonthString = startOfMonth.toISOString().split("T")[0];
      return invoices.filter((invoice) => invoice.date >= startOfMonthString);
    case "all":
      return invoices;
    default:
      return invoices;
  }
};

// Fonction pour filtrer les factures par statut
const filterByStatus = (invoices, status) => {
  if (!status || status === "all") return invoices;
  return invoices.filter((invoice) => invoice.status === status.toUpperCase());
};

// Fonction pour filtrer les clients en fonction de leurs factures
const filterClientsByInvoices = (clients, period, status) => {
  if (!period && !status) return clients;

  return clients.filter((client) => {
    const filteredInvoices = filterByStatus(
      filterByPeriod(client.invoices, period),
      status
    );
    return filteredInvoices.length > 0;
  });
};

// Get all invoices
router.get("/dashboard/:accountId", async (request, response, next) => {
  try {
    const queries = request.query;
    const period = queries.period; // 'all' | 'today' | 'week' | 'month' | 'year'
    const status = queries.status; // 'all' | 'draft' | 'paid' | 'cancelled' | 'pending'
    console.log({ period, status });

    const accountId = request.params.accountId;
    const account = await Account.findById(accountId)
      .populate("clients")
      .populate({
        path: "clients",
        populate: {
          path: "invoices",
        },
      });

    if (!account)
      return response
        .status(200)
        .json({ success: false, message: "Compte non trouvé" });

    // @ts-ignore
    const allInvoices = account.clients.map((client) => client.invoices).flat();

    // Appliquer les filtres
    const filteredByPeriod = filterByPeriod(allInvoices, period);
    const filteredInvoices = filterByStatus(filteredByPeriod, status);

    // Filtrer les clients en fonction des paramètres de requête
    const filteredClients = filterClientsByInvoices(
      account.clients,
      period,
      status
    );

    // Calculer les statistiques
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    const todayInvoices = allInvoices.filter(
      (invoice) => invoice.date === todayString
    );

    const totalToday = todayInvoices.reduce(
      (acc, invoice) => acc + Number(invoice.amount),
      0
    );

    const totalthisMonth = filteredInvoices.reduce((acc, invoice) => {
      const invoiceDate = new Date(invoice.date);
      const currentMonth = today.getMonth();
      const invoiceMonth = invoiceDate.getMonth();
      if (currentMonth === invoiceMonth) {
        return acc + Number(invoice.amount);
      }
      return acc;
    }, 0);

    const invoicesCount = filteredInvoices.length;
    const clientsCount = filteredClients.length; // Utiliser les clients filtrés

    return response.status(200).json({
      success: true,
      dashboardData: {
        invoices: filteredInvoices,
        totalthisMonth,
        invoicesCount,
        clientsCount,
        totalToday,
      },
    });
  } catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});

// Get invoice by id
router.get("/:id", async (request, response, next) => {
  try {
    const invoice = await Invoice.findById(request.params.id).populate(
      "client"
    );
    if (!invoice) {
      return response
        .status(200)
        .json({ success: false, message: "Facture non trouvée" });
    }
    return response.status(200).json({ success: true, invoice });
  } catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});

// Get invoices by client id
router.get("/client/:clientId", async (request, response) => {
  try {
    const invoices = await Invoice.find({ client: request.params.clientId });
    if (!invoices || invoices.length === 0) {
      return response
        .status(200)
        .json({ success: false, message: "Aucune facture trouvée" });
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

    const client = await Client.findById(clientId);
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
      const account = await Account.findById(accountId);
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

// Update invoice by id
router.put("/update/:id", async (request, response, next) => {
  try {
    if (!request.body) {
      return response
        .status(200)
        .json({ success: false, message: "Veuillez remplir tous les champs" });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      request.params.id,
      {
        ...request.body,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!invoice) {
      return response.status(200).json({
        success: false,
        message: "Facture non trouvée",
      });
    }

    return response.status(200).json({ success: true, invoice });
  } catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});

module.exports = router;
