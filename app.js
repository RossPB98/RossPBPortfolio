// Playlist (you can expand this with more songs)
const playlist = [
    {
        title: "Yvona",
        artist: "Soundtrack",
        src: "assets/NPC_Yvona.mp3"
    },
    {
        title: "ICK",
        artist: "Soundtrack",
        src: "assets/boss_ICK.mp3"
    },
    {
        title: "Avalon Gate",
        artist: "Soundtrack",
        src: "assets/Field_AvalonGate.mp3"
    },
    {
        title: "Sidhe Grove",
        artist: "Soundtrack",
        src: "assets/Field_SidheGrove_000.mp3"
    }
    // Add more songs as needed
];

// Keep a copy of the original playlist order
let originalPlaylist = [...playlist];
let currentPlaylist = [...playlist];
let currentTrackIndex = 0;
let isShuffleActive = false;

// DOM Elements
const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const volumeBtn = document.getElementById('volume-btn');
const volumeSlider = document.getElementById('volume-slider');
const seekBar = document.getElementById('seek-bar');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.querySelector('.track-artist');
const volumeIcon = document.getElementById('volume-icon');
const loopBtn = document.getElementById('loop-btn');

// Initialize player
function initPlayer() {
    // Set initial track
    loadTrack(currentTrackIndex);

    // Set volume
    audioPlayer.volume = volumeSlider.value;
    
    // Initialize shuffle and loop to inactive
    shuffleBtn.classList.remove('active');
    loopBtn.classList.remove('active');
    audioPlayer.loop = false;
    isShuffleActive = false;

    // Update seek bar as audio plays
    audioPlayer.addEventListener('timeupdate', updateSeekBar);

    // When track ends, play next
    audioPlayer.addEventListener('ended', playNext);

    // Event listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    seekBar.addEventListener('input', seekTo);
    volumeSlider.addEventListener('input', setVolume);
    volumeBtn.addEventListener('click', toggleMute);
    shuffleBtn.addEventListener('click', toggleShuffle);
    loopBtn.addEventListener('click', toggleLoop);

    // Update total time display when metadata is loaded
    audioPlayer.addEventListener('loadedmetadata', function () {
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
        seekBar.max = Math.floor(audioPlayer.duration);
    });
}

// Toggle loop - simplified to avoid duplication
function toggleLoop() {
    audioPlayer.loop = !audioPlayer.loop;
    if (audioPlayer.loop) {
        loopBtn.classList.add('active');
    } else {
        loopBtn.classList.remove('active');
    }
}

// Load a track
function loadTrack(index) {
    // Make sure index is valid
    if (index < 0) index = currentPlaylist.length - 1;
    if (index >= currentPlaylist.length) index = 0;

    currentTrackIndex = index;

    // Set source
    audioPlayer.src = currentPlaylist[index].src;

    // Update track info
    trackTitle.textContent = currentPlaylist[index].title;
    trackArtist.textContent = currentPlaylist[index].artist;

    // Reset seek bar
    seekBar.value = 0;
    currentTimeDisplay.textContent = '0:00';

    // Preload
    audioPlayer.load();
}

// Toggle play/pause
function togglePlayPause() {
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');

    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.classList.add('active');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
    } else {
        audioPlayer.pause();
        playPauseBtn.classList.remove('active');
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
    }
}

// Play previous track
function playPrevious() {
    loadTrack(currentTrackIndex - 1);
    audioPlayer.play()
        .then(() => {
            playPauseBtn.classList.add('active');
        })
        .catch(error => {
            console.error("Playback failed:", error);
        });
}

// Play next track
function playNext() {
    loadTrack(currentTrackIndex + 1);
    audioPlayer.play()
        .then(() => {
            playPauseBtn.classList.add('active');
        })
        .catch(error => {
            console.error("Playback failed:", error);
        });
}

// Update seek bar progress visually
function updateSeekBar() {
    seekBar.value = audioPlayer.currentTime;
    currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
    
    // Set the CSS variable for the visual progress bar
    const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    seekBar.style.setProperty('--seek-progress', `${progressPercentage}%`);
}

// Seek to position
function seekTo() {
    audioPlayer.currentTime = seekBar.value;
}

// Set volume
function setVolume() {
    audioPlayer.volume = volumeSlider.value;
    updateVolumeIcon();
    
    // Set the CSS variable for the visual volume level
    const volumePercentage = audioPlayer.volume * 100;
    volumeSlider.style.setProperty('--volume-level', `${volumePercentage}%`);
}

// Toggle mute
function toggleMute() {
    if (audioPlayer.volume > 0) {
        audioPlayer.volume = 0;
        volumeSlider.value = 0;
    } else {
        audioPlayer.volume = 0.5;
        volumeSlider.value = 0.5;
    }
    updateVolumeIcon();
}

// Update volume icon based on current volume
function updateVolumeIcon() {
    if (audioPlayer.volume === 0) {
        // Show muted icon
        volumeIcon.innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <line x1="23" y1="9" x2="17" y2="15"></line>
      <line x1="17" y1="9" x2="23" y2="15"></line>
    `;
    } else if (audioPlayer.volume < 0.5) {
        // Show low volume icon
        volumeIcon.innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    `;
    } else {
        // Show full volume icon
        volumeIcon.innerHTML = `
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    `;
    }
}

// Format time from seconds to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle
    while (currentIndex !== 0) {
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Swap it with the current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Toggle shuffle
function toggleShuffle() {
    isShuffleActive = !isShuffleActive;

    if (isShuffleActive) {
        // Enable shuffle
        shuffleBtn.classList.add('active');

        // Save current track
        const currentTrack = currentPlaylist[currentTrackIndex];

        // Shuffle playlist
        currentPlaylist = shuffleArray([...originalPlaylist]);

        // Find the current track in the shuffled playlist
        currentTrackIndex = currentPlaylist.findIndex(track => track.src === currentTrack.src);
        if (currentTrackIndex === -1) currentTrackIndex = 0;
    } else {
        // Disable shuffle
        shuffleBtn.classList.remove('active');

        // Save current track
        const currentTrack = currentPlaylist[currentTrackIndex];

        // Restore original playlist
        currentPlaylist = [...originalPlaylist];

        // Find the current track in the original playlist
        currentTrackIndex = currentPlaylist.findIndex(track => track.src === currentTrack.src);
        if (currentTrackIndex === -1) currentTrackIndex = 0;
    }
}


// Initialize on page load
window.addEventListener('DOMContentLoaded', initPlayer);
window.addEventListener('DOMContentLoaded', function() {
    initPlayer();
    // Set initial volume level indicator
    volumeSlider.style.setProperty('--volume-level', `${audioPlayer.volume * 100}%`);
    
    // Initialize seek progress to 0
    seekBar.style.setProperty('--seek-progress', '0%');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-links a');

    // Set initial active state based on current URL
    setActiveLink();

    // Add click event to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Set active link based on scroll position
    window.addEventListener('scroll', function () {
        setActiveLink();
    });

    function setActiveLink() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
});

// Form validation 
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name.length < 2) {
        alert('Please enter a valid name');
        return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('Please enter a valid email address');
        return;
    }

    if (message.length < 10) {
        alert('Message must be at least 10 characters long');
        return;
    }

    alert('Thanks for your message! I\'ll get back to you soon.');
    this.reset();
});