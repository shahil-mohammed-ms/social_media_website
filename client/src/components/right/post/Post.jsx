import React, { useEffect, useState, useReducer } from 'react';
import '../post/Post.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from '../../../axios'
import Slider from "react-slick";
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import Comment from '../../comment/comment';

// Define the initial state for post likes
const initialState = {
  likedPosts: [], // Array to store the IDs of liked posts
};

// Define the reducer function to handle state updates
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_POSTID':
      return {
        likedPosts: [...state.likedPosts, action.postId],
      };
    case 'REMOVE_POSTID':
      return {
        likedPosts: state.likedPosts.filter((postId) => postId !== action.postId),
      };
    default:
      return state;
  }
};
function Post() {
  const navigate = useNavigate();
  const [cookies] = useCookies(['sessionId']);
  // Access the session ID cookie
  const sessionId = cookies["sessionId"];

  const [profile, setProfile] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [user_id,setUser_id] = useState('')
  const [likedPosts, dispatch] = useReducer(reducer, initialState);
  const [commentBox,setCommentBox] = useState(false)
  const [postData,setPostData] =useState()
  const [passProData,setPassProData] = useState()
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        //this api gives posts
        const profileResponse = await axios.get('/', { withCredentials: true });
        setProfile(profileResponse.data.postsWithUserDetails )
        setPassProData(profileResponse.data.prof)
        console.log(profileResponse)
        const users_session = await axios.get('/profile', { withCredentials: true });
        setUser_id(users_session.data.user.id)


      } catch (error) {
        console.log(error);
      }
    };
  
    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    afterChange: (current) => setCurrentSlide(current),
  };

// liking a post
  const handleLike = async(postId) => {
  const likePost = await axios.post(`/post/${postId}/like`)

  };

  //unliking a post
  const handleUnLike =async (postId) => {
    
    const likePost = await axios.post(`/post/${postId}/unlike`)
  
  };

  const isPostLiked = (postlikeArray) => {
  
     // Check if the current user's ID is in the likes array
  const userLiked = postlikeArray.includes(user_id);
 
  return userLiked

  }; 
   // Check if a post is liked based on its ID
  const isIncludedArray = (postId) => {
    return likedPosts.likedPosts.includes(postId);
  };

  //
  const addArr =(postId)=>{
    dispatch({ type: 'ADD_POSTID', postId });

  }
  const removeArr =(postId)=>{
    dispatch({ type: 'REMOVE_POSTID', postId });

  }
  const toggleCommentBox = () => {
    setCommentBox((prevValue) => !prevValue);
  };

 
 
  return (
    <div className='testMainBox'>
{commentBox &&<Comment onClose={toggleCommentBox} prof={passProData}  post_details={postData} settings={settings} />}
      {
        profile.map((post)=>{
          return(
<div className="post" key={post.id}>
      
      <div className="post-header">
        <div className="post-pro-pic" onClick={()=>navigate(`/profile/${post.postedBy.userId}`)}><img src={`http://localhost:5000/image/images/profile_picture/${post.postedBy.profileUrl}`} alt="" className="profile-img"/></div>
        <div className="post-user-name">{post.postedBy.nickName}</div>
<div className="post-icon "><ion-icon name="ellipsis-horizontal-outline" className="three-dot"></ion-icon></div>
        
      </div>


      
      {post.imageUrl.length === 1 ? (
              <div className="post-img">
                <img
                  src={`http://localhost:5000/image/images/post/${post.imageUrl[0]}`}
                  alt=""
                  className="image"
                />
              </div>
            ) : (
              <div className="post-images">
                <Slider className='post-images-slider' {...settings}>
                  {post.imageUrl.map((image, index) => (
                    <div key={index}>
                      <img
                        src={`http://localhost:5000/image/images/post/${image}`}
                        alt=""
                        className="image"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            )}



      <div className="post-footer">
      <div className="post-icon-footer">
        {isPostLiked(post.likes)?(<span
                className={`post-icon-footer heart-like`}
                
              >
{isIncludedArray(post.id)?(<ion-icon name={`heart-outLine`}
    onClick={() => {
      handleLike(post.id);
      removeArr(post.id)
    }} 
  ></ion-icon>):(<ion-icon name={`heart`}
    onClick={() => {
      handleUnLike(post.id);
      addArr(post.id)
    }} 
  ></ion-icon>)}

 </span>):(<span
                className={`post-icon-footer heart-like`}
               
              >
              
   {isIncludedArray(post.id)?(<ion-icon name={`heart`}  onClick={() => {handleUnLike(post.id);
   removeArr(post.id)
              }}></ion-icon>):( <ion-icon name={`heart-outLine`}  onClick={() => {handleLike(post.id);
                addArr(post.id)
              }}></ion-icon>)}

              </span>

              )}
          

         <span className="post-icon-footer" onClick={()=>{toggleCommentBox();setPostData(post);}}><ion-icon name="chatbubbles-outline"></ion-icon></span>
         <span className="post-icon-footer "><ion-icon name="exit-outline"></ion-icon></span>
         <span className="post-icon-footer last"><ion-icon name="bookmark-outline"></ion-icon></span> 
        
      </div>
     
      <div className="post-footer like-count">{post.likesCount} likes</div>
      
      <div className="title"><h4>{post.title}</h4></div>
      <div className="description"><p>{post.description}</p></div>
      </div>
     </div> 
          )
          
        })

     }
    </div>
   
  )
}

export default Post