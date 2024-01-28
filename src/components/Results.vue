<template>
    <div class="results" ref="resultsArea">
        <div class="result" v-for="res in resultsData" :key="res.mp3_url"
            @dragstart.prevent="if (res.downloaded) startDrag(res.localPath);" draggable="true">
            <div class="result-profile-pic">
                <img :src="res.profile_pic" class="profile-picture-large">
                <div class="play-btn icon-btn" @click="playResult(res)">
                    <vue-feather type="play" />
                </div>
            </div>
            <div class="info-audio">
                <div class="audio-desc">
                    <div ref="LoopName" class="desc-title">{{ res.title }}</div>
                    <div ref="AuthorName" class="desc-author subtext">{{ res.author }}</div>
                </div>
            </div>
            <img class="visualizer" :src="res.waveform" draggable="false">
            <div class="mono-value info-duration">{{ res.duration }}</div>
            <div class="mono-value info-key">{{ res.key }}</div>
            <div class="mono-value info-tempo">{{ res.tempo }}</div>
            <div class="actions-result">
                <vue-feather type="trash-2" v-if="res.downloaded" class="icon-btn"
                    @click="remove(res.localPath).then(res.downloaded = false)" />
                <div class="icon-spacer" v-else />
                <vue-feather type="folder" v-if="res.downloaded" class="icon-btn"
                    @click="revealFile(res.localPath)" />
                <vue-feather type="download" v-else class="icon-btn"
                    @click="download(res.mp3_url, res.localPath).then(res.downloaded = true)" />
                <vue-feather type="heart" id="like" v-bind:class="[{ liked: false }, 'like', 'icon-btn']" />
                <vue-feather type="link" class="icon-btn" @click="openLink(res.web_link)" />
            </div>
        </div>
    </div>
    <VueEternalLoading :load="load" v-model:is-initial="isInitial" id="loading-section">
        <span class="loader"></span>
    </VueEternalLoading>
</template>

<script>
import VueFeather from 'vue-feather';
const electron = require("electron");
import { VueEternalLoading } from '@ts-pro/vue-eternal-loading';

export default {
    components: {
        VueFeather,
        VueEternalLoading
    },
    name: 'Results',
    data() {
        return {
            resultsData: [],
            query: {
                category: 0,
                keys: '',
                order: ['date', 'd'],
                tempo: [0, 200],
                page: 1,
                key: ['c', ''],
                date: 0,
                genre: 0,
                filterByKey: false
            },
            isInitial: false
        };
    },
    methods: {
        load({ loaded }) {
            electron.ipcRenderer.invoke("search", {
                category: this.query.category,
                keys: this.query.keys,
                order: [this.query.order[0], this.query.order[1]],
                tempo: [this.query.tempo[0], this.query.tempo[1]],
                page: this.query.page,
                key: [this.query.key[0], this.query.key[1]],
                date: this.query.date,
                genre: this.query.genre,
                filterByKey: this.query.filterByKey
            }).then(res => {
                // if(res.length < 0){
                //     return;
                // }
                res.forEach((r) => {
                    r.filename = r.mp3_url.split("/").splice(-1)[0].split("?")[0];
                    r.localPath = "loops/"
                        + r.category.toLowerCase() + '/'
                        + r.tempo.replace(' ', '_') + '_'
                        + (r.key != "Unknown" ? r.key.toLowerCase() + '_' : '')
                        + r.filename;

                    let oldKey = r.key;
                    if (oldKey == "Unknown") {
                        r.key = "Unknown";
                    } else {
                        r.key = oldKey[0] + (oldKey[1] == "#" ? "#" : " ");
                        if (oldKey.slice(-1) == "m") {
                            r.key += " Minor";
                        } else {
                            r.key += " Major";
                        }
                    }

                    if (r.tempo[2].match(/\d+/g) == null) {
                        r.tempo = " " + r.tempo;
                    }

                    electron.ipcRenderer.invoke("fileExists", r.localPath).then((exists) => {
                        r.downloaded = exists;
                        this.addResult(r);
                    })
                });
                loaded(res.length, 10);
                this.query.page++;
            });
        },
        reset() {
            this.resultsData = []
            this.isInitial = true;
        },
        addResult(res) {
            this.resultsData.push(res);
        },
        openLink(link) {
            electron.ipcRenderer.invoke('openLink', link);
        },
        async download(mp3_url, localPath) {
            return new Promise((resolve) => {
                electron.ipcRenderer.invoke('downloadMP3', {
                    url: mp3_url,
                    dest: localPath
                }).then(() => {
                    resolve()
                });
            });
        },
        async remove(localPath) {
            return new Promise((resolve) => {
                electron.ipcRenderer.invoke('fileDelete', localPath).then(() => {
                    resolve()
                });
            });
        },
        revealFile(path) {
            electron.ipcRenderer.invoke('revealFile', path);
        },
        startDrag(path) {
            electron.ipcRenderer.send('ondragstart', path);
        },
        playResult(res) {
            let playbar = this.$parent.$parent.$refs.PlayBar;
            playbar.loadSample(res);
        }
    },
}
</script>

<style lang="scss">
@import "../styles/globals.scss";

.results {
    width: 100vw;
    height: fit-content;
}

#loading-section {
    padding-top: $item-gap;
    padding-bottom: 90px + $item-gap;
    margin: auto;
}

.loader {
    width: 48px;
    height: 48px;
    border: 5px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}

.result {
    width: calc(100% - $side-padding * 2);
    display: grid;
    grid-template-columns: $profile-pic-large-size 1fr 1fr 5ch 8ch 7ch auto;
    margin: auto;
    padding: $item-gap/1.5;
    gap: $item-gap;
    align-items: center;
    border-radius: $radius;

    .info-audio {
        @include side-gradient(to right, $window-background);
        flex-grow: 2;

        .desc-title {
            font-weight: 700;
        }

        .desc-author {
            cursor: pointer;
        }
    }

    &:hover {
        background-color: $window-hover;

        .info-audio {
            @include side-gradient(to right, $window-hover);
        }

        .play-btn {
            opacity: 1;
            background-color: rgba($background-300, .8);
        }

        .actions-result svg {
            stroke: $foreground-100;
        }

        .desc-author {
            &:hover {
                color: $foreground-100;
                transition-duration: $animation-duration;
                transition-timing-function: $animation-timing;
                text-decoration-thickness: 2px;
                text-decoration: underline solid;
            }
        }

        .mono-value {
            color: $foreground-100;
            transition-duration: $animation-duration;
            transition-timing-function: $animation-timing;
        }
    }

    transition-duration: $animation-duration;
    transition-timing-function: $animation-timing;

    .mono-value {
        color: $foreground-200;
    }

    .audio-desc {
        margin-left: 0;
    }

    .actions-result {
        width: 125px - $item-gap;
        display: flex;
        justify-content: space-between;

        svg {
            stroke: $foreground-300;
        }
    }
}

.result-profile-pic {
    display: flex;
    flex-direction: row;
}

.profile-picture-large {
    border-radius: $radius;
    aspect-ratio: 1;
    width: $profile-pic-large-size;
}

.visualizer {
    height: $profile-pic-large-size;
    width: 100%;
    background: #000;
    filter: invert(1);
    mix-blend-mode: lighten;
    opacity: .5;
}

.icon-spacer {
    width: $item-scale;
}

.like {
    &.liked svg {
        fill: $accent-1;
        stroke: $accent-1;

        &:hover {
            fill: rgba($accent-1, .3);
            stroke: $accent-1;
        }

        &:active {
            fill: rgba($accent-1, .5);
            stroke: $accent-1;
        }
    }
}

.play-btn {
    width: $profile-pic-large-size;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -$profile-pic-large-size;
    opacity: 0;
    background-color: $background-300;

    svg {
        stroke: $foreground-100;
    }

    border-radius: $radius;
    transition-duration: $animation-duration;
    transition-timing-function: $animation-timing;
}
</style>