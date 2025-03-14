"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface VersionSwitcherProps {
  versions: string[]
  defaultVersion: string
}

export function VersionSwitcher({ versions, defaultVersion }: VersionSwitcherProps) {
  const [selectedVersion, setSelectedVersion] = useState(defaultVersion)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between w-full bg-[#27272f] rounded p-2 text-xs">
        <span>{selectedVersion}</span>
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[160px] bg-[#27272f] border-gray-700">
        {versions.map((version) => (
          <DropdownMenuItem
            key={version}
            onClick={() => setSelectedVersion(version)}
            className="text-xs cursor-pointer"
          >
            {version}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

