import { FaTrashAlt, FaPen } from 'react-icons/fa'
import { animated, useSpring } from '@react-spring/web'

type User = {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar: string
}

export default function ProfileCard({ user }: { user: User }) {
  const { id, email, first_name, last_name, avatar } = user

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
          <button>
            <FaTrashAlt />
          </button>
          <button>
            <FaPen />
          </button>
        </div>
      </section>
    </animated.div>
  )
}
