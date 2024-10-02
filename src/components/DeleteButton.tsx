import {
  InfiniteData,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Page, User } from '@/types/custom'
import { RxReload } from 'react-icons/rx'
import { FaTrashAlt } from 'react-icons/fa'
import { toast } from '@/hooks/use-toast'

export default function DeleteButton({ user }: { user: User }) {
  const queryClient = useQueryClient()

  const deleteUser = async (user: User) => {
    const res = await fetch(`https://reqres.in/api/users/${user.id}`, {
      method: 'DELETE'
    })
    // return await res.json()
    return await res
  }

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: deleteUser,
    // Workaround to be used in a fake api that doesn't save the data sent in a post request
    // The cache needs to be updated manually to reflect the data change on the client side
    onSuccess: (data, updatedUser, context) => {
      queryClient.setQueryData(
        ['users'],
        (oldData: InfiniteData<Page, unknown>) => {
          const newData = structuredClone(oldData)
          newData.pages.forEach(page => {
            page.data.forEach(user => {
              if (user.id === updatedUser.id) {
                const updatedUserIndex = page.data.indexOf(user)
                page.data.splice(updatedUserIndex, 1)
              }
            })
          })
          return newData
        }
      )
    }

    // To be used on a real api that actually saves the data being posted
    // After the post is made successfully, the queries defined in the queryKey
    // are invalidated and are automatically refetched
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['users'] })
    // }
  })

  function onDelete() {
    mutate(user, {
      onSuccess: () => {
        toast({
          description: `User ${user.first_name} ${user.last_name} was deleted`
        })
      },
      onError: error => {
        toast({
          description: 'An error has occurred' + error
        })
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button disabled={isPending}>
          {isPending && <RxReload className="mr-2 h-4 w-4 animate-spin" />}
          {!isPending && <FaTrashAlt />}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete user</DialogTitle>
          <DialogDescription>
            {`Are you sure you want to delete ${user.first_name} ${user.last_name}?`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose>
            <Button type="submit" onClick={onDelete}>
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
