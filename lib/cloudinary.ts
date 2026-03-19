const CLOUD_NAME = 'da2qwsrbv';
const API_KEY = '712369776222516';
const API_SECRET = '3uw0opJfkdYDp-XQsXclVIcbbKQ';

async function generateSignature(timestamp: number, params: Record<string, any> = {}): Promise<string> {
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');

    const str = `${sortedParams ? sortedParams + '&' : ''}timestamp=${timestamp}${API_SECRET}`;

    const msgUint8 = new TextEncoder().encode(str);
    const hashBuffer = await window.crypto.subtle.digest('SHA-1', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
        throw new Error('Cloudinary credentials not found.');
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateSignature(timestamp);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message);
    }

    return data.secure_url;
};

export const uploadFileToCloudinary = async (file: File): Promise<{ url: string; type: string; size: number }> => {
    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
        throw new Error('Cloudinary credentials not found.');
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateSignature(timestamp);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);

    // Determine resource type based on file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const resourceType = isImage ? 'image' : isVideo ? 'video' : 'raw';

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message);
    }

    return {
        url: data.secure_url,
        type: resourceType,
        size: data.bytes
    };
};

