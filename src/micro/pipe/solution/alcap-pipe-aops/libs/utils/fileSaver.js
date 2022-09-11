export function exportFile(name, content) {
  saveAs(name, new Blob([content]));
}

export function saveAs(name, blob) {
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, name);
  } else {
    let link = document.createElement('a');
    link.download = name;
    link.style.display = 'none';
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }
}

// export function saveAsByHref(href, download) {
//   let link = document.createElement('a');
//   link.download = download;
//   link.target = '_blank';
//   link.style.display = 'none';
//   link.href = href;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }
