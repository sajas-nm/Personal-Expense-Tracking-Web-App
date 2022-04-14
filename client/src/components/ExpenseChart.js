import React from "react";
import ApexCharts from "react-apexcharts";
import ChartCard from "../components/Chart/ChartCard";

function ExpenseChart({ chartData }) {
  const data = {
    series: chartData?.series || [],
    options: {
      legend: {
        position: "bottom",
        offsetX: -10,
        offsetY: 0,
      },
      labels: chartData?.labels,
      colors: chartData?.colors,
      chart: {
        type: "pie",
        height: 350,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      // responsive: [
      //   {
      //     breakpoint: 480,
      //     options: {
      //       chart: {
      //         width: 200,
      //       },
      //       legend: {
      //         position: "bottom",
      //       },
      //     },
      //   },
      // ],
    },
  };

  return (
    <ChartCard title="Expense Chart">
      {chartData && (
        <ApexCharts
          height={350}
          options={data.options}
          series={data.series}
          type="pie"
        />
      )}
    </ChartCard>
  );
}

export default ExpenseChart;
