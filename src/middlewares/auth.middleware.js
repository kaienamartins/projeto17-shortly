import { db } from "../database/database.connection.js";
import { userSchema } from "../schemas/users.schema.js";
import bcrypt from "bcrypt";

export async function signUpMiddleware(req, res, next) {
  const { password, confirmPassword, email, name } = req.body;

  try {
    const { error } = userSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(422).json({ errors });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({ message: "As senhas não são iguais!" });
    }

    if (
      password === "" ||
      confirmPassword === "" ||
      email === "" ||
      name === ""
    ) {
      return res.status(422).json({ message: "Preencha todos os campos!" });
    }

    if (
      typeof password !== "string" ||
      typeof confirmPassword !== "string" ||
      typeof email !== "string" ||
      typeof name !== "string"
    ) {
      return res.status(422).json({ message: "Envie os dados corretamente!" });
    }

    if (!email.includes("@")) {
      return res.status(422).json({ message: "Forneça um email válido!" });
    }

    const userExists = await db.query(`SELECT * FROM users WHERE email = $1;`, [
      email,
    ]);

    if (userExists.rowCount > 0) {
      return res.status(409).json({ message: "Usuário já cadastrado" });
    }

    res.locals.user = req.body;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function signInMiddleware(req, res, next) {
  const { password, email } = req.body;

  try {
    const { error } = userSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(422).json({ errors });
    }

    if (password === "" || email === "") {
      return res.status(422).json({ message: "Preencha todos os campos!" });
    }

    if (typeof password !== "string" || typeof email !== "string") {
      return res.status(422).json({ message: "Envie os dados corretamente!" });
    }

    if (!email.includes("@")) {
      return res.status(422).json({ message: "Forneça um email válido!" });
    }

    const userExists = await db.query(`SELECT * FROM users WHERE email = $1;`, [
      email,
    ]);

    if (userExists.rowCount === 0) {
      return res.status(401).json({ message: "Usuário não cadastrado" });
    }

    const correspPass = bcrypt.compareSync(
      password,
      userExists.rows[0].password
    );

    if (!correspPass) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    res.locals.user = userExists.rows[0];
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
