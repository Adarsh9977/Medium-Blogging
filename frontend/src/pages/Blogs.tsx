import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export const Blogs = () => {
    const navigate = useNavigate();
    const {loading, blogs}= useBlogs();
    
     useEffect(()=>{
        if(!localStorage.getItem('token')){
          navigate('/signin')
        }
      })

    if(loading){
        return <div>
            <Appbar/>
            <div className="flex  justify-center">
                <div className="w-screen sm:w-2/3 lg:w-1/2 items-center">
                <BlogSkeleton/>
                <BlogSkeleton/>
                <BlogSkeleton/>
                <BlogSkeleton/>
                <BlogSkeleton/>
                </div>
            </div> 
        </div>
    }
    

  return (
    <div>
        <Appbar/>
        <div className="flex justify-center">
            <div className="w-screen sm:w-2/3 lg:w-1/2 items-center">
                {blogs.map(blog=> <BlogCard 
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"2nd Feb 2024"} />)}
            </div>
        </div>
    </div>
  )
}

