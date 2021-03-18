const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB();

const originalTableName = "dynamodb-migration-example-OriginalBooksTable";

const scanWithPagination = async (tableName) => {
  let items = [];
  let lastEvaluatedKey;
  do {
    const params = {
      TableName: tableName
    };
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }
    const res = await dynamodb.scan(params).promise();
    lastEvaluatedKey = res.LastEvaluatedKey;
    console.log("Scanned page! Last evaluated key: ", lastEvaluatedKey);
    items = items.concat(res.Items);
  } while (lastEvaluatedKey);
  console.log("Found " + items.length + " items");
  return items;
}

const migrateItem = (item, tableName) => {
  const params = {
    ExpressionAttributeNames: {
      "#M": "migrate",
    },
    ExpressionAttributeValues: {
      ":m": {
        S: new Date().toISOString()
      },
    },
    Key: {
      "isbn": {
        S: item.isbn.S
      },
    },
    TableName: tableName,
    UpdateExpression: "SET #M = :m"
  };
  return dynamodb.updateItem(params).promise();
}

const runMigration = async () => {
  let items = await scanWithPagination(originalTableName);

  let promises = [];
  items.forEach(item => {
    promises.push(migrateItem(item, originalTableName));
  });
  await Promise.all(promises);
}

runMigration();
