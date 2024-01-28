<template>
    <div class="top-area">
        <p ref="LibraryName" class="LibraryName">
            {{query.keys == undefined || query.keys == "" ? library_name : "Search results for:"}}</p>
        <h2>
            <span :if="query.keys == undefined || query.keys == ''">{{query.keys}}</span>
            {{section_name}}
        </h2>
        <SearchBar
            placeholder="Search for loops..."
            @submitSearch="this.$parent.$parent.search()"
            ref="SearchBar"
            id="bottomSearch"
        />
        <div class="tags-container" v-if="search_header">
            <div class="tags-left">
                <div>
                    <div class="tag"
                        @click.self="filterEnabled.tempo = !filterEnabled.tempo;
                                filterValues.tempoRange = queryInfo.tempo"
                        :class="{ active: filterAdded.tempo }"
                    >
                        <vue-feather
                            type="activity"
                            size="18"
                            @click="filterEnabled.tempo = !filterEnabled.tempo;
                                    filterValues.tempoRange = queryInfo.tempo"
                        />
                        <div
                            @click="filterEnabled.tempo = !filterEnabled.tempo;
                                    filterValues.tempoRange = queryInfo.tempo"
                        >
                            Tempo<span
                                v-if="filterAdded.tempo"
                                class="hide-bp-300"
                            >: {{
                                    queryInfo.tempo[0] == queryInfo.tempo[1] ?
                                        queryInfo.tempo[0] :
                                        queryInfo.tempo[0] + " - " + queryInfo.tempo[1]
                                }} BPM</span>
                        </div>
                        <vue-feather
                            type="x"
                            size="18"
                            @click="
                                filterAdded.tempo = false;
                                this.$parent.$parent.search();
                            "
                            :class="{hidden: !filterAdded.tempo}"
                        />
                    </div>
                    <div class="tag-popout" :class="{ hidden: !filterEnabled.tempo }">
                        <h2>Tempo</h2>
                        <vue-slider
                            v-model="filterValues.tempoRange"
                            id="playbackSlider"
                            ref="playbackSlider"
                            :lazy="true"
                            :min="0"
                            :max="200"
                            :interval="1"
                        />
                        <div class="button-duo"
                            @click="filterEnabled.tempo = false"
                        >
                            <Button
                                @click="
                                    queryInfo.tempo = filterValues.tempoRange;
                                    filterAdded.tempo = true;
                                    this.$parent.$parent.search();
                                "
                            >
                                Apply
                            </Button>
                            <Button secondary @click="filterValues.tempoRange = queryInfo.tempo">Cancel</Button>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="tag"
                        @click.self="filterEnabled.key = !filterEnabled.key;
                                filterValues.key = queryInfo.key"
                        :class="{ active: filterAdded.key }"
                    >
                        <vue-feather
                            type="music"
                            size="18"
                            @click="filterEnabled.key = !filterEnabled.key;
                                    filterValues.key = queryInfo.key"
                        />
                        <div
                            @click="filterEnabled.key = !filterEnabled.key;
                                    filterValues.key = queryInfo.key"
                        >
                            Key<span
                                v-if="filterAdded.key"
                                class="hide-bp-300"
                            >: {{
                                queryInfo.key[0].charAt(0).toUpperCase() +
                                (queryInfo.key[0].charAt(1) == "s" ? "#" : "") + " " +
                                (queryInfo.key[1] == "m" ? "Minor" : "Major")
                            }}</span>
                        </div>
                        <vue-feather
                            type="x"
                            size="18"
                            @click="
                                filterAdded.key = false;
                                this.$parent.$parent.search();
                            "
                            :class="{hidden: !filterAdded.key}"
                        />
                    </div>
                    <div class="tag-popout" :class="{ hidden: !filterEnabled.key }">
                        <h2>Key</h2>
                        <Switch
                            class="keyModeSwitch"
                            @update:modelValue="v => filterValues.key[1] = (v ? 'm' : '')"
                            :title="'Mode: ' + (filterValues.key[1] == 'm' ? 'Minor' : 'Major')"
                        />
                        <div>
                            <div class="key-row sharps">
                                <div @click="filterValues.key[0] = 'cs'" :class="{selected : filterValues.key[0] == 'cs'}">C#</div>
                                <div @click="filterValues.key[0] = 'ds'" :class="{selected : filterValues.key[0] == 'ds'}">D#</div>
                                <div class="key-seperator"></div>
                                <div @click="filterValues.key[0] = 'fs'" :class="{selected : filterValues.key[0] == 'fs'}">F#</div>
                                <div @click="filterValues.key[0] = 'gs'" :class="{selected : filterValues.key[0] == 'gs'}">G#</div>
                                <div @click="filterValues.key[0] = 'as'" :class="{selected : filterValues.key[0] == 'as'}">A#</div>
                            </div>
                            <div class="key-row">
                                <div @click="filterValues.key[0] = 'c'" :class="{selected : filterValues.key[0] == 'c'}">C</div>
                                <div @click="filterValues.key[0] = 'd'" :class="{selected : filterValues.key[0] == 'd'}">D</div>
                                <div @click="filterValues.key[0] = 'e'" :class="{selected : filterValues.key[0] == 'e'}">E</div>
                                <div @click="filterValues.key[0] = 'f'" :class="{selected : filterValues.key[0] == 'f'}">F</div>
                                <div @click="filterValues.key[0] = 'g'" :class="{selected : filterValues.key[0] == 'g'}">G</div>
                                <div @click="filterValues.key[0] = 'a'" :class="{selected : filterValues.key[0] == 'a'}">A</div>
                                <div @click="filterValues.key[0] = 'b'" :class="{selected : filterValues.key[0] == 'b'}">B</div>
                            </div>
                        </div>
                        <div class="button-duo"
                            @click="filterEnabled.key = false"
                        >
                            <Button
                                @click="
                                    queryInfo.key = filterValues.key;
                                    filterAdded.key = true;
                                    this.$parent.$parent.search();
                                "
                                v-if="filterValues.key[0] != ' '"
                            >
                                Apply
                            </Button>
                            <Button secondary @click="filterValues.key = queryInfo.key">Cancel</Button>
                        </div>
                    </div>
                </div>
                <div class="tag"
                    @click.self="filterEnabled.genre = !filterEnabled.genre"
                    :class="{ active: queryInfo.genre != 0 }
                ">
                        <div
                            @click="filterEnabled.genre = !filterEnabled.genre;
                                    filterValues.genre = queryInfo.genre"
                        >
                            Genre<span
                                v-if="queryInfo.genre != 0"
                                class="hide-bp-300"
                            >: {{
                                genrelist.find(e => e[0] == queryInfo.genre)[1]
                            }}</span>
                        </div>
                        <vue-feather
                            type="x"
                            size="18"
                            @click="
                                queryInfo.genre = 0;
                                this.$parent.$parent.search();
                            "
                            :class="{hidden: queryInfo.genre == 0}"
                        />
                </div>
                <div class="tag-popout" :class="{ hidden: !filterEnabled.genre }">
                    <h2>Genre</h2>
                    <div class="select">
                        <div
                            class="option"
                            v-for="genre in genrelist"
                            :key="genre[0]"
                            :class="{selected : parseInt(genre[0]) == queryInfo.genre}"
                            @click="
                                queryInfo.genre = parseInt(genre[0]);
                                this.$parent.$parent.search();
                                filterEnabled.genre = false;
                                filterAdded.genre = true;

                            "
                        >
                            {{genre[1]}}
                        </div>
                    </div>
                </div>
                <div class="tag"
                    @click.self="filterEnabled.category = !filterEnabled.category"
                    :class="{ active: queryInfo.category != 0 }
                ">
                        <div
                            @click="filterEnabled.category = !filterEnabled.category;
                                    filterValues.category = queryInfo.category"
                        >
                            Category<span
                                v-if="queryInfo.category != 0"
                                class="hide-bp-300"
                            >: {{
                                categorylist.find(e => e[0] == queryInfo.category)[1]
                            }}</span>
                        </div>
                        <vue-feather
                            type="x"
                            size="18"
                            @click="
                                queryInfo.category = 0;
                                this.$parent.$parent.search();
                            "
                            :class="{hidden: queryInfo.category == 0}"
                        />
                </div>
                <div class="tag-popout" :class="{ hidden: !filterEnabled.category }">
                    <h2>Category</h2>
                    <div class="select">
                        <div
                            class="option"
                            v-for="category in categorylist"
                            :key="category[0]"
                            :class="{selected : parseInt(category[0]) == queryInfo.category}"
                            @click="
                                queryInfo.category = parseInt(category[0]);
                                this.$parent.$parent.search();
                                filterEnabled.category = false;
                                filterAdded.category = true;
                            "
                        >
                            {{category[1]}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="tag-duo">
                <div
                    @click="filterEnabled.sort = !filterEnabled.sort"
                >
                    Sort by {{queryInfo.order[0]}}
                </div>
                <vue-feather
                    :type="queryInfo.order[1] == 'd'? 'chevron-down' : 'chevron-up'"
                    size="18"
                    @click="
                        queryInfo.order[1] = (queryInfo.order[1] == 'd' ? 'a' : 'd')
                        this.$parent.$parent.search();
                    "
                />
            </div>
            <div
                class="tag-popout align-left"
                :class="{ hidden: !filterEnabled.sort }"
            >
                <h2>Sort by</h2>
                <div class="select">
                    <div
                        class="option"
                        v-for="sort in [
                            ['date', 'Date'], ['name', 'Title'],
                            ['author', 'Author'],
                            ['tempo', 'Tempo'],
                            ['downloads', 'Downloads'],
                            ['comments', 'Comments']
                        ]"
                        :key="sort[0]"
                        :class="{selected : sort[0] == queryInfo.order[0]}"
                        @click="
                            queryInfo.order[0] = sort[0];
                            this.$parent.$parent.search();
                            filterEnabled.sort = false;
                        "
                    >
                        {{sort[1]}}
                    </div>
                </div>
            </div>
        </div>
        <div class="results-header" v-if="search_header">
            <div style="width: 52px">User</div>
            <div style="flex-grow: 1">Title</div>
            <div>Duration</div>
            <div style="width: 68px">Key</div>
            <div style="width: 183px">Tempo</div>
        </div>
    </div>
</template>

<script>
    import VueFeather from 'vue-feather';
    import VueSlider from 'vue-slider-component';
    import Button from './inputs/Button.vue';
    import SearchBar from './inputs/SearchBar.vue';
    import Switch from './inputs/Switch.vue';
    export default {
        name: "TopArea",
        components: {
            VueFeather,
            VueSlider,
            Button,
            SearchBar,
            Switch
        },
        props: {
            library_name: String,
            section_name: String,
            search_header: Boolean
        },
        data() {
            return {
                queryInfo: {
                    category:       0,
                    order:          ['date', 'd'],
                    tempo:          [0,200],
                    tempoRange:     false,
                    key:            ['',''],
                    date:           0,
                    genre:          0,
                    filterByKey:    false,
                },
                query : {

                },
                filterEnabled: {
                    tempo: false,
                    key: false,
                    sort: false,
                    genre: false,
                    category: false
                },
                filterAdded: {
                    tempo: false,
                    key: false,
                    genre: false,
                    category: false
                },
                filterValues: {
                    tempoRange:          [0,200],
                    key:                ['', false]
                },
                genrelist: [['0', 'All Genres'], ['56', '8Bit Chiptune'], ['52', 'Acid'], ['3', 'Acoustic'], ['67', 'Afrobeat'], ['2', 'Ambient'], ['66', 'Big Room'], ['33', 'Blues'], ['65', 'Boom Bap'], ['37', 'Breakbeat'], ['21', 'Chill Out'], ['36', 'Cinematic'], ['13', 'Classical'], ['51', 'Comedy'], ['44', 'Country'], ['39', 'Crunk'], ['17', 'Dance'], ['55', 'Dancehall'], ['30', 'Deep House'], ['23', 'Dirty'], ['18', 'Disco'], ['11', 'Drum And Bass'], ['5', 'Dub'], ['49', 'Dubstep'], ['64', 'EDM'], ['42', 'Electro'], ['16', 'Electronic'], ['15', 'Ethnic'], ['25', 'Folk'], ['19', 'Funk'], ['46', 'Fusion'], ['24', 'Garage'], ['31', 'Glitch'], ['43', 'Grime'], ['53', 'Grunge'], ['48', 'Hardcore'], ['61', 'Hardstyle'], ['27', 'Heavy Metal'], ['7', 'Hip Hop'], ['22', 'House'], ['63', 'Indie'], ['38', 'Industrial'], ['6', 'Jazz'], ['10', 'Jungle'], ['69', 'Latin'], ['62', 'Lo-Fi'], ['57', 'Moombahton'], ['34', 'Orchestral'], ['70', 'Phonk'], ['50', 'Pop'], ['60', 'Psychedelic'], ['14', 'Punk'], ['8', 'Rap'], ['20', 'Rave'], ['4', 'Reggae'], ['32', 'Reggaeton'], ['45', 'Religious'], ['12', 'RnB'], ['1', 'Rock'], ['29', 'Samba'], ['41', 'Ska'], ['59', 'Soul'], ['47', 'Spoken Word'], ['9', 'Techno'], ['28', 'Trance'], ['54', 'Trap'], ['58', 'Trip Hop'], ['68', 'UK Drill'], ['35', 'Weird']],
                categorylist : [['0','All Categories'],['40','Accordion'],['47','Arpeggio'],['35','Bagpipe'],['36','Banjo'],['2','Bass'],['43','Bass Guitar'],['44','Bass Synth'],['39','Bass Wobble'],['31','Beatbox'],['42','Bells'],['23','Brass'],['34','Choir'],['37','Clarinet'],['28','Didgeridoo'],['1','Drum'],['7','Flute'],['5','Fx'],['24','Groove'],['33','Guitar Acoustic'],['3','Guitar Electric'],['25','Harmonica'],['41','Harp'],['30','Harpsichord'],['32','Mandolin'],['22','Orchestral'],['26','Organ'],['11','Pad'],['20','Percussion'],['21','Piano'],['46','Rhodes Piano'],['12','Scratch'],['9','Sitar'],['45','Soundscapes'],['10','Strings'],['4','Synth'],['8','Tabla'],['38','Ukulele'],['29','Violin'],['6','Vocal'],['27','Woodwind']]
            }
        },
        methods:{
            setTempo(values){
                this.filterAdded.tempo = true;
                this.queryInfo.tempo = values;
                console.log(values);
            },
            sendQuery(){
                this.$parent.search();
            }
        }
    }
</script>

<style lang="scss">
    @import '../styles/globals.scss';

    .top-area{
        padding: $side-padding;
        padding-bottom: $item-gap;
        border-bottom: 1px solid $background-300;
        width: calc(100% + 1px);    // TODO: Find a better alternative to this questionable hack
        box-sizing: border-box;
        h2{
            margin: auto;
        }
    }
    .LibraryName{
        margin: auto;
        color: $foreground-200;
    }
    .tags-container{
        margin: auto;
        margin-top: $item-gap;
        .tag-duo{
            flex-shrink: 0;
        }
    }
    .tags-container, .tags-left{
        display: flex;
        flex-grow: 1;
        gap: $item-gap;
        flex-wrap: wrap;
    }
    .tags-left{
        overflow: auto;
    }
    .tag, .tag-duo > *{
        float: left;
        display: flex;
        gap: 8px;
        height: $item-scale;
        padding: 8px;
        padding-top: 4px;
        padding-bottom: 4px;
        border-radius: $radius;
        font-weight: 900;
        cursor: pointer;
        transition-duration: $animation-duration;
        transition-timing-function: $animation-timing;
        background-color: $background-100;
        &:hover{ background: $background-300; }
        &:active{ background: $background-400; }
        &.active{
            background: $accent-1;
            &:hover{ background: darken($accent-1, 10%); }
            &:active{ background: darken($accent-1, 20%); }
            color: $foreground-100;
        }
        color: $foreground-200;
    }
    .tag-duo{
        display: flex;
        div{
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        i {
            margin-left: -2px;
            padding-left: 8px;
            padding-right: 8px;
            padding-top: 4px;
            padding-bottom: 4px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
    .tag-popout{
        @include glass($background-200, false, true);
        min-width: 200px;
        max-height: 50vh;
        overflow: auto;
        height: fit-content;
        position: absolute;
        transform: translateY($item-scale + $item-gap);
        padding: $side-padding;
        z-index: 2;
        > *{
            margin-bottom: $item-gap / 2;
            &:last-child{
                margin-bottom: 0;
            }
        }
        &.align-left{
            transform: translate(-$side-padding, $item-scale + $item-gap);
            right: 0;
        }
    }
    .results-header{
        display: flex;
        gap: $item-gap;
        color: $foreground-200;
        margin: auto;
        margin-top: $item-gap;
    }
    .hidden{
        transform: translateY($item-scale + $item-gap + 100px);
        display: none;
    }
    .select{
        .option{
            cursor: pointer;
            background-color: $background-300;
            padding: $item-gap / 2;
            border: 1px solid $background-300;
            border-bottom: 1px solid $background-200;
            transition-duration: $animation-duration;
            transition-timing-function: $animation-timing;
            color: $foreground-200;
            &:hover:not(.selected){
                background-color: $background-400;
                border-radius: $radius;
                transform: scale(1.1);
                border: 1px solid $background-200;
                color: $foreground-100;
            }
            &:active:not(.selected){
                background-color: $background-300;
                border-radius: $radius;
                transform: scale(1.05);
                border: 1px solid $background-200;
                color: $foreground-100;
            }
            &:first-child{
                border-top-left-radius: $radius;
                border-top-right-radius: $radius;
            }
            &:last-child{
                border-bottom-left-radius: $radius;
                border-bottom-right-radius: $radius;
            }
            &.selected{
                background-color: $accent-2;
                color: $inverse-foreground;
            }
        }
    }
    .key-row{
        display: flex;
        justify-content: center;
        > div{
            cursor: pointer;
            height: $item-scale;
            aspect-ratio: 1;
            display: flex;
            justify-content: center;
            padding: $item-gap / 4;
            background-color: $background-300;
            border-radius: 50%;
            margin: $item-gap / 8;
            transition-duration: $animation-duration;
            transition-timing-function: $animation-timing;
            font-size: $font-size * .85;
            &:hover{
                background: $background-400;
            }
            &:active{
                background: $background-300;
            }
            &.selected{
                color: $inverse-foreground;
                background: $accent-2;
            }
            &.key-seperator{
                background-color: transparent !important;
                cursor: default;
            }
        }
    }
    #bottomSearch{
        width: 100%;
        background-color: $background-100;
        display: none;
        margin: $item-gap 0;
    }
</style>