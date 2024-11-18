import CurrentWeather from '@/components/current-weather'
import { FavoriteCities } from '@/components/favorite-cities'
import HourlyTemprature from '@/components/hourly-temp'
import Weatherskeleton from '@/components/loading-skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import WeatherDetails from '@/components/weather-details'
import WeatherForecast from '@/components/weather-forecast'
import { useGeoLocation } from '@/hooks/use-geolocation'
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from '@/hooks/use-weather'
import { AlertCircle, MapPin, RefreshCcw } from 'lucide-react'


const WeatherDashboard = () => {

  const {
    coordinates ,
     error:locationError,
     getLocation,
     isLoding:locationLoading
    } = useGeoLocation()

    const weatherQuery= useWeatherQuery(coordinates)
    const forecastQuery= useForecastQuery(coordinates)
   const locationQuery= useReverseGeocodeQuery(coordinates)

    console.log(weatherQuery.data) 

  const handleRefresh =()=>{
    getLocation()
    if(coordinates){
      weatherQuery.refetch()
      forecastQuery.refetch()
      locationQuery.refetch()
    }
  }

    if(locationLoading){
      return<Weatherskeleton/>
    }
  
    if(locationError){
     return (<Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className='flex flex-col gap-4'>
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className='w-fit'>
            <MapPin className='mr-2 h-4 w-4'/>
            Enable Location
          </Button>
       </AlertDescription>
    </Alert>)
    }

    if(!coordinates){
      return (<Alert variant="destructive">
       <AlertCircle className="h-4 w-4" />
       <AlertTitle>Location Required</AlertTitle>
       <AlertDescription className='flex flex-col gap-4'>
           <p>Please Enable location acces to see your location.</p>
           <Button onClick={getLocation} variant={"outline"} className='w-fit'>
             <MapPin className='mr-2 h-4 w-4'/>
             Enable Location
           </Button>
        </AlertDescription>
     </Alert>)
     }
    

     const locationName = locationQuery.data?.[0]

     if(weatherQuery.error || forecastQuery.error){
          return(
            <Alert variant="destructive">
       <AlertCircle className="h-4 w-4" />
       <AlertTitle> Required</AlertTitle>
       <AlertDescription className='flex flex-col gap-4'>
           <p>Failed to fetch weather data.please try again.</p>
           <Button onClick={handleRefresh} variant={"outline"} className='w-fit'>
             <RefreshCcw className='mr-2 h-4 w-4'/>
             retry
           </Button>
        </AlertDescription>
     </Alert>
          )
     }

     if(!weatherQuery.data || !forecastQuery.data){
      return<Weatherskeleton/>
     }

  return (
    <div className='space-y-4'>
  {/* favorite cities */}
  <FavoriteCities/>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold tracking-tight'>My Location</h1>
        <Button variant={'outline'}
                 size={"icon"}
                 onClick={handleRefresh}
                 disabled={weatherQuery.isFetching || forecastQuery.isFetching}
                 >
          <RefreshCcw className={`h-4 w-4 ${weatherQuery.isFetching?"animate-spin":""}` }/>
        </Button>
      </div>
     
      <div className='grid gap-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          <CurrentWeather data={weatherQuery.data} locationName={locationName} />
          <HourlyTemprature data={forecastQuery.data}/>

        </div>

        <div className='grid gap-6 md:grid-cols-2 items-start'>
          {/* details */}
          <WeatherDetails data={weatherQuery.data} />
          {/* forecast */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  )
}

export default WeatherDashboard