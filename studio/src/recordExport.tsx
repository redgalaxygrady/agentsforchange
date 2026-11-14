import { renderToStaticMarkup } from 'react-dom/server';
import type { LaunchState } from './launchModel';
import { RECORD_CSS, RecordDocument } from './RecordDocument';

/** The downloadable page. Kept apart from RecordDocument so the server renderer loads only when someone downloads. */
export function recordHTML(state: LaunchState, images: Record<string, string | undefined>): string {
  const body = renderToStaticMarkup(<RecordDocument state={state} images={images}/>);
  const title = (state.maker.trim() ? `${state.maker.trim()} · ` : '') + 'Portfolio record';
  const safeTitle = title.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>${safeTitle}</title>
<style>body{margin:0;background:#eef1ec;padding:40px 16px}main{max-width:860px;margin:0 auto;box-shadow:0 20px 50px #0c2b2933;border-radius:24px}@media print{body{background:#fff;padding:0}main{box-shadow:none}}${RECORD_CSS}</style></head>
<body><main>${body}</main></body></html>`;
}
