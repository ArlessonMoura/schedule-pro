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
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from './ui/dialog'
import { Input } from './ui/input'
import { Page, User } from '@/types/custom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { useState } from 'react'

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

export default function Header() {
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

  const createUser = async (user: User) => {
    const res = await fetch('https://reqres.in/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
    return await res.json()
  }

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: createUser,
    // Workaround to be used in a fake api that doesn't save the data sent in a post request
    // The cache needs to be updated manually to reflect the data change on the client side
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
    }

    // To be used on a real api that actually saves the data being posted
    // After the post is made successfully, the queries defined in the queryKey
    // are invalidated and are automatically refetched
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['users'] })
    // }
  })

  function onSubmit(formData: FormData) {
    setOpen(false)
    form.reset()

    mutate(
      {
        id: '80',
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        avatar:
          'https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/128x128/plain/user.png'
      },
      {
        onSuccess: () => {
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
  }

  return (
    <header className="flex justify-between py-4 px-8">
      <p>email</p>

      <Dialog open={open} onOpenChange={e => setOpen(e)}>
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
    </header>
  )
}
