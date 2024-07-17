import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { set } from 'mongoose';

/**
 * CreateListing Component
 *
 * This component allows users to create a new listing with image uploads.
 * It manages form data, handles image uploads, and manages upload errors.
 * 
 * Key States:
 * - files: Holds the files selected for upload.
 * - formData: Holds the form data including image URLs.
 * - imageUploadError: Tracks any errors that occur during the image upload process.
 * - uploading: Indicates if the upload process is currently in progress.
 * 
 * Key Functions:
 * - handleImageSubmit: Handles the submission of images, uploading them to Firebase Storage and updating the form data.
 */
export default function CreateListing() {
  // State to hold selected files for upload
  const [files, setFiles] = useState([]);
  // State to hold form data, initializing with an empty array for image URLs
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  // State to track image upload errors
  const [imageUploadError, setImageUploadError] = useState(false);
  // State to indicate if the upload process is in progress
  const [uploading, setUploading] = useState(false);
  // Log form data for debugging purposes
  console.log(formData);

  /**
   * Handles the image submission process.
   * 
   * This function performs the following steps:
   * 1. Validates the number of files selected and the total number of images.
   * 2. Sets the uploading state to true and clears any previous errors.
   * 3. Creates an array of promises, each representing the upload of a file to Firebase Storage.
   * 4. Uses Promise.all to wait for all uploads to complete.
   * 5. Updates the formData state with the URLs of the uploaded images if successful.
   * 6. Handles errors by setting the appropriate error message and resetting the uploading state.
   * 
   * @param {Event} e - The event object from the form submission.
   */
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false); // Clear any previous upload errors
      const promises = []; // Initialize an array to hold upload promises

      // Create a promise for each file upload
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i])); // Add the upload promise to the array
      }

      // Wait for all upload promises to resolve
      Promise.all(promises)
        // On success, update form data with new image URLs
        .then((urls) => {
          setFormData({
            ...formData, // Spread existing form data
            imageUrls: formData.imageUrls.concat(urls), // Add new image URLs
          });
          setImageUploadError(false); // Clear any errors
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 MB max per image)');
          setUploading(false);
        });
    } else {
      // If no files to upload or image limit exceeded, set an error message
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false); // Set uploading state to false
    }
  };

  /**
  * Uploads a file to Firebase Storage and returns a promise that resolves with the download URL.
  *
  * This function performs the following steps:
  * 1. Generates a unique file name by combining the current timestamp with the original file name.
  * 2. Creates a reference (path/address) in Firebase Storage where the file will be stored.
  * 3. Starts the file upload to the specified location and monitors the upload progress.
  * 4. Resolves the promise with the download URL once the upload is complete.
  * 5. Rejects the promise if an error occurs during the upload.
  *
  * @param file (File) - The file to be uploaded.
  * @returns Promise<string> - A promise that resolves with the download URL of the uploaded file.
  */
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      // Step 1: Get Firebase Storage instance
      const storage = getStorage(app);

      // Step 2: Generate a unique file name by combining the current timestamp with the original file name
      // This creates a unique identifier for the file, preventing naming conflicts
      const fileName = new Date().getTime() + file.name;

      // Step 3: Create a reference (address) to the file's location in Firebase Storage
      // A reference is like an address pointing to where the file will be stored in the storage system
      // Aha Moment: This is similar to memory allocation and addressing in computer science, instead, we create a unique path to store data
      const storageRef = ref(storage, fileName);

      // Step 4: Start the file upload to the specified location
      // uploadBytesResumable starts the upload and allows us to monitor its progress
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Step 5: Set up listeners to monitor the file upload process
      uploadTask.on(
        'state_changed', // Listen for changes in the upload state
        (snapshot) => {  // Progress handler: Called periodically during the upload
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => { // Error handler: Called if an error occurs during the upload
          reject(error); // Reject the promise if an error occurs, passing the error to the caller 
        },
        () => {
          // Get the download URL once the upload is complete and resolve the promise with this URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL); // Resolve the promise with the download URL
          });
        }
      );
    });
  };

  /**
  * Removes an image URL from the imageUrls array in the formData state based on the specified index.
  *
  * This function uses the filter method to create a new array that includes all image URLs except
  * the one at the specified index. It then updates the formData state with this new array, ensuring
  * that the original array remains unchanged and the state is immutably updated.
  *
  * Parameters:
  *   index (number) - The index of the image URL to be removed from the imageUrls array.
  *
  * Example:
  *   If formData.imageUrls is ['img1.jpg', 'img2.jpg', 'img3.jpg'] and index is 1,
  *   the new array will be ['img1.jpg', 'img3.jpg'] as 'img2.jpg' at index 1 is removed.
  * 
  * In plain English, (_, i) => i !== index means:
	*	“For each element in the array, take its index i, then check if i is not equal to the specified index. 
  *  If it is not equal, keep the element; otherwise, exclude it.”
  */
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  // JSX code here:
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' id='sale' className='w-5' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5' />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='offer' className='w-5' />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='discountPrice'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Discounted price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e) => setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type='file'
              id='images'
              accept='image/*'
              multiple
            />
            <button
              type='button'
              disabled={uploading}
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}