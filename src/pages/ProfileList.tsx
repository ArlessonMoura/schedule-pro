import { useInfiniteQuery } from '@tanstack/react-query'
import ProfileCard from '../components/ProfileCard'
import React from 'react'
import { useInView } from 'react-intersection-observer'

export default function ProfileList() {
  const { ref, inView } = useInView()

  const fetchUsers = async ({ pageParam }) => {
    const res = await fetch('https://reqres.in/api/users?page=' + pageParam)
    return await res.json()
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
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
      <header className="flex justify-between py-4 px-8">
        <p>email</p>
        <button className="bg-green-600 py-2 px-8 rounded-lg">+ Add</button>
      </header>
      <main className="grid md:grid-cols-2 gap-4 p-8">
        {data.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map(
              (user: {
                id: string
                email: string
                first_name: string
                last_name: string
                avatar: string
              }) => {
                return <ProfileCard key={user.id} user={user} />
              }
            )}
          </React.Fragment>
        ))}
        <div ref={ref}>
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load Newer'
            : 'Nothing more to load'}
        </div>
        <div>
          {isFetching && !isFetchingNextPage ? 'Background Updating...' : null}
        </div>
      </main>
    </>
  )
}
