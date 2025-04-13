import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdCloudUpload } from "react-icons/md";
import JoditEditor from 'jodit-react';
import axios from 'axios';

const getUserInfoFromToken = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
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
    const editorRef = useRef(null);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Other');
    const [reporter, setReporter] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [content, setContent] = useState('');
    const [editorName, setEditorName] = useState('');
    const [loader, setLoader] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const userInfo = getUserInfoFromToken();
        if (userInfo) {
            setEditorName(userInfo.name);
        }
    }, [navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
                setError('');
            } else {
                setError('Please select a valid image file (JPG, PNG, GIF, etc.).');
                setImageFile(null);
                setImagePreview('');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) return setError("Title is required.");
        if (!reporter.trim()) return setError("Reporter name is required.");
        if (!content.trim()) return setError("Content/Description is required.");
        if (!imageFile) return setError("An image is required.");
        if (!editorName) return setError("Editor information is missing. Please log in again.");

        setLoader(true);

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('content', content);
        formData.append('reporter', reporter.trim());
        formData.append('category', category);
        formData.append('editor', editorName);
        formData.append('mediaType', 'image');
        formData.append('mediaFile', imageFile);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Authentication token not found. Please log in.");

            const response = await axios.post('https://newshive-express-1.onrender.com/news', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('News created successfully!');
            setTitle('');
            setCategory('Other');
            setReporter('');
            setImageFile(null);
            setImagePreview('');
            setContent('');
            editorRef.current.value = '';

        } catch (err) {
            let errorMessage = "Failed to create news. Please try again.";
            if (err.response) {
                errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
                if (err.response.status === 401 || err.response.status === 403) {
                    errorMessage += " Please check your login session.";
                }
            } else if (err.request) {
                errorMessage = "Could not connect to the server. Please check your network.";
            } else {
                errorMessage = err.message || errorMessage;
            }
            setError(errorMessage);
            alert(`Error: ${errorMessage}`);
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

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
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
                        <option value="Politics">Politics</option>
                        <option value="Sports">Sports</option>
                        <option value="Technology">Technology</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className='mb-6'>
                    <label className='text-md font-medium text-gray-600 mb-2 block' htmlFor="img">Featured Image</label>
                    <label htmlFor="img" className='w-full h-[240px] flex rounded text-[#404040] gap-2 justify-center items-center cursor-pointer border-2 border-dashed hover:border-indigo-500 transition-all duration-300'>
                        {
                            imagePreview ? (
                                <img src={imagePreview} className='w-full h-full object-cover rounded' alt='preview' />
                            ) : (
                                <div className='flex justify-center items-center flex-col gap-y-2'>
                                    <span className='text-4xl text-gray-400'><MdCloudUpload /></span>
                                    <span className='text-gray-500'>Select Image (JPG, PNG, etc.)</span>
                                </div>
                            )
                        }
                    </label>
                    <input required onChange={handleImageChange} className='hidden' type="file" id='img' accept="image/*" />
                </div>

                <div className='flex flex-col gap-y-2 mb-6'>
                    <label className='text-md font-medium text-gray-600'>Content / Description</label>
                    <JoditEditor
                        ref={editorRef}
                        value={content}
                        tabIndex={1}
                        onBlur={newContent => setContent(newContent)}
                    />
                </div>

                <div className='mt-4'>
                    <button
                        type="submit"
                        disabled={loader}
                        className={`px-4 py-2 rounded-md text-white transition-all duration-300 ${loader ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600'}`}
                    >
                        {loader ? 'Submitting...' : 'Add News'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateNews;
