import { db } from "../database/database.connection.js";
import { nanoid } from "nanoid";

export async function shortenUrl(req, res) {
  const { url } = req.body;
  const { userId } = res.locals;
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
  const url = req.url;

  return res.status(200).json({
    id: url.id,
    shortUrl: url.shorturl,
    url: url.url,
  });
}

export async function openUrl(req, res) {
  const url = req.url;

  try {
    await db.query(
      `UPDATE urls SET visitcount = visitcount + 1 WHERE shorturl = $1;`,
      [url.shorturl]
    );

    return res.status(302).json({ url: url.url });
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function deleteUrl(req, res) {
  const { id } = req.params;
  const userId = req.userId;

  try {
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

export async function userUrls(req, res) {
  const userId = req.userId;

  try {
    const user = await db.query(`SELECT * FROM users WHERE id = $1;`, [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado!" });
    }

    const urls = await db.query(`SELECT * FROM urls WHERE userid = $1;`, [
      userId,
    ]);

    const shortenedUrls = urls.rows.map((url) => {
      return {
        id: url.id,
        shortUrl: url.shorturl,
        url: url.url,
        visitCount: url.visitcount,
      };
    });

    const visitCount = urls.rows.reduce((acc, curr) => {
      return acc + curr.visitcount;
    }, 0);

    return res.status(200).json({
      id: user.rows[0].id,
      name: user.rows[0].name,
      visitCount: visitCount,
      shortenedUrls: shortenedUrls,
    });
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function getRanking(req, res) {
  try {
    const ranking = await db.query(`
      SELECT users.id, users.name, COUNT(urls.id) AS linksCount, COALESCE(SUM(urls.visitcount), 0) AS visitCount
      FROM users
      LEFT JOIN urls ON users.id = urls.userid
      GROUP BY users.id
      ORDER BY visitCount DESC
      LIMIT 10;
    `);

    const formattedRanking = ranking.rows.map((user) => ({
      id: user.id,
      name: user.name,
      linkscount: parseInt(user.linkscount),
      visitCount: parseInt(user.visitcount),
    }));

    res.status(200).json(formattedRanking);
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
