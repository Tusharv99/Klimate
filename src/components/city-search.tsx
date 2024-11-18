import { useState } from 'react'
import { Button } from './ui/button'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command'
import { Clock, Loader2, Search, Star, XCircle,  } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLocationSearch } from '@/hooks/use-weather'
import { useSearchHistory } from '@/hooks/use-search-history'
import { format } from 'date-fns'
import { useFavorite } from '@/hooks/use-fav'

const CitySearch = () => {
 
  const [open, setOpen] =useState(false)
  const [query, setQuery] =useState("")
  const navigate=useNavigate();
  

  const {data:locations,isLoading} = useLocationSearch(query)
  const {history,clearHistory,addToHistory}=   useSearchHistory()
  const {favorites} = useFavorite()

  const handleSelect=(cityData:string)=>{
     const[lat,lon,name,country]=cityData.split("|")

      //add to search history
        addToHistory.mutate({
          query,
          name,
          lat:parseFloat(lat),
          lon:parseFloat(lon),
          country,
        })

    setOpen(false)
     navigate(`/city/${name}?lat=${lat}&lon=${lon}`)
  }


  return (
  <>
 
   <Button
    variant="outline"
    className='relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
   onClick={()=>setOpen(true)}>
    <Search className='mr-2 h-4 w-4'/>
    Search Cities...</Button>

   <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search Cities..." value={query} onValueChange={setQuery} />
      <CommandList>
        {query.length>2 && !isLoading && (<CommandEmpty>No Cities found.</CommandEmpty>)}
       
        {/* Favorites Section */}
        {favorites.length > 0 && (
              <CommandGroup heading="Favorites">
                {favorites.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={`${city.lat}|${city.lon}|${city.name}|${city.country}`}
                    onSelect={handleSelect}
                  >
                    <Star className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>{city.name}</span>
                    {city.state && (
                      <span className="text-sm text-muted-foreground">
                        , {city.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {city.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

       


        {history.length>0 &&(
          <>
          <CommandSeparator/>
           <CommandGroup >
            <div className='flex items-center justify-between px-2 my-2'>
              <p className='text-xs text-muted-foreground'>Recent Searches</p>
              <Button 
              variant="ghost"
              size="sm"
              onClick={()=>clearHistory.mutate()}
              >
                <XCircle className='h-4 w-4'/>
                Clear
              </Button>
            </div>

            {history.map((locations)=>{
              return (
                <CommandItem key={`${locations.lat}-${locations.lon}`}
                value={`${locations.lat}|${locations.lon}|${locations.name}|${locations.country}`}
                 onSelect={handleSelect}
              >
                <Clock className='h-4 w-4 mr-2 text-muted-foreground'/>
                <span> {locations.name} </span>
                {locations.state && (
                  <span className='text-sm text-muted-foreground'>,{locations.state}</span>
                )}
                <span className='text-sm text-muted-foreground'>,{locations.country}</span>
                <span className='ml-auto text-xs text-muted-foreground'>{format(locations.searchedAt,"MMM d,h:mm a")}</span>
              </CommandItem>
              )
            })}
          
        </CommandGroup>
          </>
         )}

    <CommandSeparator/>
 
         {locations && locations.length>0 && (
        <CommandGroup heading="Suggestions">
          {locations &&(
            <div className='flex items-center justify-center p-4'>
              <Loader2 className='h-4 w-4 animate-spin'/>
            </div>
          )}
          {locations.map((locations)=>{
            return(
              <CommandItem key={`${locations.lat}-${locations.lon}`}
                value={`${locations.lat}|${locations.lon}|${locations.name}|${locations.country}`}
                 onSelect={handleSelect}
              >
                <Search className='h-4 w-4 mr-2'/>
                <span> {locations.name} </span>
                {locations.state && (
                  <span className='text-sm text-muted-foreground'>,{locations.state}</span>
                )}
                <span className='text-sm text-muted-foreground'>,{locations.country}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
         )}
      </CommandList>
    </CommandDialog>
  </>
  )
}

export default CitySearch