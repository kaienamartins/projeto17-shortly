import { db } from "../database/database.connection.js";
import { userSchema, userLoginSchema } from "../schemas/users.schema.js";

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

    const existingUser = await db.query(
      `SELECT * FROM users WHERE email = $1;`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "Email já cadastrado!" });
    }

    res.locals.userData = {
      name,
      email,
      password,
      confirmPassword,
    };
    next();
  } catch (err) {
    console.error(err);
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

    res.locals.loginData = {
      email,
      password,
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
