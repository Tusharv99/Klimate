import CurrentWeather from '@/components/current-weather';
import FavoriteButton from '@/components/fav-btn';
import HourlyTemprature from '@/components/hourly-temp';
import Weatherskeleton from '@/components/loading-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import WeatherDetails from '@/components/weather-details';
import WeatherForecast from '@/components/weather-forecast';
import { useForecastQuery, useWeatherQuery } from '@/hooks/use-weather';
import { AlertCircle} from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom'


const CityPage = () => {

const [searchParams]= useSearchParams();
const params = useParams();

const lat=parseFloat(searchParams.get("lat")|| "0")
const lon=parseFloat(searchParams.get("lon")|| "0")

const coordinates={lat,lon}

const weatherQuery= useWeatherQuery(coordinates)
const forecastQuery= useForecastQuery(coordinates)

if(weatherQuery.error || forecastQuery.error){
  return(
    <Alert variant="destructive">
<AlertCircle className="h-4 w-4" />
<AlertTitle> Required</AlertTitle>
<AlertDescription className='flex flex-col gap-4'>
 <p>Failed to load data . Please try again</p>
</AlertDescription>
</Alert>
  )
}

if(!weatherQuery.data || !forecastQuery.data || !params.cityName){
  return<Weatherskeleton/>
 }


  return (
    <div className='space-y-4'>
    {/* favorite cities */}
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-bold tracking-tight'>{params.cityName},{weatherQuery.data.sys.country}</h1>
          <div>
            <FavoriteButton data={{...weatherQuery.data,name:params.cityName}}/>
          </div>
        </div>
       
        <div className='grid gap-6'>
          <div className='flex flex-col gap-4'>
            <CurrentWeather data={weatherQuery.data} />
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

export default CityPage