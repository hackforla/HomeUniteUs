import * as React from "react";
import { useParams } from 'react-router-dom';
import { useHostHomeData } from "../../data/data-context";
import { Guest } from "../../models";
import GeneralInfo from "./GeneralInfo"

export const Profile = () => {

  const { id } = useParams();
  const { data } = useHostHomeData();

  const guest = data.guests.find((guest: Guest) => guest.id === parseInt(id || '-1')) as Guest;

  return (
    <div>
      <GeneralInfo guest={guest} />
    </div>
  )
};

export default Profile;
