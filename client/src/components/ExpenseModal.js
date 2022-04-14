/* eslint-disable no-unused-expressions */
import React, { useRef, useEffect } from "react";
import { Formik } from "formik";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input, HelperText, Label, Select, Textarea
} from "@windmill/react-ui";
import * as Yup from "yup";

function ExpenseModal({
  openModal,
  isModalOpen,
  closeModal,
  createExpenses,
  updateExpenses,
  currentExpense,
  setCurrentExpense,
}) {
  const formRef = useRef(null);
  useEffect(() => {
   
    if (currentExpense?._id) {
      formRef?.current?.setFieldValue("category", currentExpense?.category);
      formRef?.current?.setFieldValue("amount", currentExpense?.amount);
      formRef?.current?.setFieldValue("color", currentExpense?.color);
      formRef?.current?.setFieldValue(
        "description",
        currentExpense?.description
      );
      formRef?.current?.setFieldValue(
        "date",
        new Date(currentExpense?.date).toISOString().slice(0, 10)
      );
    }
  }, [currentExpense]);

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>
          {currentExpense ? "Update " : "Create "} Expense
        </ModalHeader>
        <Formik
          innerRef={formRef}
          initialValues={{
            // label: "",
            category: "",
            amount: 0,
            color: "",
            description: "",
            date: "",
          }}
          validationSchema={Yup.object({
            // label: Yup.string()
            //   .max(30, "Must be 15 characters or less")
            //   .required("Required"),

            category: Yup.string()
              .max(20, "Must be 20 characters or less")
              .required("Required"),
            description: Yup.string()
              .max(20, "Must be 20 characters or less")
              .required("Required"),

            amount: Yup.number("Amount must be a valid number").required(
              "Required"
            ),
            color: Yup.string().required("Required"),
            date: Yup.string().required("Required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            values.date = Number(new Date(values.date).getTime());
            values.amount = Number(values.amount);

            currentExpense
              ? await updateExpenses(values, currentExpense._id)
              : await createExpenses(values);
            setCurrentExpense(null);
            setSubmitting(false);

            closeModal();
          }}
        >
          {({
            values,

            errors,

            touched,

            handleChange,

            handleBlur,

            handleSubmit,

            isSubmitting,

            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <div className="grid gap-6 mb-8 md:grid-cols-2">
                  <Label className="">
                    <span>Category</span>
                    <Select
                      className="mt-1"
                      name="category"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.category}
                      valid={
                        errors.category && touched.category && errors.category
                          ? false
                          : true
                      }
                    >
                      <option>Select a Category</option>
                      <option value="Food">Food</option>
                      <option value="Bill Payments">Bill Payments</option>
                      <option value="HouseHold">HouseHold</option>
                      <option value="Grocery">Grocery</option>
                      <option value="School Fee">School Fee</option>
                      <option value="Other">Other</option>
                    </Select>

                    {errors.category && touched.category && errors.category && (
                      <HelperText valid={false}>{errors.category}</HelperText>
                    )}
                  </Label>
                  <Label>
                    <span>Amount</span>
                    <Input
                      className="mt-1"
                      name="amount"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.amount}
                      valid={
                        errors.amount && touched.amount && errors.amount
                          ? false
                          : true
                      }
                      placeholder="Amount"
                      type="number"
                    />
                    {errors.amount && touched.amount && errors.amount && (
                      <HelperText valid={false}>{errors.amount}</HelperText>
                    )}
                  </Label>
                </div>
                <div className="grid gap-6 mb-8 md:grid-cols-2">
                  <Label>
                    <span>Date</span>
                    <Input
                      className="mt-1"
                      placeholder="Jane Doe"
                      type="date"
                      name="date"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.date}
                      valid={
                        errors.date && touched.date && errors.date
                          ? false
                          : true
                      }
                    />
                    {errors.date && touched.date && errors.date && (
                      <HelperText valid={false}>{errors.date}</HelperText>
                    )}
                  </Label>
                  <Label>
                    <span>Color</span>
                    <Input
                      name="color"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.color}
                      className="mt-1"
                      placeholder="Color"
                      type="color"
                      valid={
                        errors.color && touched.color && errors.color
                          ? false
                          : true
                      }
                    />
                    {errors.color && touched.color && errors.color && (
                      <HelperText valid={false}>{errors.color}</HelperText>
                    )}
                  </Label>
                </div>
                <div className="grid gap-6 mb-8 md:grid-cols-1">
                  <Label className="">
                    <span>Description</span>
                    <Textarea
                      name="description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                      className="mt-1"
                      rows="3"
                      placeholder="Description"
                      valid={
                        errors.description &&
                        touched.description &&
                        errors.description
                          ? false
                          : true
                      }
                    />
                    {errors.description &&
                      touched.description &&
                      errors.description && (
                        <HelperText valid={false}>
                          {errors.description}
                        </HelperText>
                      )}
                  </Label>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="hidden sm:block">
                  <Button layout="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                </div>
                <div className="hidden sm:block">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Laoding..."
                      : currentExpense
                      ? "Update"
                      : "Save"}
                  </Button>
                </div>
                <div className="block w-full sm:hidden">
                  <Button
                    block
                    size="large"
                    layout="outline"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="block w-full sm:hidden">
                  <Button
                    block
                    size="large"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {currentExpense ? "Update" : "Save"}
                  </Button>
                </div>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default ExpenseModal;
