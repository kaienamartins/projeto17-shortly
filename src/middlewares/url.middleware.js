import { db } from "../database/database.connection.js";

export async function shortenURLMiddleware(req, res, next) {
  const { authorization } = req.headers;
  const { url } = req.body;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token inválido!" });
  }

  if (!url) {
    return res.status(422).json({ message: "Preencha todos os campos!" });
  }

  try {
    const session = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [
      token,
    ]);

    if (session.rows.length === 0) {
      return res.status(401).json({ message: "Você não está logado!" });
    }

    const userId = session.rows[0].userid;

    res.locals.url = url;
    res.locals.userId = userId;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function getUrlByIdMiddleware(req, res, next) {
  const { id } = req.params;

  try {
    const url = await db.query(`SELECT * FROM urls WHERE id = $1;`, [id]);

    if (url.rows.length === 0) {
      return res.status(404).json({ message: "URL não encontrada!" });
    }

    req.url = url.rows[0];

    next();
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function openUrlMiddleware(req, res, next) {
  const { shortUrl } = req.params;

  try {
    const url = await db.query(`SELECT * FROM urls WHERE shorturl = $1;`, [
      shortUrl,
    ]);

    if (url.rows.length === 0) {
      return res.status(404).json({ message: "URL não encontrada!" });
    }

    req.url = url.rows[0];

    next();
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function deleteUrlMiddleware(req, res, next) {
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

    req.userId = session.rows[0].userid;

    next();
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function userUrlsMiddleware(req, res, next) {
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

    req.userId = session.rows[0].userid;
    next();
  } catch (err) {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
