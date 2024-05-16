
import { FaPen, FaTrash, FaCheck } from 'react-icons/fa'

function Post (props) {
  return (
    <div className={props.isComplete ? "to-do-item flex complete" : "to-do-item flex incomplete"}>
      <div className='buttons'>
        <button className="delete-b" onClick={props.delete}><FaTrash /></button>
        <button className="edit-b" onClick={props.edit}><FaPen /></button>
        <button className="complete-b" onClick={props.complete}><FaCheck /></button>
      </div>
      <div className='post-info'>
        <p className="text">{props.text}</p>
        <p className="date">{props.date}</p>
      </div>
    </div>
  )
}

export default Post