import { Router } from "express";

import {
  createExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getExpenseLimit,
} from "../controllers/expense.controller";

import {
  expenseCreateRules,
  expenseUpdateRules,
  expenseGetRules,
  expenseDeleteRules,
  validate,
} from "../validator";

const expenseRoute = () => {
  const router = Router();

  /*{
  method :POST,
  body:{category:'',color:'',description:'',date:''}}*/
  router.post("/expense", expenseCreateRules(), validate, createExpense);

  /*{ method :GET}*/
  router.get("/expense", getAllExpenses);

  /*{
  method :GET,
  param:{id:''}*/
  router.get("/expense/:id", expenseGetRules(), validate, getExpense);

  /*{
  method :PUT,
  body:{category:'',color:'',description:'',date:''}}*/
  router.put("/expense/:id", expenseUpdateRules(), validate, updateExpense);

  /*{
  method :DELETE,
  param:{id:''}*/
  router.delete("/expense/:id", expenseDeleteRules(), validate, deleteExpense);

  /*{ method :GET}*/
  router.get("/expense-stats", getExpenseStats);

  /*{ method :GET}*/
  router.get("/expense-limit-check", getExpenseLimit);

  return router;
};

export { expenseRoute };
