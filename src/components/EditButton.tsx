import { FaPen } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'

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
import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: 'First name must be at least 2 characters.'
  }),
  last_name: z.string().min(2, {
    message: 'Last name must be at least 2 characters.'
  }),
  email: z.string().email({
    message: 'This is not a valid email address'
  })
})

type FormData = z.infer<typeof formSchema>

export default function EditButton({ user }: { user: User }) {
  const { id, email, first_name, last_name, avatar } = user
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: ''
    }
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
    mutationFn: updateUser,
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
                page.data[updatedUserIndex] = updatedUser
              }
            })
          })
          return newData
        }
      )

      toast({
        description: 'User information updated successfully'
      })
    }

    // To be used on a real api that actually saves the data being posted
    // After the post is made successfully, the queries defined in the queryKey
    // are invalidated and are automatically refetched
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['users'] })
    // }
  })

  function onEdit(formData: FormData) {
    setOpen(false)
    form.reset()

    mutate(
      {
        id,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        avatar
      },
      {
        onSuccess: () => {
          toast({
            description: 'User information updated successfully'
          })
        },
        onError: error => {
          toast({
            description: 'An error has occurred' + error
          })
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={e => setOpen(e)}>
      <DialogTrigger asChild>
        <button disabled={isPending}>
          {isPending && <RxReload className="mr-2 h-4 w-4 animate-spin" />}
          {!isPending && <FaPen />}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update user information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEdit)} className="space-y-8">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
