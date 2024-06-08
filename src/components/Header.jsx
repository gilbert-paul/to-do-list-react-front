import { useState } from "react"

const Header = ()=>{
  const [newMode, setNewMode] = useState(true)
  console.log(newMode)
  const handleMode=()=>{
    if(!newMode){
      document.documentElement.style.setProperty("--primary-color", "#8e44ad")
      } else {
      document.documentElement.style.setProperty("--primary-color", "#d35400")

      }
    setNewMode(!newMode)
  }

  return (
    <header>
      <div className="container">
      <i className="fa-solid fa-calendar-check"></i> 
      <h1>To Do List</h1>  
      <button onClick={handleMode}>{newMode?"Light":"Dark"}</button>   
      </div>
    </header>
  )
}

export default Header