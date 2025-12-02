import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { DatabaseIcon } from 'lucide-react'
import UpdateDbPath from './update-db-path'

export default function DbManagment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DatabaseIcon />
          <h1>Manage your data</h1>
        </CardTitle>
        <CardDescription>
          <p>
            {
              "Your whole data is stored in one file. Change these settings only if you know what you are doing, for basic usage you don't need to care about it."
            }
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateDbPath />
      </CardContent>
    </Card>
  )
}
