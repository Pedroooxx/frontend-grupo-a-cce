# Frontend CCE Grupo A - E-Sports Platform

A modern e-sports platform built with Next.js 15, featuring user authentication, tournament management, and real-time updates.

## 🚀 Tech Stack

- **Framework**: Next.js 15.3.2 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Package Manager**: pnpm
- **Build Tool**: Turbopack
- **Language**: TypeScript

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [pnpm](https://pnpm.io/) (recommended package manager)

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd frontend-grupo-a-cce
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file and configure the required variables:

   ```bash
   # Generate a secure secret for NextAuth
   openssl rand -base64 32
   ```

   Update your `.env` file with the generated secret and other configurations.

4. **Approve build scripts (if needed):**

   ```bash
   pnpm approve-builds
   ```

## 🚀 Running the Application

### Development Mode

Start the development server with Turbopack:

```bash
pnpm dev
```

The application will be available at:

- **Local**: [http://localhost:3000](http://localhost:3000)
- **Network**: <http://192.168.x.x:3000> (your local IP)

### Other Commands

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

## 📁 Project Structure

```
frontend-grupo-a-cce/
├── src/
│   ├── app/                    # App Router pages and layouts
│   │   ├── api/               # API routes
│   │   │   └── auth/          # NextAuth.js configuration
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable component
│   ├── lib/                   # Utility functions and configurations
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── package.json              # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

The following environment variables are required:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Yes |
| `DATABASE_URL` | Database connection string | Optional |

See `.env.example` for the complete list of available environment variables.

### Next.js Configuration

The project uses Next.js 15 with the App Router and Turbopack for faster development builds. Configuration can be found in `next.config.ts`.

## 🎯 Features

- **User Authentication**: Secure login/logout with NextAuth.js
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Fast Development**: Turbopack for lightning-fast builds
- **Modern Architecture**: App Router for better performance

## 🐛 Troubleshooting

### Common Issues

1. **Build script warnings**: If you see warnings about ignored build scripts, run:

   ```bash
   pnpm approve-builds
   ```

2. **Authentication errors**: Ensure your `NEXTAUTH_SECRET` is properly set in `.env`

3. **Port conflicts**: If port 3000 is in use, Next.js will automatically use the next available port

### Getting Help

If you encounter issues:

1. Check the console for error messages
2. Ensure all environment variables are properly configured
3. Verify that all dependencies are installed with `pnpm install`
4. Restart the development server

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [TypeScript](https://www.typescriptlang.org/docs/) - TypeScript documentation

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
