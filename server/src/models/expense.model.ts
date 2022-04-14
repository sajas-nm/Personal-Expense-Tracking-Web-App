import mongoose, { Schema, Model, Document } from "mongoose";

type ExpenseDocument = Document & {
  category: string;
  description: string;
  date: number;
  amount: number;
  color: string;
};

type ExpenseInput = {
  category: ExpenseDocument["category"];
  description: ExpenseDocument["description"];
  date: ExpenseDocument["date"];
  amount: ExpenseDocument["amount"];
  color: ExpenseDocument["color"];
};

const expenseSchema = new Schema(
  {
    category: {
      type: Schema.Types.String,
      required: true,
      // unique: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    date: {
      type: Schema.Types.Number,
      required: true,
    },
    color: {
      type: Schema.Types.String,
      required: true,
    },
    amount: {
      type: Schema.Types.Number,
      required: true,
    },
  },
  {
    collection: "expenses",
    timestamps: true,
  }
);

const Expense: Model<ExpenseDocument> = mongoose.model<ExpenseDocument>(
  "Expenses",
  expenseSchema
);

export { Expense, ExpenseInput, ExpenseDocument };
