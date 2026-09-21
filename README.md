# AI Assistant — custom widget for ArcGIS Experience Builder

A chat-based AI assistant widget for **ArcGIS Experience Builder**. It binds to a Map
widget that already exists in your Experience and lets end users ask questions about
it in plain language — where to go, what the data says, and how the app works.

Built on [`@arcgis/ai-components`](https://www.npmjs.com/package/@arcgis/ai-components)
(the `arcgis-assistant` web components from the ArcGIS Maps SDK for JavaScript).

> This is a community sample, not an Esri product. See [Caveats](#caveats).

---

## What it does

The widget renders `<arcgis-assistant>` together with three out-of-the-box agents,
each pointing at the same map the Experience already uses:

- **Navigation agent** — pan and zoom the map, find and go to places by name
- **Data exploration agent** — query features, statistics and spatial proximity in the layers
- **Help agent** — explain how the app works and answer usage questions

Every agent can be switched on or off from the settings panel, and the assistant can be
rebranded (heading, description, entry message) without touching code.

```
┌──────────────────────────────────────────┐
│  Experience Builder (builder view)       │
│                                          │
│   ┌──────────────┐   ┌────────────────┐  │
│   │  Map widget  │◄──│  AI Assistant  │  │
│   │  (existing)  │   │    widget      │  │
│   └──────────────┘   └────────────────┘  │
│          ▲                   │           │
│          └── reference-element ┘         │
│      jimuMapView.mapComponent            │
└──────────────────────────────────────────┘
```

---

## Requirements

- **ArcGIS Experience Builder Developer Edition 1.21** (this widget targets
  `exbVersion: 1.21.0`)
- Node.js 18+ and **pnpm** (Experience Builder's client uses pnpm)
- An **ArcGIS Online organization** where an administrator has enabled AI assistants.
  Public ArcGIS accounts cannot use the AI features.
- A registered **OAuth application** in ArcGIS Online (client ID) for sign-in — see
  [Publish and host](#5-publish-and-host).

---

## Where does `client/` come from?

**`client/` is not part of this repository.** It belongs to your ArcGIS Experience Builder
**Developer Edition** installation, which Esri distributes separately (download, then
unzip). A custom widget is a *plugin* that lives inside that installation:

```
arcgis-experience-builder/          # the Developer Edition download
├── server/                         # builder UI       (pnpm ci && npm start)
└── client/                         # webpack bundler  (pnpm ci && npm start)
    ├── package.json                # dependencies are installed HERE, shared by all widgets
    ├── node_modules/
    ├── your-extensions/
    │   └── widgets/
    │       └── ai-assistant/       # ← the files in THIS repository belong here
    │           ├── manifest.json
    │           ├── config.json
    │           ├── icon.svg
    │           └── src/
    └── sdk-sample/                 # optional: Esri's widget samples
```

Widgets have **no `package.json` of their own**. They are bundled by the client project,
so shared packages such as `@arcgis/ai-components` are installed in `client/` and resolved
from its `node_modules`. Esri's own samples in
[arcgis-experience-builder-sdk-resources](https://github.com/Esri/arcgis-experience-builder-sdk-resources)
follow exactly the same shape (`README.md`, `config.json`, `icon.svg`, `manifest.json`,
`src/` — no `package.json`).

Throughout this README, `<Experience-Builder>` is the folder where you unzipped Developer
Edition.

---

## Install

1. **Copy the widget into your Experience Builder project**

   ```bash
   cd <Experience-Builder>/client/your-extensions/widgets
   git clone <this-repo> ai-assistant
   ```

   Two rules from the Experience Builder documentation apply here:

   - **The folder name must match the `name` field in `manifest.json`** (`ai-assistant`),
     and it cannot contain spaces. Cloning into an explicit target folder
     (`git clone <repo> ai-assistant`) keeps this correct — cloning without a target name
     creates `exb-ai-assistant-widget`, which does not match and must be renamed.
   - **Restart the client dev server** after adding the folder (`Ctrl+C`, then `npm start`
     in `client/`). The webpack bundler only picks up new widget folders on start.

   The result must look like:

   ```
   client/your-extensions/widgets/ai-assistant/
   ├── manifest.json
   ├── config.json
   ├── icon.svg
   └── src/
       ├── config.ts
       ├── runtime/
       │   ├── widget.tsx
       │   ├── ai-components-jsx.d.ts
       │   └── translations/default.ts
       └── setting/
           ├── setting.tsx
           └── translations/default.ts
   ```

2. **Add the AI components package** to the client project (not to the widget folder —
   widgets inherit the client's dependencies):

   ```bash
   cd <Experience-Builder>/client
   pnpm add @arcgis/ai-components
   ```

3. **Start the dev environment**

   ```bash
   cd <Experience-Builder>/client
   npm start          # and in a second terminal: npm start inside server/
   ```

   The builder opens at `https://localhost:3001`. Accept the self-signed certificate
   warning if your browser shows one.

4. **Drop the widget on the canvas**

   The widget appears in the **Insert widget** panel under the **Custom** section (near
   the bottom of the list). Add **AI Assistant** to a page, then open its settings and
   pick the **Map widget** you want it to talk to. The widget stays disconnected (and
   shows a hint) until a map is selected.

---

## How it works

Experience Builder hands a custom widget the id of the Map widget it is bound to. This
widget uses that id to get a `JimuMapView` and then passes its map reference down to the
AI components:

```tsx
<JimuMapViewComponent
  useMapWidgetId={props.useMapWidgetIds[0]}
  onActiveViewChange={setJimuMapView}
/>

// jimuMapView.mapComponent is the map web component the AI components attach to
<arcgis-assistant ref={assistantRef} heading={config.heading}>
  <arcgis-assistant-navigation-agent ref={navigationAgentRef} />
  <arcgis-assistant-data-exploration-agent ref={dataExplorationAgentRef} />
  <arcgis-assistant-help-agent ref={helpAgentRef} />
</arcgis-assistant>
```

Two details worth knowing if you fork this:

- **The map reference is assigned as a property, not an attribute.** It is a live
  object, so React would stringify it into `reference-element="[object Object]"`.
  `src/runtime/widget.tsx` assigns `.referenceElement` in an effect instead.
- **`mapComponent` availability depends on your Experience Builder build.** The helper
  `resolveMapReference()` prefers `jimuMapView.mapComponent`, then falls back to the
  MapView container and finally to the view itself, so the widget keeps working on
  builds that only expose `view`.

---

## 5. Publish and host

1. Test locally at `https://localhost:3001`, then **publish** the Experience.
2. **Download** the published app (the static build) and host it on any static host —
   Netlify, GitHub Pages, IIS, an internal web server, and so on.
3. Register the hosted URL as an **OAuth redirect URL** in ArcGIS Online for your app:

   - ArcGIS Online → **Content → New item → Application** → set the redirect URIs
   - Add the URL where the app is hosted. The AI components ship an
     `oauth-callback.html` helper, so add that path too (e.g.
     `https://your-host/oauth-callback.html`) and make sure the file ships with your
     build.
   - The browser flow is a **public OAuth app** — there is no client secret in the
     frontend.

4. End users open the hosted app and **sign in with their own ArcGIS Online
   organizational account**. What they can see and query follows their own
   permissions on the layers.

---

## Configuration

Settings exposed in the builder:

- **Map widget** — which Map widget the assistant is bound to (required)
- **Heading / Description** — text shown at the top of the assistant panel
- **Entry message** — the instruction shown as the first message
- **Keep suggested prompts** — leave prompt chips visible after the first question
- **Navigation agent / Data exploration agent / Help agent** — enable or disable each

Defaults live in `src/config.ts`.

---

## Components from `@arcgis/ai-components`

Verified against `@arcgis/ai-components@5.1.24` (the package is published as **beta**):

- `<arcgis-assistant>` — main chat surface. Attributes include `heading`, `description`,
  `entry-message`, `reference-element`, `keep-suggested-prompts`, `feedback-enabled`,
  `copy-enabled`, `log-enabled`, `streaming-disabled`
- Agents: `arcgis-assistant-navigation-agent`,
  `arcgis-assistant-data-exploration-agent`, `arcgis-assistant-help-agent`, plus
  `arcgis-assistant-knowledge-agent` and `arcgis-assistant-layer-styling-agent`
- `<arcgis-assistant-agent>` — generic wrapper for registering your **own** agent
  (the bundle carries `langchain` / `@langchain/core`, so a custom agent can be pointed
  at your own model)
- Supporting UI: `arcgis-assistant-chat`, `-chat-entry`, `-suggested-prompts`,
  `-speech-input`, `-message-*`, `-interrupt` (confirm before an action runs)
- Events: `arcgisReady`, `arcgisSubmit`, `arcgisResponse`, `arcgisError`,
  `arcgisInterrupt`, `arcgisPromptSelect`, `arcgisFeedback`

React JSX types for these tags are declared in
`src/runtime/ai-components-jsx.d.ts` — the package ships HTML metadata for editors but
no React typings.

---

## Troubleshooting

**The widget shows "Select a Map widget..."**
No Map widget is bound. Open the widget settings and pick one.

**The assistant renders but never answers**
- The signed-in user's ArcGIS organization does not have AI assistants enabled (an
  organization administrator must enable them).
- The user is signed in with a public account — those are not supported.
- The OAuth redirect URL registered in ArcGIS Online does not exactly match the
  hosted URL.

**Duplicate custom element / two copies of the SDK**
`@arcgis/ai-components` peer-depends on `@arcgis/core`, `@arcgis/map-components` and
`@esri/calcite-components`. If Experience Builder bundles different major versions of
those, you can end up with two copies of the SDK or conflicting element registration.
Align the versions, and if needed mark the SDK packages as externals in the client's
webpack configuration.

**The chat panel has zero height**
The assistant fills its container. Make sure the widget instance has a sensible height
in the layout (the manifest defaults to 400 × 640).

---

## Caveats

- `@arcgis/ai-components` is **beta** and ships with **no Esri Technical Support**. APIs
  and attribute names may change between releases.
- This repository is a community sample, not an Esri product.
- Prompts sent from Experience Builder's own built-in assistants are not used to train
  models and those assistants do not consume credits (per Esri documentation). Verify
  the same guarantees with Esri for the AI components package before quoting them to a
  customer.
- The AI components follow the ArcGIS Maps SDK for JavaScript **5.1** line. Check that
  the SDK and Calcite versions bundled by your Experience Builder release are
  compatible with the package version you install.

---

## Credits

- Widget structure follows the conventions of Esri's
  [arcgis-experience-builder-sdk-resources](https://github.com/Esri/arcgis-experience-builder-sdk-resources)
  samples, including the `arcgis-exb-widget-dev` agent skill.
- AI chat UI: [`@arcgis/ai-components`](https://www.npmjs.com/package/@arcgis/ai-components)
  (ArcGIS Maps SDK for JavaScript).

## License

Apache License 2.0 — see [LICENSE](LICENSE).
