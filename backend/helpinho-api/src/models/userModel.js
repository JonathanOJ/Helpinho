const db = require("./connection");

const findByEmail = async (email) => {
  const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return user;
};

const signIn = async (user) => {
  const { email, password } = user;

  const userLoged = await db.oneOrNone(
    "SELECT * FROM users WHERE email = $1 AND password = $2",
    [email, password]
  );
  return userLoged;
};

const createUser = async (user) => {
  const { username, email, image, password, cpf_cnpj, birthdate } = user;
  const dateUTC = new Date(Date.now()).toUTCString();

  const query =
    " INSERT INTO users (username, email, image, password, cpf_cnpj, birthdate, total_donated, total_helpinhos_donated, total_helpinhos_created, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id";

  const createdUser = await db.one(query, [
    username,
    email,
    image,
    password,
    cpf_cnpj,
    birthdate,
    0,
    0,
    0,
    dateUTC,
  ]);

  return {
    id: createdUser.id,
    username,
    email,
    image,
    password,
    cpf_cnpj,
    birthdate,
    total_donated: 0,
    total_helpinhos_donated: 0,
    total_helpinhos_created: 0,
    createdAt: dateUTC,
  };
};

const deleteUser = async (id) => {
  const result = await db.result("DELETE FROM users WHERE id = $1", [id]);
  return result.rowCount;
};

const updateUser = async (user) => {
  const {
    id,
    username,
    email,
    image,
    password,
    cpf_cnpj,
    birthdate,
    total_donated,
    total_helpinhos_created,
    total_helpinhos_donated,
  } = user;

  const query =
    "UPDATE users SET username = $1, email = $2, image = $3, password = $4, cpf_cnpj = $5, birthdate = $6, total_donated = $7, total_helpinhos_created = $8, total_helpinhos_donated = $9 WHERE id = $10";

  const result = await db.result(query, [
    username,
    email,
    image,
    password,
    cpf_cnpj,
    birthdate,
    total_donated,
    total_helpinhos_created,
    total_helpinhos_donated,
    id,
  ]);
  return result.rowCount;
};

const updateUserHelpinhosCreated = async (id) => {
  const query =
    "UPDATE users SET total_helpinhos_created = total_helpinhos_created +1 WHERE id = $1";

  try {
    await db.result(query, [id]);
    return;
  } catch (error) {
    console.error("Error updating helpinhos created:", error);
    throw error;
  }
};

module.exports = {
  findByEmail,
  signIn,
  createUser,
  deleteUser,
  updateUser,
  updateUserHelpinhosCreated,
};
