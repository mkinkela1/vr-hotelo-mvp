import { isAccessingSelf } from '@/access/is-accessing-self'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { getUserTenantIDs } from '@/utils/get-user-tenant-id'
import { Access } from 'payload'

export const deleteAccess: Access = ({ req, id }) => {
  const { user } = req

  if (!user) {
    return false
  }

  if (isSuperAdmin(user) || isAccessingSelf({ user, id })) {
    return true
  }

  /**
   * Constrains update and delete access to users that belong
   * to the same tenant as the tenant-admin making the request
   *
   * You may want to take this a step further with a beforeChange
   * hook to ensure that the a tenant-admin can only remove users
   * from their own tenant in the tenants array.
   */
  return {
    'tenants.tenant': {
      in: getUserTenantIDs(user, 'tenant-admin'),
    },
  }
}
