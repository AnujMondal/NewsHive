import React from 'react';

const Profile = () => {
    return (
        <div className='w-full grid grid-cols-2 gap-x-6 mt-5'>
            {/* Profile Section */}
            <div className='bg-white gap-x-3 p-6 rounded flex justify-center items-center'>
                <div>
                    {/* Displaying Female Admin SVG */}
                    <img
                        src="https://img.icons8.com/glyph-neue/64/admin-settings-female.png" 
                        alt="Admin Avatar"
                        className="w-[150px] h-[150px] rounded-full border-2 border-gray-300"
                    />
                </div>
                <div className='text-[#404040] flex flex-col gap-y-1 justify-center items-start'>
                    <span><strong>Name:</strong> Nandini Kapil</span>
                    <span><strong>Email:</strong> nandini@gmail.com</span>
                    <span><strong>Category:</strong> All</span>
                    <span><strong>Role:</strong> Admin</span>
                </div>
            </div>

            {/* Change Password Section */}
            <div className='bg-white px-6 py-4 text-[#404040]'>
                <h2 className='pb-3 text-center font-semibold text-lg'>Change Password</h2>

                <form>
                    <div className='grid grid-cols-1 gap-y-5 mb-3'>
                        <div className='flex flex-col gap-y-2'>
                            <label className='text-md font-medium text-gray-600' htmlFor="old_password">Old Password</label>
                            <input type="password" placeholder='Old Password' name='old_password' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10' id='old_password' />
                        </div>

                        <div className='flex flex-col gap-y-2'>
                            <label className='text-md font-medium text-gray-600' htmlFor="new_password">New Password</label>
                            <input type="password" placeholder='New Password' name='new_password' className='px-3 py-2 rounded-md outline-0 border border-gray-300 focus:border-green-500 h-10' id='new_password' />
                        </div>
                    </div>

                    <div className='mt-4 text-center'>
                        <button className='px-4 py-2 bg-purple-500 rounded text-white hover:bg-purple-600 transition-all'>Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;