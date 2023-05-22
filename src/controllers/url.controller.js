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

export async function deleteUrl(req, res) {
  const { id } = req.params;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token inválido!" });
  }

  try {
    const session = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [
      token,
    ]);

    if (session.rows.length === 0) {
      return res.status(401).json({ message: "Você não está logado!" });
    }

    const userId = session.rows[0].userid;

    const url = await db.query(`SELECT * FROM urls WHERE id = $1;`, [id]);

    if (url.rows.length === 0) {
      return res.status(404).json({ message: "URL não encontrada!" });
    }

    if (url.rows[0].userid !== userId) {
      return res
        .status(401)
        .json({ message: "Você não tem permissão para excluir esta URL!" });
    }

    await db.query(`DELETE FROM urls WHERE id = $1;`, [id]);

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
