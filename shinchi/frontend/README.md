# Shinchi frontend
- `js/shinchi-widget.js` + `css/shinchi-widget.css` + `assets/shinchi.svg`: the chat widget (Shadow DOM, no dependencies).
- `index.html`: full-page chat. `embed-example.html`: floating launcher demo. `admin.html`: knowledge-base admin.

Embed (keep the three folders together on your site):
```html
<script src="shinchi/js/shinchi-widget.js" data-api-base="https://YOUR-BACKEND" data-mode="floating"></script>
```
Attributes: `data-api-base`, `data-mode` (`floating`|`inline`), `data-target` (inline selector), `data-open="true"`, `data-css`, `data-avatar`. Theme with CSS variables `--shinchi-blue/green/pink` on `.shell` (edit the css file). Manual: `Shinchi.mount({apiBase, mode})` after setting `window.SHINCHI_NO_AUTO = true`.
