import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Bell, Clock, Search } from "lucide-react";

const salesData = [
  { day: "Mon", sales: 6500 },
  { day: "Tue", sales: 8200 },
  { day: "Wed", sales: 7800 },
  { day: "Thu", sales: 6980 },
  { day: "Fri", sales: 5400 },
  { day: "Sat", sales: 6200 },
  { day: "Sun", sales: 7100 },
];

const orders = [
  {
    name: "iPhone",
    customer: "Michael Knight",
    date: "12/01/2024",
    status: "Paid",
  },
  {
    name: "Speaker",
    customer: "Murdock",
    date: "12/01/2024",
    status: "Pending",
  },
  {
    name: "iMac",
    customer: "Angus MacGyver",
    date: "12/01/2024",
    status: "Paid",
  },
];

const StatCard = ({ title, value, change }) => (
  <div className="bg-white rounded-2xl shadow-sm p-5">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-4xl font-bold mt-2">{value}</h2>
    <p
      className={`text-sm mt-3 ${
        change.startsWith("+")
          ? "text-green-500"
          : "text-red-500"
      }`}
    >
      {change}
    </p>
  </div>
);

const OrdersTable = () => (
  <div className="bg-white rounded-2xl p-5 overflow-x-auto">
    <h2 className="font-semibold mb-4">Recent Orders</h2>

    <table className="w-full text-sm min-w-[600px]">
      <thead>
        <tr className="text-left text-gray-500 border-b">
          <th className="py-3">Name</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {orders.map((order, idx) => (
          <tr key={idx} className="border-b">
            <td className="py-4">{order.name}</td>
            <td>{order.customer}</td>
            <td>{order.date}</td>
            <td>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  order.status === "Paid"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {order.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DashboardTab = () => {
  return (
    <div className="space-y-6">
     
      {/* Header */}
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  {/* Left side */}
  <div>
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <p className="text-sm text-gray-500">
      Welcome back, Ruhon
    </p>
  </div>

  {/* Right side */}
  <div className="flex items-center gap-4">
    {/* Search */}
    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl w-72 shadow-sm">
      <Search size={16} />
      <input
        placeholder="Search..."
        className="w-full outline-none"
      />
    </div>

    {/* Icons */}
    <Clock size={20} />
    <Bell size={20} />

    {/* Profile */}
    <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm">
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
        RB
      </div>

      <div>
        <p className="text-sm font-medium">Ruhon Borah</p>
        <p className="text-xs text-gray-500">
          Admin
        </p>
      </div>
    </div>
  </div>
</div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Revenue" value="$464,360" change="+23.4%" />
        <StatCard title="New Customers" value="360" change="-4.5%" />
        <StatCard title="Avg Order" value="$34.7" change="+12%" />
      </div>

      {/* Chart + Rating */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5">
          <h2 className="font-semibold mb-4">Product Sales</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#4ade80"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 flex flex-col justify-center items-center">
          <h2 className="font-semibold mb-4">
            Customer Rating
          </h2>

          <div className="w-36 h-36 rounded-full border-8 border-gray-200 flex items-center justify-center">
            <span className="text-4xl font-bold">
              540K
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Total Reviews
          </p>
        </div>
      </div>

      {/* Orders */}
      <OrdersTable />
    </div>
  );
};

export default DashboardTab;