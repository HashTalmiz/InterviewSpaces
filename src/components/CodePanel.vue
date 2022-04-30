<template>
  <div>
    <select v-model="language" @change="languageChange" name="languageOps" id="langOps">
      <option value="javascript">JS</option>
      <option value="text/x-c++src" >C++</option>
      <option value="java" >Java</option>
      <option value="python"> Python </option>
  </select>
    <textarea v-model="content" id="codeArea"></textarea>
  </div>
</template>

<script>

  import * as CodeMirror from 'codemirror'
  import 'codemirror/lib/codemirror.css'


  // theme css
  import 'codemirror/theme/monokai.css'

  // require active-line.js
  import'codemirror/addon/selection/active-line.js'

  // styleSelectedText
  import'codemirror/addon/selection/mark-selection.js'
  import'codemirror/addon/search/searchcursor.js'

  // hint
  import'codemirror/addon/hint/show-hint.js'
  import'codemirror/addon/hint/show-hint.css'
  import'codemirror/addon/hint/javascript-hint.js'
  import'codemirror/addon/selection/active-line.js'

  // highlightSelectionMatches
  import'codemirror/addon/scroll/annotatescrollbar.js'
  import'codemirror/addon/search/matchesonscrollbar.js'
  import'codemirror/addon/search/searchcursor.js'
  import'codemirror/addon/search/match-highlighter.js'

  // keyMap
  import'codemirror/mode/clike/clike.js'
  import'codemirror/addon/edit/matchbrackets.js'
  import'codemirror/addon/comment/comment.js'
  import'codemirror/addon/dialog/dialog.js'
  import'codemirror/addon/dialog/dialog.css'
  import'codemirror/addon/search/searchcursor.js'
  import'codemirror/addon/search/search.js'
  import'codemirror/keymap/sublime.js'

  // foldGutter
  import'codemirror/addon/fold/foldgutter.css'
  import'codemirror/addon/fold/brace-fold.js'
  import'codemirror/addon/fold/comment-fold.js'
  import'codemirror/addon/fold/foldcode.js'
  import'codemirror/addon/fold/foldgutter.js'
  import'codemirror/addon/fold/indent-fold.js'
  import'codemirror/addon/fold/markdown-fold.js'
  import'codemirror/addon/fold/xml-fold.js'
  
    //Langs
  import 'codemirror/mode/javascript/javascript'
  import 'codemirror/mode/clike/clike'
  import 'codemirror/mode/python/python'
  // import Name from '@/components/Name.vue';


  export default {
    props: {
      textCode: String
    },
    emits: ['codeChange'],
    components: {
    },
    data() {
      return {
          language: '',
          content:`#include<bits/stdc++.h>

int main() {
            
	return 0; 
}`,
          cmOption: {
            tabSize: 4,
            styleActiveLine: false,
            lineNumbers: true,
            styleSelectedText: false,
            line: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
            mode: 'text/x-c++src',
            keyMap: "sublime",
            matchBrackets: true,
            showCursorWhenSelecting: true,
            theme: "monokai",
          }
        }
    },
    mounted(){
      this.cm = CodeMirror.fromTextArea(document.getElementById('codeArea'), this.cmOption);
      this.cm.on('change', (instance, changes) => {
        const {origin} = changes;
        if(origin !== 'setValue')
          this.$emit('codeChange',instance.getValue())
      })
    },
    methods: {
      languageChange() {
        this.cm.setOption('mode', this.language)
        console.log(`Langauge set to`, this.language)
      },
      lol(){
        console.log(this.content)
      }
    },
    watch: {
      textCode(newVal) {
          this.cm.setValue(newVal)
        }
    }
  };
</script>

<style scoped>

</style>