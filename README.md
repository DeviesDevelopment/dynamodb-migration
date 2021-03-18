# dynamodb-migration

Example code for migrating data between tables using DynamoDB Streams.

## Usage
Follow these instructions if you want to play around with the example code.

### Deployment
Make sure you have the [SAM CLI tool](https://aws.amazon.com/serverless/sam/) installed.

    sam deploy --stack-name dynamodb-migration-example --capabilities CAPABILITY_IAM

### Populate data
Add any number of items to the `OriginalBooksTable`. Each item should at least contain the following properties:

```json
{
    "isbn": "some-isbn",
    "author": "some-author",
    "title": "some-title"
}
```

### Run migration script
