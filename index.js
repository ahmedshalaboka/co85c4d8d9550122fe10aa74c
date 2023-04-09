import { tweetsData }  from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


// get data from localstorage and save to new array
let tweetSaved = JSON.parse(localStorage.getItem("tweetsData"))
// save tweetsData to localStorage for once time 
if(!tweetSaved){
    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
}
//save changes or edit to localstorage using new array tweetSaved 
function SaveData(){
   
    localStorage.setItem("tweetsData", JSON.stringify(tweetSaved))
}

// deal with new array (tweetSaved) and stop using  tweetsData in all code 

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
       
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
        
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
        
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
        
    }else if(e.target.id ==='reply-btn'){
        handleReplyBtnClick(e.target.dataset.replies)
        
    }
})


 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetSaved.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
     SaveData()
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetSaved.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    
    
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    SaveData()
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetSaved.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    SaveData()
    tweetInput.value = ''    
    render()
    
    }

}

function  handleReplyBtnClick(tweetId){
     let ReplyInput = document.getElementById(`reply-${tweetId}`)
     const targetReplyObj = tweetSaved.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(ReplyInput.value){
        
       targetReplyObj.replies.unshift({
        handle: `@scrimba`,
                profilePic: `images/scrimbalogo.png`,
                tweetText: ReplyInput.value
    })
    
    SaveData()
    ReplyInput = ''
    render() 
    
    }
    
     
}


function getFeedHtml(){
 
    
    let feedHtml = ``
    
    tweetSaved.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden"  id="replies-${tweet.uuid}">
        <div class="tweet-reply" >
          <div class="tweet-inner">
             <img src="images/scrimbalogo.png" class="profile-pic">
             <div>
                <p class="handle">@scrimba</p>
                <textarea placeholder="write your reply" id="reply-${tweet.uuid}" ></textarea>
                <button data-replies="${tweet.uuid}" id="reply-btn">reply</button>
            </div>
        </div>
</div>
       <div> ${repliesHtml}</div>
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

