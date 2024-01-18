//import React from 'react'

import { hotelFacilities } from "../config/hotel-options-config";

type Props = {
    seletedFacilities: string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FacilitiesFilter = ({seletedFacilities, onChange}: Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">
        <h4 className="text-md font-semibold mb-2">Facilities</h4>
        {hotelFacilities.map((hotelFacility) => (
            <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" value={hotelFacility} checked={seletedFacilities.includes(hotelFacility)} onChange={onChange}/>
                <span>{hotelFacility}</span>
            </label>
        ))}
    </div>
  )
}

export default FacilitiesFilter









