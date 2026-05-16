# ToolHub

A modern, scalable, and production-ready web application that provides multiple utility tools in one place. Built with Next.js 15 App Router, Tailwind CSS (v4), TypeScript, and Zustand.

## Features

- **Generators:**
  - Random Number Generator
  - Random Name Generator
  - Birthday Generator
  - CNPJ Generator

- **Converters (100% Client-Side):**
  - JPG to PDF
  - PDF to JPG
  - Word to PDF
  - PDF to Word

- **Core Functionality:**
  - Fully responsive, mobile-first design.
  - Dark Mode support with local storage persistence.
  - Client-side file processing for maximum privacy.
  - Beautiful micro-interactions powered by Framer Motion.
  - Copy-to-clipboard functionality and direct file downloads.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix/Lucide Icons
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Parsing Libraries:** `pdf-lib`, `pdfjs-dist`, `mammoth`, `docx`

## Setup Instructions

1. **Install Dependencies**
   Navigate to the project directory (`toolhub`) and install the required NPM packages.
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Architecture

The project leverages Next.js App Router for server-side layout handling while utilizing `'use client'` extensively in tool components that require complex browser APIs (like `Canvas` rendering, `Blob` generating, and `URL.createObjectURL`).

- All utilities process data strictly within the browser context to ensure user privacy and data security.
- Theme switching is implemented globally via `next-themes`.
- `zustand` is used for sidebar toggle and global search query states.
