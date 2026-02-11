// customLibreTranslateBackend.js
import { BackendModule } from 'i18next';
import axios from 'axios';

const LIBRETRANSLATE_API_URL = 'https://libretranslate.com/translate';

const customLibreTranslateBackend: BackendModule = {
  type: 'backend',

  read: async function (language, namespace, callback) {
    try {
      const response = await axios.post(LIBRETRANSLATE_API_URL, {
        q: ['Hello', 'World'], // Example text to translate
        source: 'en', // Source language
        target: language, // Target language
      });

      if (response.status === 200) {
        const translations = response.data.translations.reduce((acc, translation, index) => {
          acc[`key${index + 1}`] = translation.translatedText;
          return acc;
        }, {});

        callback(null, translations);
      } else {
        callback(new Error('Failed to fetch translations'), null);
      }
    } catch (error) {
      callback(error, null);
    }
  }
};

export default customLibreTranslateBackend;
