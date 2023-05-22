import server from "./server";
import Env from "@loaders/v1/env";

const start = async () => {
  const app = await server();

  app.listen(Env.variable.PORT, () => {
    console.log(`Server is running on port ${Env.variable.PORT}`);
  });
};

start();
