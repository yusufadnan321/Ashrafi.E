/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @returns {Promise<Object>} - Returns {url, publicId}
 */
export const uploadToCloudinary = async (file) => {
  const cloudName = 'dirtzafyi';
  const uploadPreset = 'Ashrafi Engineers';
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary image URL
 * @returns {string|null} - Public ID or null
 */
export const extractPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    
    const pathParts = parts[1].split('/');
    const startIdx = pathParts[0].startsWith('v') ? 1 : 0;
    const publicIdParts = pathParts.slice(startIdx);
    
    const lastPart = publicIdParts[publicIdParts.length - 1];
    const withoutExt = lastPart.substring(0, lastPart.lastIndexOf('.')) || lastPart;
    publicIdParts[publicIdParts.length - 1] = withoutExt;
    
    return publicIdParts.join('/');
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

/**
 * Delete image from Cloudinary
 * NOTE: Currently logs deletion - requires backend for actual deletion
 * @param {string} imageUrl - Cloudinary image URL
 * @returns {Promise<boolean>} - Success status
 */
export const deleteFromCloudinary = async (imageUrl) => {
  const publicId = extractPublicId(imageUrl);
  
  if (!publicId) {
    console.warn('Could not extract public_id from URL:', imageUrl);
    return false;
  }
  
  console.log('🗑️ Image marked for deletion from Cloudinary:', publicId);
  
  // TODO: For production, implement backend endpoint for secure deletion
  // Cloudinary delete requires API Secret (never expose in frontend)
  
  return true;
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {boolean} - True if valid
 */
export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
    return false;
  }
  
  if (file.size > maxSize) {
    alert('Image size must be less than 5MB');
    return false;
  }
  
  return true;
};
