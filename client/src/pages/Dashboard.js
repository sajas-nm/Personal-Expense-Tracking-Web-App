import React, { useState, useEffect, useContext } from "react";
import PageTitle from "../components/Typography/PageTitle";
import ExpenseModal from "../components/ExpenseModal";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";

import { ExpenseContext } from "../context/ExpenseContext";

function Dashboard() {
  const {
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
  } = useContext(ExpenseContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  useEffect(() => {
    getAllExpenses();
    getChartData();
  }, []);

  useEffect(() => {
    getLimitCheck();
  }, [expenses]);

  const modalProps = {
    openModal,
    isModalOpen,
    closeModal,
    createExpenses,
    updateExpenses,
    currentExpense,
    setCurrentExpense,
  };
  const listProps = {
    openModal,
    isModalOpen,
    closeModal,
    expenses,
    setCurrentExpense,
    deleteExpenses,
    filterData,
    getAllExpenses,
    handleFilter
  };
  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      {monthlyLimit >= 90 && monthlyLimit < 100 && (
        <div
          class=" mb-4 p-4 pl-12 relative rounded-lg leading-5 bg-yellow-100 text-yellow-900 dark:bg-yellow-600 dark:text-white"
          role="alert"
        >
          <svg
            class="h-5 w-5 text-yellow-400 dark:text-yellow-100 absolute left-0 top-0 ml-4 mt-4"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          You have reach 90% of your monthly budget
        </div>
      )}

      <div className="grid gap-6 mb-8 md:grid-cols-2 ">
        <ExpenseChart chartData={chartData} />
        <ExpenseModal {...modalProps} />
        <ExpenseList {...listProps} />
      </div>
    </>
  );
}

export default Dashboard;
