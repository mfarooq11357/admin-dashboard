
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const FinancesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [totalCollected, setTotalCollected] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Predefined expense categories
  const predefinedExpenses = [
    { description: 'Catering', amount: 0 },
    { description: 'Stage Costs', amount: 0 },
    { description: 'Venue Costs', amount: 0 },
  ];

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/events/${id}/finance`);
        const finance = response.data.finance;
        setTotalCollected(finance.totalCollected);
        // If no expenses exist, use predefined ones; otherwise, use existing expenses
        setExpenses(finance.expenses.length > 0 ? finance.expenses : predefinedExpenses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching finance:', error);
        toast.error('Failed to load financial data');
        setLoading(false);
      }
    };
    fetchFinance();
  }, [id]);

  const handleAddExpense = () => {
    setExpenses([...expenses, { description: '', amount: 0 }]);
  };

  const handleRemoveExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = field === 'amount' ? parseFloat(value) || 0 : value;
    setExpenses(newExpenses);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    const invalidExpenses = expenses.some(exp => !exp.description || exp.amount < 0);
    if (invalidExpenses) {
      toast.error('Please fill all expense descriptions and ensure amounts are non-negative.');
      return;
    }
    if (totalCollected < 0) {
      toast.error('Total collected cannot be negative.');
      return;
    }

    try {
      await axios.put(`http://localhost:3000/events/${id}/finance`, {
        expenses,
        totalCollected,
      });
      toast.success('Finances updated successfully!');
      navigate('/finances');
    } catch (error) {
      console.error('Error updating finance:', error);
      toast.error('Failed to update finances');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Event Finances</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Total Collected */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Collected (Income)</label>
          <input
            type="number"
            value={totalCollected}
            onChange={(e) => setTotalCollected(parseFloat(e.target.value) || 0)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="0"
            step="0.01"
          />
        </div>

        {/* Expenses */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Expenses</h2>
          {expenses.map((expense, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                placeholder="Expense Description"
                value={expense.description}
                onChange={(e) => handleExpenseChange(index, 'description', e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Amount"
                value={expense.amount}
                onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                className="w-1/3 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
              <button
                type="button"
                onClick={() => handleRemoveExpense(index)}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                &minus;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddExpense}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            <span className="mr-2">+</span> Add Expense
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default FinancesDetails;