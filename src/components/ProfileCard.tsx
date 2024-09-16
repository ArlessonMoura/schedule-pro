import { FaTrashAlt, FaPen } from 'react-icons/fa';

export default function ProfileCard(props: {
  image: string;
  textInfo: string;
}) {
  const { image, textInfo } = props;
  return (
    <section className="grid grid-cols-12 grid-rows-6 gap-4 border-4 border-gray-400">
      <img className="col-span-4 row-span-3" src={image} alt="profile" />

      <article className="col-span-8 col-start-5 row-span-4">
        <p>Name: {textInfo}</p>
        <p>Last Name: {textInfo}</p>
        <p>Email: {textInfo}</p>
      </article>

      <div className="flex justify-center col-span-8 col-start-5 row-span-2 row-start-5 gap-4">
        <button>
          <FaTrashAlt />
        </button>
        <button>
          <FaPen />
        </button>
      </div>
    </section>
  );
}
