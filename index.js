const imageDiv = document.querySelector("#image");
const titleDiv = document.querySelector("#title");
const download_btn = document.querySelector("#download");
const url_form = document.querySelector("#url_form");
const result_display = document.querySelector("#result_display");
const loader = document.querySelector("#loader");
const result_display_content = document.querySelectorAll(".result-display");
const result_container = document.querySelector(".result-container");
const message = document.querySelector("#message");

url_form.addEventListener("submit",e=>{
    e.preventDefault();
    message.textContent = ``
    loader.style.display = "block" 
    result_container.style.display = "block";
    loader.style.display = "block"
        result_display_content.forEach(element=>{
            element.style.display = "none"
        })
    const url = document.querySelector("#url").value;
    fetchUrl(url);      
})

function youtube_parser(url){
      return new Promise((resolve)=>{
          var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
          var match = url.match(regExp);
          resolve((match&&match[7].length==11)? match[7] : false)     
      })  
}


function getImage(url){
    return new Promise((resolve)=>{
        resolve(`https://img.youtube.com/vi/${url}/hqdefault.jpg`);
    })   
}

async function fetchUrl(url){    
    const url_id = await youtube_parser(url); 
    const imageUrl = await getImage(url_id);
    const response = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${url_id}`,{
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'youtube-mp36.p.rapidapi.com',
            'x-rapidapi-key': '9e88c98e16mshe7194a8a47e400bp10ee7fjsn16ca6671571b'
        }
    }).then(res=>{                               
        return res.json();
    }).then(data=>{
        if(data.status==="ok"){
            data.image = imageUrl;
            loader.style.display = "none"
            result_display_content.forEach(element=>{
            element.style.display = "block"
            
            })
            displayRes(data);
        }else{
            loader.style.display = "none" 
            message.textContent = `Not Found Video`
        }       
    })
}

function displayRes(data){
    imageDiv.src = data.image; 
    titleDiv.textContent = data.title;   
    download_btn.href= data.link;
}
