import { useState } from 'react';
import { useSearchContext } from '../contexts/SearchContext';
import { useQuery } from 'react-query';
import * as apiClient from '../api-client';
import SearchResultsCard from '../components/SearchResultCard';
import Pagination from '../components/Pagination';
import StarRatingFilter from '../components/StarRatingFilter';
import HotelTypesFilter from '../components/HotelTypesFilter';
import FacilitiesFilter from '../components/FacilitiesFilter';
import PriceFilter from '../components/PriceFilter';

const Search = () => {

    const search = useSearchContext();
    const [page, setPage] = useState<number>(1);
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [seletedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
    const [seletedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
    const [sortOption, setSortOption] = useState<string>("");

    const searchParams = {
      destination: search.destination,
      checkIn: search.checkIn.toISOString(),
      checkOut: search.checkOut.toISOString(),
      adultCount: search.adultCount.toString(),
      childCount: search.childCount.toString(),
      page: page.toString(),
      stars: selectedStars,
      types: seletedHotelTypes,
      facilities: seletedFacilities,
      maxPrice: selectedPrice !== undefined ? selectedPrice.toString() : undefined,
      sortOption,
    };

    const {data: hotelData} = useQuery(["searchHotels", searchParams], () => apiClient.searchHotels(searchParams));

    const handleStarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const starRating = event.target.value;

      setSelectedStars((prevStars) => event.target.checked ? [...prevStars, starRating] : prevStars.filter((star) => star !== starRating))
    };

    const handleHotelTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const hotelType = event.target.value;

      setSelectedHotelTypes((prevHotelTypes) => event.target.checked ? [...prevHotelTypes, hotelType] : prevHotelTypes.filter((hotelsType) => hotelsType !== hotelType))
    };

    const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const facilityType = event.target.value;

      setSelectedFacilities((prevFacilityTypes) => event.target.checked ? [...prevFacilityTypes, facilityType] : prevFacilityTypes.filter((facilitiesType) => facilitiesType !== facilityType))
    };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5'>
      {/* div for filter column */}
      <div className='rounded-lg border border-slate-300 p-5 h-fit sticky top-10'>
        <div className='space-y-5'>
          <h3 className='text-lg font-semibold border-b border-slate-300 pb-5'>Filter by:</h3>
          <StarRatingFilter seletedStars={selectedStars} onChange={handleStarChange}/>
          <HotelTypesFilter seletedHotelTypes={seletedHotelTypes} onChange={handleHotelTypeChange}/>
          <FacilitiesFilter seletedFacilities={seletedFacilities} onChange={handleFacilityChange}/>
          <PriceFilter selectedPrice={selectedPrice} onChange={(value?: number) => setSelectedPrice(value)}/>
        </div>
      </div>
      {/* div for cards column */}
      <div className='flex flex-col gap-5'>
        <div className='flex justify-between items-center'>
          <span className='text-xl font-bold'>
            {hotelData?.pagination.total} Hotels Found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select value={sortOption} onChange={(event) => setSortOption(event.target.value)} className='p-2 border rounded-md'>
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">Price per Night (Low to High)</option>
            <option value="pricePerNightDesc">Price per Night (High to Low)</option>
          </select>
        </div>
        {hotelData?.data.map((hotel) => (<SearchResultsCard hotel={hotel}/>))}
        <div><Pagination page={hotelData?.pagination.page || 1} pages={hotelData?.pagination.pages || 1} onPageChange={(page) => setPage(page)}/></div>
      </div>
    </div>
  )
}

export default Search