import "dotenv/config"
import { setupDataDog } from "./config/datadog"
const { MONGOHQ_URL, NODE_ENV, PORT } = process.env

// Setup DataDog before importing another modules,
// so DataDog gets a chance to patch the integrations as per the documation.
// https://github.com/DataDog/dd-trace-js/blob/f638dd66845806ed3ee06e8fbf32b0062b9d21d7/src/proxy.js#L33
setupDataDog()

// tslint:disable:no-console
import "reflect-metadata"

import { GraphQLServer, Options } from "graphql-yoga"
import { parse } from "mongodb-uri"
import * as morgan from "morgan"
import { Connection, createConnection } from "typeorm"
import { databaseConfig } from "./config/database"
import { createSchema } from "./utils/createSchema"

bootstrap()

async function bootstrap() {
  // Setup Database
  try {
    const { database } = parse(MONGOHQ_URL!)
    const connectionArgs = databaseConfig()
    const connection: Connection = await createConnection(connectionArgs)

    if (connection.isConnected) {
      console.log(
        "[kaws] Successfully connected to MongoDB database:",
        database
      )
    }
  } catch (error) {
    console.error("[kaws] Error to connecting to MongoDB:", error)
  }

  // Setup server
  try {
    const schema = await createSchema()
    const server = new GraphQLServer({ schema })
    const app = server.express
    const serverOptions: Options = {
      port: PORT,
      endpoint: "/graphql",
      playground: "/playground",
      debug: NODE_ENV === "development",
    }

    // Setup middleware
    app.use(morgan("combined"))

    // Setup endpoints
    app.get("/health", (req, res) => res.status(200).end())

    // Start the server
    server.start(serverOptions, ({ port, playground }) => {
      console.log(
        `[kaws] Server is running, GraphQL Playground available at http://localhost:${port}${playground}`
      )
    })
  } catch (error) {
    console.log("[kaws] Error booting server:", error)
  }
}
