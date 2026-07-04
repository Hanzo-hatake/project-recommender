import { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { userService } from '../services/api'

export function useRole() {
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [roleLoading, setRoleLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded || !user) return

    const clerkId = user.id
    const email = user.emailAddresses[0]?.emailAddress || ''

    userService.getUserRole(clerkId, email)
      .then(role => {
        setIsAdmin(role.is_admin)
      })
      .catch(() => {
        setIsAdmin(false)
      })
      .finally(() => {
        setRoleLoading(false)
      })
  }, [isLoaded, user])

  return { isAdmin, roleLoading }
}