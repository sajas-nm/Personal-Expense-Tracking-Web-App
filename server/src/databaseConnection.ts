import mongoose, { ConnectionOptions } from "mongoose";
import dotenv from "dotenv";

mongoose.Promise = global.Promise;
dotenv.config();

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

const connectToDatabase = async (): Promise<void> => {
  const options: ConnectionOptions = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };

  await mongoose.connect(
    `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
    options
  );
};

export { connectToDatabase };

