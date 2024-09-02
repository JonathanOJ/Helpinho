const express = require("express");
const serverless = require("serverless-http");
const AWS = require("aws-sdk");

const app = express();
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

// Get Helpinho by ID
app.get("/helpinho/:id", async (req, res) => {
  const { id } = req.params;

  const params = {
    TableName: HELPINHO_TABLE,
    Key: { id },
  };

  try {
    const result = await dynamoDbClient.get(params).promise();
    if (result.Item) {
      res.status(200).json(result.Item);
    } else {
      res.status(404).json({ error: "Helpinho not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch helpinho" });
  }
});

// Find All Helpinhos by User ID
app.get("/helpinho/findAllByUser/:id", async (req, res) => {
  const { id } = req.params;

  const params = {
    TableName: HELPINHO_TABLE,
    IndexName: "UserResponsableIndex", // Assuming an index for userResponsable.id
    KeyConditionExpression: "userResponsable.id = :userId",
    ExpressionAttributeValues: {
      ":userId": id,
    },
  };

  try {
    const result = await dynamoDbClient.query(params).promise();
    res.status(200).json(result.Items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not fetch helpinhos by user" });
  }
});

// Search Helpinhos
app.post("/helpinho/search", async (req, res) => {
  const { search, category, page, itemsPerPage } = req.body;
  const offset = itemsPerPage * (page - 1);

  const params = {
    TableName: HELPINHO_TABLE,
    FilterExpression: "",
    ExpressionAttributeValues: {},
    Limit: itemsPerPage,
  };

  if (search) {
    params.FilterExpression += "contains(title, :search)";
    params.ExpressionAttributeValues[":search"] = search;
  }

  if (category) {
    if (params.FilterExpression) params.FilterExpression += " AND ";
    params.FilterExpression += ":category = ANY(category)";
    params.ExpressionAttributeValues[":category"] = category;
  }

  params.ExclusiveStartKey = offset ? { id: offset } : null;

  try {
    const result = await dynamoDbClient.scan(params).promise();
    res.status(200).json(result.Items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not perform search" });
  }
});

// Create or Update Helpinho
app.post("/helpinho/save", async (req, res) => {
  const {
    id,
    title,
    description,
    image,
    category,
    userResponsable,
    value,
    createdAt,
    requestEmergency,
  } = req.body;

  try {
    if (id && id > 0) {
      const params = {
        TableName: HELPINHO_TABLE,
        Key: { id },
        UpdateExpression: `SET
          title = :title,
          description = :description,
          category = :category,
          userResponsable = :userResponsable,
          createdAt = :createdAt`,
        ExpressionAttributeValues: {
          ":title": title,
          ":description": description,
          ":category": category,
          ":userResponsable": userResponsable,
          ":createdAt": createdAt,
        },
        ReturnValues: "UPDATED_NEW",
      };

      const result = await dynamoDbClient.update(params).promise();
      res.status(200).json(result.Attributes);
    } else {
      const dateUTC = new Date().toISOString();
      const newId = Date.now().toString();

      const params = {
        TableName: HELPINHO_TABLE,
        Item: {
          id: newId,
          title,
          description,
          image,
          category,
          userResponsable,
          value,
          createdAt: dateUTC,
          requestEmergency,
        },
      };

      await dynamoDbClient.put(params).promise();
      res
        .status(201)
        .json({ id: newId, title, description, category, userResponsable });
    }
  } catch (error) {
    console.error(error); // Melhora a visibilidade do erro no log
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
});
// Delete Helpinho
app.delete("/helpinho/:id", async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: HELPINHO_TABLE,
    Key: { id },
  };

  try {
    const result = await dynamoDbClient.delete(params).promise();
    res.status(200).json({ success: result.Attributes ? true : false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete helpinho" });
  }
});

// Find User by Email
app.get("/users/findByEmail/:email", async (req, res) => {
  const { email } = req.params;
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
    if (result.Items.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result.Items[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not find user" });
  }
});

// User Sign In
app.post("/users/signIn", async (req, res) => {
  const { email, password } = req.body;

  const params = {
    TableName: USERS_TABLE,
    IndexName: "email-password-index",
    KeyConditionExpression: "email = :email AND password = :password",
    ExpressionAttributeValues: {
      ":email": email,
      ":password": password,
    },
  };

  try {
    const result = await dynamoDbClient.query(params).promise();
    if (result.Items.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.status(200).json(result.Items[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not sign in" });
  }
});

// Delete User
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: USERS_TABLE,
    Key: { id },
  };

  try {
    const result = await dynamoDbClient.delete(params).promise();
    if (result.Attributes) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not delete user" });
  }
});

// Save or Update User
app.post("/users/save", async (req, res) => {
  const { id, username, email, image, password, cpf_cnpj, birthdate } =
    req.body;

  if (id && id > 0) {
    const params = {
      TableName: USERS_TABLE,
      Key: { id },
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
      res.status(200).json(result.Attributes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Could not update user" });
    }
  } else {
    const dateUTC = new Date().toISOString();
    const newId = Date.now().toString();

    const params = {
      TableName: USERS_TABLE,
      Item: {
        id: newId,
        username,
        email,
        image,
        password,
        cpf_cnpj,
        birthdate,
        totalDonated: 0,
        totalHelpinhosDonated: 0,
        totalHelpinhosCreated: 0,
        createdAt: dateUTC,
      },
    };

    try {
      await dynamoDbClient.put(params).promise();
      res
        .status(201)
        .json({ id: newId, username, email, image, cpf_cnpj, birthdate });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Could not create user" });
    }
  }
});

module.exports.handler = serverless(app);
