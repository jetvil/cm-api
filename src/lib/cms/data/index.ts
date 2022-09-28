export default function handleDatabaseInit(db: "mongodb" | "mysql" | "sqlite" | "postgres" | "mssql") {
  // ...
  // make factory make a connection to the database and then setup the given schemas
  console.info(db);
}
