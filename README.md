# mvpapp

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
// <template>
//     <div>
//         <Codemirror
//              v-model:value="code"
//             :options="cmOptions"
//             placeholder="test placeholder"
//             :height="100"
//             @change="pog"
//         />
//     </div>
// </template>

// <script>
// // import { ref } from "vue";
// import Codemirror from "codemirror-editor-vue3";
// import "codemirror/mode/javascript/javascript.js";
// import "codemirror/theme/dracula.css";
//     export default {
//         props: {
//             // code: String
//         },
//         components: {
//             Codemirror
//         },
//        data() {
//             return {
//                 code: "ll",
//                 cmOptions: {
//                     mode: "text/javascript", // Language mode
//                     theme: "dracula", // Theme
//                     lineNumbers: true, // Show line number
//                     smartIndent: true, // Smart indent
//                     indentUnit: 2, // The smart indent unit is 2 spaces in length
//                     foldGutter: true, // Code folding
//                     styleActiveLine: true, // Display the style of the selected row
//                 },
//             };
//         },
//         methods: {
//             pog() {
//                 console.log(this.code)
//             }
//         },
//     }
// </script>
// <style scoped>
// .Codemirror {
//     font-size: 10rem;
// }
// </style>

