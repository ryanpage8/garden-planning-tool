export interface Plant {
  name: string
  species: string
  row: number
  col: number
  water_needs?: string | string[] | null
  sunlight?: string | string[] | null
}

export default function PlantCard({ plant }: { plant: Plant }) {
  return (
    <div className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 cursor-pointer hover:border-green-400 transition-colors">
      <div className="text-white text-sm font-medium">{plant.name}</div>
      <div className="text-gray-400 text-xs italic mb-1">{plant.species}</div>
      <div className="flex gap-2 mt-1">
        {plant.sunlight && (
          <span className="text-xs text-gray-400">
            ☀️ {Array.isArray(plant.sunlight) ? plant.sunlight.join(", ") : plant.sunlight}
          </span>
        )}
        {plant.water_needs && (
          <span className="text-xs text-gray-400">
            💧 {Array.isArray(plant.water_needs) ? plant.water_needs.join(", ") : plant.water_needs}
          </span>
        )}
      </div>
    </div>
  )
}