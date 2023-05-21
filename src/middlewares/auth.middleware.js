import { db } from "../database/database.connection.js";
import { userSchema, userLoginSchema } from "../schemas/users.schema.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUpMiddleware(req, res, next) {
  const { name, email, password, confirmPassword } = req.body;

  try {
    const { error } = userSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(422).json({ errors });
    }

    if (!name || !email || !password || !confirmPassword) {
      return res.status(422).json({ message: "Preencha todos os campos!" });
    }

    const minPassword = 6;
    if (password.length < minPassword) {
      return res
        .status(422)
        .json({ message: "A senha deve ter no mínimo 6 caracteres!" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ message: "Forneça um email válido!" });
    }

    const userExists = await db.query(`SELECT * FROM users WHERE email = $1;`, [
      email,
    ]);

    if (userExists.rowCount !== 0) {
      return res.status(409).json({ message: "Usuário já cadastrado" });
    }

    const hashPass = bcrypt.hashSync(password, 10);

    const queryText = `
      INSERT INTO users (name, email, password, confirmpassword, createdAt)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const queryValues = [name, email, hashPass, confirmPassword];

    const { rows } = await db.query(queryText, queryValues);

    res.locals.user = rows[0];
    return res.status(201).send();
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function signInMiddleware(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: "Preencha todos os campos!" });
  }

  try {
    const { error } = userLoginSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(422).json({ errors });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ message: "Forneça um email válido!" });
    }

    const userExists = await db.query(`SELECT * FROM users WHERE email = $1;`, [
      email,
    ]);

    if (userExists.rowCount === 0) {
      return res.status(401).json({ message: "Usuário não cadastrado!" });
    }

    const correspPass = bcrypt.compareSync(
      password,
      userExists.rows[0].password
    );

    if (!correspPass) {
      return res.status(401).json({ message: "Senha incorreta!" });
    }

    const token = uuid();

    await db.query(`INSERT INTO sessions (token, userid) VALUES ($1, $2);`, [
      token,
      userExists.rows[0].id,
    ]);

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
