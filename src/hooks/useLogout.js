import { useEffect, useState } from 'react'
import { auth,db } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { updateDoc, doc } from 'firebase/firestore'

export const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch, user } = useAuthContext()
  
  const logout = async () => {
    setError(null)
    setIsPending(true)
    try {
      // sign the user out
      const { uid } = user
      await updateDoc(doc(db, 'users', `${uid}`), { online: false })
      
      await auth.signOut()
      
      console.log('logout db triggerd',user)
      // dispatch logout action
      dispatch({ type: 'LOGOUT' }).then(
        console.log('logout Ab triggerd',user)
      )
      
      // update state
      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      } 
      setIsPending(false)
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { logout, error, isPending }
}