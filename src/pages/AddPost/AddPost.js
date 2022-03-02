import './AddPost.css'
import Select from 'react-select'
import {  useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { useNavigate } from 'react-router-dom'
import { storage } from '../../firebase/config'
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Country, State, City }  from 'country-state-city';

const categories = [
  { value: '1BHK', label: '1BHK' },
  { value: '2BHK', label: '2BHK' },
  { value: '3BHK', label: '3BHK' },
  { value: '4BHK', label: '4BHK' },
]

function AddPost() {
  const {  addDocument, response } = useFirestore(['posts'])
  const { user } = useAuthContext()  
  const navigate = useNavigate()
  const [stateName, setStateName] = useState(null)
  const [cityName, setCityName] = useState(null)
  const [sName, setSName] = useState('')


  //getting states of india
  const code = 'IN';
	const country = Country.getCountryByCode(code);
	const states = State.getStatesOfCountry(country.isoCode);
	const names = states.map((state) => {
			return {value: state.isoCode, label:state.name };
		}); 


    //getting cities
   const cities = City.getCitiesOfState(code, stateName);
    const cityNames = cities.map((city) => {
        return {value: city.name, label:city.name };
      });
  
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [formError, setFormError] = useState(null)
  const [post, setPost] = useState(null)
  const [postError, setPostError] = useState(null)
  const [isPending, setIsPending ] = useState(false)

  const handleFileChange = async (e) => {
    setPost(null)
    let selected = []
    
        for (let i = 0; i < e.target.files.length; i++){
            if (!e.target.files[i]) {
                setPostError('Please select a file')
                return
            }
            if (!e.target.files[i].type.includes('image')) {
                setPostError('Selected file must be an image')
                return
            }

            selected.push(e.target.files[i])            
        }

    
    setPostError(null)
    setPost(selected)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let images = []
     setFormError(null)
     setIsPending(true)

    if(!category){
      setFormError('Please select a category')
      setIsPending(false)
      return
    }

    if(post.length > 0){
    
        for (let i = 0; i < post.length; i++){
            const uploadPath = `posts/${user.uid}/${post[i].name}`
            const storageRef = ref(storage, uploadPath)
            await uploadBytes(storageRef, post[i])
            const imgUrl = await getDownloadURL(storageRef)
            images.push(imgUrl)
        }
        // console.log('images',images)
        // console.log('simg',selectedImg)
        // console.log('img',img)
    }
      
    const selectedImg = images
    // setPost(images)  

    const createdBy = {
      displayName: user.displayName,
      id: user.uid,
      photoURL: user.photoURL
    }

    const postDetails = {
      selectedImg,
      details,
      category: category.value,
      dueDate: Timestamp.fromDate(new Date(dueDate)),
      comments:[],
      createdBy,
      sName,
      cityName,
      isActive: true,
    }
      console.log(postDetails)
    await addDocument(postDetails)
    if(!response.error){
      navigate('/')
    }
    setIsPending(false)
  }
  return (
    <div className='create-form'>
      <h2 className="page-title">Create a Post</h2>
        <form onSubmit={handleSubmit}>
        <label>
            <span>Select House Images:</span>
            <input 
            className="custom-file-input"
            type="file" 
            multiple
            required
            onChange={handleFileChange} />
            {postError && (<div className='error'>{postError}</div>)}
        </label>
          <label>
            <span>House Details:</span>
            <textarea 
              required
              onChange={(e) => setDetails(e.target.value)}
              value={details} 
            ></textarea>
          </label>
          <div className="set1">
            <label className="date">
              <span>Set available date:</span>
              <input
                required 
                type="date" 
                onChange={(e) => setDueDate(e.target.value)} 
                value={dueDate}
              />
            </label>
            <label className="select">
              <span>House category:</span>
              <div className="select_div">
              <Select
                onChange={(option) => setCategory(option)} 
                options={categories}
              /></div>
            </label>
          </div>
          <label>
            <span>Select state:</span>
            <div className="select_div state-select"></div>
            <Select
              onChange={(option) => {setStateName(option.value); setSName(option.label)}} 
              options={names}
            />
          </label>
          {stateName && 
          <label>
            <span>Select City:</span>
            <div className="select_div state-select"></div>
            <Select
              onChange={(option) => setCityName(option.label)} 
              options={cityNames}
              />
          </label>
            }

          {!isPending && <button className='btn a-btn'>Post</button>}
		    {isPending && <button className='btn a-btn' disabled>Uploading</button>}
          {formError && <p className="error">{formError}</p> }

        </form>
    </div>
  )
}

export default AddPost
