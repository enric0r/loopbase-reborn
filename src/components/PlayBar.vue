<template>
    <div ref="PlayBar" class="play-bar" v-bind:class="{hidden: title == ''}">
        <audio
            id="audioPlayer"
            ref="audioPlayer"
            :loop="loop"
            :volume="volume / 100"
            @timeupdate="setPlaybackPos()"
        />
        <div ref="InfoArea" class="info-audio">
            <img ref="ProfilePicture" :src="profile_picture" class="profile-picture">
            <div class="audio-desc">
                <div ref="LoopName" class="desc-title">{{title}}</div>
                <div ref="ArtistName" class="desc-artist subtext">{{info}}</div>
            </div>
        </div>
        <div class="playback-controls">
            <vue-feather
                class="icon-btn"
                :type="this.$refs.audioPlayer == undefined || this.$refs.audioPlayer.paused ? 'play' : 'pause'"
                
                @click="togglePlay()"
            />
        </div>
        <vue-slider
            v-model="position"
            id="playbackSlider"
            ref="playbackSlider"
            :lazy="true"
            :min="0"
            :max="1"
            :interval=".0001"
            @drag-start="dragging = true"
            @drag-end="dragging = false; positionToAudio()"
            tooltip="none"
            :dragOnClick="true"
        />
        <vue-feather
            class="icon-btn"
            type="volume-x"
            
            v-if="volume==0"
            @click="volume = prevVolume"
        />
        <div v-else @click="prevVolume = volume; volume = 0" style="height: 18px">
            <vue-feather class="icon-btn" type="volume"  v-if="volume < 33"></vue-feather>
            <vue-feather class="icon-btn" type="volume-1"  v-else-if="volume < 67"></vue-feather>
            <vue-feather class="icon-btn" type="volume-2"  v-else-if="volume >= 67"></vue-feather>
        </div>
        <vue-slider
            v-model="volume"
            id="volumeSlider"
            :min="0"
            :max="100"
        />
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    import VueSlider from 'vue-slider-component';

    export default {
        name:'PlayBar',
        components: {
            VueFeather,
            VueSlider
        },
        props: {
        },
        methods: {
            loadSample(res){
                this.$data.title = res.title;
                this.$data.info = res.author + " | " + res.tempo + " | " + res.key;
                this.$data.profile_picture = res.profile_pic;

                let audio = document.getElementById("audioPlayer");
                if(audio == undefined) return;
                if(res.mp3_url == audio.src){
                    if(audio.currentTime == audio.duration){
                        audio.currentTime=0;
                    }
                    if (audio.paused) {
                        audio.play();
                    } else {
                        audio.pause();
                    }
                    return;
                }
                audio.src = res.mp3_url;
                audio.play();
            },
            togglePlay(){
                let audio = document.getElementById("audioPlayer");
                if(audio == undefined) return;
                if (audio.paused) {
                    audio.play();
                } else {
                    audio.pause();
                }
            },
            getPlaybackPos(){
                let audio = document.getElementById("audioPlayer");
                if(audio == undefined) return 0;
                if(!this.$data.dragging)
                return audio.currentTime / audio.duration;
            },
            setPlaybackPos(){
                let audio = document.getElementById("audioPlayer");
                if(audio == undefined) return 0;
                    this.$data.position = audio.currentTime / audio.duration;
            },
            getDuration(){
                let audio = document.getElementById("audioPlayer");
                if(audio == undefined) return 0;
                return audio.duration;
            },
            positionToAudio(){
                let audio = document.getElementById("audioPlayer");
                if(audio == undefined) return 0;
                setTimeout(audio.currentTime = audio.duration * this.$data.position, 10);
            }
        },
        data() {
            return {
                position: 0,
                volumePercent: 100,
                loop: false,
                title: "",
                info: "",
                profile_picture: "",
                volume: 100,
                prevVolume: 100,
                dragging: false
            }
        }
    }
</script>

<style lang="scss">
    @import "../styles/globals.scss";
    @import "../styles/slider.scss";

    .play-bar{
        @include glass($playbar-background, false, false);
        padding: 0 $side-padding;
        gap: $side-padding;
        height: 90px;
        align-items: center;
        display: flex;
        border-top: 1px solid $seperator;
        &.hidden{
            display: none;
        }
    }
    .info-audio{
        display: flex;
        align-items: center;
        flex-grow: 2;
        height: 100%;
    }
    .profile-picture{
        width: 36px;
        image-rendering: crisp-edges;
        border-radius: $radius;
    }
    .audio-desc{
        margin-left: $item-gap / 2;
        div{
            width: max-content;
        }
        overflow: hidden;
        width: 10px;
        flex-grow: 1;
    }
    .playback-controls{
        display: flex;
        gap: $item-gap;
        align-items: center;
    }
    #volumeSlider{
        width: 120px !important;
    }
    #playbackSlider{
        flex-grow: 2;
    }
</style>