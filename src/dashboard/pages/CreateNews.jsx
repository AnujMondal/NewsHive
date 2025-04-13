import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdCloudUpload } from "react-icons/md";
import JoditEditor from 'jodit-react'

const CreateNews = () => {

    const [show, setShow] = useState(false)
    const editor = useRef(null)

    const [title, setTitle] = useState('')
    const [image, setImage] = useState('')
    const [img, setImg] = useState('')
    const [description, setDescription] = useState('')
    const [loader, setLoader] = useState(false)
    const [images, setImages] = useState([])

    const imageHandle = (e) => {
        const { files } = e.target
        if (files.length > 0) {
            setImg(URL.createObjectURL(files[0]))
            setImage(files[0])
        }
    }

    const dummySubmit = (e) => {
        e.preventDefault()
        console.log({ title, description, image })
        alert("Submitted (UI only)")
    }

    return (
        <div className='bg-white rounded-md shadow p-4'>
            <div className='flex justify-between p-2 border-b mb-4'>
                <h2 className='text-xl font-semibold'>Add News</h2>
                <Link className='px-3 py-1 bg-purple-500 rounded text-white hover:bg-purple-600' to='/writer/news'>My News</Link>
            </div>

            <form onSubmit={dummySubmit}>
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

                <div className='mb-6'>
                    <label htmlFor="img" className='w-full h-[240px] flex rounded text-[#404040] gap-2 justify-center items-center cursor-pointer border-2 border-dashed'>
                        {
                            img ? <img src={img} className='w-full h-full object-cover rounded' alt='preview' />
                                : <div className='flex justify-center items-center flex-col gap-y-2'>
                                    <span className='text-2xl'><MdCloudUpload /></span>
                                    <span>Select Image</span>
                                </div>
                        }
                    </label>
                    <input required onChange={imageHandle} className='hidden' type="file" id='img' />
                </div>

                <div className='flex flex-col gap-y-2 mb-6'>
                    <div className='flex justify-start items-center gap-x-2'>
                        <h2 className='text-md font-medium text-gray-600'>Description</h2>
                        <div onClick={() => setShow(true)}>
                            <span className='text-2xl cursor-pointer text-gray-500 hover:text-gray-700'><MdCloudUpload /></span>
                        </div>
                    </div>
                    <JoditEditor
                        ref={editor}
                        value={description}
                        tabIndex={1}
                        onBlur={value => setDescription(value)}
                        onChange={() => { }}
                    />
                </div>

                <div className='mt-4'>
                    <button
                        disabled={loader}
                        className='px-4 py-2 bg-purple-500 rounded-md text-white hover:bg-purple-600 transition'
                    >
                        {loader ? 'Submitting...' : 'Add News'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateNews