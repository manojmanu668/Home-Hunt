import './App.css';
import { BrowserRouter, Link, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import Navbar from './components/Navbar';
import { useAuthContext } from './hooks/useAuthContext'
import Sidebar from './components/Sidebar';
import Profile from './pages/Profile/Profile' 
import AddPost from './pages/AddPost/AddPost';
import Chats from './pages/Chats/Chats';
import OnlineUsers from './components/OnlineUsers';
import Saved from './components/Saved'


function App() {
  const { user, authIsReady } = useAuthContext()
  return (
    <div className="App">
      { authIsReady && ( 
      <BrowserRouter>
        {user && <Sidebar/>}
        <div className="container"> 
        {!user && <Navbar /> }
        <Routes>
          <Route path='/' element={!user ? <Navigate to="/login"/> : <Dashboard/>}/>
          <Route path='/login' element={user ? <Navigate to="/"/> : <Login/>}/>
          <Route path='/signup' element={!user ? <Signup/> : <Navigate to="/"/>}/>
          <Route path='/profile/:id' element={!user ? <Navigate to="/login"/> : <Profile /> }/>
          <Route path='/addpost' element={!user ? <Navigate to="/login"/> : <AddPost /> }/>
          <Route path='/chats/*' element={!user ? <Navigate to="/login"/> : <Chats /> }/>
          <Route path='/saved/:id' element={!user ? <Navigate to="/login"/> : <Saved /> }/>
        </Routes>
        </div>
        {user && <OnlineUsers/>}
      </BrowserRouter>
      )}
    </div>
  );
}

export default App;
