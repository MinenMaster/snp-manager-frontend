# SNP-Manager | Frontend

This project is the frontend for the **SNP-Manager**, a password management tool designed to store passwords securely on your own server. It is built using Next.js and requires a backend to handle authentication, password storage, and other functionalities.

> **Note**: This project is currently **very unfinished**. Expect incomplete features and potential bugs.

## Table of Contents

-   [Getting Started](#getting-started)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Running the Project](#running-the-project)
-   [Planned features](#planned-features)

## Getting Started

Follow these instructions to set up the project on your local machine for development and testing.

## Prerequisites

Make sure the following are installed on your machine:

-   [Node.js](https://nodejs.org/) (v14.x or later)
-   [npm](https://www.npmjs.com/) (v6.x or later)

Additionally, ensure you have the backend for the SNP-Manager running. You can find the backend setup instructions in its repository.

## Installation

> **Note**: The connection to the backend is currently hard-coded to our backend. In the finished product, a self-hosted backend will be needed.

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/snp-manager-frontend.git
cd snp-manager-frontend
npm install
```

## Running the Project

Start the development server:

```bash
npm run dev
```

The project will run at `http://localhost:3000`.

## Planned features

-   **Secure Login**: Authenticate users with JWT-based login.
-   **Password Management**: Create, view, edit, and delete stored passwords.
-   **Category Organization**: Organize passwords into custom categories.
-   **User Settings**: Enable two-factor authentication (2FA) and manage other user-specific settings.
-   **Responsive Design**: Fully responsive UI for a seamless experience across devices.
