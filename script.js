console.log("Lets write js");

let currentSong = new Audio(); 

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
  

async function getSongs()
{
    let a = await fetch("http://127.0.0.1:5500/songs/"); 
    let response = await a.text(); 
    // console.log(response);
    let div = document.createElement("div"); 
    div.innerHTML = response; 
    let as = div.getElementsByTagName("a");   //all anchor tags 
    let songs = []; 

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split('/songs/')[1]);
        }
    }
    return songs;
}

const playMusic = (track, pause=false)=>{
    currentSong.src = "/songs/" + track; 
    if(!pause){
        currentSong.play();
        play.src = "images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track); 
    document.querySelector(".songtime").innerHTML = "00:00/00:00"; 
}
 

async function main(){

    // Get the list of All the Songs
    let songs =  await getSongs(); 
    console.log(songs); 

    // currentSong.innerHTML = songs[0]; 
    playMusic(songs[0], true); 

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + 
                                                `<li>
                                                    <img class="invert" width="34" src="/images/music.svg" alt="">
                                                    <div class="info">
                                                        <div> ${song.replaceAll("%20", " ")}</div>
                                                        <div>Harry</div>
                                                    </div>
                                                    <div class="playnow">
                                                        <span>Play Now</span>
                                                        <img class="invert" src="/images/playbtn.svg" alt="">
                                                    </div>
                                                </li>`;
    }


    // Attach an event Listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach( e=>{
            e.addEventListener("click", element=>{
                // console.log(e.querySelector(".info").firstElementChild.innerHTML);
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim()); 
            })
    })

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
        currentSong.currentTime = (currentSong.duration * percent) / 100; 
    }) 

}
main(); 
