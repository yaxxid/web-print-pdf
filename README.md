# 🚀 PDF Worker API: HTML to PDF Generator

## 💡 Overview

This project implements a simple, robust **API service** that converts a publicly accessible URL (containing a fully rendered HTML document, like an invoice template) into a high-quality **PDF file**.

It is built using **Node.js**, the **Express** framework, and the **Puppeteer** library, which controls a headless instance of the Chrome browser for perfect HTML/CSS rendering fidelity.

## ✨ Features

* **URL-to-PDF Conversion:** Generates a PDF from any publicly accessible URL.
* **High Fidelity:** Uses a real Chrome rendering engine (via Puppeteer) for accurate preservation of CSS, JavaScript, and complex layouts.
* **API Endpoint:** Simple RESTful `POST` endpoint for easy integration into client applications.
* **Cost-Effective:** Leverages open-source tools for a minimal long-term hosting cost (deployment platform fees only).

## 🛠️ Getting Started

Follow these steps to set up and run the PDF worker API locally.

### Prerequisites

You must have the following installed on your machine:

* **Node.js** (LTS version recommended)
* **npm** (comes with Node.js)

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone [YOUR_REPOSITORY_URL]
    cd pdf-worker-api
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

### Running Locally

Execute the start script defined in `package.json`:

```bash
npm start
