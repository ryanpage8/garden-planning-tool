import { useState } from 'react'
import PlantCard from './PlantCard'
import { plants } from './demo-data/plants'

export default function PlantLibrary() {
  const [search, setSearch] = useState('')

  const filtered = plants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="pt-3 pr-6 pb-3 flex flex-col gap-3 w-full">
      <input
        type="text"
        placeholder="Search plants..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
      />
      {filtered.map(plant => (
        <PlantCard key={plant.name} plant={plant} />
      ))}
    </div>
  )
}
