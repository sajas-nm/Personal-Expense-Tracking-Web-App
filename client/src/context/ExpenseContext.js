import React, { useState, useEffect } from "react";
import { httpClient } from "../utils/httpClient";
import { toast } from "react-toastify";

// create context
export const ExpenseContext = React.createContext();
const toastOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [monthlyLimit, setMonthlyLimit] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [currentFilters, setCurrentFilters] = useState(null);

  useEffect(() => {
    if (currentFilters) {
      getAllExpenses(currentFilters);
    }
  }, [currentFilters]);

  const handleFilter = (e) => {
    setCurrentFilters({
      ...currentFilters,
      [e.target.name]: e.target.value,
    });
  };
  const getAllExpenses = async (query) => {
    const res = await httpClient("/expense", {
      query: {
        month: query?.month || "",
        year: query?.year || "",
      },
    }).catch((error) => console.error(error));

    setExpenses(res?.data);
  };

  const getChartData = async () => {
    const res = await httpClient("/expense-stats", {}).catch((error) =>
      console.error(error)
    );

    const series = [];
    const colors = [];
    const labels = [];

    for (const { color, count, category } of res?.data) {
      series.push(count);
      colors.push(color);
      labels.push(category || "series");
    }

    setChartData({
      series,
      colors,
      labels,
    });
  };

  const getLimitCheck = async () => {
    const res = await httpClient("/expense-limit-check", {});
    setMonthlyLimit(res?.data?.limit);
    setFilterData({
      months: res?.data?.months,
      years: res?.data?.years,
    });
  };

  const createExpenses = async (values) => {
    const res = await httpClient("/expense", {
      method: "POST",
      body: values,
    }).catch((error) => {
      toast.error(JSON.parse(error?.message || "")?.message, toastOptions);
      console.error("e=>", error);
    });

    if (res) {
      toast.success("Created Successfully!", toastOptions);
      setExpenses([...expenses, res.data]);
      getChartData();
    }
  };

  const updateExpenses = async (values, id) => {
    const res = await httpClient(`/expense/${id}`, {
      method: "PUT",
      body: values,
    }).catch((error) => {
      toast.error(JSON.parse(error?.message || "")?.message, toastOptions);
      console.error("e=>", error);
    });
    if (res) {
      toast.success("Updated Successfully!", toastOptions);
      const index = expenses.findIndex((v) => v._id === res.data._id);
      const expensesNew = expenses.map((v) => v);
      expensesNew[index] = res.data;
      setExpenses(expensesNew);
      getChartData();
    }
  };

  const deleteExpenses = async (id) => {
    const res = await httpClient(`/expense/${id}`, {
      method: "DELETE",
    }).catch((error) => {
      toast.error(JSON.parse(error?.message || "")?.message, toastOptions);
      console.error("e=>", error);
    });
    if (res) {
      setExpenses(expenses.filter((v) => v._id !== id));
      toast.success("Deleted Successfully!", toastOptions);
      getChartData();
    }
  };

  const prop = {
    getAllExpenses,
    getChartData,
    getLimitCheck,
    createExpenses,
    updateExpenses,
    deleteExpenses,
    expenses,
    chartData,
    monthlyLimit,
    filterData,
    handleFilter
  };

  return (
    <ExpenseContext.Provider value={{ ...prop }}>
      {children}
    </ExpenseContext.Provider>
  );
};
