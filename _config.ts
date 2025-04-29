import lume from "lume/mod.ts";
import wiki from "wiki/mod.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import lang_typescript from "npm:highlight.js/lib/languages/typescript";

const site = lume({
    location: new URL("https://slime21023.github.io/learning-typescript/"),
});

site.use(wiki());
site.use(codeHighlight({
    theme: {
        name: "github-dark",
        cssFile: "/styles.css"
    },
    languages: {
        typescript: lang_typescript
    }
}));

export default site;
