// const db = require("./connection");

// const findByEmail = async (email) => {
//   const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [
//     email,
//   ]);
//   return user;
// };

// const signIn = async (user) => {
//   const { email, password } = user;

//   const userLoged = await db.oneOrNone(
//     "SELECT * FROM users WHERE email = $1 AND password = $2",
//     [email, password]
//   );
//   return userLoged;
// };

// const createUser = async (user) => {
//   const { username, email, image, password, cpf_cnpj, birthdate } = user;
//   const dateUTC = new Date(Date.now()).toUTCString();

//   const query =
//     " INSERT INTO users (username, email, image, password, cpf_cnpj, birthdate, total_donated, total_helpinhos_donated, total_helpinhos_created, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id";

//   const createdUser = await db.one(query, [
//     username,
//     email,
//     image,
//     password,
//     cpf_cnpj,
//     birthdate,
//     0,
//     0,
//     0,
//     dateUTC,
//   ]);

//   return {
//     id: createdUser.id,
//     username,
//     email,
//     image,
//     password,
//     cpf_cnpj,
//     birthdate,
//     total_donated: 0,
//     total_helpinhos_donated: 0,
//     total_helpinhos_created: 0,
//     createdAt: dateUTC,
//   };
// };

// const deleteUser = async (id) => {
//   const result = await db.result("DELETE FROM users WHERE id = $1", [id]);
//   return result.rowCount;
// };

// const updateUser = async (user) => {
//   const {
//     id,
//     username,
//     email,
//     image,
//     password,
//     cpf_cnpj,
//     birthdate,
//     total_donated,
//     total_helpinhos_created,
//     total_helpinhos_donated,
//   } = user;

//   const query =
//     "UPDATE users SET username = $1, email = $2, image = $3, password = $4, cpf_cnpj = $5, birthdate = $6, total_donated = $7, total_helpinhos_created = $8, total_helpinhos_donated = $9 WHERE id = $10";

//   const result = await db.result(query, [
//     username,
//     email,
//     image,
//     password,
//     cpf_cnpj,
//     birthdate,
//     total_donated,
//     total_helpinhos_created,
//     total_helpinhos_donated,
//     id,
//   ]);
//   return result.rowCount;
// };

// const updateUserHelpinhosCreated = async (id) => {
//   const query =
//     "UPDATE users SET total_helpinhos_created = total_helpinhos_created +1 WHERE id = $1";

//   try {
//     await db.result(query, [id]);
//     return;
//   } catch (error) {
//     console.error("Error updating helpinhos created:", error);
//     throw error;
//   }
// };

const AWS = require("aws-sdk");

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const findByEmail = async (email) => {
  const params = {
    TableName: USERS_TABLE,
    IndexName: "email-index",
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  try {
    const result = await dynamoDbClient.query(params).promise();
    return result.Items[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const signIn = async (user) => {
  const { email, password } = user;

  const params = {
    TableName: "helpinho-users",
    FilterExpression: "email = :email AND password = :password",
    ExpressionAttributeValues: {
      ":email": email,
      ":password": password,
    },
  };

  try {
    const result = await dynamoDbClient.scan(params).promise();

    if (result.Items && result.Items.length > 0) {
      return result.Items[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteUser = async (userId) => {
  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
  };

  try {
    const result = await dynamoDbClient.delete(params).promise();
    return result.Attributes ? true : false;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateUser = async (user) => {
  const { userId, username, email, image, password, cpf_cnpj, birthdate } =
    user;

  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression: `SET
      username = :username,
      email = :email,
      image = :image,
      password = :password,
      cpf_cnpj = :cpf_cnpj,
      birthdate = :birthdate`,
    ExpressionAttributeValues: {
      ":username": username,
      ":email": email,
      ":image": image,
      ":password": password,
      ":cpf_cnpj": cpf_cnpj,
      ":birthdate": birthdate,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamoDbClient.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createUser = async (user) => {
  const { username, email, image, password, cpf_cnpj, birthdate } = user;
  const dateUTC = new Date().toISOString();
  const newId = Date.now().toString();

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: newId,
      username,
      email,
      image,
      password,
      cpf_cnpj,
      birthdate,
      total_donated: 0,
      total_helpinhos_donated: 0,
      total_helpinhos_created: 0,
      created_at: dateUTC,
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    return {
      userId: newId,
      username,
      email,
      image,
      cpf_cnpj,
      birthdate,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findById = async (userId) => {
  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
  };

  try {
    const result = await dynamoDbClient.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateUserHelpinhosCreated = async (userId) => {
  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression:
      "SET total_helpinhos_created = total_helpinhos_created + :inc",
    ExpressionAttributeValues: {
      ":inc": 1,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamoDbClient.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateTotalDonated = async (body) => {
  const { userId, donated_value } = body;

  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression: "SET total_donated = total_donated + :donated_value",
    ExpressionAttributeValues: {
      ":donated_value": donated_value,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamoDbClient.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateTotalHelpinhosDonated = async (body) => {
  const { userId } = body;

  const params = {
    TableName: USERS_TABLE,
    Key: { userId },
    UpdateExpression:
      "SET total_helpinhos_donated = total_helpinhos_donated + :inc",
    ExpressionAttributeValues: {
      ":inc": 1,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await dynamoDbClient.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  findByEmail,
  signIn,
  findById,
  createUser,
  deleteUser,
  updateUser,
  updateTotalHelpinhosDonated,
  updateUserHelpinhosCreated,
  updateTotalDonated,
};
