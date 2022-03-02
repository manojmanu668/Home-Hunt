import { useReducer, useEffect, useState } from "react"
import { db } from "../firebase/config"
import { collection, addDoc, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore'

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, success: false, error: null }
    case 'ADDED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null }
    case 'DELETED_DOCUMENT':
      return { isPending: false, document: null, success: true, error: null }
    case 'UPDATED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null }
    case 'ERROR':
      return { isPending: false, document: null, success: false, error: action.payload }
    default:
      return state
  }
}

export const useFirestore = (collectionName) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  const [isCancelled, setIsCancelled] = useState(false)

  // collection ref
  const ref = collection(db, ...collectionName)

  // only dispatch is not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  // add a document
  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' })
    console.log(doc)
    try {
      const addedDocument = await addDoc( ref, { ...doc, createdAt: serverTimestamp()})
      dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
    }
    catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
      console.log(err.message)
    }
  }

  // delete a document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      console.log('Delete doc id',id)
      const ref = doc(db, ...collectionName, id)
      await deleteDoc(ref)
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
    }
    catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' })
    }
  }

  //update comment
  const updateDocument = async (id, updates) => {
    dispatch({ type: 'IS_PENDING'})
    console.log(id,'doc to update',updates)
    try {
      const ref = doc(db, ...collectionName, id)
      const updatedDocument = await updateDoc(ref, updates )     
      dispatchIfNotCancelled({ type:'UPDATED_DOCUMENT', payload: updatedDocument})
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message})
      return null
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { addDocument, deleteDocument,updateDocument, response }

}
