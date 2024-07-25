import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'da49azful',
    api_key: process.env.CLOUDINARY_API_KEY || 753652499695798,
    api_secret: process.env.CLOUDINARY_API_SECRET || 'ur_k20_XlzwlVgyF2La7JPqT44U',
  });


  export default cloudinary