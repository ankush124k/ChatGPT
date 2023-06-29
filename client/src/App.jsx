import { useState ,useEffect} from "react";
import axios from "axios" ;
import send from "./assets/send.svg";
import user from "./assets/user.png";
import loadingIcon from "./assets/loader.svg";
import bot from "./assets/bot.png";

function App() {
  const [input, setInput] = useState("");
  const [posts, setposts] = useState([]);

  useEffect(()=> {
    document.querySelector(".layout").scrollTop = document.querySelector(".layout").scrollHeight;
  },[posts])
  const fetchBotResponse = async() => {
    const {data} = await axios.post("https://chatgpt-app-tkmq.onrender.com",
    {input},
    {
      headers:{
        "ContentType":"application/json",
      },
    });
    return data;
  };

  const onSubmit = ()=>{
        if(input.trim()==="")return ;
        updatePosts(input);
        updatePosts("loading....",false,true);
        setInput("");
        fetchBotResponse().then((res) => {
          console.log(res.bot.trim());
          updatePosts(res.bot.trim(),true);
        });
  };

  const autoTypingResponse = (text) =>{
      let index=0;
      let interval =setInterval(() => {
        if(index<text.length){
          setposts((prevState) => {
            let lastItem = prevState.pop();
            if(lastItem.type!=="bot"){
              prevState.push({
                type:"bot",
                post:text.charAt(index-1),
              });
            }else{
              prevState.push({
                type:"bot",
                post:lastItem.post+text.charAt(index-1),
              });
            }
            return [...prevState];
          });
          index++;
        }else{
          clearInterval(interval);
        }
      }, 20);
  };

  const updatePosts=(post,isBot,isLoading)=>{
        if(isBot){
          autoTypingResponse(post);
        }else{
          setposts((prevState) => {
            return [
              ...prevState,
              { 
                type:isLoading ? "loading":"user",
                post,
              },//alsoo can write post only as name of both is same
            ];
          });
        }
  };

  const onKeyUp=(e)=>{
    if(e.key==="Enter"||e.which===13){
      onSubmit();
    }
  };


  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className=" layout">
          {posts.map((post, index) => (
            <div 
            key={index}
            className={'chat-bubble ${post.type==="bot" || post.type==="loading" ? "bot" : ""}'}>
              <div className="avatar">
                <img src={post. type==="bot" || post.type==="loading"?bot:user} />
              </div>

              {post.type==="loading"?(
                <div className="loader">
                <img src={loadingIcon}/>
              </div>
              ):(
                <div className="post">{post.post}</div>
              ) }
            </div>
          ))}
        </div>
      </section>

      <footer>
        <input
          value={input}
          className="composebar"
          autoFocus
          type="text"
          placeholder="How can I help !!"
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} />
        </div>
      </footer>
    </main>
  );
}

export default App;
