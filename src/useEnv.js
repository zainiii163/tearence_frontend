const APiData = {
  GoogleApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  baseUrl:
    process.env.REACT_APP_API_URL ||
    process.env.REACT_APP_API_BASE_URL ||
    "https://api.worldwideadverts.info/api/v1",
};

export default APiData;
