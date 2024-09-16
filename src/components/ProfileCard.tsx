export default function ProfileCard(props: {
  image: string;
  textInfo: string;
}) {
  const { image, textInfo } = props;
  return (
    <section className="border-gray-400 border-4">
      <img src={image} alt="profile" />
      <article>
        <p>{textInfo}</p>
        <p>
          Nemo deleniti cupiditate laudantium qui culpa tenetur et repudiandae
          ex doloribus fuga autem possimus molestiae, minus eius debitis ullam
          architecto, totam dolorem consequatur rerum? In, deleniti. Aliquam
          nostrum nobis nemo.
        </p>
        <p>
          Assumenda architecto sequi doloribus repellat laboriosam est dolores
          quaerat quod consectetur quasi, id eius suscipit eaque laudantium quam
          cupiditate voluptatem iure maiores odio. Laudantium similique vel,
          modi ab nemo officiis?
        </p>
      </article>

      <button>test1</button>
      <button>test2</button>
    </section>
  );
}
