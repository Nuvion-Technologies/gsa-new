// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TraineeManagement = () => {
//     const ip = import.meta.env.VITE_IP;
//     const [trainees, setTrainees] = useState([]);
//     const [showTraineePopup, setShowTraineePopup] = useState(false);
//     const [editingTrainee, setEditingTrainee] = useState(null);
//     const [traineeFormData, setTraineeFormData] = useState({
//         name: '',
//         father: '',
//         dob: '',
//         address: '',
//         phone: '',
//         plan_id: '',
//         active: true,
//         photo: null,
//     });

//     useEffect(() => {
//         fetchTrainees();
//     }, []);

//     const fetchTrainees = async () => {
//         try {
//             const response = await axios.get(`http://${ip}/api/academy/trainees`);
//             setTrainees(response.data);
//         } catch (error) {
//             console.error("Error fetching trainees:", error);
//         }
//     };

//     const handleTraineeInputChange = (e) => {
//         const { name, value, files } = e.target;
//         setTraineeFormData({
//             ...traineeFormData,
//             [name]: files ? files[0] : value,
//         });
//     };

//     const handleTraineeSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         for (const key in traineeFormData) {
//             formData.append(key, traineeFormData[key]);
//         }

//         try {
//             if (editingTrainee) {
//                 await axios.put(`http://${ip}/api/academy/trainee/${editingTrainee._id}`, formData);
//             } else {
//                 await axios.post(`http://${ip}/api/academy/trainee`, formData);
//             }
//             fetchTrainees();
//             setShowTraineePopup(false);
//             setEditingTrainee(null);
//         } catch (error) {
//             console.error("Error submitting trainee data:", error);
//         }
//     };

//     const toggleTraineeActive = async (id) => {
//         try {
//             await axios.patch(`http://${ip}/api/academy/trainee/${id}/toggle`);
//             fetchTrainees();
//         } catch (error) {
//             console.error("Error toggling trainee status:", error);
//         }
//     };

//     const generateIdCard = async (id) => {
//         try {
//             await axios.post(`http://${ip}/api/academy/trainee/${id}/generate-id`);
//             fetchTrainees();
//         } catch (error) {
//             console.error("Error generating ID card:", error);
//         }
//     };

//     const openTraineePopup = (trainee = null) => {
//         setEditingTrainee(trainee);
//         setTraineeFormData(
//             trainee || {
//                 name: '',
//                 father: '',
//                 dob: '',
//                 address: '',
//                 phone: '',
//                 plan_id: '',
//                 active: true,
//                 photo: null,
//             }
//         );
//         setShowTraineePopup(true);
//     };

//     return (
//         <div className="p-4">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">Trainee Management</h3>
//             <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 onClick={() => openTraineePopup()}
//             >
//                 Add Trainee
//             </button>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
//                 {trainees.map((trainee) => (
//                     <div key={trainee._id} className="border p-4 rounded shadow">
//                         {trainee.photo && (
//                            <img
//                            src={`data:image/png;base64,${trainee.photo}`}
//                            alt={trainee.name}
//                            className="w-full h-32 object-cover rounded mb-2"
//                        />
//                         )}
//                         <h4 className="font-semibold">{trainee.name}</h4>
//                         <p>Father: {trainee.father}</p>
//                         <p>Phone: {trainee.phone}</p>
//                         <p>Plan: {trainee.plan_id}</p>
//                         <div className="flex justify-between mt-2">
//                             <button
//                                 className={`px-4 py-2 ${trainee.active ? 'bg-red-500' : 'bg-green-500'} text-white rounded`}
//                                 onClick={() => toggleTraineeActive(trainee._id)}
//                             >
//                                 {trainee.active ? 'Deactivate' : 'Activate'}
//                             </button>
//                             <button
//                                 className="px-4 py-2 bg-yellow-500 text-white rounded"
//                                 onClick={() => openTraineePopup(trainee)}
//                             >
//                                 Edit
//                             </button>
//                             <button
//                                 className="px-4 py-2 bg-blue-500 text-white rounded"
//                                 onClick={() => generateIdCard(trainee._id)}
//                             >
//                                 Generate ID
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             {showTraineePopup && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-auto">
//                     <div className="bg-white p-6 rounded shadow-md w-96 max-h-[90%] overflow-y-auto">
//                         <h3 className="text-lg font-semibold mb-4">
//                             {editingTrainee ? 'Edit Trainee' : 'Add Trainee'}
//                         </h3>
//                         <form onSubmit={handleTraineeSubmit}>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700">Name</label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={traineeFormData.name}
//                                     onChange={handleTraineeInputChange}
//                                     className="mt-1 block w-full p-2 border border-gray-300 rounded"
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700">Photo</label>
//                                 <input
//                                     type="file"
//                                     name="photo"
//                                     onChange={handleTraineeInputChange}
//                                     className="mt-1 block w-full"
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700">Father</label>
//                                 <input
//                                     type="text"
//                                     name="father"
//                                     value={traineeFormData.father}
//                                     onChange={handleTraineeInputChange}
//                                     className="mt-1 block w-full p-2 border border-gray-300 rounded"
//                                 />
//                             </div>
//                             <div className="flex justify-end">
//                                 <button
//                                     type="button"
//                                     className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
//                                     onClick={() => setShowTraineePopup(false)}
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="px-4 py-2 bg-blue-500 text-white rounded"
//                                 >
//                                     {editingTrainee ? 'Update' : 'Add'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TraineeManagement;

















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TraineeManagement = () => {
//     const ip = import.meta.env.VITE_IP;
//     const [trainees, setTrainees] = useState([]);
//     const [showTraineePopup, setShowTraineePopup] = useState(false);
//     const [editingTrainee, setEditingTrainee] = useState(null);
//     const [traineeFormData, setTraineeFormData] = useState({
//         name: '',
//         father: '',
//         dob: '',
//         address: '',
//         phone: '',
//         plan_id: '',
//         active: true,
//         photo: null,
//     });

//     useEffect(() => {
//         fetchTrainees();
//     }, []);

//     const fetchTrainees = async () => {
//         try {
//             const response = await axios.get(`http://${ip}/api/academy/trainees`);
//             setTrainees(response.data);
//         } catch (error) {
//             console.error("Error fetching trainees:", error);
//         }
//     };

//     const handleTraineeInputChange = (e) => {
//         const { name, value, files } = e.target;
//         setTraineeFormData({
//             ...traineeFormData,
//             [name]: files ? files[0] : value,
//         });
//     };

//     const handleTraineeSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         for (const key in traineeFormData) {
//             formData.append(key, traineeFormData[key]);
//         }

//         try {
//             if (editingTrainee) {
//                 await axios.put(`http://${ip}/api/academy/trainee/${editingTrainee._id}`, formData);
//             } else {
//                 await axios.post(`http://${ip}/api/academy/trainee`, formData);
//             }
//             fetchTrainees();
//             setShowTraineePopup(false);
//             setEditingTrainee(null);
//         } catch (error) {
//             console.error("Error submitting trainee data:", error);
//         }
//     };

//     const toggleTraineeActive = async (id) => {
//         try {
//             await axios.patch(`http://${ip}/api/academy/trainee/${id}/toggle`);
//             fetchTrainees();
//         } catch (error) {
//             console.error("Error toggling trainee status:", error);
//         }
//     };

//     const generateIdCard = async (id) => {
//         try {
//             await axios.post(`http://${ip}/api/academy/trainee/${id}/generate-id`);
//             fetchTrainees();
//         } catch (error) {
//             console.error("Error generating ID card:", error);
//         }
//     };

//     const openTraineePopup = (trainee = null) => {
//         setEditingTrainee(trainee);
//         setTraineeFormData(
//             trainee || {
//                 name: '',
//                 father: '',
//                 dob: '',
//                 address: '',
//                 phone: '',
//                 plan_id: '',
//                 active: true,
//                 photo: null,
//             }
//         );
//         setShowTraineePopup(true);
//     };

//     return (
// <div className="bg-white mt-8">
// <h3 className="text-2xl font-bold text-gray-800 mb-6">
//         Traniee Management
//       </h3>

//   {/* Add Trainee Button */}
//   <button
// className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600"
//     onClick={() => openTraineePopup()}
//   >
//     Add Trainee
//   </button>

//   {/* Trainee Cards */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//     {trainees.map((trainee) => (
//       <div key={trainee._id} className="border p-5 rounded-lg shadow-lg transition-all hover:shadow-xl">
//         {trainee.photo && (
//           <img
//             src={`data:image/png;base64,${trainee.photo}`}
//             alt={trainee.name}
//             className="w-full h-36 object-cover rounded-t-md mb-4"
//           />
//         )}
//         <h4 className="text-lg font-semibold text-gray-800">{trainee.name}</h4>
//         <p className="text-gray-600 mt-2">Father: {trainee.father}</p>
//         <p className="text-gray-600 mt-1">Phone: {trainee.phone}</p>
//         <p className="text-gray-600 mt-1">Plan: {trainee.plan_id}</p>

//         <div className="flex justify-between mt-4">
//           {/* Deactivate/Activate Button */}
//           <button
//             className={`px-4 py-2 text-white rounded-md ${trainee.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
//             onClick={() => toggleTraineeActive(trainee._id)}
//           >
//             {trainee.active ? 'Deactivate' : 'Activate'}
//           </button>

//           {/* Edit Button */}
//           <button
//             className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all"
//             onClick={() => openTraineePopup(trainee)}
//           >
//             Edit
//           </button>

//           {/* Generate ID Button */}
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//             onClick={() => generateIdCard(trainee._id)}
//           >
//             Generate ID
//           </button>
//         </div>
//       </div>
//     ))}
//   </div>

//   {/* Trainee Popup Form */}
//   {showTraineePopup && (
//     <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center overflow-auto transition-all">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-h-[90%] overflow-y-auto transition-all">
//         <h3 className="text-xl font-semibold mb-6">
//           {editingTrainee ? 'Edit Trainee' : 'Add Trainee'}
//         </h3>
//         <form onSubmit={handleTraineeSubmit}>
//           {/* Name Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={traineeFormData.name}
//               onChange={handleTraineeInputChange}
//               className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>

//           {/* Photo Upload */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Photo</label>
//             <input
//               type="file"
//               name="photo"
//               onChange={handleTraineeInputChange}
//               className="mt-1 block w-full text-sm text-gray-700 file:bg-gray-100 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300"
//             />
//           </div>

//           {/* Father Name Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">Father</label>
//             <input
//               type="text"
//               name="father"
//               value={traineeFormData.father}
//               onChange={handleTraineeInputChange}
//               className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>

//           {/* Form Buttons */}
//           <div className="flex justify-end mt-6 space-x-4">
//             <button
//               type="button"
//               className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
//               onClick={() => setShowTraineePopup(false)}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//             >
//               {editingTrainee ? 'Update' : 'Add'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )}
// </div>

//     );
// };

// export default TraineeManagement;






// // THIRD CODE 
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TraineeManagement = () => {
//     const ip = import.meta.env.VITE_IP;
//     const [trainees, setTrainees] = useState([]);
//     const [plans, setPlans] = useState([]);
//     const [showTraineePopup, setShowTraineePopup] = useState(false);
//     const [editingTrainee, setEditingTrainee] = useState(null);
//     const [traineeFormData, setTraineeFormData] = useState({
//         name: '',
//         father: '',
//         dob: '',
//         address: '',
//         phone: '',
//         plan_id: '',
//         active: true,
//         photo: null,
//         fatherSignature: null,
//         occupation: '',
//         currentClass: '',
//         schoolName: '',
//         traineeSignature: null,
//         dateAndPlace: '',
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
//             console.log(response.data);
//         } catch (error) {
//             console.error("Error fetching plans:", error);
//         }
//     };

//     const handleTraineeInputChange = (e) => {
//         const { name, value, files } = e.target;
//         setTraineeFormData({
//             ...traineeFormData,
//             [name]: files ? files[0] : value,
//         });
//     };

//     const handleTraineeSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         for (const key in traineeFormData) {
//             formData.append(key, traineeFormData[key]);
//         }

//         try {
//             if (editingTrainee) {
//                 await axios.put(`http://${ip}/api/academy/trainee/${editingTrainee._id}`, formData);
//             } else {
//                 await axios.post(`http://${ip}/api/academy/trainee`, formData);
//             }
//             fetchTrainees();
//             setShowTraineePopup(false);
//             setEditingTrainee(null);
//         } catch (error) {
//             console.error("Error submitting trainee data:", error);
//         }
//     };

//     const toggleTraineeActive = async (id) => {
//         try {
//             await axios.patch(`http://${ip}/api/academy/trainee/${id}/toggle`);
//             fetchTrainees();
//         } catch (error) {
//             console.error("Error toggling trainee status:", error);
//         }
//     };

//     const generateIdCard = async (id) => {
//         try {
//             await axios.post(`http://${ip}/api/academy/trainee/${id}/generate-id`);
//             fetchTrainees();
//         } catch (error) {
//             console.error("Error generating ID card:", error);
//         }
//     };

//     const openTraineePopup = (trainee = null) => {
//         setEditingTrainee(trainee);
//         setTraineeFormData(
//             trainee || {
//                 name: '',
//                 father: '',
//                 dob: '',
//                 address: '',
//                 phone: '',
//                 plan_id: '',
//                 active: true,
//                 photo: null,
//                 fatherSignature: null,
//                 occupation: '',
//                 currentClass: '',
//                 schoolName: '',
//                 traineeSignature: null,
//                 dateAndPlace: '',
//             }
//         );
//         setShowTraineePopup(true);
//     };

//     const handleCancel = () => {
//         setTraineeFormData({
//             name: '',
//             father: '',
//             dob: '',
//             address: '',
//             phone: '',
//             plan_id: '',
//             active: true,
//             photo: null,
//             fatherSignature: null,
//             occupation: '',
//             currentClass: '',
//             schoolName: '',
//             traineeSignature: null,
//             dateAndPlace: '',
//         });
//         setShowTraineePopup(false);
//     };

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
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//                 {trainees.map((trainee) => (
//                     <div key={trainee._id} className="border p-5 rounded-lg shadow-lg transition-all hover:shadow-xl">
//                         {trainee.photo && (
//                             <img
//                                 src={`data:image/png;base64,${trainee.photo}`}
//                                 alt={trainee.name}
//                                 className="w-full h-36 object-cover rounded-t-md mb-4"
//                             />
//                         )}
//                         <h4 className="text-lg font-semibold text-gray-800">{trainee.name}</h4>
//                         <p className="text-gray-600 mt-2">Father: {trainee.father}</p>
//                         <p className="text-gray-600 mt-1">Phone: {trainee.phone}</p>
//                         <p className="text-gray-600 mt-1">Plan: {trainee.plan_id}</p>

//                         <div className="flex justify-between mt-4">
//                             {/* Deactivate/Activate Button */}
//                             <button
//                                 className={`px-4 py-2 text-white rounded-md ${trainee.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
//                                 onClick={() => toggleTraineeActive(trainee._id)}
//                             >
//                                 {trainee.active ? 'Deactivate' : 'Activate'}
//                             </button>

//                             {/* Edit Button */}
//                             <button
//                                 className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all"
//                                 onClick={() => openTraineePopup(trainee)}
//                             >
//                                 Edit
//                             </button>

//                             {/* Generate ID Button */}
//                             <button
//                                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//                                 onClick={() => generateIdCard(trainee._id)}
//                             >
//                                 Generate ID
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Trainee Popup Form */}
//             {showTraineePopup && (
//     <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center overflow-auto transition-all">
//         <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-[700px] max-h-[90%] overflow-y-auto transition-all">
//             <h3 className="text-2xl font-semibold mb-6 text-center">
//                 {editingTrainee ? 'Edit Trainee' : 'Add Trainee'}
//             </h3>
//             <form onSubmit={handleTraineeSubmit}>
//                 {/* Two Column Layout */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     {/* Left Column */}
//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Trainee Name</label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={traineeFormData.name}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Father's Name</label>
//                         <input
//                             type="text"
//                             name="father"
//                             value={traineeFormData.father}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Phone</label>
//                         <input
//                             type="tel"
//                             name="phone"
//                             value={traineeFormData.phone}
//                             onChange={handleTraineeInputChange}
//                             pattern="^[0-9]{10}$"
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">DOB</label>
//                         <input
//                             type="date"
//                             name="dob"
//                             value={traineeFormData.dob}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Address</label>
//                         <textarea
//                             name="address"
//                             value={traineeFormData.address}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">School Name</label>
//                         <input
//                             type="text"
//                             name="schoolName"
//                             value={traineeFormData.schoolName}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Current Class</label>
//                         <input
//                             type="text"
//                             name="currentClass"
//                             value={traineeFormData.currentClass}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Father's Occupation</label>
//                         <input
//                             type="text"
//                             name="occupation"
//                             value={traineeFormData.occupation}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Signature of Trainee</label>
//                         <input
//                             type="file"
//                             name="traineeSignature"
//                             onChange={handleTraineeInputChange}
//                             accept="image/*"
//                             className="mt-1 block w-full text-sm text-gray-700 file:bg-gray-100 file:py-3 file:px-5 file:rounded-md file:border file:border-gray-300"
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Father's Signature</label>
//                         <input
//                             type="file"
//                             name="fatherSignature"
//                             onChange={handleTraineeInputChange}
//                             accept="image/*"
//                             className="mt-1 block w-full text-sm text-gray-700 file:bg-gray-100 file:py-3 file:px-5 file:rounded-md file:border file:border-gray-300"
//                         />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="block text-sm font-medium text-gray-700">Plan Selection</label>
//                         <select
//                             name="plan_id"
//                             value={traineeFormData.plan_id}
//                             onChange={handleTraineeInputChange}
//                             className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
//                             required
//                         >
//                             {plans.map(plan => (
//                                 <option key={plan._id} value={plan._id}>{plan.name}</option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>

//                 <div className="flex justify-end mt-6 space-x-6">
//                     <button
//                         type="button"
//                         className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
//                         onClick={handleCancel}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
//                     >
//                         {editingTrainee ? 'Update' : 'Add'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     </div>
// )}

//         </div>
//     );
// };

// export default TraineeManagement;









// // FOURTH CODE
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from 'moment'
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
                        <p className="text-gray-600 mt-1"><span>Roll No</span><span className="text-gray-700 font-bold">{trainee.roll_no}</span></p>
                        <p className="text-gray-600 mt-1"><span>Father</span><span className="text-gray-700 font-bold">{trainee.father}</span></p>
                        <p className="text-gray-600 mt-1"><span>Phone</span><span className="text-gray-700 font-bold">{trainee.phone}</span></p>
                        <p className="text-gray-600 mt-1"><span>Expiry</span><span className="text-gray-700 font-bold">{formatDateTime(trainee.to)}</span></p>
                        <p className="text-gray-600 mt-1"><span>Amount</span><span className="text-gray-700 font-bold">₹{trainee.amount}</span></p>
                    </div>
                ))}
            </div>

            {/* Trainee Popup Form */}
            {showTraineePopup && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-[700px] max-h-[90%] overflow-y-auto">
                        <h3 className="text-2xl font-semibold mb-6 text-center">
                            {editingTrainee ? 'Edit Trainee' : 'Add Trainee'}
                        </h3>
                        <form onSubmit={handleTraineeSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700">Trainee Photo</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, "photo")}
                                            accept="image/*"
                                        />
                                </div>


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

                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium text-gray-700">Signature of
                                            Trainee</label>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, "traineeSignature")}
                                            accept="image/*"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium text-gray-700">Father's
                                            Signature</label>
                                        <input
                                            type="file"
                                            onChange={(e) => handleFileChange(e, "fatherSignature")}
                                            accept="image/*"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium text-gray-700">Plan
                                            Selection</label>
                                        <select
                                            name="plan_id"
                                        value={traineeFormData.plan_id}
                                        onChange={handleTraineeInputChange}
                                        className="mt-1 block w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    >
                                        {plans.map(plan => (
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
                            </div>
                        </form>

                    </div>
                </div>
            )}
        </div>
    );
};

export default TraineeManagement;