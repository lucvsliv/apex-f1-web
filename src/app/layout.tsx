// app/layout.tsx
import "./globals.css"

import { LanguageProvider } from "@/contexts/language-context"

export const metadata = {
    title: "Apex F1",
    description: "Apex-F1 F1 Data Service with AI Agent",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
            <LanguageProvider>
                {children}
            </LanguageProvider>
        </body>
        </html>
    )
}
