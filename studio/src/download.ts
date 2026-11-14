/** Save text as a file through the browser's download. */
export function downloadFile(filename: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/[\\/\u0000-\u001f]/g, '-');
  document.body.appendChild(link);
  try { link.click(); }
  finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
