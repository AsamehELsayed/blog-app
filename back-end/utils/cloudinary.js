const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_APP_NAME,
    api_key:process.env.CLOUDINARY_APP_KEY,
    api_secret:process.env.CLOUDINARY_APP_SECRET
})

const cloudinaryUploadImage=async(fileToUpload)=>{
    try {
        const data=await cloudinary.uploader.upload(fileToUpload,
            {resource_type:"auto"})
            return data
    } catch (error) {
        throw new Error("error")
    }
}
const cloudinaryRemoveImage = async (publicId) => {
    try {
        console.log(publicId)
        const data = await cloudinary.uploader.destroy(publicId);
        console.log("Image removed from Cloudinary:", data);
        return data;
    } catch (error) {
        console.error("Failed to remove image from Cloudinary:", error);
        throw new Error(error);
    }
};
const cloudinaryRemovAllImages=async(publicId)=>{
    try {
        const data=await cloudinary.v2.api.delete_resources(publicId)
            return data
    } catch (error) {
        return error
    }
}


module.exports={
    cloudinaryUploadImage,cloudinaryRemoveImage,cloudinaryRemovAllImages
}