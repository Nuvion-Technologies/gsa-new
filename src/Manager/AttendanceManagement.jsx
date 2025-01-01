import React, { useState, useEffect, useRef } from "react";

const AttendanceManagement = () => {
    const [rollno, setRollno] = useState("");
    const [attendanceMessage, setAttendanceMessage] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);
    const [absentData, setAbsentData] = useState([]);
    const [date, setDate] = useState("");
    const ip = import.meta.env.VITE_IP;
    const inputRef = useRef(null); // Ref for the input field

    // Function to update trainee-student information on page load
    const updateTraineeStudent = async () => {
        try {
            const response = await fetch(`http://${ip}/api/manager/update-trainee-student`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userid: localStorage.getItem("userid") }),
            });

            if (!response.ok) {
                console.error("Failed to update trainee-student information.");
            }
        } catch (error) {
            console.error("An error occurred while updating trainee-student information:", error);
        }
    };

    // Function to fetch attendance data
    const fetchAttendanceData = async (selectedDate = date) => {
        try {
            const response = await fetch(`http://${ip}/api/manager/trainee-attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ date: selectedDate, userid: localStorage.getItem("userid") }),
            });

            const data = await response.json();
            if (response.ok) {
                setAttendanceData(data.presentStudents || []);
                setAbsentData(data.absentStudents || []);
            } else {
                setAttendanceMessage(data.message || "Failed to fetch attendance data.");
            }
        } catch (error) {
            setAttendanceMessage("An error occurred while fetching attendance data.");
            console.error(error);
        }
    };

    // Fetch attendance data and call the update API on initial load
    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
        updateTraineeStudent(); // Call the update API
        fetchAttendanceData(today); // Fetch attendance data
        inputRef.current?.focus(); // Focus the input field on initial load
    }, []);

    // Function to mark attendance
    const markAttendance = async () => {
        try {
            const response = await fetch(`http://${ip}/api/manager/take-attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ rollno, userid: localStorage.getItem("userid") }),
            });

            const data = await response.json();
            if (response.ok) {
                setAttendanceMessage(data.message);
                fetchAttendanceData(date);
            } else {
                setAttendanceMessage(data.message || "Failed to mark attendance.");
            }
            setRollno(""); // Clear input after submission
            inputRef.current?.focus(); // Focus back on the input field
        } catch (error) {
            setAttendanceMessage("An error occurred while marking attendance.");
            console.error(error);
        }
    };

    // Handle Enter key press in the input field
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            markAttendance(); // Trigger markAttendance on Enter press
        }
    };

    // Ensure the input is focused when rollno changes (e.g., after clearing it)
    useEffect(() => {
        inputRef.current?.focus();
    }, [rollno]);

    return (
        <div className="p-6 bg-white rounded">

            <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Mark Attendance</h4>
                <div className="flex items-center justify-start gap-4">
                <input
                    type="text"
                    className="border border-gray-300 rounded px-4 py-2 w-1/2"
                    placeholder="Enter Roll Number"
                    value={rollno}
                    ref={inputRef} // Attach ref to input field
                    onChange={(e) => setRollno(e.target.value)}
                    onKeyPress={handleKeyPress} // Listen for Enter key press
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={markAttendance}
                >
                    Submit
                </button>
                </div>
                {attendanceMessage && <p className="text-green-600 mt-2 font-bold">{attendanceMessage}</p>}
            </div>

            <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Attendance Records</h4>
                <input
                    type="date"
                    className="border border-gray-300 rounded px-4 py-2 mb-2"
                    value={date}
                    onChange={(e) => {
                        setDate(e.target.value);
                        fetchAttendanceData(e.target.value);
                    }}
                />

<div className="flex flex-row gap-8 items-start justify-start mt-8">
    {/* Present Students Section */}
    <div className="w-1/2 flex flex-col items-start justify-start gap-4 bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
        <h5 className="font-semibold text-green-700 text-lg">Present Students:</h5>
        {attendanceData.length > 0 ? (
            <ul className="space-y-2 w-full">
                {attendanceData.map((student, index) => (
                    <li
                        key={index}
                        className="flex items-center gap-4 bg-green-100 rounded-lg p-3 shadow-sm border border-green-300"
                    >
                        <div className="flex-grow text-gray-800">
                            <span className="font-semibold">{student.name}</span>{" "}
                            (<span className="text-gray-600">{student.rollno}</span>)
                        </div>
                        <div className="text-sm text-gray-500">
                            Expiry: <span className="italic">{student.expiringDate}</span>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500 italic">No present students found for this date.</p>
        )}
    </div>

    {/* Absent Students Section */}
    <div className="w-1/2 flex flex-col items-start justify-start gap-4 bg-red-50 p-4 rounded-lg shadow-sm border border-red-200">
        <h5 className="font-semibold text-red-700 text-lg">Absent Students:</h5>
        {absentData.length > 0 ? (
            <ul className="space-y-2 w-full">
                {absentData.map((student, index) => (
                    <li
                        key={index}
                        className="flex items-center gap-4 bg-red-100 rounded-lg p-3 shadow-sm border border-red-300"
                    >
                        <div className="flex-grow text-gray-800">
                            <span className="font-semibold">{student.name}</span>{" "}
                            (<span className="text-gray-600">{student.rollno}</span>)
                        </div>
                        <div className="text-sm text-gray-500">
                            Expiry: <span className="italic">{student.expiringDate}</span>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500 italic">No absent students found for this date.</p>
        )}
    </div>
</div>

            </div>
        </div>
    );
};

export default AttendanceManagement;
