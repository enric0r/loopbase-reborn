<template>
    <div class="title-bar">
        <div class="window-btns">
            <div><h4>♾️</h4></div>
            <div><h4>LoopBase</h4></div>
        </div>
        <SearchBar
            placeholder="Search for loops..."
            @submitSearch="this.$parent.search()"
            ref="SearchBar"
            id="topSearch"
        />
        <div class="actions">
            <vue-feather size="24" type="folder" @click="revealFile('')"/>
            <vue-feather size="24" type="settings" @click="showSettings()"/>
        </div>
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    import SearchBar from './inputs/SearchBar.vue'
    const electron = require("electron");

    export default {
        components: {
            VueFeather,
            SearchBar
        },
        methods: {
            revealFile(f){
                electron.ipcRenderer.invoke('revealFile', f);
            },
            showSettings(){
                window.open();
            }
        },
    };
</script>

<style lang="scss">
    @import '../styles/globals.scss';
    .title-bar{
        @include glass($background-100, false, false);
        -webkit-app-region: drag;
        justify-content: space-between;
        color: $foreground-100;
        padding: 0 $side-padding;
        height: 52px;
        display: flex;
        align-items: center;
        gap: $item-gap;
        border-bottom: 1px solid $seperator;
        >*{
            -webkit-app-region: no-drag;
        }
    }
    .window-btns {
        display: flex;
        gap: 8px;
        div{
            width: 12px;
            height: 12px;
            background-color: transparent;
            border-radius: 6px;
        }
    }
    .actions{
        display: flex;
        gap: $item-gap;
        .vue-feather, .vue-feather > svg {
            stroke: $foreground-200;
            cursor: pointer;
            width: 18px !important;
            aspect-ratio: 1;
        }
    }
</style>