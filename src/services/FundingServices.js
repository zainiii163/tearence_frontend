import Api from "../api";

export default false
  ? {
      message: "You are Offline. Please! turn on the internet",
    }
  : {
      getCampaign: (skip,limit) => {
        return Api.get(`v1/campaign?skip=${skip}&limit=${limit}`);
      },
      createCampaign: (formData) => {
        // console.log(formData , '------------------')
        return Api.post('v1/campaign', formData);
      },
    }