import React,{ useState, useEffect} from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { MdModeEditOutline } from 'react-icons/md';
import './styles/UpdateForm.css'
import Select from 'react-select'
import { Country, State, City }  from 'country-state-city'; 
import { MdOutlineCancel } from 'react-icons/md';
import { AiFillEdit } from 'react-icons/ai';
import { useUpdate } from '../hooks/useUpdate'
import { useFirestore } from '../hooks/useFirestore'

function UpdateForm({update, data}) {
    const { user } = useAuthContext()   
    const img = React.createRef()
    const [file, setFile] = useState(user.photoURL)
    const [name, setName] = useState(user.displayName)
    const [email, setEmail] = useState(user.email)  
    const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber ? data.phoneNumber : null)
    const [stateName, setStateName] = useState(data.stateCode ? data.stateCode : null)
    const [imgUrl, setimgUrl] = useState(user.photoURL)
    const [cityName, setCityName] = useState(data.cityName ? data.cityName : null)
    const [citiesList, setCitiesList] = useState(null)
    const [sName, setSName] = useState(data.stateName ? data.stateName : null)
    const [profilePic, setProfilePic] = useState(null)
    const [profilePicError, setProfilePicError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [stateList, setStateList] = useState(null)

    const {UpdateEmail, UpdateDisplayName, UpdateImg, err } = useUpdate()
    const { updateDocument,response } = useFirestore(['users'])
  
    useEffect(() => {
        if(data.stateCode){
            setStateName(data.stateCode)
        } 
        if(data.cityName){
            setCitiesList({ label:`${data.cityName}` })
        }
        if(data.stateName && data.stateCode){
            setStateList({value: `${data.stateCode}`, label:`${data.stateName}` })
        }
    }, [])
    
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

console.log(stateName)
console.log(sName)
console.log(cityNames)
console.log(citiesList)



    const handleFile = () => {
        img.current.click()
    }

    const handleChange = (e) => {
        setProfilePic(null)
        let selected = e.target.files[0]
    
        if (!selected) {
          setProfilePicError('Please select a file')
          return
        }
        if (!selected.type.includes('image')) {
          setProfilePicError('Selected file must be an image')
          return
        }
        
        setProfilePic(selected)
        setProfilePicError(null)
        console.log('thumbnail updated')
        setFile(
           URL.createObjectURL(e.target.files[0])
        )
      }

    const getImgUrl = (link) => {
        setimgUrl(link)
    }

    const handleSubmit = async () => {
        setIsPending(true)
        
        if(email){
            await UpdateEmail(email)
        }

        if(profilePic){
            await UpdateImg(profilePic)
        }

        if(name){
            await UpdateDisplayName(name)
        }

        const updates = {
            displayName: name,
            email: email,
            phoneNumber: phoneNumber,
            stateName: sName,
            stateCode: stateName,
            cityName: cityName,
        }

        await updateDocument(user.uid, {
            ...updates
        })        

          if(!err && !response.error){
              window.location.reload()          
          }
        setIsPending(false)
    }

    const handleCities = (label) => {
        setCitiesList(null)
        console.log('triggered')
        setStateList(label)
    }

    const handleSelect = () => {
        setCitiesList()
    }

    
    console.log(citiesList)
    return (
        <>
        {!isPending ? 
            <div className='edit-wrap'>
                <div className="edit-butt" onClick={update}>
                    <span  className='edit-icon'><MdOutlineCancel/></span>
                    <span>cancel</span>
                </div>
                <div className="edit-butt" onClick={handleSubmit}>
                    <span className='edit-icon'><AiFillEdit/></span>
                    <span>Update</span>
                </div>
            </div>
            :
            <div className='edit-wrap'>
                <div className="edit-butt" onClick={update}>
                    Loading.....
                </div>
            </div>
        }
        <div className='update-form'>
            <form>
            <div className="top-container">
                <div className="edit-img" >
                    <span onClick={handleFile}>
                        <MdModeEditOutline/>
                        <input type="file" ref={img} className='hide' onChange={(event) => handleChange(event)} />
                    </span>
                    <img src={file ? file : '/default_user.jpg'} alt="profile image" ></img>
                </div>
                <label>
                    <span>Name:</span>
                    <input
                    required 
                    type="text" 
                    onChange={(e) => setName(e.target.value)}
                    defaultValue={user.displayName}
                    />
                    {profilePicError && (<div className='error'>{profilePicError}</div>)}
                </label>
            </div>
            <div className="bottom-container">
            {err && <p className='error'>{err}</p>}
                <label>
                    <span>Email:</span>
                    <input
                    required 
                    type="email" 
                    onChange={(e) => setEmail(e.target.value)}
                    defaultValue={user.email}
                    />
                </label>
                <label>
                    <span>Phone Number:</span>
                    <input
                    required 
                    type="number" 
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    defaultValue={data.phoneNumber}
                    />
                </label>
                <label>
                    <span>Select state:</span>
                    <div className="select_div ">
                    <Select
                    onChange={(option) => {setStateName(option.value); setSName(option.label); handleCities(option);}} 
                    options={names}
                    value={stateList}
                    />
                    </div>
                </label>
                {data.cityName || stateName ?
                <label>
                    <span>Select City:</span>
                    <div className="select_div ">
                    <Select
                    onChange={(option) => {setCityName(option.label); handleSelect(option.label);}} 
                    options={cityNames}
                    value={citiesList}
                    />
                    </div>
                </label> : ''
                     } 
                </div>
            </form>
        </div>
        </>
    )
}

export default UpdateForm
