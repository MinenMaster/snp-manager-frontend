"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
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
        }
      } catch (err) {
        console.error("Fehler bei der Tokenprüfung:", err);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div>
      <h1>Welcome to the Landing Page</h1>
      <p>Only logged-in users can see this page.</p>
    </div>
  );
}
