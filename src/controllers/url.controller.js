import { db } from "../database/database.connection.js";
import { nanoid } from "nanoid";

export async function shortenUrl(req, res) {
  const { url } = res.locals;
  const userId = res.locals.userId;
  const short = nanoid(8);

  try {
    const shortUrl = await db.query(
      `INSERT INTO urls (url, shorturl, userId) VALUES ($1, $2, $3) RETURNING id;`,
      [url, short, userId]
    );

    return res.status(201).json({ id: shortUrl.rows[0].id, shortUrl: short });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
