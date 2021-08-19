[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<p align="center">
  <h3 align="center">Product Catalog API</h3>

  <p align="center">
    Application to maintain a product catalog that offers a REST API.
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#next-steps">Next Steps</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![Product Architecture](/images/architecture.png?raw=true "Architecture")

This application was built on a Serverless Architecture, to leverage scalability that AWS services can provide.

Using API Gateway, I have made a proxy integration with Lambda Functions and architectural pattern for microservices.

In this architecture, each of the application components are decoupled and independently deployed and operated. Each Lambda Function is responsbile for a specific method of API Gateway.

Talking about fault tolerance, I have used an retry estrategy to communicate with the supply-chain API. So that means every time I get an error on this API, depending on statusCode, the application is ready to retry using a exponential delay. This guarantees that the application can be reliable for a certain time. 

But if after the retries the API still throwing errros, I leverage SQS Queues to try to process this messages after 60 seconds. We maintain the performance, which means that the client does not have to wait this message to be proceessed. After that, we have dead letter queues to be the final alternative if the message could not be processed.

### Built With

* [Node.js](https://nodejs.org/en/)
* [TypeScript](https://www.typescriptlang.org/)
* [Serverless Framework](https://www.serverless.com/)
* [Webpack](https://webpack.js.org/)
* [Jest](https://jestjs.io/)
* [Axios](https://www.npmjs.com/package/axios)
* [Axios-Retry](https://www.npmjs.com/package/axios-retry)
* [AWS-SDK](https://aws.amazon.com/pt/sdk-for-javascript/)


## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* Node.js
  https://nodejs.org/en/download/

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/matheusdms/product-catalog-api.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Install Serverless Framework
   ```sh
   sudo npm install -g serverless
   ```
4. Run unit testing
   ```sh
   npm test
   ```

## Usage

This API is running on AWS Cloud. Here is the OpenAPI specification:

```
openapi: "3.0.1"
info:
  title: "dev-product-catalog-api"
  version: "2021-08-19T02:47:47Z"
servers:
- url: "https://1lh4vhcx64.execute-api.us-east-1.amazonaws.com/{basePath}"
  variables:
    basePath:
      default: "/dev"
paths:
  /{id}:
    get:
      parameters:
      - name: "id"
        in: "path"
        required: true
        schema:
          type: "string"
    put:
      parameters:
      - name: "id"
        in: "path"
        required: true
        schema:
          type: "string"
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ProductModel"
        required: true
    delete:
      parameters:
      - name: "id"
        in: "path"
        required: true
        schema:
          type: "string"
  /:
    get: {}
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ProductModel"
        required: true
components:
  schemas:
    ProductModel:
      title: "ProductModel"
      required:
      - "name"
      - "price"
      - "quantity"
      type: "object"
      properties:
        quantity:
          type: "number"
          description: "Quantity"
        price:
          type: "number"
          description: "Price"
        name:
          type: "string"
          description: "Product name"
        id:
          type: "string"
          description: "Product identifier"
```

## Next Steps

1. Implement a PUT operation at the supply chain API.
2. Configure the dead letter queues to send messages to a application which sends SNS notifications to the team, warning that an error occurred in that particular operation.
3. Create a Lambda Layer to keep all the reausable code (such as HttpsLibrary, AWS Build Request, and so on)

## Contact

Matheus das Mercês - matheusdmerces@gmail.com

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/matheus-das-merces/
