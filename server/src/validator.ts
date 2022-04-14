import { body, param, validationResult } from "express-validator";
import express from "express";

const expenseCreateRules = () => {
  return [
    body("category").isString().isLength({ min: 1, max: 100 }),
    body("description").isString().isLength({ min: 1, max: 100 }),
    body("date").isNumeric().isLength({ min: 1, max: 100 }),
    body("amount").isNumeric(),
    body("color").isString(),
  ];
};

const expenseUpdateRules = () => {
  return [
    param("id").isString(),
    body("category").isString().isLength({ min: 1, max: 100 }),
    body("description").isString().isLength({ min: 1, max: 100 }),
    body("date").isNumeric().isLength({ min: 1, max: 100 }),
    body("amount").isNumeric(),
    body("color").isString(),
  ];
};

const expenseGetRules = () => {
  return [param("id").isString()];
};

const expenseDeleteRules = () => {
  return [param("id").isString()];
};

const validate = (req: express.Request, res: express.Response, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors: any = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

export {
  expenseCreateRules,
  expenseUpdateRules,
  expenseGetRules,
  expenseDeleteRules,
  validate,
};
