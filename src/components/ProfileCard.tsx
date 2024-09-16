import { FaTrashAlt, FaPen } from 'react-icons/fa'

export default function ProfileCard(props: {
  image: string
  textInfo: string
}) {
  const { image, textInfo } = props

  return (
    <section className="grid grid-cols-3 grid-rows-4 gap-4 border-2 border-gray-300 p-4">
      <img
        className="row-span-3"
        src="https://reqres.in/img/faces/2-image.jpg"
        alt="profile"
      />

      <article className="flex justify-between flex-col col-span-2 row-span-3">
        <p>Name: {textInfo}</p>
        <p>Last Name: {textInfo}</p>
        <p>Email: {textInfo}</p>
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
  )
}
