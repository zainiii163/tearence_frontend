import Api from "../api";
import { createListingWithPosterName } from "../utils/posterHelper";

export default false
  ? {
      message: "You are Offline. Please! turn on the internet",
    }
  : {
      getAdsList: (category, skip, limit) => {
        return Api.get(
          `listing?skip=${skip}&limit=${limit}&category=${category}`
        );
      },
      getAffiliateAds: (skip, limit) => {
        return Api.get(`affiliate-programs/affiliates/business-offers?skip=${skip}&limit=${limit}`);
      },
      getAdsListFilterApi: (
        category,
        skip,
        limit,
        currencies,
        max_price,
        min_price
      ) => {
        const url = `https://api.worldwideadverts.info/api/v1/listing?skip=${skip}&limit=${limit}&category=${category}&currencies=${currencies}&max_price=${max_price}&min_price=${min_price}`;
        return fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            return {
              status: "Success",
              message: "",
              data: data,
            };
          })
          .catch((error) => {
            throw new Error(`Fetch error: ${error.message}`);
          });
      },
      createAdsList: (data, user = null, businessStore = null, storeDetail = null, isAdmin = false) => {
        // Enhanced listing data with poster information
        const enhancedData = user ? 
          createListingWithPosterName(data, user, businessStore, storeDetail, isAdmin) : 
          data;
        
        return Api.post("listing", enhancedData);
      },

      updateAds: (id, formData) => {
        return Api.put(`listing/${id}`, formData);
      },
      deleteAds: (id) => {
        return Api.delete(`listing/${id}`);
      },
      detailsAdsList: (slug) => {
        return Api.get(`listing/${slug}`);
      },
      updateFavAdsList: (id) => {
        return Api.put(`listing-favorite/${id}`);
      },
      getFeaturedAds: (skip, limit) => {
        return Api.post(`listing/featured?skip=${skip}&limit=${limit}`);
      },
      getFeaturedAdsSlide: (skip, limit) => {
        return Api.post(`listing/featured?skip=${skip}&limit=${limit}`);
      },
      getNewAds: (skip, limit) => {
        return Api.post(`listing/new?skip=${skip}&limit=${limit}`);
      },
      getNewAdsSlide: (skip, limit) => {
        return Api.post(`listing/new?skip=${skip}&limit=${limit}`);
      },
      getPromotedAds: (skip, limit) => {
        return Api.post(`listing/promoted?skip=${skip}&limit=${limit}`);
      },
            creatFavouriteAds: (data) => {
        // Ensure the payload includes the currently logged in customer_id when
        // the caller forgets to provide it (many components were passing the
        // listing owner instead). This centralizes the correct behaviour.
        const payload = Object.assign({}, data || {});
        // Always use the logged-in customer as the actor. If no customer is
        // logged in, leave the payload as-is so the backend can return a
        // proper unauthenticated error.
        const storedCustomerId = localStorage.getItem('customer_id');
        if (storedCustomerId) payload.customer_id = storedCustomerId;
        return Api.post("listing-favorite", payload);
      },
      getFavouriteAds: (skip, limit, id) => {
        const customerQuery = id ? `&customer_id=${id}` : "";
        return Api.get(`listing-favorite?skip=${skip}&limit=${limit}${customerQuery}`);
      },
      getFavouriteAdsDetail: (id) => {
        return Api.get(`listing-favorite/${id}`);
      },
      removeFabAds: (id) => {
        return Api.delete(`listing-favorite/${id}`);
      },
      getMyAds: (id, skip, limit, status) => {
        // return Api.get(`v1/listing/{1583}/my-listing?id=1583&status=active&skip=0&limit=10`)
        return Api.get(
          `listing/${id}/my-listing?id=${id}&skip=${skip}&limit=${limit}&status=${status}`
        );
      },
      getClassified: () => {
        return Api.get("classified");
      },
      getClassifiedBySlug: (slug) => {
        return Api.get(`classified/${slug}`);
      },
      getGlobalSearch: (searchData) => {
        return Api.post(`listing/global`, searchData);
      },
      getBlog: (skip, limit) => {
        return Api.get(`blog?&skip=${skip}&limit=${limit}`);
      },
      getBlogDetails: (id) => {
        return Api.get(`blog/${id}`);
      },
      getBooksList: (skip, limit) => {
        return Api.get(`book?skip=${skip}&limit=${limit}`);
      },
      getMyAdsByCategory: (id, skip, limit, category) => {
        // return Api.get(`v1/listing/{1583}/my-listing?id=1583&status=active&skip=0&limit=10`)
        return Api.get(
          `listing/${id}/my-listing?id=${id}&skip=${skip}&limit=${limit}`
        );
      },
    };
