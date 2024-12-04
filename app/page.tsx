"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "./authContext";

export default function LandingPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("register");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const apiUrl = "http://snp-api.vercel.app";
        const endpoint =
            activeTab === "login" ? `${apiUrl}/login` : `${apiUrl}/register`;

        const data = {
            identifier:
                activeTab === "login"
                    ? formData.username || formData.email
                    : undefined,
            password: formData.password,
        };

        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                setSuccessMessage("Erfolgreich angemeldet! Weiterleitung...");
                // Wenn Login erfolgreich ist, weiterleiten zur Home-Seite
                if (activeTab === "login") {
                    router.push("/home"); // Weiterleitung zur Home-Seite nach Login
                }
            } else {
                const error = await response.json();
                setErrorMessage(error.message || "Ein Fehler ist aufgetreten");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setErrorMessage(
                "Ein Fehler ist aufgetreten. Bitte versuche es später erneut."
            );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-blue-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                {/* Tab Switcher */}
                <div className="flex justify-between mb-4">
                    <button
                        onClick={() => setActiveTab("login")}
                        className={`text-lg font-semibold py-2 px-4 rounded-tl-lg ${
                            activeTab === "login"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setActiveTab("register")}
                        className={`text-lg font-semibold py-2 px-4 rounded-tr-lg ${
                            activeTab === "register"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                    >
                        Signup
                    </button>
                </div>

                {/* Error and Success Messages */}
                {errorMessage && (
                    <div className="mb-4 text-red-500">
                        <p>{errorMessage}</p>
                    </div>
                )}
                {successMessage && (
                    <div className="mb-4 text-green-500">
                        <p>{successMessage}</p>
                    </div>
                )}

                {/* Login Form */}
                {activeTab === "login" && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username or Email"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded"
                        >
                            Login
                        </button>
                    </form>
                )}

                {/* Register Form */}
                {activeTab === "register" && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email Address"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <button
                            type="submit"
                            className="w-full p-2 bg-blue-500 text-white rounded"
                        >
                            Signup
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
