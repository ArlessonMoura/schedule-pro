import { useToast } from '@/hooks/use-toast'
import {
  InfiniteData,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { Button } from './ui/button'
import { RxReload } from 'react-icons/rx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Page, User } from '@/types/custom'

export default function Header() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const createUser = async (user: User) => {
    const res = await fetch('https://reqres.in/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
    return await res.json()
  }

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: createUser
    // Workaround to be used in a fake api that doesn't save the data sent in a post request
    // The cache needs to be updated manually to reflect the data change on the client side
    // onSuccess: () => {
    //   queryClient.setQueryData(['users'], (prevUsers) => )
    // },

    // To be used on a real api that actually saves the data being posted
    // After the post is made successfully, the queries defined in the queryKey
    // are invalidated and are automatically refetched
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['users'] })
    // }
  })

  return (
    <header className="flex justify-between py-4 px-8">
      <p>email</p>

      <Dialog>
        <DialogTrigger asChild>
          <button
            className="bg-green-600 py-2 px-8 rounded-lg flex justify-center items-center"
            disabled={isPending}
          >
            {isPending && <RxReload className="mr-2 h-4 w-4 animate-spin" />}
            {isPending && 'Please wait'}
            {!isPending && '+Add'}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new user</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastname" className="text-right">
                Last Name
              </Label>
              <Input id="lastname" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button
                type="submit"
                onClick={() => {
                  mutate(
                    {
                      id: '80',
                      email: 'ksdlkdl',
                      first_name: 'mudado',
                      last_name: 'mudado 2',
                      avatar: 'https://reqres.in/img/faces/1-image.jpg'
                    },
                    {
                      onSuccess: (data, newUser, context) => {
                        queryClient.setQueryData(
                          ['users'],
                          (oldData: InfiniteData<Page, unknown>) => {
                            const newData = structuredClone(oldData)
                            const lastPageIndex = newData.pages.length - 1
                            newData.pages[lastPageIndex].data.push(newUser)

                            // newData.pages.forEach(page => {
                            //   const usersPerPage = page.data.length
                            //   if (usersPerPage < 6) {
                            //     page.data.push(newUser)
                            //   }
                            // })

                            return newData
                          }
                        )

                        toast({
                          description: 'User added successfully'
                        })
                      },

                      onError: () => {
                        toast({
                          description: 'An error has occurred'
                        })
                      }
                    }
                  )
                }}
              >
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}
