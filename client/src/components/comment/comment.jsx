import React,{useState,useEffect} from 'react'
import Slider from "react-slick";
import axios from '../../axios'

function Comment({ onClose,post_details,prof }) {
  const [comment, setComment] = useState('');
  const[retrievedComments,setRetrievedComments] = useState([])
 

 const postData = async(e)=>{
  e.preventDefault()
  try{
    const postComment =await axios.post(`post/${post_details.id}/comments`,{comment,withCredentials: true})
   
    
    
    setRetrievedComments((prev)=>[...prev,{id:postComment.data.resp.id,
      likes:postComment.data.resp.likes,
      likesCount:postComment.data.resp.likesCount,
      commentText:postComment.data.resp.commentText,
      createdAt:postComment.data.resp.createdAt,
      commentedBy:{
        nickName:prof.nickName,
        profileUrl:prof.profileUrl

      }

    }])
    setComment('')
    
  }catch(e){
  console.log(e)
  }
 }

 useEffect(()=>{
const fetchData =async()=>{
const getComentData = await axios.get(`post/${post_details.id}/comments`)
setRetrievedComments(getComentData.data.commentWithDetails)

}
fetchData()

 },[])

  return (
    <div className="comment_box">
      <div className="comment_exit" onClick={onClose}><ion-icon  name="close-outline"></ion-icon></div>
 
<div className="post_section">
<div className="profile_section">
<div className="post-pro-pic" ><img src={`http://localhost:5000/image/images/profile_picture/${post_details.postedBy.profileUrl}`}
 alt="" className="profile-img"/></div>
<p>{post_details.postedBy.nickName}</p>
</div>
<div className="post_sub">
  <div className="post_img_section">
    <img src={`http://localhost:5000/image/images/post/${post_details.imageUrl[0]}`} alt="" />
  </div>
  <div className="post_desc_title">
    <div className="post_desc_section"><h3>title</h3>
    <p>{post_details.title}</p></div>
    
    <div className="post_title_section"><h3>desc</h3>
    <p>{post_details.description}</p>
    </div>
  </div>
</div>

</div>


<div className="comment_section">

{ 
  retrievedComments.map((obj) => (
    <div key={obj.commentId}>
      <div className="comment_header">
        <div className="post-pro-pic" ><img src={`http://localhost:5000/image/images/profile_picture/${obj.commentedBy.profileUrl}`} alt="" className="profile-img"/></div>
        <p className='commenter_name'>{obj.commentedBy.nickName}</p>
      </div>
      <div className="comment_sub">
        <div className="time_cmt">8h</div>
        <div className="write_cmt">
          <p>{obj.commentText}</p>
        </div>
      </div>
    </div>
  ))
}


</div>
<form className="comment_submit" onSubmit={postData} >

  <input type="text" className="comment_input" placeholder='write something...' value={comment} onChange={(e)=>{setComment(e.target.value)}} />
  <button className='comment_submit_btn'>
  <ion-icon name="arrow-redo-outline"></ion-icon>
  </button>

</form>

  
  </div>
  )
}

export default Comment