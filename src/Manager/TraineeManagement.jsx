// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import moment from 'moment'
// const TraineeManagement = () => {
//     const ip = import.meta.env.VITE_IP;
//     const [trainees, setTrainees] = useState([]);
//     const [plans, setPlans] = useState([]);
//     const [showTraineePopup, setShowTraineePopup] = useState(false);
//     const [editingTrainee, setEditingTrainee] = useState(null);
//     const [error, setError] = useState("");
//     const [traineeFormData, setTraineeFormData] = useState({
//         name: "",
//         father: "",
//         dob: "",
//         address: "",
//         phone: "",
//         plan_id: "",
//         active: true,
//         photo: null,
//         fatherSignature: null,
//         occupation: "",
//         currentClass: "",
//         schoolName: "",
//         traineeSignature: null,
//         dateAndPlace: "",
//         amount: 0,
//     });

//     useEffect(() => {
//         fetchTrainees();
//         fetchPlans();
//     }, []);

//     const fetchTrainees = async () => {
//         try {
//             const response = await axios.get(`http://${ip}/api/academy/trainees`);
//             setTrainees(response.data);
//         } catch (error) {
//             console.error("Error fetching trainees:", error);
//         }
//     };

//     const fetchPlans = async () => {
//         try {
//             const response = await axios.post(`http://${ip}/api/academy/active-plans`);
//             setPlans(response.data);
//         } catch (error) {
//             console.error("Error fetching plans:", error);
//         }
//     };

//     const handleFileChange = (e, field) => {
//         const file = e.target.files[0];
//         if (file && file.size <= 2 * 1024 * 1024) { // 2 MB size limit
//             setTraineeFormData({ ...traineeFormData, [field]: file });
//         } else {
//             setError("File size should be less than 2MB.");
//         }
//     };

//     const handleTraineeInputChange = (e) => {
//         const { name, value } = e.target;
//         if (name === "plan_id") {
//             const selectedPlan = plans.find((plan) => plan._id === value);
//             setTraineeFormData({
//                 ...traineeFormData,
//                 [name]: value,
//                 amount: selectedPlan ? selectedPlan.amount : 0,
//             });
//         } else {
//             setTraineeFormData({ ...traineeFormData, [name]: value });
//         }
//     };

//     const handleTraineeSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         Object.keys(traineeFormData).forEach((key) => {
//             formData.append(key, traineeFormData[key]);
//         });

//         try {
//             if (editingTrainee) {
//                 await axios.put(
//                     `http://${ip}/api/academy/trainee/${editingTrainee._id}`,
//                     formData
//                 );
//             } else {
//                 await axios.post(`http://${ip}/api/manager/add-new-trainee`, formData);
//             }
//             fetchTrainees();
//             setShowTraineePopup(false);
//             setEditingTrainee(null);
//             setError("");
//         } catch (error) {
//             console.error("Error submitting trainee data:", error);
//             setError("Failed to submit trainee data. Please try again.");
//         }
//     };

//     const openTraineePopup = (trainee = null) => {
//         setEditingTrainee(trainee);
//         setTraineeFormData(
//             trainee || {
//                 name: "",
//                 father: "",
//                 dob: "",
//                 address: "",
//                 phone: "",
//                 plan_id: "",
//                 active: true,
//                 photo: null,
//                 fatherSignature: null,
//                 occupation: "",
//                 currentClass: "",
//                 schoolName: "",
//                 traineeSignature: null,
//                 dateAndPlace: "",
//                 amount: 0,
//             }
//         );
//         setShowTraineePopup(true);
//     };

//     const handleCancel = () => {
//         setShowTraineePopup(false);
//         setError("");
//     };
//     const formatDateTime = (dateTime) => moment(dateTime).format('DD-MM-YYYY HH:mm:ss');
//     return (
//         <div className="bg-white mt-8">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6">Trainee Management</h3>

//             {/* Add Trainee Button */}
//             <button
//                 className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
//                 onClick={() => openTraineePopup()}
//             >
//                 Add Trainee
//             </button>

//             {/* Trainee Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
//                 {trainees.map((trainee) => (
//                     <div key={trainee._id} className="border p-5 rounded-lg shadow-lg">
//                         <div className="w-full flex items-center justify-center">
//                         {trainee.photo && (
//                             <img
//                                 src={`http://${ip}/uploads/${trainee.photo}`}
//                                 alt={trainee.name}
//                                 className="w-48 h-64 object-cover rounded-md mb-4"
//                             />
//                         )}
//                         </div>
//                         <h4 className="text-xl font-semibold text-gray-800">{trainee.name}</h4>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Roll No</span><span className="text-gray-700 font-bold">{trainee.roll_no}</span></p>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Father</span><span className="text-gray-700 font-bold">{trainee.father}</span></p>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Phone</span><span className="text-gray-700 font-bold">{trainee.phone}</span></p>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Expiry</span><span className="text-gray-700 font-bold">{formatDateTime(trainee.to)}</span></p>
//                         <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Amount</span><span className="text-gray-700 font-bold">₹{trainee.amount}</span></p>
//                     </div>
//                 ))}
//             </div>

//             {/* Trainee Popup Form */}
//             {showTraineePopup && (
//                 <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
//                    <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-[700px] lg:w-[900px] xl:w-[1100px] max-h-[90%] overflow-y-auto mx-auto">
//     <h3 className="text-2xl font-semibold mb-6 text-center">
//         {editingTrainee ? 'Edit Trainee' : 'Add Trainee'}
//     </h3>
//     <form onSubmit={handleTraineeSubmit}>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             {/* Trainee Name */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Trainee Name</label>
//                 <input
//                     type="text"
//                     name="name"
//                     value={traineeFormData.name}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* Father's Name */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Father's Name</label>
//                 <input
//                     type="text"
//                     name="father"
//                     value={traineeFormData.father}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* Phone Number */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Phone</label>
//                 <input
//                     type="tel"
//                     name="phone"
//                     value={traineeFormData.phone}
//                     onChange={handleTraineeInputChange}
//                     pattern="^[0-9]{10}$"
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* Trainee Photo */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Trainee Photo</label>
//                 <input
//                     type="file"
//                     onChange={(e) => handleFileChange(e, "photo")}
//                     accept="image/*"
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Date of Birth */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">DOB</label>
//                 <input
//                     type="date"
//                     name="dob"
//                     value={traineeFormData.dob}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Address */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Address</label>
//                 <textarea
//                     name="address"
//                     value={traineeFormData.address}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* School Name */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">School Name</label>
//                 <input
//                     type="text"
//                     name="schoolName"
//                     value={traineeFormData.schoolName}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 />
//             </div>

//             {/* Current Class */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Current Class</label>
//                 <input
//                     type="text"
//                     name="currentClass"
//                     value={traineeFormData.currentClass}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Father's Occupation */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Father's Occupation</label>
//                 <input
//                     type="text"
//                     name="occupation"
//                     value={traineeFormData.occupation}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Trainee Signature */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Signature of Trainee</label>
//                 <input
//                     type="file"
//                     onChange={(e) => handleFileChange(e, "traineeSignature")}
//                     accept="image/*"
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Father's Signature */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Father's Signature</label>
//                 <input
//                     type="file"
//                     onChange={(e) => handleFileChange(e, "fatherSignature")}
//                     accept="image/*"
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>

//             {/* Plan Selection */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Plan Selection</label>
//                 <select
//                     name="plan_id"
//                     value={traineeFormData.plan_id}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                     required
//                 >
//                     {plans.map((plan) => (
//                         <option key={plan._id} value={plan._id}>{plan.name}</option>
//                     ))}
//                 </select>
//             </div>

//             {/* Amount Field */}
//             <div className="flex flex-col">
//                 <label className="block text-sm font-medium text-gray-700">Amount</label>
//                 <input
//                     type="number"
//                     name="amount"
//                     value={traineeFormData.amount}
//                     onChange={handleTraineeInputChange}
//                     className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                 />
//             </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end mt-6 space-x-6">
//             <button
//                 type="button"
//                 className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
//                 onClick={handleCancel}
//             >
//                 Cancel
//             </button>
//             <button
//                 type="submit"
//                 className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//             >
//                 {editingTrainee ? 'Update' : 'Add'}
//             </button>
//         </div>
//     </form>
// </div>

//                 </div>
//             )}
//         </div>
//     );
// };

// export default TraineeManagement;







import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from 'moment';

const TraineeManagement = () => {
    const ip = import.meta.env.VITE_IP;
    const [trainees, setTrainees] = useState([]);
    const [plans, setPlans] = useState([]);
    const [showTraineePopup, setShowTraineePopup] = useState(false);
    const [editingTrainee, setEditingTrainee] = useState(null);
    const [error, setError] = useState("");
    const [traineeFormData, setTraineeFormData] = useState({
        name: "",
        father: "",
        dob: "",
        address: "",
        phone: "",
        plan_id: "",
        active: true,
        photo: null,
        fatherSignature: null,
        occupation: "",
        currentClass: "",
        schoolName: "",
        traineeSignature: null,
        dateAndPlace: "",
        amount: 0,
    });

    useEffect(() => {
        fetchTrainees();
        fetchPlans();
    }, []);

    const fetchTrainees = async () => {
        try {
            const response = await axios.get(`http://${ip}/api/academy/trainees`);
            setTrainees(response.data);
        } catch (error) {
            console.error("Error fetching trainees:", error);
        }
    };

    const fetchPlans = async () => {
        try {
            const response = await axios.post(`http://${ip}/api/academy/active-plans`);
            setPlans(response.data);
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file && file.size <= 2 * 1024 * 1024) { // 2 MB size limit
            setTraineeFormData({ ...traineeFormData, [field]: file });
        } else {
            setError("File size should be less than 2MB.");
        }
    };

    const handleTraineeInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "plan_id") {
            const selectedPlan = plans.find((plan) => plan._id === value);
            setTraineeFormData({
                ...traineeFormData,
                [name]: value,
                amount: selectedPlan ? selectedPlan.amount : 0,
            });
        } else {
            setTraineeFormData({ ...traineeFormData, [name]: value });
        }
    };

    const handleTraineeSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(traineeFormData).forEach((key) => {
            formData.append(key, traineeFormData[key]);
        });

        try {
            if (editingTrainee) {
                await axios.put(
                    `http://${ip}/api/academy/trainee/${editingTrainee._id}`,
                    formData
                );
            } else {
                await axios.post(`http://${ip}/api/manager/add-new-trainee`, formData);
            }
            fetchTrainees();
            setShowTraineePopup(false);
            setEditingTrainee(null);
            setError("");
        } catch (error) {
            console.error("Error submitting trainee data:", error);
            setError("Failed to submit trainee data. Please try again.");
        }
    };

    const openTraineePopup = (trainee = null) => {
        setEditingTrainee(trainee);
        setTraineeFormData(
            trainee || {
                name: "",
                father: "",
                dob: "",
                address: "",
                phone: "",
                plan_id: "",
                active: true,
                photo: null,
                fatherSignature: null,
                occupation: "",
                currentClass: "",
                schoolName: "",
                traineeSignature: null,
                dateAndPlace: "",
                amount: 0,
            }
        );
        setShowTraineePopup(true);
    };

    const handleCancel = () => {
        setShowTraineePopup(false);
        setError("");
    };

    const formatDateTime = (dateTime) => moment(dateTime).format('DD-MM-YYYY HH:mm:ss');

    return (
        <div className="bg-white mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Trainee Management</h3>

            {/* Add Trainee Button */}
            <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
                onClick={() => openTraineePopup()}
            >
                Add Trainee
            </button>

            {/* Trainee Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {trainees.map((trainee) => (
                    <div key={trainee._id} className="border p-5 rounded-lg shadow-lg">
                        <div className="w-full flex items-center justify-center">
                            {trainee.photo && (
                                <img
                                    src={`http://${ip}/uploads/${trainee.photo}`}
                                    alt={trainee.name}
                                    className="w-48 h-64 object-cover rounded-md mb-4"
                                />
                            )}
                        </div>
                        <h4 className="text-xl font-semibold text-gray-800">{trainee.name}</h4>
                        <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Roll No</span><span className="text-gray-700 font-bold">{trainee.roll_no}</span></p>
                        <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Father</span><span className="text-gray-700 font-bold">{trainee.father}</span></p>
                        <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Phone</span><span className="text-gray-700 font-bold">{trainee.phone}</span></p>
                        <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Expiry</span><span className="text-gray-700 font-bold">{formatDateTime(trainee.to)}</span></p>
                        <p className="text-gray-600 mt-1 flex flex-row justify-between"><span>Amount</span><span className="text-gray-700 font-bold">₹{trainee.amount}</span></p>

                        {/* Edit Button */}
                        <button
                            className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                            onClick={() => openTraineePopup(trainee)}
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            {/* Trainee Popup Form */}
            {showTraineePopup && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-[700px] lg:w-[900px] xl:w-[1100px] max-h-[90%] overflow-y-auto mx-auto">
                        <h3 className="text-2xl font-semibold mb-6 text-center">
                            {editingTrainee ? 'Edit Trainee' : 'Add Trainee'}
                        </h3>
                        <form onSubmit={handleTraineeSubmit}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             {/* Trainee Name */}
             <div className="flex flex-col">
                 <label className="block text-sm font-medium text-gray-700">Trainee Name</label>
                 <input
                    type="text"
                    name="name"
                    value={traineeFormData.name}
                    onChange={handleTraineeInputChange}
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                />
            </div>

            {/* Father's Name */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                <input
                    type="text"
                    name="father"
                    value={traineeFormData.father}
                    onChange={handleTraineeInputChange}
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                    type="tel"
                    name="phone"
                    value={traineeFormData.phone}
                    onChange={handleTraineeInputChange}
                    pattern="^[0-9]{10}$"
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                />
            </div>

            {/* Trainee Photo */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Trainee Photo</label>
                <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "photo")}
                    accept="image/*"
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">DOB</label>
                <input
                    type="date"
                    name="dob"
                    value={traineeFormData.dob}
                    onChange={handleTraineeInputChange}
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Address */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                    name="address"
                    value={traineeFormData.address}
                    onChange={handleTraineeInputChange}
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                />
            </div>

            {/* School Name */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">School Name</label>
                <input
                    type="text"
                    name="schoolName"
                    value={traineeFormData.schoolName}
                    onChange={handleTraineeInputChange}
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                />
            </div>

            {/* Current Class */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Current Class</label>
                <input
                    type="text"
                    name="currentClass"
                    value={traineeFormData.currentClass}
                    onChange={handleTraineeInputChange}
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Father's Occupation */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Father's Occupation</label>
                <input
                    type="text"
                    name="occupation"
                    value={traineeFormData.occupation}
                    onChange={handleTraineeInputChange}
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Trainee Signature */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Signature of Trainee</label>
                <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "traineeSignature")}
                    accept="image/*"
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Father's Signature */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Father's Signature</label>
                <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "fatherSignature")}
                    accept="image/*"
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            {/* Plan Selection */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Plan Selection</label>
                <select
                    name="plan_id"
                    value={traineeFormData.plan_id}
                    onChange={handleTraineeInputChange}
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                >
                    {plans.map((plan) => (
                        <option key={plan._id} value={plan._id}>{plan.name}</option>
                    ))}
                </select>
            </div>

            {/* Amount Field */}
            <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={traineeFormData.amount}
                    onChange={handleTraineeInputChange}
                    className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
        </div>

                            <div className="flex justify-end mt-6 space-x-6">
                                <button
                                    type="button"
                                    className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                                >
                                    {editingTrainee ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TraineeManagement;