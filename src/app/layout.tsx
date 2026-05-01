// app/layout.tsx
import "./globals.css"

export const metadata = {
    title: "Apex F1",
    description: "Apex-F1 F1 Data Service with AI Agent",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>{children}</body>
        </html>
    )
}
