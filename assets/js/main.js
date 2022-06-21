const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'MY_MUSIC'

const player = $('.player');
const heading = $('.header h2')
const thumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');
const timeCurrent = $('.controls_time--left')
const timeFull = $('.controls_time--right')

// 1. Render songs
// 2. Scroll top
// 3. Play/ Pause/ seek
// 4. CD rotate
// 5. Next/ prev
// 6. Random
// 7. Next/ Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Chạy về khóc với anh',
            singer: 'Erik',
            path: './assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Crying Over You',
            singer: 'JustaTee',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Đáp án của bạn',
            singer: 'A Nhũng',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Dấu mưa',
            singer: 'Trung Quân Idol',
            path: './assets/music/song4.mp3',
            image: './assets/img/song4.jpg'
        },
        {
            name: 'Nơi này có anh',
            singer: 'Sơn Tùng M-TP',
            path: './assets/music/song5.mp3',
            image: './assets/img/song5.jpg'
        },
        {
            name: 'She Neva Knows',
            singer: 'JustaTee',
            path: './assets/music/song6.mp3',
            image: './assets/img/song6.jpg'
        },
        {
            name: 'Thả vào mưa',
            singer: 'Trung Quân Idol',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg'
        },
        {
            name: 'Vô Tình',
            singer: 'HoaProx x Xesi',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg'
        },
        {
            name: 'Sài Gòn hôm nay mưa',
            singer: 'JSOL, Cukak, Hoàng Duyên',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg'
        },
        {
            name: 'Fool For You',
            singer: 'Kastra',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg'
        },
        {
            name: 'Nổi gió rồi',
            singer: 'Châu Thâm (Zhou Shen)',
            path: './assets/music/song11.mp3',
            image: './assets/img/song11.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('');

    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        const cdAnimate =  cd.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimate.pause();

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0; 
            cd.style.opacity = newCdWidth / cdWidth;
        }

        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true;
            cd.classList.add('active');
            player.classList.add('playing');
            cdAnimate.play();
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            cd.classList.remove('active')
            player.classList.remove('playing');
            cdAnimate.pause();
        }

        audio.ontimeupdate = function() {
            const duration = audio.duration
            if(duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
                progress.style.background = 'linear-gradient(to right, #ec1f55 0%, #ec1f55 ' + progressPercent + 
                                            '%, #d3d3d3 ' + progressPercent + '%, #d3d3d3 100%)';

                let sec = Math.floor(audio.currentTime)
                let min = Math.floor(sec / 60)
                min = min >= 10 ? min : ('0' + min)
                sec = Math.floor(sec % 60)
                sec = sec >= 10 ? sec : ('0' + sec)
                timeCurrent.textContent = min + ':' + sec;                            
                
                let secFull = Math.floor(duration)
                let minFull = Math.floor(secFull / 60)
                minFull = minFull >= 10 ? minFull : ('0' + minFull)
                secFull = Math.floor(secFull % 60)
                secFull = secFull >= 10 ? secFull : ('0' + secFull)
                timeFull.textContent = minFull + ':' + secFull;

            } else {
                timeCurrent.textContent = '00' + ":" + "00"
                timeFull.textContent = '00' + ":" + "00"
            }
        }

        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        }

        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        }

        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click()
            }
        }

        playList.onclick = function(e) {
            const songNotActive = e.target.closest('.song:not(.active)')
            if(songNotActive || e.target.closest('.option')) { 
                if(songNotActive) {
                    _this.currentIndex = Number(songNotActive.dataset.index)
                    let activeSong = $('.song.active')
                    activeSong.classList.remove('active')
                    playList.children.item(_this.currentIndex).classList.add('active')

                    _this.loadCurrentSong()
                    audio.play()
                }

                // if(e.target.closest('.option')) {

                // }
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            if(this.currentIndex <= 2) {
                $('.song.active').scrollIntoView({      
                    behavior: 'smooth',
                    block: 'end'  
                });
            }
            else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 400)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        thumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function () {
        let activeSong = $('.song.active')
        activeSong.classList.remove('active')
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        playList.children.item(this.currentIndex).classList.add('active')
        this.loadCurrentSong()
    },
    prevSong: function () {
        let activeSong = $('.song.active')
        activeSong.classList.remove('active')
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        playList.children.item(this.currentIndex).classList.add('active')
        this.loadCurrentSong()
    },
    randomSong: function () {
        let newIndex
        let activeSong = $('.song.active')
        activeSong.classList.remove('active')
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }   while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        playList.children.item(this.currentIndex).classList.add('active')
        this.loadCurrentSong()
    },
    start: function() {
        this.loadConfig()


        this.defineProperties()

        
        this.handleEvents()


        this.loadCurrentSong()

        
        this.render()

        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
}

app.start();