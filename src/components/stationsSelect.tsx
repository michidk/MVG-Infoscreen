"use client";

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils";
import { Station } from "@/lib/stations";

type Props = {
  availableStations: Station[];
  selectedStations: Station[];
  onSelect: ((station: Station) => void)
}

export function StationSelect(props: Props) {
  const { availableStations: availableStations, selectedStations: selectedStations, onSelect } = props;

  const [open, setOpen] = useState(false)


  let boxLabel: string;
  if (selectedStations.length === 0) {
    boxLabel = "Select station...";
  } else if (selectedStations.length === 1) {
    boxLabel = selectedStations[0].name;
  } else {
    boxLabel = "...";
  }

  return (
    <>
      {availableStations.length == 0 && (
        <div>Loading...</div>
      )}
      {availableStations.length > 0 && (
        <>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {boxLabel}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search station..." />
                <ScrollArea className="h-96">
                  <CommandEmpty>No station found.</CommandEmpty>
                  <CommandGroup>
                    {availableStations.map((station) => (
                      <CommandItem
                        key={station.name}
                        value={station.name}
                        onSelect={(currentValue) => {
                          const selectedStation = availableStations.find((station) => station.name.toLowerCase() === currentValue);

                          setOpen(false);
                          if (selectedStation)
                            onSelect(selectedStation);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedStations.find((selected) => selected.id == station.id) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {station.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
        </>
      )
      }
    </>
  );
}
