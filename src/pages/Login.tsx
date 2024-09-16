export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-cover bg-[url('https://cdn.arstechnica.net/wp-content/uploads/2023/06/bliss-update-800x533.jpg')]">
      <form className="rounded-3xl border-2 border-neutral-950 flex flex-col gap-4 py-16 px-16 bg-white max-w-md">
        <input
          className="rounded-lg border-2 border-neutral-950 py-2 placeholder:text-center px-4"
          type="text"
          placeholder="Name"
        />
        <input
          className="rounded-lg border-2 border-neutral-950 py-2 placeholder:text-center px-4"
          placeholder="Password"
          type="password"
          name=""
          id=""
        />
        <button className="bg-green-600 py-2 rounded-lg">Enter</button>
      </form>
    </div>
  )
}
