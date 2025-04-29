import lume from "lume/mod.ts";
import wiki from "wiki/mod.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import lang_typescript from "npm:highlight.js/lib/languages/typescript";
import relativeUrls from "lume/plugins/relative_urls.ts";
const site = lume();

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

site.use(relativeUrls());

export default site;
