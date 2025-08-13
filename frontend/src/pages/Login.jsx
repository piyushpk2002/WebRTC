import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const { setAuthUser } = useAuthStore();
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) =>{
        e.preventDefault();
        setAuthUser(userId)
        navigate('/home')
    }

  return (
    <div className='w-screen h-screen flex justify-center items-center flex-col'>
        <h1 className='text-black text-bold font-mono'>Login</h1>
        <form onSubmit = {handleSubmit} className='flex flex-col p-4 items-center justify-center'>
            <input 
            type='text'
            onChange={(e) => setUserId(e.target.value)}
            className='p-4 w-40 h-10 border border-8 border-purple rounded-sm'
            />
            <button type="submit" className='w-20 h-10 mt-4 bg-blue-800 font-mono text-white text-bold'>Submit</button>
        </form>
    </div>
  )
}

export default Login