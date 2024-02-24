console.log("Lets write js");

let currentSong = new Audio(); 
let songs; 
let currFolder; 

// Correct

// function to convert seconds to minutes
function secondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return `00:00/00:00`;
    }
  
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
  
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  
// Correct


async function getSongs(folder)
{   
    currFolder = folder; 
    // let a = await fetch(`http://127.0.0.1:5500/${folder}/`);   // this we used when run this site locally
    // let a = await fetch(`/${folder}/`); 
    let a = await fetch(`https://song4u.netlify.app/${folder}/`); 
    // console.log(a);
    let response = await a.text(); 
    let div = document.createElement("div"); 
    div.innerHTML = response; 
    let as = div.getElementsByTagName("a");   //all anchor tags 
    // console.log(as);
    songs = []; 
    
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    // console.log(songs);

// Correct

        // Show all the songs in the Playlist
        let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
        songUL.innerHTML = ""; 
        for (const song of songs) {
            songUL.innerHTML = songUL.innerHTML + 
                                                    `<li>
                                                        <img class="invert" width="34" src="images/music.svg" alt="">
                                                        <div class="info">
                                                            <div> ${song.replaceAll("%20", " ")}</div>
                                                            <div>Praveen</div>
                                                        </div>
                                                        <div class="playnow">
                                                            <span>Play Now</span>
                                                            <img class="invert" src="images/playbtn.svg" alt="">
                                                        </div>
                                                    </li>`;
        }
// Correct
    
        // Attach an event Listener to each song
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach( e=>{
                e.addEventListener("click", element=>{
                    // console.log(e.querySelector(".info").firstElementChild.innerHTML);
                    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim() + ".mp3");
                })
        })

    return songs; 
}

// Correct

// Function to Play song
const playMusic = (track, pause=false)=>{
    currentSong.src = `/${currFolder}/` + track; 
    if(!pause){
        currentSong.play();
        play.src = "images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track).slice(0,-4);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"; 
}

// Correct

// Other's Code
async function getSongsList(folder) {
    let a = await fetch(folder)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    return songs
}

async function displayAlbums(){
    // let a = await fetch(`http://127.0.0.1:5500/songs/`);   // this we used when run this site locally
    // let a = await fetch(`/songs/`);    
    let a = await fetch(`https://song4u.netlify.app/songs/`);    
    let response = await a.text(); 
    let div = document.createElement("div"); 
    div.innerHTML = response; 
    
    // console.log(div);
    let anchors = div.getElementsByTagName("a"); 
    let cardContainer = document.querySelector(".cardContainer");
    
    let array = Array.from(anchors); 
    

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if(e.href.includes("/songs/") && !e.href.includes(".htaccess") && (await getSongsList(e.href)).length != 0){
            let folder = e.href.split("/").slice(-1)[0]; 
            // Get the metadata of the folder
            // let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);      //this we used when run this site locally
            // let a = await fetch(`/songs/${folder}/info.json`);
            let a = await fetch(`https://song4u.netlify.app/songs/${folder}/info.json`);
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + 
                                                                `<div data-folder="${folder}" class="card">
                                                                    <div class="play">
                                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"/>
                                                                        </svg>    
                                                                    </div>
                                                                    <img src="/songs/${folder}/cover.jpeg" alt="">
                                                                    <h3>${response.title}</h3>
                                                                    <p class="songDesc">${response.description}</p>
                                                                </div>`
        }
    }

// Correct

    // Load the playlist Whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach( e =>{
        // console.log(e)
        e.addEventListener("click", async item=>{
            // console.log(item.currentTarget.dataset.folder);
            songs =  await getSongs(`songs/${item.currentTarget.dataset.folder}`); 
            playMusic(songs[0]); 
            document.querySelector(".left").style.left = 0;  // More responsive by me
        })
    })
}

// Correct
 

async function main(){

    // Get the list of All the Songs of ncs folder initially
    // await getSongs("songs/ncs");
    
    // currentSong.innerHTML = songs[0]; 
    // playMusic(songs[0], true);             

    // Display all the albums on the page
    await displayAlbums();


    // Attach an event listener to previous, play, next buttons.
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "images/pause.svg"; 
        }
        else{
            currentSong.pause(); 
            play.src = "images/playbtn.svg"; 
        }
    })

    //Event Listerner for time Update
    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML =  `${secondsToMinutesAndSeconds(currentSong.currentTime)} 
                                                        / ${secondsToMinutesAndSeconds(currentSong.duration)}`; 
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"; 
    })

    // Add Event Listener to SeekBaar
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100 ; 
        document.querySelector(".circle").style.left = percent + "%"; 
        currentSong.currentTime = ((currentSong.duration) * percent) / 100; 
    }) 

    // Add Event Listener to hamburger to view left library side
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = 0; 
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        // console.log("previous Clicked");
        console.log(currentSong.src.split("/").slice(-1)[0]); 
        // console.log(songs);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]); 
        if((index-1)>=0){
            playMusic(songs[index-1]); 
        }
    })
    
     // Add an event listener to Next
    next.addEventListener("click", ()=>{
        // console.log("Next Clicked");
        console.log(currentSong.src.split("/").slice(-1)[0]); 
        // console.log(songs);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]); 
        if((index+1)<=songs.length){
            playMusic(songs[index+1]); 
        }
    })

    // Add an event listener to  Volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value) / 100; 
        if(currentSong.volume > 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace = ("images/mute.svg","images/volume.svg"); 
        }
    })

    // Add an Event listener to mute the Vol
    document.querySelector(".volume>img").addEventListener("click", e=>{
        // console.log(e.target); 
        if(e.target.src.includes("images/volume.svg")){
            e.target.src = e.target.src.replace = ("images/volume.svg","images/mute.svg"); 
            currentSong.volume = 0; 
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0; 
        }
        else{
            e.target.src = e.target.src.replace = ("images/mute.svg","images/volume.svg"); 
            currentSong.volume = .10; 
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10; 
        }
    })

}

main(); 
