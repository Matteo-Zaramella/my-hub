import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
