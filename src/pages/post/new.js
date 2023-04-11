
import { AppLayout } from "@/components/AppLayout";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useState } from "react";
import {getAppProps} from './../../utils/getAppProps';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBlog} from "@fortawesome/free-solid-svg-icons";
export default function NewPost(props) {
  const router = useRouter();
  // const [postContent, setPostContent] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generating, setGenerating] = useState(false);


  const handleClick = async (e)=>{
    e.preventDefault();
    setGenerating(true)
    try{
      const response = await fetch('/api/generatePost',{
        method:'POST',
        headers:{
          'content-type':'application/json'
        },
        body: JSON.stringify({topic, keywords})
      })

      const json = await response.json();

      if(json?.postId){
        router.push(`/post/${json?.postId}`);
      }
    }catch(e){
      setGenerating(false);
    }
  }
    


    return (
      <div className="h-full overflow-hidden">
         {!!generating &&(
          <div className="text-slate-800 h-full w-full flex flex-col animate-pulse justify-center items-center">
            <FontAwesomeIcon icon={faBlog} className="text-8xl"></FontAwesomeIcon>
            <h6>Generating....</h6>
          </div>
        )}
        {!generating &&(
        <div className="w-full h-full flex flex-col overflow-auto">
          <form onSubmit={handleClick} className="m-auto w-ful max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border-slate shadow-slate-200">
            <div>
              <label>
                <strong>
                  Generate a blog post on the topic of :
                </strong>
                <textarea className="resize-none border border-slate-500 w-full my-2 px-4 py-2 rounded-sm " value={topic} onChange={(e)=>setTopic(e.target.value)} maxLength={90}></textarea>
                </label> 
            </div> 
            <div>
              <label>
                <strong>
                  Trageting the following keywords:
                </strong>
                <textarea className="resize-none border border-slate-500 w-full my-2 px-4 py-2 rounded-sm " 
                value={keywords} 
                onChange={(e)=>setKeywords(e.target.value)}
                maxLength={90}
                ></textarea>
                <small className="block mb-2">Seperate keywords with a comma</small>
                </label> 
            </div> 
            <button className="btn" type="submit" disabled={!topic.trim()|| !keywords.trim()}>Generate</button>
          </form>
        </div>
        )}
      </div>
    )
  }

  NewPost.getLayout = function getLayout(page, pageProps){

    return <AppLayout {...pageProps}>{page}</AppLayout>
  }


export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx){
    const props =await getAppProps(ctx);
    if(!props.availableTokens){
      return {
        redirect:{
            destination:"/token-topup",
            permanent:false
        }
    }

    }
    return {
      props
    }
  }
});
