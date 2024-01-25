<template>
    <div class="switch" @click="flip()">
        <div class="switch-label"> {{title}} </div>
        <div class="switch-outer" :class="{ active: value }">
            <div class="switch-inner" :class="{ active: value }">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Switch",
    emits: ['update:modelValue'],
    props:{
        modelValue: Boolean,
        title: String
    },
    data() {
        return {
            value: false,
        }
    },
    methods: {
        flip(){
            this.value = !this.value;
            this.$emit('update:modelValue', this.value);
        }
    }
}
</script>

<style lang="scss">
    @import '../../styles/globals.scss';
    .switch{
        display: flex;
        justify-content: space-between;
    }
    .switch-inner{
        width: $radius * 2;
        aspect-ratio: 1;
        border-radius: $radius;
        background: $foreground-100;
        transition-duration: $animation-duration;
        transition-timing-function: $animation-timing;
        &.active{
            margin-left: $radius * 2;
        }
    }
    .switch-outer{
        width: $radius * 4;
        border-radius: $radius;
        background-color: $background-100;
        cursor: pointer;
        transition-duration: $animation-duration;
        transition-timing-function: $animation-timing;
        &.active{
            background-color: $accent-2;
        }
    }
    .switch-label{
        color: $foreground-200;
    }
</style>