import ImageKit from "imagekit";

import { v4 as uuidv4 } from 'uuid';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Upload multiple images and return array of URLs
async function uploadImage({ buffer, folder = '/products' }) {
    const res = await imagekit.upload({
        file: buffer.toString('base64'),
        fileName: uuidv4(),
        folder
    })
    return {
        url: res.url,
        thumbnail: res.thumbnailUrl || res.url,
        id: res.fileId
    }
}

export default uploadImage