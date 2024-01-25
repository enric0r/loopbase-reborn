<template>
    <div class="button" :class="{ secondary: secondary }">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "Button",
    props: {
        secondary: Boolean
    }
}
</script>

<style lang="scss">
    @import '../../styles/globals.scss';
    .button{
        background-color: $accent-1;
        transition-duration: $animation-duration;
        transition-timing-function: $animation-timing;
        border-radius: $radius;
        height: $item-scale;
        padding: $item-gap;
        padding-top: $item-gap / 2;
        padding-bottom: $item-gap / 2;
        width: fit-content;
        background: $accent-1;
        cursor: pointer;
        font-weight: 900;
        &:hover{
            background: darken($accent-1, 10%);
        }
        &:active{
            background: darken($accent-1, 20%);
        }
        &.secondary{
            background-color: $foreground-100;
            &:hover{ background: darken($foreground-100, 10%); }
            &:active{ background: darken($foreground-100, 20%); }
            color: $inverse-foreground;
        }
    }
    .button-duo{
        display: flex;
        justify-content: space-between;
    }
</style>