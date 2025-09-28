'use client';

import React, { useState } from 'react';
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown,
  FileText, 
  Download, 
  CheckCircle, 
  Clock,
  CreditCard,
  PieChart,
  BarChart3,
} from 'lucide-react';

interface RevenueData {
  month: string;
  rent: number;
  electricity: number;
  parking: number;
  other: number;
  total: number;
}

interface ExpenseData {
  category: string;
  amount: number;
  color: string;
}

const FinancialManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [viewType, setViewType] = useState('overview');

  // Sample financial data
  const revenueData: RevenueData[] = [
    { month: 'Jan 2025', rent: 96000, electricity: 12000, parking: 6000, other: 6000, total: 120000 },
    { month: 'Dec 2024', rent: 94000, electricity: 11500, parking: 5800, other: 5700, total: 117000 },
    { month: 'Nov 2024', rent: 92000, electricity: 11000, parking: 5600, other: 5400, total: 114000 },
    { month: 'Oct 2024', rent: 90000, electricity: 10500, parking: 5400, other: 5100, total: 111000 },
    { month: 'Sep 2024', rent: 88000, electricity: 10000, parking: 5200, other: 4800, total: 108000 },
    { month: 'Aug 2024', rent: 86000, electricity: 9500, parking: 5000, other: 4500, total: 105000 },
  ];

  const expenseData: ExpenseData[] = [
    { category: 'Electricity Bill', amount: 8000, color: 'bg-yellow-500' },
    { category: 'Water Bill', amount: 2000, color: 'bg-blue-500' },
    { category: 'Maintenance', amount: 5000, color: 'bg-red-500' },
    { category: 'Cleaning Staff', amount: 3000, color: 'bg-green-500' },
    { category: 'Security', amount: 4000, color: 'bg-purple-500' },
    { category: 'Internet', amount: 1500, color: 'bg-orange-500' },
    { category: 'Property Tax', amount: 2500, color: 'bg-pink-500' },
    { category: 'Other', amount: 1000, color: 'bg-gray-500' }
  ];

  const pendingPayments = [
    { tenant: 'Amit Kumar', room: '101-B', amount: 8000, dueDate: '1 Feb 2025', daysOverdue: 3 },
    { tenant: 'Neha Patel', room: '103-A', amount: 8000, dueDate: '10 Jan 2025', daysOverdue: 25 },
    { tenant: 'Anjali Sharma', room: '202', amount: 8000, dueDate: '20 Feb 2025', daysOverdue: 0 },
    { tenant: 'Rohit Sharma', room: '204-C', amount: 7000, dueDate: '15 Feb 2025', daysOverdue: 0 }
  ];

  const currentMonth = revenueData[0];
  const lastMonth = revenueData[1];
  const totalExpenses = expenseData.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = currentMonth.total - totalExpenses;
  const profitMargin = ((netProfit / currentMonth.total) * 100).toFixed(1);

  const growth = {
    revenue: (((currentMonth.total - lastMonth.total) / lastMonth.total) * 100).toFixed(1),
    rent: (((currentMonth.rent - lastMonth.rent) / lastMonth.rent) * 100).toFixed(1),
    electricity: (((currentMonth.electricity - lastMonth.electricity) / lastMonth.electricity) * 100).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Management</h2>
            <p className="text-gray-500">Track revenue, expenses, and profitability</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Select time period"
            >
              <option value="current-month">Current Month</option>
              <option value="last-month">Last Month</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="last-6-months">Last 6 Months</option>
              <option value="year-to-date">Year to Date</option>
            </select>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewType === 'overview' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewType('detailed')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewType === 'detailed' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Detailed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{(currentMonth.total / 1000).toFixed(0)}K</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <IndianRupee className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {parseFloat(growth.revenue) >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${
              parseFloat(growth.revenue) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {growth.revenue}% from last month
            </span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₹{(totalExpenses / 1000).toFixed(0)}K</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {((totalExpenses / currentMonth.total) * 100).toFixed(1)}% of total revenue
            </p>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">₹{(netProfit / 1000).toFixed(0)}K</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-green-600 font-medium">
              {profitMargin}% profit margin
            </p>
          </div>
        </div>

        {/* Pending Collections */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Collections</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(pendingPayments.reduce((sum, p) => sum + p.amount, 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-yellow-600 font-medium">
              {pendingPayments.length} pending payments
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Sources</h3>
            <PieChart className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Room Rent</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹{currentMonth.rent.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{((currentMonth.rent / currentMonth.total) * 100).toFixed(0)}%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Electricity Bills</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹{currentMonth.electricity.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{((currentMonth.electricity / currentMonth.total) * 100).toFixed(0)}%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Parking Charges</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹{currentMonth.parking.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{((currentMonth.parking / currentMonth.total) * 100).toFixed(0)}%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Other Charges</span>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">₹{currentMonth.other.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{((currentMonth.other / currentMonth.total) * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
            <BarChart3 className="h-5 w-5 text-gray-500" />
          </div>
          
          <div className="space-y-3">
            {expenseData.map((expense, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 ${expense.color} rounded-full`}></div>
                  <span className="text-sm font-medium text-gray-700">{expense.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">₹{expense.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{((expense.amount / totalExpenses) * 100).toFixed(0)}%</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Total Expenses</span>
              <span className="font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Payments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Pending Payments</h3>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tenant</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Room</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((payment, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{payment.tenant}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-700">{payment.room}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">₹{payment.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-gray-700">{payment.dueDate}</span>
                  </td>
                  <td className="py-3 px-4">
                    {payment.daysOverdue > 0 ? (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        {payment.daysOverdue} days overdue
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100" title="Record payment">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="Send reminder">
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Financial Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Financial Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Record Bulk Payments</p>
              <p className="text-sm text-gray-500">Record payments for multiple tenants</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Generate Monthly Report</p>
              <p className="text-sm text-gray-500">Create detailed financial report</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Financial Analytics</p>
              <p className="text-sm text-gray-500">View detailed analytics and trends</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;
