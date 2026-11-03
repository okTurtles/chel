import sbp from 'npm:@sbp/sbp'
import { NoPasswordError } from '../../controller/backend.ts'
import L from '../../common/translations.ts'

type LiveData = { live: { data: unknown, error: string } }

// Loads one of the dashboard's API paths into `live.data`. When that fails,
// `live.error` says why, and the page shows it instead.
export default (path: string): Record<string, unknown> => ({
  data (): LiveData {
    return { live: { data: null, error: '' } }
  },
  async created (this: LiveData): Promise<void> {
    try {
      this.live.data = await sbp('backend/dashboard/get', path)
    } catch (e) {
      if (e instanceof NoPasswordError) {
        this.live.error = L('The dashboard shows no data until it has a password. Set dashboardAdminPassword under [server] in chel.toml, then restart chel.')
        return
      }
      console.error(`[dashboard] could not load /api/${path}`, e)
      this.live.error = L('Could not load the data. The browser console has the details.')
    }
  }
})
