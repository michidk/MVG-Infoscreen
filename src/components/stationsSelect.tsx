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



export function StationSelect(props: Props):React.JSX.Element {
  const maxStationsInitialLoad:number = 800
  const {
    availableStations: availableStations,
    selectedStations: selectedStations,
    onSelect,
  }: {
    availableStations: Station[] | null;
    selectedStations: Station[];
    onSelect: (station: Station) => void;
  } = props;

  const trimmedStations:Station[] = availableStations ? availableStations.slice(0, maxStationsInitialLoad) : []
  const [open, setOpen]: [open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  const [dropDownCurrentState, setDropDownCurrentState] : [dropDownCurrentState: React.JSX.Element, setDropDownCurrentState: React.Dispatch<React.SetStateAction<React.JSX.Element>>] = useState(<></>)
  const [allStationsLoaded, setAllStationsLoaded] : [allStationsLoaded: boolean, setAllStationsLoaded: React.Dispatch<boolean>] = useState(false)

  function renderStations(stations:Station[]):React.JSX.Element{
    return (
        <CommandGroup>
          {stations.map((station:Station) => (
              <CommandItem
                  key={station.id}
                  value={station.name}
                  onSelect={(currentValue:string):void => {
                    const selectedStation:Station | undefined = availableStations ? availableStations.find(
                        (station):boolean =>
                            station.name.toLowerCase() === currentValue,
                    ) : undefined;

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
  React.useEffect(():void => {
    if(!availableStations) return
    setAllStationsLoaded(false)


    setDropDownCurrentState(renderStations(trimmedStations))

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
                        onClick={() => setDropDownCurrentState(renderStations(availableStations))}>
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