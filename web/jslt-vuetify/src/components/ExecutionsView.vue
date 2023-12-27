<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-card>
        <v-tabs bg-color="primary" v-model="tab">
          <v-tab value="one"> main.js </v-tab>
          <v-tab value="two"> package.json </v-tab>
        </v-tabs>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="one">
              <div class="editor-container">
                <prism-editor
                v-model="code"
                class="my-editor"
                :highlight="highlighter"
                line-numbers
              ></prism-editor>
              </div>
            </v-window-item>

            <v-window-item value="two">
              <div class="editor-container">
                <prism-editor
                v-model="packagejson"
                class="my-editor"
                :highlight="highlighterJson"
                line-numbers
              ></prism-editor>
              </div>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>

      <v-row class="d-flex">

        <v-col cols="auto">
          <v-btn
            color="primary"
            @click="onRun"
            min-width="228"
            rel="noopener noreferrer"
            size="x-large"
            target="_blank"
            variant="flat"
          >
            <v-icon icon="mdi-speedometer" size="large" start />
            Iniciar ejecución
          </v-btn>
        </v-col>

      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
//
import { highlight, languages } from "prismjs/components/prism-core";
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere
import "prismjs/components/prism-json";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles
import "prismjs/components/prism-json";
import "prismjs/components/prism-javascript";
import { ref } from "vue";
const tab = ref();
const code = ref('console.log("Hello world")');
const packagejson = ref(
  '{\n\t"name": "tryme",\n\t"version": "1.0.0",\n\t"description": "",\n\t"author": "",\n\t"license": "ISC"\n}'
);

const highlighter = (code: string): string => {
  let r = highlight(code, languages.javascript, "javascript");
  r = r.replace(/\n/g, "breakme");
  r = r.replace(/(\s\s)/g, '<span class="show-tabs">&nbsp;&nbsp;</span>');
  r = r.replace(/breakme/g, "\n");
  return r;
};
const highlighterJson = (code: string): string => {
  let r = code;
  try {
    if (JSON.parse(code) != undefined) {
      r = highlight(code, languages.json, "json");
    }
    // onTemplateChange()
    // redraw()
  } catch (e) {
    console.log(e);
  }
  return r;
};

function onRun(){
  console.log("onRun")
}
</script>
<style scoped>
.my-editor {
	font-family:
		Fira code,
		Fira Mono,
		Consolas,
		Menlo,
		Courier,
		monospace;
	font-size: 13px;
	height: 100%;
	line-height: 1.5;
	padding: 0px;
	overflow-x: visible !important;
}

.editor-container {
	height: 70vh;
	padding: 10px;
	overflow-x: visible;
	overflow-y: visible;
	width: 1000000px;
}
</style>
