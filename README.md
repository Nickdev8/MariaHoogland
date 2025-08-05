[![Live Website](https://img.shields.io/badge/Live%20Website-mariahoogland.nl-blue?style=for-the-badge&logo=vercel)](https://mariahoogland.nl)

# Maria Hoogland Architect Portfolio

A professional, responsive website showcasing the distinguished work of **Maria Hoogland**, an award-winning architect. This repository contains all source code, assets, and configuration required to build and deploy her official online portfolio.

---

## Table of Contents

1. [Overview](#overview)  
2. [Key Features](#key-features)  
3. [Technology Stack](#technology-stack)  
4. [Architecture & Structure](#architecture--structure)  
5. [Getting Started](#getting-started)  
6. [Deployment](#deployment)  
7. [Contributing](#contributing)  
8. [License & Attribution](#license--attribution)  

---

## Overview

Maria Hoogland’s portfolio website provides an engaging platform for clients, collaborators, and media to explore her architectural practice. Visitors can browse completed and ongoing projects, view upcoming events, and easily submit inquiries.

---

## Key Features

- **Project Showcase**  
  High-resolution galleries and in-depth case studies illustrating design process, materials, and finished structures.

- **Event Calendar**  
  Interactive listings of exhibitions, lectures, and industry engagements—with automatic updates via a secure CMS.

- **Contact & Inquiries**  
  A GDPR-compliant contact form that routes client messages directly to Maria’s studio email.

- **Secure Admin Dashboard**  
  Role-based access for content managers to create, edit, and publish project pages and event details.

---

## Technology Stack

| Layer            | Tools & Frameworks         |
| ---------------- | -------------------------- |
| Frontend         | SvelteKit, TypeScript      |
| Build & Bundling | Vite                       |
| Styling          | Tailwind CSS               |
| CMS & Authentication | Custom SvelteKit API, JWT |
| Hosting & CDN    | Vercel                     |

---

## Architecture & Structure

```

MariaHoogland/
├── public/               # Static assets (images, favicon, robots.txt)
├── src/
│   ├── lib/              # Shared components & utilities
│   ├── routes/           # SvelteKit page endpoints
│   │   ├── +page.svelte  # Home, Portfolio, Events, Contact
│   │   └── admin/        # Secure admin panel
│   └── styles/           # Global styles & Tailwind config
├── .env.example          # Environment variable template
├── svelte.config.js      # SvelteKit configuration
└── vite.config.ts        # Vite configuration

```

---

## Getting Started

**Prerequisites**  
- Node.js ≥ 18  
- npm ≥ 9  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/NickDev8/MariaHoogland.git
   cd MariaHoogland


2. **Install dependencies**

   ```bash
   npm ci
   ```

3. **Set up environment variables**
   Copy `.env.example` to `.env` and populate your API keys, database URLs, and SMTP credentials.

4. **Run in development mode**

   ```bash
   npm run dev
   ```

   Open your browser at [http://localhost:5173](http://localhost:5173).

---

## Deployment

This project is configured for zero-configuration deployments on Vercel:

1. Connect the GitHub repository to your Vercel account.
2. Define environment variables in your Vercel dashboard.
3. Trigger a deployment via push to `main` or through the Vercel CLI:

   ```bash
   vercel --prod
   ```

---

## Contributing

We welcome contributions! To propose feature enhancements or bug fixes:

1. Fork this repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes and push to your fork.
4. Open a Pull Request against `main` with a clear description of your changes.

Please adhere to the existing code style and include any relevant tests.

---

## License & Attribution

This project is licensed under the [MIT License](./LICENSE).
All third-party assets and libraries are used in compliance with their respective licenses.

---

[![This project is part of Shipwrecked, the world\&#39;s first hackathon on an island!](https://hc-cdn.hel1.your-objectstorage.com/s/v3/739361f1d440b17fc9e2f74e49fc185d86cbec14_badge.png)](https://shipwrecked.hackclub.com/?t=ghrm)