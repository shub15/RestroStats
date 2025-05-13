import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

const TransactionDisplay = ({limit}) => {
  const {darkTheme, toggleTheme} = useTheme()

  // const [transactions, setTransactions] = useState([
  //   {
  //     "item_name": "Vadapav",
  //     "item_price": 20.0,
  //     "order_id": "2",
  //     "quantity": 15,
  //     "timestamp": "Tue, 23 Aug 2022 14:00:00 GMT",
  //     "transaction_amount": 300.0,
  //     "transaction_type": "Cash"
  //   },
  //   {
  //     "item_name": "Vadapav",
  //     "item_price": 20.0,
  //     "order_id": "3",
  //     "quantity": 1,
  //     "timestamp": "Sun, 20 Nov 2022 14:00:00 GMT",
  //     "transaction_amount": 20.0,
  //     "transaction_type": "Cash"
  //   },
  // ]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'descending'
  });
  const [filterType, setFilterType] = useState('All');

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://127.0.0.1:5000/transactions/${limit}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTransactions(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    toggleTheme(!darkTheme);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (sortConfig.key === 'timestamp') {
      const dateA = new Date(a[sortConfig.key]);
      const dateB = new Date(b[sortConfig.key]);
      return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
    } else {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    }
  });

  // Apply filter
  const filteredTransactions = filterType === 'All'
    ? sortedTransactions
    : sortedTransactions.filter(transaction => transaction.transaction_type === filterType);

  // Handle sort
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Calculate totals
  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.transaction_amount, 0);
  const totalItems = filteredTransactions.reduce((sum, transaction) => sum + transaction.quantity, 0);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-screen ${darkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
        <div className="text-xl">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen ${darkTheme ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }
  // console.log(transactions)
  return (
    <div className={`min-h-screen p-4 transition-colors duration-200 rounded-lg ${darkTheme ? ' text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-6">
          {/* <h1 className="text-2xl font-bold">Transaction History</h1> */}
          {/* <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg ${darkTheme
                ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            {darkTheme ? '☀️ Light' : '🌙 Dark'}
          </button> */}
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="mb-4 md:mb-0">
            <span className="mr-2">Filter by:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`border rounded p-1 ${darkTheme ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            >
              <option value="All">All Transactions</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div className="flex items-center">
            <span className="mr-2">Sort by:</span>
            <button
              onClick={() => requestSort('timestamp')}
              className={`mr-2 px-3 py-1 border rounded ${darkTheme
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
            >
              Date {sortConfig.key === 'timestamp' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => requestSort('transaction_amount')}
              className={`px-3 py-1 border rounded ${darkTheme
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
            >
              Amount {sortConfig.key === 'transaction_amount' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded shadow ${darkTheme ? 'bg-blue-900 text-blue-100' : 'bg-blue-50 text-blue-800'}`}>
            <h3 className="text-lg font-semibold">Total Transactions</h3>
            <p className="text-2xl">{filteredTransactions.length}</p>
          </div>
          <div className={`p-4 rounded shadow ${darkTheme ? 'bg-green-900 text-green-100' : 'bg-green-50 text-green-800'}`}>
            <h3 className="text-lg font-semibold">Total Amount</h3>
            <p className="text-2xl">₹{totalAmount.toFixed(2)}</p>
          </div>
          <div className={`p-4 rounded shadow ${darkTheme ? 'bg-purple-900 text-purple-100' : 'bg-purple-50 text-purple-800'}`}>
            <h3 className="text-lg font-semibold">Total Items</h3>
            <p className="text-2xl">{totalItems}</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className={`overflow-x-auto rounded shadow ${darkTheme ? 'bg-gray-800' : 'bg-white'}`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={darkTheme ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkTheme ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredTransactions.map((transaction, i) => (
                <tr key={transaction.order_id} className={darkTheme ? `hover:bg-gray-700` : `hover:bg-gray-50 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">#{transaction.order_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>{transaction.item_name}</div>
                    <div className={`text-xs ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>₹{transaction.item_price.toFixed(2)} each</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(transaction.timestamp)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">₹{transaction.transaction_amount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.transaction_type === 'Cash'
                        ? darkTheme ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-800'
                        : darkTheme ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                      }`}>
                      {transaction.transaction_type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className={`text-center py-10 ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
              No transactions found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDisplay;