// Frontend Component
import React, { useState, useEffect } from "react";
import axios from "axios";
import TraineeManagement from "./TraineeManagement";

const AcademyManagement = () => {
  const ip = import.meta.env.VITE_IP;
  const [plans, setPlans] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    plan_limit: "",
    sport: "",
    active: true,
  });

  useEffect(() => {
    // Fetch existing plans
    axios
      .post(`http://${ip}/api/academy/all-plans`, {
        userId: localStorage.getItem("userid"),
      })
      .then((response) => setPlans(response.data));
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingPlan) {
      await axios.put(
        `http://${ip}/api/academy/update-plan/${editingPlan._id}`,
        formData
      );
    } else {
      await axios.post(`http://${ip}/api/academy/add-plan`, formData);
    }
    setFormData({
      name: "",
      amount: "",
      plan_limit: "",
      sport: "",
      active: true,
    });
    setShowPopup(false);
    setEditingPlan(null);
    const updatedPlans = await axios.post(
      `http://${ip}/api/academy/all-plans`,
      { userId: localStorage.getItem("userid") }
    );
    setPlans(updatedPlans.data);
  };

  const togglePlanActive = async (id) => {
    await axios.patch(
      `http://${ip}/api/academy/update-plan-status/${id}/toggle`
    );
    const updatedPlans = await axios.post(
      `http://${ip}/api/academy/all-plans`,
      { userId: localStorage.getItem("userid") }
    );
    setPlans(updatedPlans.data);
  };

  const openEditPopup = (plan) => {
    setEditingPlan(plan);
    setFormData(plan);
    setShowPopup(true);
  };

  const openAddPopup = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      amount: "",
      plan_limit: "",
      sport: "",
      active: true,
    });
    setShowPopup(true);
  };

  return (
    <div className="p-4 w-full mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Academy Management
      </h3>
      <div className="flex mb-6">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
          onClick={openAddPopup}
        >
          Add New Plan
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center overflow-auto z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {editingPlan ? "Edit Plan" : "Add Plan"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Plan Limit (in Days)
                </label>
                <input
                  type="number"
                  name="plan_limit"
                  value={formData.plan_limit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Sport
                </label>
                <select
                  name="sport"
                  value={formData.sport}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Sport</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Football">Football</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600"
                  onClick={() => {
                    setShowPopup(false);
                    setEditingPlan(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                >
                  {editingPlan ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition"
          >
            <h4 className="font-bold text-lg text-gray-800">{plan.name}</h4>
            <p className="text-gray-600">Sport: {plan.sport}</p>
            <p className="text-gray-600">Amount: ₹{plan.amount}</p>
            <div className="flex justify-between items-center mt-4">
              <button
                className={`px-4 py-2 rounded-lg shadow-md ${
                  plan.active ? "bg-red-500" : "bg-green-500"
                } text-white hover:opacity-90`}
                onClick={() => togglePlanActive(plan._id)}
              >
                {plan.active ? "Inactive" : "Active"}
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600"
                onClick={() => openEditPopup(plan)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
      <TraineeManagement />
    </div>
  );
};

export default AcademyManagement;
