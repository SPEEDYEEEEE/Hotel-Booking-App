//import React from 'react';
import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/Appcontext";
import * as apiClient from '../api-client';

const AddHotels = () => {

    const {showToast} = useAppContext();
    const {mutate, isLoading} = useMutation(apiClient.addMyHotel, {
        onSuccess: () => {
            showToast({message: "Hotel Info Saved!", type: "SUCCESS"})
        },
        onError: () => {
            showToast({message: "Error Saving Hotel Info", type: "ERROR"})
        },
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData)
    };

  return <ManageHotelForm onSave={handleSave} isLoading={isLoading}/>;
  
};

export default AddHotels