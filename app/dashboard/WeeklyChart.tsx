"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// ApexCharts loads only on client
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type WeeklyChartProps = { week: number[] };

const formatHM = (value: number) => {
  const h = Math.floor(value / 60);
  const m = Math.floor(value % 60);
  return `${h}h ${m.toString().padStart(2, "0")}m`;
};

const useLabels = () =>
  useMemo(
    () => ["6d ago", "5d ago", "4d ago", "3d ago", "2d ago", "1d ago", "Today"],
    []
  );

export default function WeeklyChart({ week }: WeeklyChartProps) {
  const labels = useLabels();

  const series = [{ name: "Study Time", data: week }];

  const maxValue = Math.max(...week);
  const forcedMax = maxValue < 5 ? 5 : undefined;

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },

    stroke: {
      curve: "smooth",
      width: 4,
      colors: ["var(--color-blue)"],
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: "var(--color-blue)",
            opacity: 0.45,
          },
          {
            offset: 100,
            color: "var(--color-blue)",
            opacity: 0.05,
          },
        ],
      },
    },

    xaxis: {
      categories: labels,
      labels: {
        style: { colors: "var(--color-text)" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      min: 0,
      max: forcedMax,
      labels: {
        formatter: formatHM,
        style: { colors: "var(--color-text)" },
        offsetX: -12,
      },
    },

    tooltip: {
      theme: "dark", // still readable in light mode
      style: {
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
      },
      marker: { show: false },
      y: { formatter: formatHM },
    },

    grid: {
      borderColor: "var(--color-border)",
      strokeDashArray: 4,
    },

    dataLabels: { enabled: false },
  };

  return (
    <div
      className="
        w-full p-8 rounded-2xl border-2
        bg-surface
        border-border
        text-text
      "
    >
      <h2 className="text-lg font-semibold mb-2">This Week’s Stats</h2>

      <Chart options={options as any} series={series} type="area" height={260} />
    </div>
  );
}

