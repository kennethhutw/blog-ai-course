
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectID } from "bson";
import clientPromise from "../../../lib/mongodb";
import { AppLayout } from "../../components/AppLayout";
import {getAppProps} from './../../utils/getAppProps';
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import PostContext from '@/context/postContext';
export default function Post(props) {

  const router = useRouter();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {deletePost} = useContext(PostContext);

  const handleDeleteConfirm = async()=>{
    try{
      const response = await fetch('/api/deletePost',{
        method:"POST",
        headers:{
          "content-type":"application/json"
        },
        body:JSON.stringify({postId:props.id})
      });

      const json = await response.json();
      if(json){
        deletePost(props.id);
        router.replace('/post/new');
      }
    }catch(e){

    }
  }

    return (
      <div className="overflow-auto h-full">
        <div className="max-w-3xl mx-auto bg-white p-8">
        <section className="bg-gray-300 rounded-lg px-6 py-8 mb-8">
            <h2 className="text-gray-800 text-lg font-bold mb-4"> SEO title and meta description</h2>
          <p className=" text-gray-800 text-2xl">{props.title}</p>
          <p className=" text-gray-800 text-sm">{props.metaDescription}</p>
          </section>

          <section className="bg-gray-300 rounded-lg px-6 py-8 mb-8">
            <h2 className="text-gray-800 text-lg font-bold mb-4"> Keywords</h2>
            <ul className="flex flex-wrap">
              {props.keywords.split(',').map((keyword, i)=>(
                <i key={i} className="bg-gray-400 text-gray-800 rounded-full py-1 px-3 mr-2 mb-2">#{keyword}</i>
              ))}
            </ul>
          </section>


          <section className="bg-gray-300 rounded-lg px-6 py-8 mb-8">
            <h2 className="text-gray-800 text-lg font-bold mb-4"> Blog post</h2>
            <div className="text-gray-800 mb-4" dangerouslySetInnerHTML={{__html: props.postContent}}></div>
          </section>

          <section className="my-4">
             {!showDeleteConfirm && (
              <button className="btn bg-red-600 hover:bg-red-700"
              onClick={()=>setShowDeleteConfirm(true)}>Delete Post</button>
             )}

          {!!showDeleteConfirm && (
             <div>
              <p>Are you sure you want to delete this post?</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn bg-stone-600 hover:bg-stone-700"
                onClick={()=>setShowDeleteConfirm(false)}>
                  Cancel
                </button>
                <button className="btn bg-red-600 hover:bg-red-700"
                onClick={handleDeleteConfirm}>
                  Confirm delete
                </button>

              </div>

             </div>
             )}
          </section>

        </div>
       
      </div>
    )
  }

  Post.getLayout = function getLayout(page, pageProps){
    return <AppLayout {...pageProps}>{page}</AppLayout>
}
  
  export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx){

      const props = await getAppProps(ctx);
        const userSession = await getSession(ctx.req, ctx.res);
        const client = await clientPromise;
        const db = client.db("blogAI")
    
        const user = await db.collection("users").findOne({
            auth0Id:userSession.user.sub
        });

        const post =await db.collection('posts').findOne({
            _id: new ObjectID(ctx.params.postId),
            userId:user._id
        })
       
        if(!post){
            return {
                redirect:{
                    destination:"/post/new",
                    permanent:false
                }
            }
        }

        return{
            props:{
                id:ctx.params.postId,
                postContent: post?.postContent,
                title: post?.title,
                metaDescription: post?.metaDescription,
                keywords:post.keywords,
                postCreated: post.created.toString(),
                ...props
            }
        }
    }
  });
