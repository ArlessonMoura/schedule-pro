import { useInfiniteQuery } from '@tanstack/react-query'
import ProfileCard from '../components/ProfileCard'
import React from 'react'
import { useInView } from 'react-intersection-observer'
import Header from '../components/Header'
import { Toaster } from '@/components/ui/toaster'
import { Page } from '@/types/custom'

export default function ProfileList() {
  const { ref, inView } = useInView()

  const fetchUsers = async ({
    pageParam
  }: {
    pageParam: number
  }): Promise<Page> => {
    const res = await fetch('https://reqres.in/api/users?page=' + pageParam)
    return await res.json()
  }

  const { data, error, fetchNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['users'],
      queryFn: fetchUsers,
      initialPageParam: 1,
      getNextPageParam: lastPage => {
        const isFinalPage = lastPage.page === lastPage.total_pages
        if (isFinalPage) {
          return null
        }
        return lastPage.page + 1
      }
    })

  React.useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  if (status === 'pending') return 'Loading...'

  if (status === 'error') return 'An error has occurred: ' + error.message

  return (
    <>
      <Header />
      <main className="grid md:grid-cols-2 gap-4 p-8">
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map(user => {
              return <ProfileCard key={user.id} user={user} />
            })}
          </React.Fragment>
        ))}
        <div ref={ref}>
          {isFetchingNextPage ? 'Loading more...' : 'Nothing more to load'}
        </div>
        <div>
          {isFetching && !isFetchingNextPage ? 'Background Updating...' : null}
        </div>
      </main>
      <Toaster />
    </>
  )
}
