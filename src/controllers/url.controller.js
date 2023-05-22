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
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function getUrlById(req, res) {
  const { id } = req.params;

  try {
    const url = await db.query(`SELECT * FROM urls WHERE id = $1;`, [id]);

    if (url.rows.length === 0) {
      return res.status(404).json({ message: "URL não encontrada!" });
    }

    return res.status(200).json({
      id: url.rows[0].id,
      shortUrl: url.rows[0].shorturl,
      url: url.rows[0].url,
    });
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function openUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const url = await db.query(`SELECT * FROM urls WHERE shorturl = $1;`, [
      shortUrl,
    ]);

    if (url.rows.length === 0) {
      return res.status(404).json({ message: "URL não encontrada!" });
    }

    await db.query(
      `UPDATE urls SET visitcount = visitcount + 1 WHERE shorturl = $1;`,
      [shortUrl]
    );

    const original = url.rows[0].url;
    return res.status(200).json({ url: original });
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
