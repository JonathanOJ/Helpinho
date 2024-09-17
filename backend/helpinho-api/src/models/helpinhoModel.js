const AWS = require("aws-sdk");

const HELPINHO_TABLE = process.env.HELPINHO_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

const findById = async (helpinhoId) => {
  const params = {
    TableName: HELPINHO_TABLE,
    Key: { helpinhoId },
  };

  try {
    const result = await dynamoDbClient.get(params).promise();
    return result.Item;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const findAllByUser = async (userId) => {
  const params = {
    TableName: HELPINHO_TABLE,
    FilterExpression: "user_responsable.userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  try {
    const result = await dynamoDbClient.scan(params).promise();
    return result.Items;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const searchHelpinho = async (searchBody) => {
  const { search, category, page, itemsPerPage } = searchBody;
  const offset = itemsPerPage * (page - 1);

  const params = {
    TableName: HELPINHO_TABLE,
    Limit: itemsPerPage,
  };

  const filterExpressions = [];
  const expressionAttributeValues = {};

  // Adicionar filtro de busca por título
  if (search) {
    filterExpressions.push("contains(title, :search)");
    expressionAttributeValues[":search"] = search;
  }

  // Adicionar filtro de categoria
  if (category) {
    filterExpressions.push(":category = ANY(category)");
    expressionAttributeValues[":category"] = category;
  }

  // Apenas incluir FilterExpression se houver filtros
  if (filterExpressions.length > 0) {
    params.FilterExpression = filterExpressions.join(" AND ");
    params.ExpressionAttributeValues = expressionAttributeValues;
  }

  params.ExclusiveStartKey = offset ? { id: offset } : null;

  try {
    const result = await dynamoDbClient.scan(params).promise();
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createHelpinho = async (helpinho) => {
  const dateUTC = new Date().toISOString();
  const newId = Date.now().toString();

  helpinho.helpinhoId = newId;

  const params = {
    TableName: HELPINHO_TABLE,
    Item: {
      ...helpinho,
      created_at: dateUTC,
    },
    ReturnValues: "ALL_OLD",
  };

  try {
    await dynamoDbClient.put(params).promise();
    return { helpinhoId: newId, ...helpinho };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateHelpinho = async (helpinho) => {
  const { helpinhoId, ...updateFields } = helpinho;

  const updateExpression = [];
  const expressionAttributeValues = {};

  for (const key in updateFields) {
    updateExpression.push(`${key} = :${key}`);
    expressionAttributeValues[`:${key}`] = updateFields[key];
  }

  const params = {
    TableName: HELPINHO_TABLE,
    Key: { helpinhoId },
    UpdateExpression: `SET ${updateExpression.join(", ")}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDbClient.update(params).promise();
    return result.Attributes;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const deleteHelpinho = async (helpinhoId) => {
  const params = {
    TableName: HELPINHO_TABLE,
    Key: { helpinhoId },
  };

  try {
    const result = await dynamoDbClient.delete(params).promise();
    return result.Attributes ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const donate = async (donation) => {
  const { helpinhoId, donated_value } = donation;

  const params = {
    TableName: HELPINHO_TABLE,
    Key: { helpinhoId },
    UpdateExpression:
      "SET users_donated = list_append(users_donated, :donation)",
    ExpressionAttributeValues: {
      ":donation": [donation],
    },
    ReturnValues: "ALL_NEW",
  };

  const updateHelpinhoParams = {
    TableName: HELPINHO_TABLE,
    Key: { helpinhoId },
    UpdateExpression: "SET value_donated = value_donated + :donated_value",
    ExpressionAttributeValues: {
      ":donated_value": donated_value,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDbClient.update(params).promise();
    await dynamoDbClient.update(updateHelpinhoParams).promise();
    return result.Attributes;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  searchHelpinho,
  findById,
  findAllByUser,
  createHelpinho,
  deleteHelpinho,
  updateHelpinho,
  donate,
};
