// Placeholder data for the Accounts page, which has no server data behind it
// yet. Dashboard, Contracts and Users show the server's real data.
import L from '../../common/translations.ts'

interface ApplicationOption {
  id: string
  name: string
}

const fakeApplicationOptions: ApplicationOption[] = [
  { id: 'groupincome', name: L('Group income') },
  { id: 'app-2', name: L('Application 2') },
  { id: 'app-3', name: L('Application 3') }
]

export {
  fakeApplicationOptions
}
