# @jetvil/cm-api

[![Bundle size](https://img.shields.io/bundlephobia/min/@jetvil/cm-api/latest?label=Bundle%20Size&style=for-the-badge)](https://bundlephobia.com/package/@jetvil/cm-api@latest)
[![Version](https://img.shields.io/npm/v/@jetvil/cm-api?style=for-the-badge&color=cb3837&logo=npm)](https://www.npmjs.com/package/@jetvil/cm-api)&nbsp;
![Downloads](https://img.shields.io/npm/dt/@jetvil/cm-api?style=for-the-badge)&nbsp;
[![GitHub](https://img.shields.io/github/license/jetvil/cm-api?style=for-the-badge)](https://github.com/jetvil/cm-api/blob/main/LICENSE)&nbsp;
[![GitHub Repo stars](https://img.shields.io/github/stars/jetvil/cm-api?color=E9E9E9&logo=Github&style=for-the-badge)](https://www.github.com/jetvil/cm-api)&nbsp;
[![GitHub issues](https://img.shields.io/github/issues-raw/jetvil/cm-api?label=issues&style=for-the-badge)](https://github.com/jetvil/cm-api/issues)&nbsp;

📚 Content management API for integrating with NodeJS Express(backend) and Prisma(ORM)

# Features

- 🚀 **Easy to use**: Easy to install in your project.
- ✅ **ES6+ && TS**: TypeScript and ES6+ support(JS).
- 📦 **Required dependencies**: You don't need what you won't use: express and prisma.
- 💵 **Free**: It's free and always will be, the beauty of open source.

Take in mind that this solution is for when you want to control your own backend and frontend, but do not want to have struggle to create a cms with all the routes and schemas and database handlers that come with it.

When you are looking for a full cms solution, we recommend strapi or changing languages and taking wagtail for python.

# Getting Started

## Installation

To use this package, **install** using `npm`, `yarn` or `pnpm`📥:

```bash
# npm
npm install @jetvil/cm-api
# yarn
yarn add @jetvil/cm-api
# pnpm
pnpm install @jetvil/cm-api
```

## Usage

```js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jetvil = require("@jetvil/cm-api");

// prisma with eg. postgresql and schemas: "user" and "post"
const prisma = new PrismaClient(); // Prisma ORM, you must have it installed and generated.
const app = express();
const jetvil = jetvil();

app.use(express.json()); // for parsing application/json.

jetvil.setClient(prisma); // Set prisma client here or pass it in the router() method.
const router = jetvil.router(); // Empty by default, you can configure it by passing an object.

app.use("/api", router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
// Routes such as /user and /post will be available at /api/user and /api/post
```

## Configuration

You can configure the router by passing an object to the router() method.

By doing so you can adjust the routes to your needs.

```js
const jetvil = require("@jetvil/cm-api");

const jetvil = jetvil();

const router = jetvil.router({
  client: prisma, // Prisma ORM, you must have it installed and generated.
  global: {
    schemas: ["user", "post", "profile"], // if specified, only these schemas will be available.
    methods: ["get", "post", "put", "delete", "fake"], // if specified, only these methods will be available, 'fake' will not be used.
    middleware: [
      {
        methods: ["get"], // Method to which the middleware will be applied.
        schemas: ["user"], // Schema to which the middleware will be applied.
        handler: (req, res, next) => {
          // Middleware function.
          next();
        },
      },
    ],
  },
  config: {
    // note how the schema is the key and the value is an object with the schema config.
    // these are overrides for the global config on a per schema basis.
    user: {
      methods: ["get", "post", "put"], // note how the delete method is not included.
      actions: ["read", "create", "update", "delete"], // these actions determine what the user can do with the schema.
      // for example, if the user has the 'read' action, he can only read the schema.
      // when the 'filter' action is included, the user can filter the schema on the schema.

      middleware: [
        // this middleware will override the global middleware for the user schema.
        {
          handler: (_req, _res, next) => {
            console.log("Middleware applied to user schema!");
            next();
          },
        },
      ],
    },
  },
  verbose: true, // If true, the router will log the routes it generates.
});
```

## Documentation

<!-- TODO -->

As of this moment, the documentation is not yet available, but it will be soon⏳

# Contributing

Found a bug🦟? or want to suggest a new feature🆕? or just want to help🆘?

Feel free to open an issue or a pull request.

Contributions are always welcome!🎉

- Fork the project [here](https://github.com/jetvil/cm-api/fork).
- Create a new branch like this: `git checkout -b feature/featureName`.
- Commit your changes to your branch: `git commit -m 'Create AwesomeFeature'`⚙️.
- Push your branch: `git push origin feature/featureName`.
- Open a pull request on the `dev` branch [here](https://github.com/jetvil/cm-api/pulls)🔃.

📒**Note:** Make sure to add tests for your changes ✅.
