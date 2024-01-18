//import React from 'react';
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from '../api-client';
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/Appcontext";

const EditHotel = () => {
    const { hotelId } = useParams();
    const {showToast} = useAppContext();
    const { data: hotel } = useQuery("fetchMyHotelsById", () => apiClient.fetchMyHotelsById(hotelId || ''), { enabled: !!hotelId });

    const {mutate, isLoading} = useMutation(apiClient.updateMyHotelById, {
        onSuccess: () => {showToast({message: "Hotel Saved!", type: "SUCCESS"})},
        onError: () => {showToast({message: "Error saving Hotel", type: "ERROR"})}
    })

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    };

    return (
        <div>
            <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading} />
        </div>
    );
};

export default EditHotel;



