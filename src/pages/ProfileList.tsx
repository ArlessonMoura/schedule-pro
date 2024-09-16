// import { useEffect } from 'react';
import ProfileCard from '../components/ProfileCard'

export default function ProfileList() {
  // useEffect(){

  // }

  return (
    <>
      <header className="flex justify-between py-4 px-8">
        <p>email</p>
        <button className="bg-green-600 py-2 px-8 rounded-lg">+ Add</button>
      </header>
      <main className="grid md:grid-cols-2 gap-4 p-8">
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
        <ProfileCard />
      </main>
    </>
  )
}
