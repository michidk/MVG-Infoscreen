"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Station } from "@/lib/stations";

type Props = {
  availableStations: Station[] | null;
  selectedStations: Station[];
  onSelect: (station: Station) => void;
};



export function StationSelect(props: Props) {
  const {
    availableStations: availableStations,
    selectedStations: selectedStations,
    onSelect,
  } = props;

  const [open, setOpen] = useState(false);
  const [dropDownCurrentState, setDropDownCurrentState] = useState(<></>)
  const [allStationsLoaded, setAllStationsLoaded] = useState(false)
  
  //loading all stations into the dropdown (takes longer so only done if the user clicks on the "load all stations" button)
  function loadAllStations() {
    if(!availableStations) return
    setAllStationsLoaded(true)
    setDropDownCurrentState(
      <CommandGroup>
        {availableStations.map((station) => (
          <CommandItem
            key={station.id}
            value={station.name}
            onSelect={(currentValue) => {
              const selectedStation = availableStations.find(
                (station) =>
                  station.name.toLowerCase() === currentValue,
              );

              setOpen(false);
              setAllStationsLoaded(false)
              if (selectedStation) onSelect(selectedStation);
            }}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                selectedStations.find(
                  (selected) => selected.id == station.id,
                )
                  ? "opacity-100"
                  : "opacity-0",
              )}
            />
            {station.name}
          </CommandItem>
        ))}
      </CommandGroup>
    )
  }

  //runs everytime the dropdown is opened
  React.useEffect(() => {
    if(!availableStations) return
    setAllStationsLoaded(false)
    //setting the dropdown to the first 800 stations to achieve a faster opening of the dropdown
    setDropDownCurrentState(
      <CommandGroup>
        {/*the .filter function here limits the station array to the first 800*/}
        {availableStations.filter((item, idx) => idx < 800).map((station) => (
          <CommandItem
            key={station.id}
            value={station.name}
            onSelect={(currentValue) => {
              const selectedStation = availableStations.find(
                (station) =>
                  station.name.toLowerCase() === currentValue,
              );

              setOpen(false);
              setAllStationsLoaded(false)
              if (selectedStation) onSelect(selectedStation);
            }}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                selectedStations.find(
                  (selected) => selected.id == station.id,
                )
                  ? "opacity-100"
                  : "opacity-0",
              )}
            />
            {station.name}
          </CommandItem>
        ))}

      </CommandGroup>
    )
  }, [open])

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
      {
        //making sure that availableStations is always available at this point
        !availableStations || availableStations.length == 0 ?
          <></>
        :
        (
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
                    {
                      allStationsLoaded ? <></> :
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                        onClick={() => loadAllStations()}>
                          Load All Stations...
                      </Button>
                    }
                    <CommandEmpty>No station found.</CommandEmpty>
                    {dropDownCurrentState}
                  </ScrollArea>
                </Command>
              </PopoverContent>
            </Popover>
          </>
        )}
      </>
  );
}