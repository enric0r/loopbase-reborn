<template>
  <TitleBar ref="TitleBar"/>
  <MainContent ref="MainContent"/>
  <PlayBar ref="PlayBar"/>
</template>

<script>
  import TitleBar from './components/TitleBar.vue';
  import MainContent from './components/MainContent.vue';
  import PlayBar from './components/PlayBar.vue';
  import '@fontsource/rubik/400.css';
  import '@fontsource/rubik/700.css';
  import '@ibm/plex/scss/ibm-plex.scss';

  export default {
      name: 'App',
      components: {
          TitleBar,
          MainContent,
          PlayBar
      },
      methods: {
          search(){
              let originalQuery = this.$refs.TitleBar.$refs.SearchBar.value;
              let topBarQuery = this.$refs.MainContent.$refs.TopArea.queryInfo;
              let query = {
                  category:       topBarQuery.category,
                  keys:           '',
                  order:          topBarQuery.order,
                  tempo:          topBarQuery.tempo,
                  page:           1,
                  key:            [topBarQuery.key[0], topBarQuery.key[1]],
                  date:           topBarQuery.date,
                  genre:          topBarQuery.genre,
                  filterByKey:    this.$refs.MainContent.$refs.TopArea.filterAdded.key
              };

              // This matches every ocurrence of (NUMBER) BPM in the query
              let bpmregex = /[0-9]+ *bpm(?: |$)/gi;
              let bpmtext = Array.from(originalQuery.matchAll(bpmregex));
              query.keys = originalQuery.replaceAll(bpmregex, "");

              if(bpmtext.length > 0){
                  query.tempo = bpmtext.pop()[0].match(/[1-9][0-9]*/)[0];
                  query.tempo = [Number(query.tempo), Number(query.tempo)];
                  this.$refs.MainContent.$refs.TopArea.setTempo(query.tempo);
              }

              // This matches every occurence of a key in the query
              let keyregex = /([a-g]|A-G) *[#b]? *(maj|min)(or)?(?: |$)/gi;
              let keytext = Array.from(originalQuery.matchAll(keyregex));
              query.keys = query.keys.replaceAll(keyregex, "");

              // Remove BPM/Key information from query
              this.$refs.TitleBar.$refs.SearchBar.value = query.keys.replaceAll("  ", " ").trim();

              if(keytext.length > 0){
                  query.filterByKey = true;
                  let keymatch = keytext.pop()[0].toLowerCase();
                  let note = keymatch[0];
                  if(keymatch[1] == "#") note += "s";
                  if(keymatch[1] == "b") {
                      let charcode = (keymatch.charCodeAt(1) - "a".charCodeAt(0)) + 1;
                      charcode %= 8;
                      charcode += "a".charCodeAt(0);
                      note = String.fromCharCode(charcode);
                  }
                  query.key = [
                      note,
                      keymatch.match(/(maj|min)/i)[0].toLowerCase() == "min" ? "m" : ""
                  ];
              }

              console.log(query);
              this.$refs.MainContent.$refs.TopArea.$data.query = query;
              this.$refs.MainContent.$refs.Results.$data.query = query;
              this.$refs.MainContent.$refs.Results.reset();
          }
      }
  }
</script>

<style lang="scss">
  @import 'styles/globals.scss';
  body{
      margin: 0;
      background-color: $window-background;
      overflow-y: overlay;
  }
  #app {
      color: $foreground-100;
      font-size: $font-size;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: $window-background;
      .title-bar{
          top: 0;
      }
      .title-bar, .play-bar{
          z-index: 5;
          position: fixed;
          box-sizing: border-box;
          width: 100%;
      }
      .main-content{
          z-index: -1;
      }
      .play-bar{
          bottom: 0;
      }
  }
  *::-webkit-scrollbar {
      width: 10px;
      margin-right: 10px;
  }

  *::-webkit-scrollbar-track {
      background: transparent;
  }

  *::-webkit-scrollbar-thumb {
      transition: $animation-duration;
      background-color: rgba($foreground-100, 25%);
      &:hover{
          background-color: rgba($foreground-100, 50%);
      }
      border-radius: 10px;
  }
  @media only screen and (max-width: 800px) {
      .mono-value{
          letter-spacing: -.5px;
      }
      .info-duration{
          display: none;
      }
      .result{
          grid-template-columns: $profile-pic-large-size auto 6ch 5ch;
          gap: $item-gap / 1.5;
          row-gap: $item-gap / 2;
          grid-template-areas: 
              "p d k b "
              "v v a a ";
          .result-profile-pic{
              grid-area: p;
          }
          .visualizer{
              grid-area: v;
          }
          .actions-result{
              grid-area: a;
          }
          .info-key{
              grid-area: k;
          }
          .info-bpm{
              grid-area: b;
          }
          .info-audio{
              grid-area: d;
          }
      }
  }
  @media only screen and (max-width: 600px) {
      h1{ font-size: $font-size * 5 * $scale; }
  }
  @media only screen and (max-width: 500px) {
      .result{
          grid-template-columns: $profile-pic-large-size auto 6ch;
          grid-template-rows: auto;
          grid-template-areas: 
              "p d k"
              "p d b"
              "v v v"
              "a a a";
          .actions-result{
              width: 100%;
          }
      }
      h1{ font-size: $font-size * 4 * $scale; }
  }
  @media only screen and (max-width: 400px) {
      #topSearch{ display: none; }
      #bottomSearch{ display: block; }
      h1{ font-size: $font-size * 3 * $scale; }
  }
  @media only screen and (max-width: 300px) {
      .result{
          grid-template-columns: $profile-pic-large-size auto;
          grid-template-areas: 
              "p k"
              "p b"
              "d d"
              "v v"
              "a a";
      }
      .hide-bp-300{
          display: none;
      }
      h1{ font-size: $font-size * 2 * $scale; }
  }
</style>
