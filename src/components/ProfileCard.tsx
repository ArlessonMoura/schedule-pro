import { FaTrashAlt, FaPen } from 'react-icons/fa'
import { animated, useSpring } from '@react-spring/web'
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
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
  InfiniteData,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { RxReload } from 'react-icons/rx'
import { Page, User } from '@/types/custom'

export default function ProfileCard({ user }: { user: User }) {
  const { id, email, first_name, last_name, avatar } = user
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const springs = useSpring({
    from: { y: 100 },
    to: { y: 0 }
  })

  const updateUser = async (user: User) => {
    const res = await fetch(`https://reqres.in/api/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
    return await res.json()
  }

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: updateUser
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
    <animated.div style={{ ...springs }}>
      <section className="grid grid-cols-3 grid-rows-4 gap-4 border-2 border-gray-300 p-4 h-56">
        <img className="row-span-3" src={avatar} alt="profile" />

        <article className="flex justify-between flex-col col-span-2 row-span-3">
          <p>Name: {first_name}</p>
          <p>Last Name: {last_name}</p>
          <p>Email: {email}</p>
        </article>

        <div className="flex justify-evenly col-span-2 col-start-2 row-start-4">
          <Dialog>
            <DialogTrigger asChild>
              <button disabled={isPending}>
                {isPending && (
                  <RxReload className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!isPending && <FaTrashAlt />}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete user</DialogTitle>
                <DialogDescription>
                  {`Are you sure you want to delete ${first_name} ${last_name}?`}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose>
                  <Button
                    type="submit"
                    onClick={() => {
                      mutate(
                        { id, email, first_name: 'mudado', last_name, avatar },
                        {
                          onSuccess: (data, updatedUser, context) => {
                            queryClient.setQueryData(
                              ['users'],
                              (oldData: InfiniteData<Page, unknown>) => {
                                const newData = structuredClone(oldData)
                                newData.pages.forEach(page => {
                                  page.data.forEach(user => {
                                    if (user.id === updatedUser.id) {
                                      const updatedUserIndex =
                                        page.data.indexOf(user)
                                      page.data.splice(updatedUserIndex, 1)
                                    }
                                  })
                                })
                                return newData
                              }
                            )

                            toast({
                              description: `User ${first_name} ${last_name} was deleted`
                            })
                          },
                          onError: error => {
                            toast({
                              description: 'An error has occurred' + error
                            })
                          }
                        }
                      )
                    }}
                  >
                    Confirm
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button disabled={isPending}>
                {isPending && (
                  <RxReload className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!isPending && <FaPen />}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update user information</DialogTitle>
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
                        { id, email, first_name: 'mudado', last_name, avatar },
                        {
                          onSuccess: (data, updatedUser, context) => {
                            queryClient.setQueryData(
                              ['users'],
                              (oldData: InfiniteData<Page, unknown>) => {
                                const newData = structuredClone(oldData)
                                newData.pages.forEach(page => {
                                  page.data.forEach(user => {
                                    if (user.id === updatedUser.id) {
                                      const updatedUserIndex =
                                        page.data.indexOf(user)
                                      page.data[updatedUserIndex] = updatedUser
                                    }
                                  })
                                })
                                return newData
                              }
                            )

                            toast({
                              description:
                                'User information updated successfully'
                            })
                          },
                          onError: error => {
                            toast({
                              description: 'An error has occurred' + error
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
        </div>
      </section>
    </animated.div>
  )
}
