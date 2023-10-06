import 'i18next';

// resources.ts file is generated with `npm run toc`

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof resources;
  }
}
