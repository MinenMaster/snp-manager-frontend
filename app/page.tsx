import Link from "next/link";
import Header from "./components/Header";

const HomePage = () => {
  return (
    <div className="container">
      <div className="content">
        <h1>Welcome to the Password Manager</h1>
        <p>
          Manage your passwords securely. Please{" "}
          <Link href="/auth/login">log in</Link> or{" "}
          <Link href="/auth/register">register</Link> to get started.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
