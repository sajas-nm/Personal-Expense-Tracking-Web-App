import { Request, Response } from "express";
import { Expense, ExpenseInput } from "../models/expense.model";

const EXPENSE_LIMIT = 10000;

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const currentExpenses = async (date: number) => {
  //date unix time timestap
  const currentDate = new Date(date);
  const iYear = currentDate.getFullYear();
  const iMonth = currentDate.getMonth();

  const daysInMonth = new Date(iYear, iMonth, 0).getDate();

  var start = new Date(iYear, iMonth, 1).getTime();
  var end = new Date(iYear, iMonth, daysInMonth).getTime();

  //*Check Monthly Expense Limit
  const curentExpense: any = await Expense.aggregate([
    {
      $match: {
        $and: [{ date: { $gte: start } }, { date: { $lte: end } }],
      },
    },
    { $group: { _id: null, sum: { $sum: "$amount" } } },
  ]).catch((e) => console.error("[Error]", e));

  if (curentExpense.length > 0) {
    return curentExpense[0].sum;
  }

  return 0;
};

const createExpense = async (req: Request, res: Response) => {
  const { description, category, amount, date, color } = req.body;

  const expenseInput: ExpenseInput = {
    category,
    description,
    date,
    amount,
    color,
  };

  const curentExpense = await currentExpenses(date);

  const totalExpense = curentExpense + amount;

  const isExceedLimit = totalExpense > EXPENSE_LIMIT;

  if (isExceedLimit) {
    return res.status(422).json({
      message: "Total expense limit exceeded for this month!",
    });
  }

  const expenseCreated = await Expense.create(expenseInput).catch((e) =>
    console.error("[Error]", e)
  );

  return res.status(201).json({ data: expenseCreated });
};

const getAllExpenses = async (req: Request, res: Response) => {
  let expense;
  if (req?.query?.year && req?.query?.year) {
    const monthNumber = monthNames.findIndex((v) => v === req?.query?.month);
    const iYear = req?.query?.year || new Date().getFullYear();

    const iMonth = monthNumber || new Date().getMonth();

    //TODO::if month is December
    const nextMonth = Number(iMonth) + 1;

    expense = await Expense.find()
      .where("date")
      .gte(new Date(`${iYear}-${iMonth}-01`).getTime())
      .lte(new Date(`${iYear}-${nextMonth}-01`).getTime())
      .sort("-createdAt")
      .exec()
      .catch((e) => console.error("[Error]", e));
  } else {
    expense = await Expense.find()
      .sort("-createdAt")
      .exec()
      .catch((e) => console.error("[Error]", e));
  }

  return res.status(200).json({ data: expense });
};

const getExpense = async (req: Request, res: Response) => {
  const { id } = req.params;

  const expense = await Expense.findOne({ _id: id }).catch((e) =>
    console.error("[Error]", e)
  );

  if (!expense) {
    return res
      .status(404)
      .json({ message: `Expense with id "${id}" not found.` });
  }

  return res.status(200).json({ data: expense });
};

const updateExpense = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, category, amount, date, color } = req.body;

  const expense = await Expense.findOne({ _id: id }).catch((e) =>
    console.error("[Error]", e)
  );

  if (!expense) {
    return res
      .status(404)
      .json({ message: `Expense with id "${id}" not found.` });
  }

  const expenseInput: ExpenseInput = {
    category,
    description,
    date,
    amount,
    color,
  };

  const curentExpense = await currentExpenses(date);

  const totalExpense = curentExpense + amount;

  const isExceedLimit = totalExpense > EXPENSE_LIMIT;

  if (isExceedLimit) {
    return res.status(422).json({
      message: "Total expense limit exceeded for this month!",
    });
  }

  await Expense.updateOne({ _id: id }, expenseInput).catch((e) =>
    console.error("[Error]", e)
  );

  const expenseUpdated = await Expense.findById(id).catch((e) =>
    console.error("[Error]", e)
  );

  return res.status(200).json({ data: expenseUpdated });
};

const deleteExpense = async (req: Request, res: Response) => {
  const { id } = req.params;

  await Expense.findByIdAndDelete(id).catch((e) => console.error("[Error]", e));

  return res.status(200).json({ message: "Expense deleted successfully." });
};

const getExpenseStats = async (req: Request, res: Response) => {
  const pipeline = [
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        color: { $first: "$color" },
        category: { $first: "$category" },
      },
    },
  ];

  const groupData = await Expense.aggregate(pipeline);

  return res.status(200).json({ data: groupData });
};

const getExpenseLimit = async (req: Request, res: Response) => {
  const curentExpense = await currentExpenses(new Date().getTime());
  const groupData = await Expense.find({}, { _id: 0, date: 1 });
  const totalExpensePercentage = (curentExpense / EXPENSE_LIMIT) * 100;

  const months: any = [];
  const years: any = [];
  for (const { date } of groupData) {
    const m: any = new Date(date).getMonth();
    const y: any = new Date(date).getFullYear();
    if (!months.includes(monthNames[m])) {
      months.push(monthNames[m]);
    }
    if (!years.includes(y)) {
      years.push(y);
    }
  }

  return res.status(200).json({
    data: {
      limit: Math.round(totalExpensePercentage),
      months,
      years,
    },
  });
};
export {
  createExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getExpenseLimit,
};
