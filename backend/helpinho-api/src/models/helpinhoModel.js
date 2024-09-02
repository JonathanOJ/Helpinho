const db = require("./connection");

const searchHelpinho = async (searchBody) => {
  const { search, category, page, itemsPerPage } = searchBody;
  const offset = itemsPerPage * (page - 1);

  let whereClauses = [];
  let values = [];

  if (search) {
    whereClauses.push(`title ILIKE $${values.length + 1}`);
    values.push(`%${search}%`);
  }

  if (category) {
    whereClauses.push(`$${values.length + 1} = ANY(category)`);
    values.push(`${category}`);
  }

  const query = `SELECT * FROM helpinhos ${
    whereClauses.length > 0 ? "WHERE " + whereClauses.join(" AND ") : ""
  } LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;

  values.push(itemsPerPage, offset);

  return db.any(query, values);
};

const findById = async (id) => {
  const query = "SELECT * FROM helpinhos WHERE id = $1";
  return db.oneOrNone(query, [id]);
};

const findAllByUser = async (userId) => {
  const query =
    "SELECT * FROM helpinhos WHERE (user_responsable -> 'id')::INTEGER = $1";
  return db.any(query, [userId]);
};

const createHelpinho = async (helpinho) => {
  const {
    title,
    description,
    image,
    category,
    users_donated,
    value,
    request_emergency,
    emergency,
    user_responsable,
  } = helpinho;
  const dateUTC = new Date().toUTCString();

  const query =
    "INSERT INTO helpinhos (title, description, image, category, users_donated, value, request_emergency, emergency, user_responsable, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id";

  const createdHelpinho = await db.one(query, [
    title,
    description,
    image,
    category,
    users_donated,
    value,
    request_emergency,
    emergency,
    user_responsable,
    dateUTC,
  ]);

  return { insertId: createdHelpinho.id };
};

const deleteHelpinho = async (id) => {
  const result = await db.result("DELETE FROM helpinhos WHERE id = $1", [id]);
  return result.rowCount;
};

const updateHelpinho = async (helpinho) => {
  const {
    id,
    title,
    description,
    image,
    category,
    users_donated,
    value,
    request_emergency,
    emergency,
    user_responsable,
    createdAt,
  } = helpinho;

  const query =
    "UPDATE helpinhos SET title = $1, description = $2, image = $3, users_donated = $4, category = $5, value = $6, request_emergency = $7, emergency = $8, user_responsable = $9, created_at = $10 WHERE id = $11";

  const result = await db.result(query, [
    title,
    description,
    image,
    users_donated,
    category,
    value,
    request_emergency,
    emergency,
    user_responsable,
    createdAt,
    id,
  ]);

  return result.rowCount;
};

module.exports = {
  searchHelpinho,
  findById,
  findAllByUser,
  createHelpinho,
  deleteHelpinho,
  updateHelpinho,
};
