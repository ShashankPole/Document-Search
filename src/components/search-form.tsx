import { Search } from "lucide-react"

export function SearchForm() {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="w-full bg-[#27272f] rounded-md py-2 pl-8 pr-4 text-xs focus:outline-none"
      />
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  )
}

