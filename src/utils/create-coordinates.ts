import axios from "axios";

import { geoKey } from "../config/config";

const createCoordinates = async (location: string) => {
  const result = await axios
    .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${geoKey}`)
    .then((response) => {
      const data = response.data;
      return data.results[0].geometry.location;
    })
    .catch(() => {});
  return result;
};

export default createCoordinates;
