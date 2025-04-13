// import React, { useRef, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { MdCloudUpload } from "react-icons/md";
// import JoditEditor from 'jodit-react'

// const CreateNews = () => {

//     const [show, setShow] = useState(false)
//     const editor = useRef(null)

//     const [title, setTitle] = useState('')
//     const [image, setImage] = useState('')
//     const [img, setImg] = useState('')
//     const [description, setDescription] = useState('')
//     const [loader, setLoader] = useState(false)
//     const [images, setImages] = useState([])

//     const imageHandle = (e) => {
//         const { files } = e.target
//         if (files.length > 0) {
//             setImg(URL.createObjectURL(files[0]))
//             setImage(files[0])
//         }
//     }

//     const dummySubmit = (e) => {
//         e.preventDefault()
//         console.log({ title, description, image })
//         alert("Submitted (UI only)")
//     }

//     return (
//         <div className='bg-white rounded-md shadow p-4'>
//             <div className='flex justify-between p-2 border-b mb-4'>
//                 <h2 className='text-xl font-semibold'>Add News</h2>
//                 <Link className='px-3 py-1 bg-purple-500 rounded text-white hover:bg-purple-600' to='/writer/news'>My News</Link>
//             </div>

//             <form onSubmit={dummySubmit}>
//                 <div className='flex flex-col gap-y-2 mb-6'>
//                     <label className='text-md font-medium text-gray-600' htmlFor="title">Title</label>
//                     <input
//                         required
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         type="text"
//                         placeholder='Enter news title'
//                         name='title'
//                         className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10'
//                         id='title'
//                     />
//                 </div>

//                 <div className='mb-6'>
//                     <label htmlFor="img" className='w-full h-[240px] flex rounded text-[#404040] gap-2 justify-center items-center cursor-pointer border-2 border-dashed'>
//                         {
//                             img ? <img src={img} className='w-full h-full object-cover rounded' alt='preview' />
//                                 : <div className='flex justify-center items-center flex-col gap-y-2'>
//                                     <span className='text-2xl'><MdCloudUpload /></span>
//                                     <span>Select Image</span>
//                                 </div>
//                         }
//                     </label>
//                     <input required onChange={imageHandle} className='hidden' type="file" id='img' />
//                 </div>

//                 <div className='flex flex-col gap-y-2 mb-6'>
//                     <div className='flex justify-start items-center gap-x-2'>
//                         <h2 className='text-md font-medium text-gray-600'>Description</h2>
//                         <div onClick={() => setShow(true)}>
//                             <span className='text-2xl cursor-pointer text-gray-500 hover:text-gray-700'><MdCloudUpload /></span>
//                         </div>
//                     </div>
//                     <JoditEditor
//                         ref={editor}
//                         value={description}
//                         tabIndex={1}
//                         onBlur={value => setDescription(value)}
//                         onChange={() => { }}
//                     />
//                 </div>

//                 <div className='mt-4'>
//                     <button
//                         disabled={loader}
//                         className='px-4 py-2 bg-purple-500 rounded-md text-white hover:bg-purple-600 transition'
//                     >
//                         {loader ? 'Submitting...' : 'Add News'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     )
// }

// export default CreateNews


import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdCloudUpload } from "react-icons/md";
import JoditEditor from 'jodit-react';
import axios from 'axios'; // Using axios for easier API calls

// Function to get user info from token (similar to Header)
const getUserInfoFromToken = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            // Extract relevant info - adjust keys based on your actual token payload
            return {
                id: payload.id,
                name: payload.name || payload.email?.split('@')[0] || 'Unknown Editor',
                role: payload.role
            };
        }
    } catch (error) {
        console.error('Error parsing token:', error);
    }
    return null;
};


const CreateNews = () => {
    const navigate = useNavigate();
    const editorRef = useRef(null); // Renamed from 'editor' to avoid conflict

    // State Variables
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Other'); // Default category
    const [reporter, setReporter] = useState(''); // Add state for reporter
    const [imageFile, setImageFile] = useState(null); // Store the actual File object
    const [imagePreview, setImagePreview] = useState(''); // Store the preview URL
    const [content, setContent] = useState(''); // Renamed from description for clarity
    const [editorName, setEditorName] = useState(''); // Store editor's name
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState(''); // For displaying errors

    // Get editor name on component mount
    useEffect(() => {
        const userInfo = getUserInfoFromToken();
        if (userInfo) {
            setEditorName(userInfo.name);
            // Optionally pre-fill reporter if editor is likely the reporter
            // setReporter(userInfo.name);
        } else {
            console.warn("Could not retrieve editor information from token.");
            // Handle case where user info isn't available (e.g., redirect to login)
            // navigate('/');
        }
    }, [navigate]); // Added navigate dependency

    // Handle Image Selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Basic validation (optional: check file type/size)
            if (file.type.startsWith('image/')) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
                 setError(''); // Clear previous image errors
            } else {
                 setError('Please select a valid image file (JPG, PNG, GIF, etc.).');
                 setImageFile(null);
                 setImagePreview('');
            }
        }
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        // Basic Validation
        if (!title.trim()) return setError("Title is required.");
        if (!reporter.trim()) return setError("Reporter name is required.");
        if (!content.trim()) return setError("Content/Description is required.");
        if (!imageFile) return setError("An image is required.");
        if (!editorName) return setError("Editor information is missing. Please log in again."); // Should ideally not happen if useEffect works

        setLoader(true);

        // Prepare FormData
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('content', content);
        formData.append('reporter', reporter.trim());
        formData.append('category', category);
        formData.append('editor', editorName); // Add editor name
        formData.append('mediaType', 'image'); // Hardcoded as per schema/UI
        formData.append('mediaFile', imageFile); // *** Use 'mediaFile' or the key your backend expects ***

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Authentication token not found. Please log in.");
            }

            // --- API Call ---
            // Replace '/api/news' with your actual backend endpoint
            const response = await axios.post('/news', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Axios sets this correctly with FormData, but can be explicit
                    'Authorization': `Bearer ${token}` // Send token for authentication
                }
            });

            // --- Handle Success ---
            console.log("News created successfully:", response.data);
            alert('News created successfully!'); // Replace with better notification if desired
            // Reset form or navigate away
            setTitle('');
            setCategory('Other');
            setReporter('');
            setImageFile(null);
            setImagePreview('');
            setContent('');
            editorRef.current.value = ''; // Clear Jodit editor
            // navigate('/writer/news'); // Optional: navigate to the news list

        } catch (err) {
            // --- Handle Errors ---
            console.error("Error creating news:", err);
            let errorMessage = "Failed to create news. Please try again.";
            if (err.response) {
                // Error from backend (e.g., validation error)
                errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
                 if (err.response.status === 401 || err.response.status === 403) {
                     errorMessage += " Please check your login session.";
                     // Optionally redirect to login: navigate('/');
                 }
            } else if (err.request) {
                // No response received from server
                errorMessage = "Could not connect to the server. Please check your network.";
            } else {
                 // Error setting up the request
                 errorMessage = err.message || errorMessage;
            }
             setError(errorMessage);
             alert(`Error: ${errorMessage}`); // Replace with better notification

        } finally {
            setLoader(false);
        }
    };

    return (
        <div className='bg-white rounded-md shadow p-4'>
            <div className='flex justify-between p-2 border-b mb-4'>
                <h2 className='text-xl font-semibold'>Add News</h2>
                <Link className='px-3 py-1 bg-purple-500 rounded text-white hover:bg-purple-600' to='/writer/news'>My News</Link>
            </div>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Title Input */}
                <div className='flex flex-col gap-y-2 mb-6'>
                    <label className='text-md font-medium text-gray-600' htmlFor="title">Title</label>
                    <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder='Enter news title'
                        name='title'
                        className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10'
                        id='title'
                    />
                </div>

                {/* Reporter Input */}
                <div className='flex flex-col gap-y-2 mb-6'>
                    <label className='text-md font-medium text-gray-600' htmlFor="reporter">Reporter Name</label>
                    <input
                        required
                        value={reporter}
                        onChange={(e) => setReporter(e.target.value)}
                        type="text"
                        placeholder='Enter reporter name'
                        name='reporter'
                        className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10'
                        id='reporter'
                    />
                </div>

                 {/* Category Select */}
                 <div className='flex flex-col gap-y-2 mb-6'>
                    <label className='text-md font-medium text-gray-600' htmlFor="category">Category</label>
                    <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        name='category'
                        className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10 bg-white'
                        id='category'
                    >
                         {/* Options based on your Schema Enum */}
                        <option value="Politics">Politics</option>
                        <option value="Sports">Sports</option>
                        <option value="Technology">Technology</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Image Upload */}
                <div className='mb-6'>
                     <label className='text-md font-medium text-gray-600 mb-2 block' htmlFor="img">Featured Image</label>
                    <label htmlFor="img" className='w-full h-[240px] flex rounded text-[#404040] gap-2 justify-center items-center cursor-pointer border-2 border-dashed hover:border-indigo-500 transition-all duration-300'>
                        {
                            imagePreview ? <img src={imagePreview} className='w-full h-full object-cover rounded' alt='preview' />
                                : <div className='flex justify-center items-center flex-col gap-y-2'>
                                    <span className='text-4xl text-gray-400'><MdCloudUpload /></span>
                                    <span className='text-gray-500'>Select Image (JPG, PNG, etc.)</span>
                                </div>
                        }
                    </label>
                    <input required onChange={handleImageChange} className='hidden' type="file" id='img' accept="image/*" /> {/* Added accept attribute */}
                </div>

                {/* Content/Description Editor */}
                <div className='flex flex-col gap-y-2 mb-6'>
                    <label className='text-md font-medium text-gray-600'>Content / Description</label>
                    {/* Removed the extra MdCloudUpload icon here as it wasn't functional */}
                    <JoditEditor
                        ref={editorRef}
                        value={content}
                        tabIndex={1}
                        // Use onBlur or onChange based on preference. onBlur is less frequent.
                        onBlur={newContent => setContent(newContent)}
                        // Or use onChange if you need immediate updates:
                        // onChange={newContent => setContent(newContent)}
                    />
                </div>

                {/* Submit Button */}
                <div className='mt-4'>
                    <button
                        type="submit" // Explicitly set type to submit
                        disabled={loader}
                        className={`px-4 py-2 rounded-md text-white transition-all duration-300 ${loader ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'}`}
                    >
                        {loader ? 'Submitting...' : 'Add News'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateNews;