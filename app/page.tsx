"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Styles from "./page.module.css";

interface Category {
    id: number;
    name: string;
}

interface Password {
    id: number;
    title: string;
    username: string;
    password: string;
    url: string;
    notes: string;
    categoryName: string;
    categoryId: number;
}

export default function LandingPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [passwords, setPasswords] = useState<Password[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [newPassword, setNewPassword] = useState({
        title: "",
        username: "",
        password: "",
        url: "",
        notes: "",
        categoryId: 0,
    });
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        null
    );
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedPasswordId, setSelectedPasswordId] = useState<number | null>(
        null
    );
    // const [selectedPassword, setSelectedPassword] = useState({
    //     title: "",
    //     username: "",
    //     password: "",
    //     url: "",
    //     notes: "",
    //     categoryId: 0,
    // });
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const selectedPassword = passwords.find(
        (password) => password.id === selectedPasswordId
    );

    // Fetch categories and passwords
    useEffect(() => {
        const checkAuthAndFetchCategoriesAndPasswords = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch(
                    "https://snp-api.vercel.app/auth",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.status !== 200) {
                    router.push("/login");
                    return;
                }

                // Fetch categories
                const categoriesResponse = await fetch(
                    "https://snp-api.vercel.app/categories",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    setCategories(categoriesData);
                }

                // Fetch passwords
                const passwordsResponse = await fetch(
                    "https://snp-api.vercel.app/passwords",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (passwordsResponse.ok) {
                    const passwordsData = await passwordsResponse.json();
                    setPasswords(passwordsData);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        checkAuthAndFetchCategoriesAndPasswords();
    }, [router]);

    const handleCreateCategory = async () => {
        setError("");
        setSuccess("");

        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("You are not logged in.");
            return;
        }

        if (!newCategory.trim()) {
            setError("Category name cannot be empty.");
            return;
        }

        try {
            const response = await fetch(
                "https://snp-api.vercel.app/categories",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: newCategory }),
                }
            );

            if (response.status === 201) {
                const newCategoryResponse = await response.json();
                setCategories([
                    ...categories,
                    { id: newCategoryResponse.id, name: newCategory },
                ]);
                setNewCategory("");
                setSuccess("Category created successfully.");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error creating category.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
    };

    const handleCategoryClick = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
        setNewPassword({ ...newPassword, categoryId });
    };

    const handleCreatePassword = async () => {
        setError("");
        setSuccess("");

        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("You are not logged in.");
            return;
        }

        if (!newPassword.title.trim() || !newPassword.password.trim()) {
            setError("Title and password are required.");
            return;
        }

        if (newPassword.categoryId === 0) {
            setError("Please select a category.");
            return;
        }

        try {
            const response = await fetch(
                "https://snp-api.vercel.app/passwords",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newPassword),
                }
            );

            if (response.status === 201) {
                const responseData = await response.json();
                setSuccess("Password created successfully.");
                setNewPassword({
                    title: "",
                    username: "",
                    password: "",
                    url: "",
                    notes: "",
                    categoryId: 0,
                });

                const passwordsResponse = await fetch(
                    "https://snp-api.vercel.app/passwords",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (passwordsResponse.ok) {
                    const passwordsData = await passwordsResponse.json();
                    setPasswords(passwordsData);
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error creating password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
    };

    const handleEditPassword = async () => {
        if (selectedPassword) {
            setNewPassword({
                title: selectedPassword.title,
                username: selectedPassword.username,
                password: selectedPassword.password,
                url: selectedPassword.url,
                notes: selectedPassword.notes,
                categoryId: selectedPassword.categoryId,
            });
        }

        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("You are not logged in.");
            return;
        }

        try {
            const response = await fetch(
                `https://snp-api.vercel.app/passwords/${selectedPasswordId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const filteredPasswords = passwords.filter(
                    (password) => password.id !== selectedPasswordId
                );
                setPasswords(filteredPasswords);
                setSelectedPasswordId(null);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error deleting password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }

        setIsPasswordModalOpen(true);
    };

    const handleDeletePassword = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("You are not logged in.");
            return;
        }

        try {
            const response = await fetch(
                `https://snp-api.vercel.app/passwords/${selectedPasswordId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const filteredPasswords = passwords.filter(
                    (password) => password.id !== selectedPasswordId
                );
                setPasswords(filteredPasswords);
                setSelectedPasswordId(null);
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Error deleting password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        router.push("/login");
    };

    return (
        <div className={Styles.container}>
            <header className={Styles.header}>
                <h1 className={Styles.title}>SNP-Manager</h1>
            </header>
            <div className={Styles.content}>
                <aside className={Styles.menu}>
                    <h2>Categories</h2>
                    <ul>
                        {categories.map((category) => (
                            <li
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={Styles.categoryItem}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                    <div className={Styles.createCategory}>
                        <input
                            type="text"
                            placeholder="New Category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className={Styles.input}
                        />
                        <button
                            onClick={handleCreateCategory}
                            className={Styles.createButton}
                        >
                            Add
                        </button>
                    </div>
                    {error && <p className={Styles.error}>{error}</p>}
                    {success && <p className={Styles.success}>{success}</p>}
                </aside>

                <main className={Styles.passwordList}>
                    <h2>Passwords</h2>
                    <div className={Styles.passwordGrid}>
                        {passwords.length === 0 ? (
                            <p>No passwords found.</p>
                        ) : (
                            passwords.map((password) => (
                                <div
                                    key={password.id}
                                    onClick={() => {
                                        setSelectedPasswordId(password.id);
                                    }}
                                >
                                    <div className={Styles.passwordItem}>
                                        <h3>{password.title}</h3>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className={Styles.createButton}
                    >
                        Create New Password
                    </button>
                </main>

                {selectedPassword && (
                    <div className={Styles.passwordDetailsModal}>
                        <h3>{selectedPassword.title}</h3>
                        <p>
                            <strong>Username:</strong>
                        </p>
                        <p>{selectedPassword.username}</p>
                        <p>
                            <strong>Password:</strong>
                        </p>
                        <p>{selectedPassword.password}</p>
                        <p>
                            <strong>URL:</strong>
                        </p>
                        <p>{selectedPassword.url}</p>
                        <p>
                            <strong>Notes:</strong>
                        </p>
                        <p>{selectedPassword.notes}</p>
                        <button onClick={() => setSelectedPasswordId(null)}>
                            Close
                        </button>
                        <button onClick={handleEditPassword}>Edit</button>
                        <button onClick={handleDeletePassword}>Delete</button>
                    </div>
                )}

                {isPasswordModalOpen && (
                    <div className={Styles.modal}>
                        <div className={Styles.modalContent}>
                            <h3>New Password</h3>
                            <input
                                type="text"
                                placeholder="Title"
                                value={newPassword.title}
                                onChange={(e) =>
                                    setNewPassword({
                                        ...newPassword,
                                        title: e.target.value,
                                    })
                                }
                                className={Styles.input}
                            />
                            <input
                                type="text"
                                placeholder="Username"
                                value={newPassword.username}
                                onChange={(e) =>
                                    setNewPassword({
                                        ...newPassword,
                                        username: e.target.value,
                                    })
                                }
                                className={Styles.input}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newPassword.password}
                                onChange={(e) =>
                                    setNewPassword({
                                        ...newPassword,
                                        password: e.target.value,
                                    })
                                }
                                className={Styles.input}
                            />
                            <input
                                type="url"
                                placeholder="URL"
                                value={newPassword.url}
                                onChange={(e) =>
                                    setNewPassword({
                                        ...newPassword,
                                        url: e.target.value,
                                    })
                                }
                                className={Styles.input}
                            />
                            <textarea
                                placeholder="Notes"
                                value={newPassword.notes}
                                onChange={(e) =>
                                    setNewPassword({
                                        ...newPassword,
                                        notes: e.target.value,
                                    })
                                }
                                className={Styles.input}
                            ></textarea>
                            <button
                                onClick={handleCreatePassword}
                                className={Styles.createButton}
                            >
                                Create Password
                            </button>
                            <button
                                onClick={() => setIsPasswordModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
