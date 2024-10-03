import { animated, useSpring } from '@react-spring/web'
import { User } from '@/types/custom'
import DeleteButton from './DeleteButton'
import EditButton from './EditButton'

export default function ProfileCard({ user }: { user: User }) {
  const { email, first_name, last_name, avatar } = user

  const springs = useSpring({
    from: { y: 100 },
    to: { y: 0 }
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
          <DeleteButton user={user} />
          <EditButton user={user} />
        </div>
      </section>
    </animated.div>
  )
}
