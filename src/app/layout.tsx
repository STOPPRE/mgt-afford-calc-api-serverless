import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mortgage Calculator API',
  description: 'Serverless API for the mortgage affordability calculator.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
