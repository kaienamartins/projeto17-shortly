import { db } from "../database/database.connection.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  const hashPass = bcrypt.hashSync(password, 10);

  try {
    await db.query(
      `INSERT INTO users (name, email, password, "confirmPassword") VALUES ($1, $2, $3, $4);`,
      [name, email, hashPass, confirmPassword]
    );

    res.status(201).send();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function signIn(req, res) {
  const { user } = res.locals;
  const token = uuid();

  try {
    await db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2);`, [
      token,
      user.id,
    ]);
    res.status(200).send({ token });
  } catch (err) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}
