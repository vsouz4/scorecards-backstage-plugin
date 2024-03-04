# Scorecards Plugin for Backstage

Visualize interesting information about your software catalog.

## Setup and Integration

Install the plugin
```shell
$ yarn add --cwd packages/app @vsouz4/scorecards-backstage-plugin
```

Add proxy config
```
# app-config.yaml

proxy:
  '/scorecards':
    target: '<SCORECARDS_API_URL>'
```

Export the plugin
```ts
# packages/app/src/plugins.ts

export { scorecardsPlugin } from '@vsouz4/scorecards-backstage-plugin';
```

Setup route
```tsx
# packages/app/src/App.tsx

import { ScorecardsPage } from '@vsouz4/scorecards-backstage-plugin';

...

<Route path="/scorecards" element={<ScorecardsPage />} />
```

Add a new sidebar item
```tsx
# packages/app/src/components/Root/Root.tsx

import LayersIcon from '@material-ui/icons/Layers';

...

<SidebarItem icon={LayersIcon} to="scorecards" text="Scorecards" />
```
