import { db } from "../firebase/config"
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react"

export const useDocument = (collectionName, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  //realtime data of document
  useEffect(() => {
        const ref = doc(db, collectionName, id)

        const unsub = onSnapshot(ref, (snapshot) => {
            if (snapshot.data()){
                setDocument({...snapshot.data(), id: snapshot.id})
                setError(null)
            } else {
                setError('no such document exists')
            }
            
        },(err) => {
            console.log(err.message)
            setError('failed to get document')
        })

        return () => unsub()
      
  }, [collectionName, id])

  return { document, error }
}