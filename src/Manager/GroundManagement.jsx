// import React, { useState, useEffect } from 'react';
// import moment from 'moment';

// const GroundManagement = () => {
//     const [plans, setPlans] = useState([]);
//     const [bookings, setBookings] = useState([]);
//     const [filteredBookings, setFilteredBookings] = useState([]);
//     const [filteredPlans, setFilteredPlans] = useState([]);
//     const [editMode, setEditMode] = useState(false);
//     const [currentEditId, setCurrentEditId] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [filterGround, setFilterGround] = useState("ALL");
//     const [bookingForm, setBookingForm] = useState({name: '',mobile_no: '',date: '',start_date: '',end_date: '',ground: '',payment_method: '',payment_status: 'Pending',status: true,description: '',advance: 0,advpaymentmode: '',plan_id: '',started: false,ended: false,amount: 0,
//     });

//     const ip = import.meta.env.VITE_IP;

//     useEffect(() => {
//         // Fetch ground plans
//         fetch(`http://${ip}/api/ground/plans`)
//             .then((response) => response.json())
//             .then((data) => setPlans(data))
//             .catch((error) => console.error('Error fetching ground plans:', error));

//         // Fetch bookings
//         fetch(`http://${ip}/api/ground/bookings`)
//             .then((response) => response.json())
//             .then((data) => {
//                 const sortedBookings = data.sort((a, b) => {
//                     // Sort by ground alphabetically
//                     if (a.ground < b.ground) return -1;
//                     if (a.ground > b.ground) return 1;

//                     // If ground names are the same, sort by start date
//                     return new Date(a.start_date) - new Date(b.start_date);
//                 });
//                 setBookings(sortedBookings);
//                 setFilteredBookings(sortedBookings);
//             })
//             .catch((error) => console.error('Error fetching bookings:', error));
//     }, []);

//     useEffect(() => {
//         if (bookingForm.ground) {
//             setFilteredPlans(plans.filter((plan) => plan.category === bookingForm.ground));
//         } else {
//             setFilteredPlans([]);
//         }
//     }, [bookingForm.ground, plans]);

//     useEffect(() => {
//         if (filterGround === "ALL") {
//             setFilteredBookings(bookings);
//         } else {
//             setFilteredBookings(bookings.filter((booking) => booking.ground === filterGround));
//         }
//     }, [filterGround, bookings]);

//     const handleBookingChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'plan_id') {
//             const selectedPlan = filteredPlans.find((plan) => plan._id === value);
//             setBookingForm((prevState) => ({
//                 ...prevState,
//                 [name]: value,
//                 amount: selectedPlan ? selectedPlan.amount : 0,
//             }));
//         } else {
//             setBookingForm((prevState) => ({ ...prevState, [name]: value }));
//         }
//     };

//     const handleEditBooking = (booking) => {
//         setEditMode(true);
//         setCurrentEditId(booking._id);
//         setBookingForm({
//             ...booking,
//             plan_id: booking.plan_id || '',
//             ground: booking.ground || '',
//         });
//         setShowModal(true);
//     };

//     const handleSubmitBooking = (e) => {
//                 e.preventDefault();
            
//                 if (!bookingForm.plan_id) {
//                     alert('Please select a plan before submitting the booking.');
//                     return;
//                 }
            
//                 // Find the selected plan
//                 const selectedPlan = filteredPlans.find((plan) => plan._id === bookingForm.plan_id);
//                 localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
//                 if (!selectedPlan) {
//                     alert('Invalid plan selected.');
//                     return;
//                 }
            
//                 // Combine date and timings to create start_date and end_date
//                 const selectedDate = bookingForm.date; // User-selected date (e.g., "2024-12-26")
//                 const startDateTimeUTC = new Date(`${selectedDate}T${selectedPlan.from}:00Z`); // Parse `from` time in UTC
//                 const endDateTimeUTC = new Date(`${selectedDate}T${selectedPlan.to}:00Z`); // Parse `to` time in UTC
            
//                 // Convert to IST by adding 5 hours 30 minutes
//                 const startDateTimeIST = new Date(startDateTimeUTC.getTime() - 5.5 * 60 * 60 * 1000);
//                 const endDateTimeIST = new Date(endDateTimeUTC.getTime() - 5.5 * 60 * 60 * 1000);
            
//                 // Convert to human-readable format
//                 const humanReadableStart = startDateTimeIST.toLocaleString('en-IN', {
//                     weekday: 'long',
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                     hour12: true,
//                     timeZone: 'Asia/Kolkata',
//                 });
            
//                 const humanReadableEnd = endDateTimeIST.toLocaleString('en-IN', {
//                     weekday: 'long',
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit',
//                     hour12: true,
//                     timeZone: 'Asia/Kolkata',
//                 });
            
//                 // Prepare the final booking object
//                 const updatedBookingForm = {
//                     ...bookingForm,
//                     start_date: startDateTimeIST.toISOString(), 
//                     end_date: endDateTimeIST.toISOString(),
//                 };
            
        
//                 if (editMode) {
//                     // Update existing booking
//                     fetch(`http://${ip}/api/ground/bookings/${currentEditId}`, {
//                         method: 'PUT',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify(updatedBookingForm),
//                     })
//                         .then((response) => response.json())
//                         .then((data) => {
//                             setBookings((prevState) =>
//                                 prevState.map((booking) =>
//                                     booking._id === currentEditId ? data.booking : booking
//                                 )
//                             );
//                             setEditMode(false);
//                             setCurrentEditId(null);
//                             resetBookingForm();
//                             setShowModal(false);
//                             window.location.reload();
//                         })
//                         .catch((error) => console.error('Error updating booking:', error));
//                 } else {
//                     // Create new booking
//                     fetch(`http://${ip}/api/ground/book`, {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify(updatedBookingForm),
//                     })
//                         .then((response) => response.json())
//                         .then((data) => {
//                             setBookings((prevState) => [...prevState, data.booking]);
//                             resetBookingForm();
//                             setShowModal(false);
//                             window.location.reload();
//                         })
//                         .catch((error) => console.error('Error creating booking:', error));
//                 }
//             };
            
//             // Helper to reset the booking form
//             const resetBookingForm = () => {
//                 setBookingForm({name: '',mobile_no: '',date: '',ground: '',payment_method: '',payment_status: 'Pending',status: true,description: '',advance: 0,advpaymentmode: '',plan_id: '',started: false,ended: false,amount: 0,
//                 });
//             };
        

//     const formatDateTime = (dateTime) => moment(dateTime).format('YYYY-MM-DD HH:mm:ss');

//     return (
//         <div>
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">Ground Management</h3>
//             <button
//                 onClick={() => {
//                     setShowModal(true);
//                     setEditMode(false);
//                     setBookingForm({
//                         name: '',
//                         mobile_no: '',
//                         date: '',
//                         ground: '',
//                         payment_method: '',
//                         payment_status: 'Pending',
//                         status: true,
//                         description: '',
//                         advance: 0,
//                         advpaymentmode: '',
//                         plan_id: '',
//                         started: false,
//                         ended: false,
//                         amount: 0,
//                     });
//                 }}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
//             >
//                 Create Booking
//             </button>

//             {/* Filter Buttons */}
//             <div className="flex space-x-4 mb-4">
//                 <button
//                     onClick={() => setFilterGround("ALL")}
//                     className={`px-4 py-2 rounded ${filterGround === "ALL" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
//                 >
//                     All
//                 </button>
//                 <button
//                     onClick={() => setFilterGround("GROUND-A")}
//                     className={`px-4 py-2 rounded ${filterGround === "GROUND-A" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
//                 >
//                     Ground A
//                 </button>
//                 <button
//                     onClick={() => setFilterGround("GROUND-B")}
//                     className={`px-4 py-2 rounded ${filterGround === "GROUND-B" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
//                 >
//                     Ground B
//                 </button>
//             </div>

//             {/* Modal */}
//             {showModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//                      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 max-h-[90%] overflow-y-auto">
//                         <h4 className="text-lg font-semibold text-gray-700 mb-4">
//                             {editMode ? 'Edit Booking' : 'Create Booking'}
//                         </h4>
//                         <form onSubmit={handleSubmitBooking} className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-bold">Name:</label>
//                                 <input
//                                     type="text"
//                                     name="name"
//                                     value={bookingForm.name}
//                                     onChange={handleBookingChange}
//                                     className="border p-2 w-full border-gray-400 rounded mt-1"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-bold">Mobile No:</label>
//                                 <input
//                                     type="number"
//                                     name="mobile_no"
//                                     value={bookingForm.mobile_no}
//                                     onChange={handleBookingChange}
//                                     className="border p-2 w-full border-gray-400 rounded mt-1"
//                                     required
//                                 />
//                             </div>
//                             <div>
//                         <label className="block text-sm font-bold">Date:</label>
//                         <input
//                             type="date"
//                             name="date"
//                             value={bookingForm.date}
//                             onChange={handleBookingChange}
//                             className="border p-2 w-full border-gray-400 rounded mt-1"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-bold">Ground:</label>
//                         <select
//                             name="ground"
//                             value={bookingForm.ground}
//                             onChange={handleBookingChange}
//                             className="border p-2 w-full border-gray-400 rounded mt-1"
//                         >
//                             <option value="">Select Ground</option>
//                             <option value="GROUND-A">GROUND A</option>
//                             <option value="GROUND-B">GROUND B</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-bold">Plan:</label>
//                         <select
//                             name="plan_id"
//                             value={bookingForm.plan_id}
//                             onChange={handleBookingChange}
//                             className="border p-2 w-full border-gray-400 rounded mt-1"
//                         >
//                             <option value="">Select Plan</option>
//                             {filteredPlans.map((plan) => (
//                                 <option key={plan._id} value={plan._id}>
//                                     {plan.name} - {plan.sport} - {plan.amount} INR - {plan.from} - {plan.to}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-bold">Amount:</label>
//                         <input
//                             type="number"
//                             name="amount"
//                             value={bookingForm.amount}
//                             onChange={handleBookingChange}
//                             className="border p-2 w-full border-gray-400 rounded mt-1"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-bold">Payment Method:</label>
//                         <select
//                             name="payment_method"
//                             value={bookingForm.payment_method}
//                             onChange={handleBookingChange}
//                             className="border p-2 w-full border-gray-400 rounded mt-1"
//                         >
//                             <option value="">Select Payment Method</option>
//                             <option value="Cash">Cash</option>
//                             <option value="Card">Card</option>
//                             <option value="UPI">UPI</option>
//                         </select>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-bold">Payment Status:</label>
//                         <select
//                             name="payment_status"
//                             value={bookingForm.payment_status}
//                             onChange={handleBookingChange}
//                             className="border p-2 w-full border-gray-400 rounded mt-1"
//                         >
//                             <option value="Pending">Pending</option>
//                             <option value="Paid">Paid</option>
//                             <option value="Partial">Partial</option>
//                         </select>
//                     </div>
//                     <div className='flex space-x-4 mt-6'>
//                         <label className="block text-sm font-bold">Status:</label>
//                         <input
//                             type="checkbox"
//                             name="status"
//                             className='w-5'
//                             checked={bookingForm.status}
//                             onChange={() => setBookingForm((prevState) => ({...prevState, status: !prevState.status}))}
//                         />
//                         <span>Active</span>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-bold">Description:</label>
//                         <textarea
//                             name="description"
//                             value={bookingForm.description}
//                             onChange={handleBookingChange}
//                             className="border p-2 w-full border-gray-400 rounded mt-1"
//                         ></textarea>
//                     </div>
//                     <div>
//                         <label className="block text-sm font-bold">Advance:</label>
//                         <input
//                             type="number"
//                             name="advance"
//                             value={bookingForm.advance}
//                             onChange={handleBookingChange}
//                             className="border p-2 w-full border-gray-400 rounded mt-1"
//                         />
//                     </div>
//                     <div>
//                         <label className="block text-sm font-bold">Advance Payment Mode:</label>
//                         <select
//                             name="advpaymentmode"
//                             value={bookingForm.advpaymentmode}
//                             onChange={handleBookingChange}
//                             className="border p-2 w-full border-gray-400 rounded mt-1"
//                         >
//                             <option value="">Select Advance Payment Mode</option>
//                             <option value="Cash">Cash</option>
//                             <option value="Card">Card</option>
//                             <option value="UPI">UPI</option>
//                         </select>
//                     </div>

//                     <div className='flex space-x-4 mt-6'>
//                         <label className="block text-sm font-bold">Started:</label>
//                         <input
//                             type="checkbox"
//                             name="started"
//                             className='w-5'
//                             checked={bookingForm.started}
//                             onChange={() => setBookingForm((prevState) => ({
//                                 ...prevState,
//                                 started: !prevState.started
//                             }))}
//                         />
//                     </div>
//                     <div className='flex space-x-4 mt-6 '>
//                         <label className="block text-sm font-bold">Ended:</label>
//                         <input
//                             type="checkbox"
//                             name="ended"
//                             className='w-5'
//                             checked={bookingForm.ended}
//                             onChange={() => setBookingForm((prevState) => ({...prevState, ended: !prevState.ended}))}
//                         />
//                     </div>
//                             <div className="flex justify-end space-x-4 mt-6">
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowModal(false)}
//                                     className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//                                 >
//                                     {editMode ? 'Update Booking' : 'Create Booking'}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             <div className='h-[70vh] overflow-y-auto'>
//                 <h4 className="text-md font-semibold text-gray-700 mb-2">Bookings</h4>
//                 <table className="w-full border">
//                     <thead>
//                         <tr>
//                             <th className="border px-4 py-2">Name</th>
//                             <th className="border px-4 py-2">Mobile</th>
//                             <th className="border px-4 py-2">Ground</th>
//                             <th className="border px-4 py-2">Start Date</th>
//                             <th className="border px-4 py-2">End Date</th>
//                             <th className="border px-4 py-2">Status</th>
//                             <th className="border px-4 py-2">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredBookings.map((booking) => (
//                             <tr key={booking._id}>
//                                 <td className="border px-4 py-2">{booking.name}</td>
//                                 <td className="border px-4 py-2">{booking.mobile_no}</td>
//                                 <td className="border px-4 py-2">{booking.ground}</td>
//                                 <td className="border px-4 py-2">{formatDateTime(booking.start_date)}</td>
//                                 <td className="border px-4 py-2">{formatDateTime(booking.end_date)}</td>
//                                 <td className="border px-4 py-2">{booking.status ? 'Active' : 'Inactive'}</td>
//                                 <td className="border px-4 py-2">
//                                     <button
//                                         onClick={() => handleEditBooking(booking)}
//                                         className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
//                                     >
//                                         Edit
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default GroundManagement;








import React, { useState, useEffect } from 'react';
import moment from 'moment';

const GroundManagement = () => {
    const [plans, setPlans] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filterGround, setFilterGround] = useState("ALL");
    const [filterDate, setFilterDate] = useState("");
    const [bookingForm, setBookingForm] = useState({
        name: '',
        mobile_no: '',
        date: '',
        start_date: '',
        end_date: '',
        ground: '',
        payment_method: '',
        payment_status: 'Pending',
        status: true,
        description: '',
        advance: 0,
        advpaymentmode: '',
        plan_id: '',
        started: false,
        ended: false,
        amount: 0,
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const ip = import.meta.env.VITE_IP;

    useEffect(() => {
        // Fetch ground plans
        fetch(`http://${ip}/api/ground/plans`)
            .then((response) => response.json())
            .then((data) => setPlans(data))
            .catch((error) => console.error('Error fetching ground plans:', error));

        // Fetch bookings
        fetch(`http://${ip}/api/ground/bookings`)
            .then((response) => response.json())
            .then((data) => {
                const sortedBookings = data.sort((a, b) => {
                    // Sort by ground alphabetically
                    if (a.ground < b.ground) return -1;
                    if (a.ground > b.ground) return 1;

                    // If ground names are the same, sort by start date
                    return new Date(a.start_date) - new Date(b.start_date);
                });
                setBookings(sortedBookings);
                setFilteredBookings(sortedBookings);
            })
            .catch((error) => console.error('Error fetching bookings:', error));
    }, []);

    useEffect(() => {
        if (bookingForm.ground) {
            setFilteredPlans(plans.filter((plan) => plan.category === bookingForm.ground));
        } else {
            setFilteredPlans([]);
        }
    }, [bookingForm.ground, plans]);

    useEffect(() => {
        if (filterGround === "ALL") {
            setFilteredBookings(bookings.filter((booking) => new Date(booking.end_date) >= new Date()));  // Only upcoming bookings
        } else if (filterGround === "PAST") {
            setFilteredBookings(bookings.filter((booking) => new Date(booking.end_date) < new Date()));  // Only past bookings
        } else {
            setFilteredBookings(bookings.filter((booking) => booking.ground === filterGround)); // Filter by ground
        }
    }, [filterGround, bookings]);


    useEffect(() => {
        if (filterDate) {
            setFilteredBookings(bookings.filter((booking) => {
                const bookingDate = moment(booking.start_date).format('YYYY-MM-DD');
                return bookingDate === filterDate; // Filter by selected date
            }));
        } else {
            setFilteredBookings(bookings); // Show all bookings if no date filter is applied
        }
    }, [filterDate, bookings]);

    const handleBookingChange = (e) => {
        const { name, value } = e.target;

        if (name === 'plan_id') {
            const selectedPlan = filteredPlans.find((plan) => plan._id === value);
            setBookingForm((prevState) => ({
                ...prevState,
                [name]: value,
                amount: selectedPlan ? selectedPlan.amount : 0,
            }));
            checkBookingAvailability(value, bookingForm.date);  // Check availability after plan change
        } else if (name === 'date') {
            setBookingForm((prevState) => ({ ...prevState, [name]: value }));
            checkBookingAvailability(bookingForm.plan_id, value); // Check availability after date change
        } else {
            setBookingForm((prevState) => ({ ...prevState, [name]: value }));
        }
    };

    const checkBookingAvailability = (planId, selectedDate) => {
        if (!planId || !selectedDate) {
            setErrorMessage('');
            setSuccessMessage('');
            return;
        }

        const selectedPlan = filteredPlans.find((plan) => plan._id === planId);
        const startDateTime = new Date(`${selectedDate}T${selectedPlan.from}:00Z`);
        const endDateTime = new Date(`${selectedDate}T${selectedPlan.to}:00Z`);

        const isConflict = bookings.some((booking) => {
            const bookingStart = new Date(booking.start_date);
            const bookingEnd = new Date(booking.end_date);
            return booking.ground === bookingForm.ground &&
                ((startDateTime >= bookingStart && startDateTime < bookingEnd) ||
                    (endDateTime > bookingStart && endDateTime <= bookingEnd) ||
                    (startDateTime <= bookingStart && endDateTime >= bookingEnd));
        });

        if (isConflict) {
            setErrorMessage('Slot Already Booked, please choose another timing or date.');
            setSuccessMessage('');
        } else {
            setSuccessMessage('Booking Available');
            setErrorMessage('');
        }
    };

    const handleEditBooking = (booking) => {
        setEditMode(true);
        setCurrentEditId(booking._id);
        setBookingForm({
            ...booking,
            plan_id: booking.plan_id || '',
            ground: booking.ground || '',
        });
        setShowModal(true);
    };

    const handleSubmitBooking = (e) => {
        e.preventDefault();

        if (!bookingForm.plan_id) {
            alert('Please select a plan before submitting the booking.');
            return;
        }

        const selectedPlan = filteredPlans.find((plan) => plan._id === bookingForm.plan_id);
        if (!selectedPlan) {
            alert('Invalid plan selected.');
            return;
        }

        const selectedDate = bookingForm.date;
        const startDateTimeUTC = new Date(`${selectedDate}T${selectedPlan.from}:00Z`);
        const endDateTimeUTC = new Date(`${selectedDate}T${selectedPlan.to}:00Z`);

        const startDateTimeIST = new Date(startDateTimeUTC.getTime() - 5.5 * 60 * 60 * 1000);
        const endDateTimeIST = new Date(endDateTimeUTC.getTime() - 5.5 * 60 * 60 * 1000);

        const updatedBookingForm = {
            ...bookingForm,
            start_date: startDateTimeIST.toISOString(),
            end_date: endDateTimeIST.toISOString(),
        };

        if (editMode) {
            fetch(`http://${ip}/api/ground/bookings/${currentEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBookingForm),
            })
                .then((response) => response.json())
                .then((data) => {
                    setBookings((prevState) =>
                        prevState.map((booking) =>
                            booking._id === currentEditId ? data.booking : booking
                        )
                    );
                    setEditMode(false);
                    setCurrentEditId(null);
                    resetBookingForm();
                    setShowModal(false);
                    window.location.reload();
                })
                .catch((error) => console.error('Error updating booking:', error));
        } else {
            fetch(`http://${ip}/api/ground/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBookingForm),
            })
                .then((response) => response.json())
                .then((data) => {
                    setBookings((prevState) => [...prevState, data.booking]);
                    resetBookingForm();
                    setShowModal(false);
                    window.location.reload();
                })
                .catch((error) => console.error('Error creating booking:', error));
        }
    };

    const resetBookingForm = () => {
        setBookingForm({
            name: '',
            mobile_no: '',
            date: '',
            ground: '',
            payment_method: '',
            payment_status: 'Pending',
            status: true,
            description: '',
            advance: 0,
            advpaymentmode: '',
            plan_id: '',
            started: false,
            ended: false,
            amount: 0,
        });
    };

    const formatDateTime = (dateTime) => moment(dateTime).format('YYYY-MM-DD HH:mm:ss');

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Ground Management</h3>
            <button
                onClick={() => {
                    setShowModal(true);
                    setEditMode(false);
                    resetBookingForm();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
            >
                Create Booking
            </button>

            {/* Filter Buttons */}
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setFilterGround("ALL")}
                    className={`px-4 py-2 rounded ${filterGround === "ALL" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilterGround("GROUND-A")}
                    className={`px-4 py-2 rounded ${filterGround === "GROUND-A" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
                >
                    Ground A
                </button>
                <button
                    onClick={() => setFilterGround("GROUND-B")}
                    className={`px-4 py-2 rounded ${filterGround === "GROUND-B" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
                >
                    Ground B
                </button>
                <button
                    onClick={() => setFilterGround("PAST")}
                    className={`px-4 py-2 rounded ${filterGround === "PAST" ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
                >
                    Past Bookings
                </button>
            </div>

            <div className="mb-4">
                <label className="mr-2">Filter by Date:</label>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                />
            </div>

            <div className='h-[70vh] overflow-y-auto'>
              <h4 className="text-md font-semibold text-gray-700 mb-2">Bookings</h4>
                 <table className="w-full border">
                     <thead>
                         <tr>
                             <th className="border px-4 py-2">Name</th>
                             <th className="border px-4 py-2">Mobile</th>
                             <th className="border px-4 py-2">Ground</th>
                             <th className="border px-4 py-2">Start Date</th>
                             <th className="border px-4 py-2">End Date</th>
                             <th className="border px-4 py-2">Status</th>
                             <th className="border px-4 py-2">Actions</th>
                         </tr>
                     </thead>
                     <tbody>
                         {filteredBookings.map((booking) => (
                            <tr key={booking._id}>
                                <td className="border px-4 py-2">{booking.name}</td>
                                <td className="border px-4 py-2">{booking.mobile_no}</td>
                                <td className="border px-4 py-2">{booking.ground}</td>
                                <td className="border px-4 py-2">{formatDateTime(booking.start_date)}</td>
                                <td className="border px-4 py-2">{formatDateTime(booking.end_date)}</td>
                                <td className="border px-4 py-2">{booking.status ? 'Active' : 'Inactive'}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleEditBooking(booking)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 max-h-[90%] overflow-y-auto">
                        <h2 className="text-xl font-semibold mb-4">
                            {editMode ? "Edit Booking" : "Create New Booking"}
                        </h2>

                        <form onSubmit={handleSubmitBooking}>
                            <div className="mb-4">
                                 <label className="block text-sm font-bold">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={bookingForm.name}
                                    onChange={handleBookingChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold">Mobile No:</label>
                      <input
                                    type="number"
                                    name="mobile_no"
                                    value={bookingForm.mobile_no}
                                    onChange={handleBookingChange}
                                    className="border p-2 w-full border-gray-400 rounded mt-1"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                 <label className="block text-sm font-bold">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={bookingForm.date}
                                    onChange={handleBookingChange}
                                    className="border p-2 w-full border-gray-400 rounded mt-1"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                         <label className="block text-sm font-bold">Ground:</label>
            <select
                            name="ground"
                            value={bookingForm.ground}
                            onChange={handleBookingChange}
                            className="border p-2 w-full border-gray-400 rounded mt-1"
                        >
                            <option value="">Select Ground</option>
                            <option value="GROUND-A">GROUND A</option>
                            <option value="GROUND-B">GROUND B</option>
                        </select>
                    </div>


                    <div className="mb-4">
                                 <label className="block text-sm font-bold">Plan</label>
                                <select
                                    name="plan_id"
                                    value={bookingForm.plan_id}
                                    onChange={handleBookingChange}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="">Select Plan</option>
                                    {filteredPlans.map((plan) => (
                                        <option key={plan._id} value={plan._id}>
                                            {plan.name} - {plan.sport} - {plan.amount} INR - {plan.from} - {plan.to}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <p className={`text-lg ${errorMessage ? 'text-red-500' : 'text-green-500'}`}>
                                {errorMessage || successMessage}
                            </p>

                            <div className="mb-4">
                         <label className="block text-sm font-bold">Amount:</label>
                <input
                            type="number"
                            name="amount"
                            value={bookingForm.amount}
                            onChange={handleBookingChange}
                            className="border p-2 w-full border-gray-400 rounded mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold">Payment Method:</label>
                        <select
                            name="payment_method"
                            value={bookingForm.payment_method}
                            onChange={handleBookingChange}
                            className="border p-2 w-full border-gray-400 rounded mt-1"
                        >
                            <option value="">Select Payment Method</option>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="UPI">UPI</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold">Payment Status:</label>
                        <select
                            name="payment_status"
                            value={bookingForm.payment_status}
                            onChange={handleBookingChange}
                            className="border p-2 w-full border-gray-400 rounded mt-1"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Partial">Partial</option>
                        </select>
                    </div>
                    <div className='flex space-x-4 mt-6 mb-4'>
                        <label className="block text-sm font-bold">Status:</label>
                        <input
                            type="checkbox"
                            name="status"
                            className='w-5'
                            checked={bookingForm.status}
                            onChange={() => setBookingForm((prevState) => ({...prevState, status: !prevState.status}))}
                        />
                        <span>Active</span>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold">Description:</label>
                        <textarea
                            name="description"
                            value={bookingForm.description}
                            onChange={handleBookingChange}
                            className="border p-2 w-full border-gray-400 rounded mt-1"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold">Advance:</label>
                        <input
                            type="number"
                            name="advance"
                            value={bookingForm.advance}
                            onChange={handleBookingChange}
                            className="border p-2 w-full border-gray-400 rounded mt-1"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold">Advance Payment Mode:</label>
                        <select
                            name="advpaymentmode"
                            value={bookingForm.advpaymentmode}
                            onChange={handleBookingChange}
                            className="border p-2 w-full border-gray-400 rounded mt-1"
                        >
                            <option value="">Select Advance Payment Mode</option>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="UPI">UPI</option>
                        </select>
                    </div>

                    <div className='flex space-x-4 mt-6'>
                        <label className="block text-sm font-bold">Started:</label>
                        <input
                            type="checkbox"
                            name="started"
                            className='w-5'
                            checked={bookingForm.started}
                            onChange={() => setBookingForm((prevState) => ({
                                ...prevState,
                                started: !prevState.started
                            }))}
                        />
                    </div>
                    <div className='flex space-x-4 mt-6 '>
                        <label className="block text-sm font-bold">Ended:</label>
                        <input
                            type="checkbox"
                            name="ended"
                            className='w-5'
                            checked={bookingForm.ended}
                            onChange={() => setBookingForm((prevState) => ({...prevState, ended: !prevState.ended}))}
                        />
                    </div>


                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {editMode ? "Update Booking" : "Submit Booking"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroundManagement;
