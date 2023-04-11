
import { AppLayout } from "@/components/AppLayout";
import { getAppProps } from "@/utils/getAppProps";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
export default function Topup() {

  const handleClick = async()=>{
    const response = await fetch('/api/addTokens',{
      method:'POST',
      header:{
        'content-type':'application/json'
      }
    })

    const json = await response.json();

    console.log("RESULT : ", json);
    window.location.href = json.session.url;
  }

    return (
      <div>
       <h1>Topup</h1>
       <button className="btn" onClick={handleClick}>Add tokens</button>
      </div>
    )
  }
  

  Topup.getLayout = function getLayout(page, pageProps){

    return <AppLayout {...pageProps}>{page}</AppLayout>
  }

  export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx){
      const props =await getAppProps(ctx);
      return {
        props
      }
    }
   
});
