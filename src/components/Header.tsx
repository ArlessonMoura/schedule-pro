import { useToast } from '@/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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

export default function Header() {
  const { toast } = useToast()
  // const queryClient = useQueryClient()

  const createUser = async (user: object) => {
    const res = await fetch('https://reqres.in/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
    return await res.json()
  }

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: createUser
    // onSuccess: newUser => {
    //   queryClient.setQueryData(['users'], (prevUsers) => )
    // },
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
                    { name: 'morpheus', job: 'leader' },
                    {
                      onSuccess: () =>
                        toast({
                          description: 'User added successfully'
                        }),
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
