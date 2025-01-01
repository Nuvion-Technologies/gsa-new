import React, { useState, useEffect } from "react";
import AcademyManagement from "./AcademyManagement";
import AttendanceManagement from "./AttendanceManagement";
import AccountsOverview from "./AccountsOverview";
import BoxCricketManagement from "./BoxCricketManagement";
import ContactUsQueries from "./ContactUsQueries";
import EventManagement from "./EventManagement";
import EventParticipants from "./EventParticipants";
import GalleryManagement from "./GalleryManagement";
import GroundManagement from "./GroundManagement";
import InventoryManagement from "./InventoryManagement";
import StaffManagement from "./StaffManagement";
import StaffAttendance from "./StaffAttendance";
import ManagerHome from "./ManagerHome";

function ManagerDashboard() {
    // Load initial state from localStorage or default to "Academy"
    const [activeComponent, setActiveComponent] = useState(() => {
        return localStorage.getItem("activeComponent") || "Academy";
    });

    // Save to localStorage whenever activeComponent changes
    useEffect(() => {
        localStorage.setItem("activeComponent", activeComponent);
    }, [activeComponent]);

    const renderComponent = () => {
        switch (activeComponent) {
            case "Academy":
                return <AcademyManagement />;
            case "Attendance":
                return <AttendanceManagement />;
            case "Accounts":
                return <AccountsOverview />;
            case "BoxCricket":
                return <BoxCricketManagement />;
            case "ContactUs":
                return <ContactUsQueries />;
            case "Events":
                return <EventManagement />;
            case "EventParticipants":
                return <EventParticipants />;
            case "Gallery":
                return <GalleryManagement />;
            case "Ground":
                return <GroundManagement />;
            case "Inventory":
                return <InventoryManagement />;
            case "Staff":
                return <StaffManagement />;
            case "StaffAttendance":
                return <StaffAttendance />;
            case "ManagerHome":
                return <ManagerHome />;
            default:
                return <div className="text-gray-600">Select a module from the menu.</div>;
        }
    };

    const menuItems = [
        { label: "Home", key: "ManagerHome" },
        { label: "Academy Management", key: "Academy" },
        { label: "Attendance Management", key: "Attendance" },
        { label: "Accounts Overview", key: "Accounts" },
        { label: "Box Cricket Management", key: "BoxCricket" },
        { label: "Contact Us Queries", key: "ContactUs" },
        { label: "Event Management", key: "Events" },
        { label: "Event Participants", key: "EventParticipants" },
        { label: "Gallery Management", key: "Gallery" },
        { label: "Ground Management", key: "Ground" },
        { label: "Inventory Management", key: "Inventory" },
        { label: "Staff Management", key: "Staff" },
        { label: "Staff Attendance", key: "StaffAttendance" },
    ];

    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar */}
            <aside className="w-70 bg-blue-700 text-white shadow-lg sticky top-0">
                <div className="p-5 border-b border-blue-600">
                    <h1 className="text-2xl font-bold">Manager Dashboard</h1>
                </div>
                <nav className="mt-6 px-3">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.key} className="my-2">
                                <button
                                    onClick={() => setActiveComponent(item.key)}
                                    className={`w-full px-4 py-3 text-left rounded-md transition-all ${
                                        activeComponent === item.key
                                            ? "bg-white text-blue-700 no-underline font-bold shadow-md"
                                            : "bg-blue text-white no-underline"
                                    }`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 p-8">
                <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800">
                        {menuItems.find((item) => item.key === activeComponent)?.label || "Dashboard"}
                    </h2>
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                        }}
                        className="px-5 py-2 bg-red-600 text-white font-semibold no-underline rounded-md shadow-md hover:bg-red-700"
                    >
                        Logout
                    </button>
                </header>

                <div className="bg-white mt-8 p-6 rounded-lg shadow-lg border border-gray-200">
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
}

export default ManagerDashboard;
