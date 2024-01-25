<template>
    <div class="SearchBar" ref="SearchBar">
        <div class="inner">
            <vue-feather type="search" size="12" class="search" @onclick="submit"></vue-feather>
            <input class="input"
                ref="input"
                contenteditable="true"
                v-bind:placeholder="placeholder"
                v-model="value"
                v-on:keyup.enter="submit"
            >
        </div>
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    export default {
        name: 'SearchBar',
        components: {
            VueFeather
        },
        data() {
            return {value: ""};
        },
        props: {
            placeholder: String
        },
        methods: {
            submit(){
                this.$emit('submitSearch');
            }
        }
    }
</script>

<style lang="scss">
@import "../../styles/globals.scss";

::-webkit-input-placeholder{
    color: $foreground-200;
}

.SearchBar{
    flex-shrink: 1;
    flex-grow: 0;
    width: 437px;
    .inner svg{
        stroke: $foreground-200;
        height: $font-size * .9;
        stroke-width: 3.5;
    }
    background-color: $background-200;
    border-radius: $radius;
    height: 26px;
    transition-duration: $animation-duration;
    transition-timing-function: $animation-timing;
    cursor: text;
    border: 1px rgba(255,255,255,.1) solid;
    border-radius: $radius;
    box-shadow: inset 0px -3px 1px -2px rgba(255,255,255,.2);
}
.inner{
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: $item-gap;
    height: 100%;
    width: 100%;
    max-width: 100%;
    transition-duration: $animation-duration;
    transition-timing-function: $animation-timing;
}
.input{
    background: transparent;
    border: 0px;
    outline: 0px;
    outline: none;
    display: inline-block;
    white-space: nowrap;
    color: $foreground-200;
    overflow: visible;
    width: 100%;
    height: 100%;
}
</style>