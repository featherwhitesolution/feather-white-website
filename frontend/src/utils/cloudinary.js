export const optimizeCloudinaryUrl = (url, transformations = 'q_auto,f_auto') => {
  if (!url || typeof url !== 'string') {
    return url;
  }

  // Clean up legacy localhost URLs that might be in the database
  let cleanUrl = url.replace('http://localhost:5000', '');

  if (cleanUrl.includes('images.unsplash.com')) {
    // Unsplash uses query params for transformations
    // Replace existing w and q params or append them
    let urlObj = new URL(cleanUrl);
    
    // Parse transformations string (e.g., 'w_1080,q_50,f_auto')
    const tParts = transformations.split(',');
    tParts.forEach(part => {
        if (part.startsWith('w_')) urlObj.searchParams.set('w', part.split('_')[1]);
        if (part.startsWith('q_')) urlObj.searchParams.set('q', part.split('_')[1]);
    });
    
    return urlObj.toString();
  }

  if (!cleanUrl.includes('cloudinary.com')) {
    return cleanUrl;
  }

  // Ensure HTTPS for Cloudinary
  if (cleanUrl.startsWith('http://res.cloudinary.com')) {
    cleanUrl = cleanUrl.replace('http://', 'https://');
  }

  // Cloudinary URL format: https://res.cloudinary.com/[cloud_name]/image/upload/[transformations]/[version]/[public_id].[extension]
  if (cleanUrl.includes('/upload/')) {
    const parts = cleanUrl.split('/upload/');
    let afterUpload = parts[1];
    
    // Break the path into segments
    const pathSegments = afterUpload.split('/');
    
    // Check if the very first segment is a transformation block.
    // Cloudinary transformations contain underscores and commas, e.g., 'c_fill,w_500'. 
    // They do NOT start with 'v' followed by numbers (which is the version tag).
    const isTransformation = pathSegments[0].includes('_') && 
                             !/^v\d+$/.test(pathSegments[0]) && 
                             /^[a-z]+_/.test(pathSegments[0]);
                             
    if (isTransformation) {
        // Discard the old transformation block
        pathSegments.shift();
    }
    
    // Rebuild the URL with OUR strict optimizations to prevent huge image lag
    return `${parts[0]}/upload/${transformations}/${pathSegments.join('/')}`;
  }

  return cleanUrl;
};
