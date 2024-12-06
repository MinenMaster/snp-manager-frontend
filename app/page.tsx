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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // Modal-Status für Passwortformular

  // Abrufen der Kategorien und Passwörter
  useEffect(() => {
    const checkAuthAndFetchCategoriesAndPasswords = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("https://snp-api.vercel.app/auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          router.push("/login");
          return;
        }

        // Kategorien abrufen
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

        // Passwörter abrufen
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
        console.error("Fehler beim Abrufen der Daten:", err);
      }
    };

    checkAuthAndFetchCategoriesAndPasswords();
  }, [router]);

  const handleCreateCategory = async () => {
    setError("");
    setSuccess("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Sie sind nicht angemeldet.");
      return;
    }

    if (!newCategory.trim()) {
      setError("Der Kategoriename darf nicht leer sein.");
      return;
    }

    try {
      const response = await fetch("https://snp-api.vercel.app/categories", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (response.status === 201) {
        const newCategoryResponse = await response.json();
        setCategories([
          ...categories,
          { id: newCategoryResponse.id, name: newCategory },
        ]);
        setNewCategory("");
        setSuccess("Kategorie erfolgreich erstellt.");
      } else {
        const errorData = await response.json();
        console.error("Fehler beim Erstellen der Kategorie:", errorData);
        setError(errorData.message || "Fehler beim Erstellen der Kategorie.");
      }
    } catch (err) {
      console.error("Fehler beim Erstellen der Kategorie:", err);
      setError(
        "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."
      );
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
      setError("Sie sind nicht angemeldet.");
      return;
    }

    if (!newPassword.title.trim() || !newPassword.password.trim()) {
      setError("Titel und Passwort sind erforderlich.");
      return;
    }

    if (newPassword.categoryId === 0) {
      setError("Bitte wähle eine Kategorie aus.");
      return;
    }

    try {
      const response = await fetch("https://snp-api.vercel.app/passwords", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPassword),
      });

      if (response.status === 201) {
        const responseData = await response.json();
        setSuccess("Passwort erfolgreich erstellt.");
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
        } else {
          console.error(
            "Fehler beim Abrufen der Passwörter:",
            await passwordsResponse.text()
          );
        }
      } else {
        const errorData = await response.json();
        console.error("Fehler beim Erstellen des Passworts:", errorData);
        setError(errorData.message || "Fehler beim Erstellen des Passworts.");
      }
    } catch (err) {
      console.error("Fehler beim Erstellen des Passworts:", err);
      setError(
        "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  // Password Details anzeigen
  const selectedPassword = passwords.find(
    (password) => password.id === selectedPasswordId
  );

  return (
    <div className={Styles.container}>
      <header className={Styles.header}>
        <h1 className={Styles.title}>SNP-Manager</h1>
      </header>
      <div className={Styles.content}>
        <aside className={Styles.menu}>
          <h2>Kategorien</h2>
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
              placeholder="Neue Kategorie"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className={Styles.input}
            />
            <button
              onClick={handleCreateCategory}
              className={Styles.createButton}
            >
              Hinzufügen
            </button>
          </div>
          {error && <p className={Styles.error}>{error}</p>}
          {success && <p className={Styles.success}>{success}</p>}
        </aside>

        <main className={Styles.passwordList}>
          <h2>Passwörter</h2>
          <div className={Styles.passwordGrid}>
            {passwords.length === 0 ? (
              <p>Es wurden keine Passwörter gefunden.</p>
            ) : (
              passwords.map((password) => (
                <div
                  key={password.id}
                  onClick={() => setSelectedPasswordId(password.id)}
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
            Neues Passwort erstellen
          </button>
        </main>

        {selectedPassword && (
          <div className={Styles.passwordDetailsModal}>
            <h3>{selectedPassword.title}</h3>
            <p>
              <strong>Benutzername:</strong>
            </p>
            <p>{selectedPassword.username}</p>
            <p>
              <strong>Passwort:</strong>
            </p>
            <p>{selectedPassword.password}</p>
            <p>
              <strong>URL:</strong>
            </p>
            <p>{selectedPassword.url}</p>
            <p>
              <strong>Notizen:</strong>
            </p>
            <p>{selectedPassword.notes}</p>
            <button
              onClick={() => setSelectedPasswordId(null)}
              className={Styles.closeButton}
            >
              Schließen
            </button>
          </div>
        )}

        {/* Button zum Öffnen des Passwortformulars */}

        {/* Modal für die Passworterstellung */}
        {isPasswordModalOpen && (
          <div className={Styles.modal}>
            <div className={Styles.modalContent}>
              <h3>Neues Passwort</h3>
              <input
                type="text"
                placeholder="Titel"
                value={newPassword.title}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, title: e.target.value })
                }
                className={Styles.input}
              />
              <input
                type="text"
                placeholder="Benutzername"
                value={newPassword.username}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, username: e.target.value })
                }
                className={Styles.input}
              />
              <input
                type="password"
                placeholder="Passwort"
                value={newPassword.password}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, password: e.target.value })
                }
                className={Styles.input}
              />
              <input
                type="url"
                placeholder="URL"
                value={newPassword.url}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, url: e.target.value })
                }
                className={Styles.input}
              />
              <textarea
                placeholder="Notizen"
                value={newPassword.notes}
                onChange={(e) =>
                  setNewPassword({ ...newPassword, notes: e.target.value })
                }
                className={Styles.input}
              ></textarea>
              <button
                onClick={handleCreatePassword}
                className={Styles.createButton}
              >
                Passwort Erstellen
              </button>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className={Styles.closeButton}
              >
                Schließen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
