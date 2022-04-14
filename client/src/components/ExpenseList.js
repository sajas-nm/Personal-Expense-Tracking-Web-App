/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from "react";
import { Select, Button } from "@windmill/react-ui";
import { DeleteIcon, MailIcon, EditIcon } from "../icons";
import Popover from "@idui/react-popover";

function ExpenseList({
  openModal,
  expenses,
  setCurrentExpense,
  deleteExpenses,
  filterData,
  getAllExpenses,
  handleFilter,
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [index, setIndex] = useState(-1);

  const formatDate = (date) => {
    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .split(" ")
      .join("-");
  };
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
  });

  return (
    <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
      <div className="flex  w-full  justify-between items-center border-b border-gray-500 pb-2 mb-2">
        <p className=" font-semibold text-gray-800 dark:text-gray-300">
          Expenses
        </p>

        <Button size="small" onClick={openModal}>
          Add Expense
        </Button>
      </div>
      <div className="flex    justify-start items-center">
        <Select
          className="p-1 mr-2"
          style={{ width: "8rem" }}
          name="year"
          onChange={handleFilter}
        >
          {filterData?.years?.map((y) => (
            <option value={y}>{y}</option>
          ))}
        </Select>
        <Select
          className="p-1 "
          style={{ width: "8rem" }}
          name="month"
          onChange={handleFilter}
        >
          {filterData?.months?.map((m) => (
            <option value={m}>{m}</option>
          ))}
        </Select>
      </div>
      <div className=" flex w-full ">
        <ul className="flex flex-col w-full p-4">
          {expenses?.map((v, i) => (
            <li
              onClick={() => setCurrentExpense(v)}
              key={v?._id}
              className="border-gray-200 flex flex-row mb-2"
            >
              <div className="select-none cursor-pointer bg-gray-200 rounded-md flex flex-1 items-center p-2  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                <div
                  className="flex flex-col rounded-md w-10 h-10  justify-center items-center mr-4"
                  style={{ background: v?.color }}
                >
                  <MailIcon className="h-5 w-6 text-white " />
                </div>
                <div className="flex-1 pl-1 mr-16">
                  <div className="text-base">{v?.category}</div>
                  <div className="text-gray-600 text-sm truncate">
                    {v?.description}
                  </div>
                </div>
                <div className="text-gray-600 text-sm    ">
                  {formatter.format(v?.amount)}
                </div>
                <div className="flex  flex-col ml-4 pl-2 border-l-2 border-gray-100 ">
                  <div className="cursor-pointer text-gray-600 text-xs flex flex-row justify-end items-center">
                    <EditIcon
                      onClick={() => {
                        setCurrentExpense(v);
                        openModal();
                      }}
                      className="h-5 w-5 text-blue-500 mr-1 hover:text-blue-700"
                    />
                    {/* <Popover
                      isOpen={isPopoverOpen && i === index}
                      positions={["top", "left"]}
                      padding={10}
                      reposition={false}
                      onClickOutside={() => {
                        setIndex(-1);
                        setIsPopoverOpen(false);
                      }}
                      content={({ position, nudgedLeft, nudgedTop }) => (
                        <div className="shadow-md bg-white rounded flex">
                          <div>
                            Hi! I'm popover content. Here's my current position:{" "}
                            {position}.
                          </div>
                          <div>
                            I'm {` ${nudgedLeft} `} pixels beyond my boundary
                            horizontally!
                          </div>
                          <div
                            onClick={() => {
                              deleteExpenses(v._id);
                              setIndex(-1);
                              setIsPopoverOpen(!isPopoverOpen);
                            }}
                          >
                            I'm {` ${nudgedTop} `} pixels beyond my boundary
                            vertically!
                          </div>
                        </div>
                      )}
                    >
                    </Popover> */}
                    <Popover
                      isOpen={isPopoverOpen && i === index}
                      style={{ padding: 0 }}
                      offset={[0, 2]}
                      content={() => (
                        <div className="shadow-md bg-white rounded flex flex-col">
                          <div
                            onClick={() => {
                              deleteExpenses(v._id);
                              setIndex(-1);
                              setIsPopoverOpen(!isPopoverOpen);
                            }}
                            className="text-sm"
                          >
                            Are you sure you want to Delete ?
                          </div>
                          <div className="flex justify-center items-center mt-2">
                            <div
                              onClick={() => {
                                setIndex(-1);
                                setIsPopoverOpen(!isPopoverOpen);
                              }}
                              className="rounded border border-gray-600 text-sm m-2  px-4 hover:bg-gray-300 cursor-pointer"
                            >
                              No
                            </div>
                            <div
                              onClick={() => {
                                deleteExpenses(v._id);
                                setIndex(-1);
                                setIsPopoverOpen(!isPopoverOpen);
                              }}
                              className="rounded bg-red-500 text-sm m-2 px-4 text-white hover:bg-red-600 cursor-pointer"
                            >
                              Yes
                            </div>
                          </div>
                        </div>
                      )}
                      trigger="click"
                      placement="left"
                    >
                      <DeleteIcon
                        className="h-5 w-5 text-red-500 hover:text-red-700"
                        onClick={() => {
                          setIndex(i);
                          setIsPopoverOpen(!isPopoverOpen);
                        }}
                      />
                    </Popover>
                  </div>
                  <div className="text-gray-600 text-xs mt-2">
                    {formatDate(v?.date)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ExpenseList;
