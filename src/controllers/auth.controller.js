import { db } from "../database/database.connection.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  const hashPass = bcrypt.hashSync(password, 10);

  try {
    await db.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
      [name, email, hashPass]
    );
  } catch (err) {
    res.status(500).json({ message: "Erro interno do servidor", error: err });
  }
}

export async function signIn(req, res) {
  const { user } = res.locals;
  const token = uuid();

  try {
    await db.query(`INSERT INTO sessions (token, userid) VALUES ($1, $2);`, [
      token,
      user.id,
    ]);
  } catch (err) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}
