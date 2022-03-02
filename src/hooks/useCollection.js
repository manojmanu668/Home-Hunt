import { useEffect, useState, useRef } from "react"
import { db } from "../firebase/config"
import { query, where, orderBy, collection, onSnapshot } from "firebase/firestore";

export const useCollection = (_c, _q, _odrBy) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)
  // if we don't use a ref --> infinite loop in useEffect
  // _query is an array and is "different" on every function call
  const c = useRef(_c).current
  const q = useRef(_q).current
  const odrBy = useRef(_odrBy).current
  
  useEffect(() => {
    let ref = collection(db, ...c)
    console.log(c,q,odrBy)
    if(q && odrBy){
        ref = query(ref, where(...q), orderBy(...odrBy))
    }
    else if (q) {
      ref = query(ref, where(...q))     //ref.where(...query)
    }
    else if(odrBy) {
      ref = query(ref, orderBy(...odrBy))        //ref.orderBy(...orderBy)
    }

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({...doc.data(), id: doc.id})
      });
      
      // update state
      setDocuments(results)
      setError(null)
    }, error => {
      console.log(error)
      setError('could not fetch the data')
    })

    // unsubscribe on unmount
    return () => unsubscribe()

  }, [collection, query, orderBy])

  return { documents, error }
}