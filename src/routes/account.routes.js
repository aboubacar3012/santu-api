const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const middleware = require("../utils/middleware");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const Account = require("../model/account.model");
const Client = require("../model/client.model");

const { sendMail } = require("../utils/sendMail");
// send sms
// router.post("/sendsms", async (request, response) => {
//   try {
//     const accountSid = PROCESS.ENV.TWILIO_ACCOUNT_SID;
//     const authToken = PROCESS.ENV.TWILIO_AUTH_TOKEN;
//     const client = require('twilio')(accountSid, authToken);

//     client.messages
//       .create({
//         body: 'ljl',
//         from: '+12294045562',
//         to: '+33758020980'
//       })
//       .then(message => console.log(message.sid));

//   } catch (e) {
//     return response.status(200).json({ success: false, error: e.message });
//   }
// });

// Get all accounts
router.get("/", async (request, response) => {
  try {
    const accounts = await Account.find()
      .populate("clientId")
      // sort by updatedAt
      .sort({ createdAt: -1 })
      .lean();
    response.json({
      success: true,
      accounts,
    });
  }
  catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});

// get account by ID
router.get("/:id", middleware.isAuthenticated, (request, response) => {
  try {
    const accountId = request.params.id;
    // verifier si l'id est valid
    if (!mongoose.isValidObjectId(accountId))
      return response.status(200).json({
        success: false,
        message: "l'ID de cet utilisateur n'existe pas",
      });

    Account.findById(accountId)
      .populate("clients")
      // .lean()
      .then((account) => {
        if (account) {
          return response.status(200).json({ success: true, account });
        } else {
          return response
            .status(200)
            .json({ success: false, message: "Utilisateur non trouvé" });
        }
      });

  } catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});

// Create a new account
// router.post("/create", async (request, response) => {
//   try {
//     if (!request.body) {
//       return response
//         .status(200)
//         .json({ success: false, message: "Veuillez remplir tous les champs" });
//     }
//     const { firstName, lastName, email, role, phone, password, clientId } =
//       request.body;
//     const findedAccount = await Account.findOne({ email });
//     if (findedAccount) {
//       return response.status(200).json({
//         success: false,
//         message: "Ce utilisateur est déjà enregistré",
//         account: findedAccount,
//       });
//     }
//     const account = new Account({
//       firstName,
//       lastName,
//       email,
//       role,
//       phone,
//       password,
//       clientId,
//     });

//     const client = await Client.findById(clientId);
//     if (client) {
//       client?.accounts?.push(account._id);
//       await client.save();
//       await account.save();
//       console.log(client);
//       console.log(account);
//       response.json({ success: true, account });
//     }


//   } catch (e) {
//     return response.status(200).json({ success: false, error: e.message });
//   }
// });

// Create a new account
router.post("/auth", async (request, response) => {
  try {
    if (!request.body) {
      return response
        .status(200)
        .json({ success: false, message: "Veuillez remplir tous les champs" });
    }
    const { email, password } = request.body;

    const findedAccount = await Account.findOne({ email }).populate("clients");
    if (findedAccount && password.length > 0) {
      if (bcrypt.compareSync(password, findedAccount.password)) {
        const token = jwt.sign(
          { id: findedAccount._id, role: findedAccount.role, email: findedAccount.email },
          process.env.SECRET_KEY || "santupro_key",
          {
            expiresIn: process.env.JWT_EXPIRE,
          }
        );

        return response.status(200).json({
          success: true,
          account: findedAccount,
          message: "Connexion reussie avec success",
          token,
        });
      }
    }

    if (findedAccount && password.length === 0) {
      return response.status(200).json({
        exist: true,
        success: true,
        message: "Ce utilisateur est déjà enregistré",
        account: findedAccount,
      });
    }


    // generate pasword of 8 characters, 1 uppercase, 1 lowercase, 1 number
    const generatedPassword = Math.random().toString(36).slice(-8); // generate random password of 8 characters
    const hashedPassword = bcrypt.hashSync(generatedPassword, saltRounds);
    // @ts-ignore
    sendMail({
      to: email,
      subject: "Votre mot de passe temporaire",
      html: `
        <p>Bonjour ${"Aboubacar"},</p>
        <p style="font-weight:bold">Voici votre mot de passe temporaire: ${generatedPassword}</p>
        <p>Vous pouvez vous connecter avec ce mot de passe et le changer dans votre profil</p>
      `,
    });
    const account = new Account({
      email,
      password: hashedPassword,
    });

    await account.save();

    response.json({ created: true, success: true, account: { email, generatedPassword } });



  } catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});

// Login
router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;
    const account = await Account.findOne({ email }).populate("clientId");

    if (!account) {
      return response.json({
        success: false,
        message: "Aucun utilisateur trouvé avec cet email",
      });
    }

    if (!account.isActive) {
      return response.json({
        success: false,
        message: "Votre compte a été désactivé, veuillez contacter l'administrateur",
      });
    }

    // vérifier si c'est le premier login
    if (account.isFirstLogin) {
      // vérifier si le mot de passe est correct
      if (account.password === password) {
        return response.json({
          success: true,
          message: "Vous devez changer votre mot de passe",
          account,
        });
      }
    }

    // cela signifie que c'est pas le premier login
    if (bcrypt.compareSync(password, account.hashedPassword)) {
      const token = jwt.sign(
        { id: account._id, role: account.role, email: account.email },
        process.env.SECRET_KEY || "santupro_key",
        {
          expiresIn: process.env.JWT_EXPIRE,
        }
      );

      return response.status(200).json({
        success: true,
        account: account,
        message: "Connexion reussie avec success",
        token,
      });
    }

    return response.json({
      success: false,
      message: "Email ou Mot de passe incorrect",
    });
  } catch (error) {
    return response.status(200).json({ success: false, error: error.message });
  }
});

// Change password after first login
router.put("/updatepassword/:id", (request, response) => {
  try {
    const accountId = request.params.id;
    const { password } = request.body;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    // verifier si l'id est valid
    if (!mongoose.isValidObjectId(accountId))
      return response.status(200).json({
        success: false,
        message: "l'ID de cet utilisateur n'existe pas",
      });

    Account.findByIdAndUpdate(
      accountId,
      { hashedPassword, isFirstLogin: false },
      { new: true }
    ).then((updated) => {
      if (updated)
        return response.status(200).json({
          account: updated,
          success: true,
          message: "Mise a jour du mot de passe reussie avec success",
        });
      else
        return response
          .status(200)
          .json({ success: false, message: "Utilisateur non trouvé" });
    });
  } catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});

// Reset password
router.post(
  "/resetpassword",
  middleware.isAuthenticated,
  (request, response) => {
    try {
      const { email } = request.body;
      // check if account exist
      Account.findOne({ email: email }).then((account) => {
        if (!account) {
          return response.status(200).json({
            success: false,
            message: "Aucun utilisateur trouvé avec cet email",
          });
        }
        // generate random password of 12 characters
        const password = Math.random().toString(36).slice(-12); // generate random password of 12 characters
        account.password = password;
        account.isFirstLogin = true;
        account.save().then(() => {
          return response.status(200).json({
            success: true,
            message: "Mot de passe réinitialisé avec succès",
            password,
          });
        });
      });

      return response.status(200).json({
        success: false,
        message: "Aucun utilisateur trouvé avec cet email",
      });
    } catch (e) {
      return response.status(200).json({ success: false, error: e.message });
    }
  }
);

// Update account
// middleware.isAuthenticated,
router.put("/update/:id", (request, response) => {
  try {
    const accountId = request.params.id;
    // verifier si l'id est valid
    if (!mongoose.isValidObjectId(accountId))
      return response.status(200).json({
        success: false,
        message: "l'ID de cet utilisateur n'existe pas",
      });

    Account.findByIdAndUpdate(accountId, { ...request.body, isFirstLogin: false }, { new: true }).then(
      (updated) => {
        if (updated)
          return response.status(200).json({
            account: updated,
            success: true,
            message: "Mise a jour reussie avec success",
          });
        else
          return response
            .status(200)
            .json({ success: false, message: "Utilisateur non trouvé" });
      }
    );
  } catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});

// Delete account
// middleware.isAuthenticated,
router.delete("/:id", (request, response) => {
  try {
    const accountId = request.params.id;
    // verifier si l'id est valid
    if (!mongoose.isValidObjectId(accountId))
      return response.status(200).json({
        success: false,
        message: "l'ID de cet utilisateur n'existe pas",
      });

    Account.findByIdAndRemove(accountId).then((deletedAccount) => {
      if (deletedAccount)
        return response.status(200).json({
          success: true,
          message: "Utilisateur supprimé avec succès",
        });
      else
        return response
          .status(200)
          .json({ success: false, message: "Utilisateur non trouvé" });
    });
  } catch (e) {
    return response.status(200).json({ success: false, error: e.message });
  }
});

module.exports = router;
