import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';

const CaregiverList = () => {
  const { users, getAllUsers, aToken } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllUsers(); // Fetch users when the component mounts and aToken is available
    } else {
      toast.error("Admin token missing. Please login.");
    }
  }, [aToken, getAllUsers]);

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium text-gray-600'>All Users</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {users.length > 0 ? (
          users.map((user, index) => (
            <div className='border border-indigo-300 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
              <img
                className='bg-indigo-100 group-hover:bg-primary transition-all duration-500'
                src={user.image || 'https://via.placeholder.com/150'}
                alt={`${user.name}'s profile`}
              />
              <div className='p-4'>
                <p className='text-neutral-800 text-lg font-medium'>{user.name}</p>
                <p className='text-zinc-600 text-sm'>{user.email}</p>
                <p className='text-zinc-600 text-sm'>Role: {user.role || 'Patient'}</p>
                <p className='text-zinc-600 text-sm'>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-gray-500'>No user found.</p>
        )}
      </div>
    </div>
  );
};

export default CaregiverList;
