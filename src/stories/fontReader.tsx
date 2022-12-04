import opentype from 'opentype.js';
import React from 'react';
import { useEffect } from 'react';
import stringify from 'fast-stringify';

export function useFontInfo(url: string) {
  const [info, setInfo] = React.useState<opentype.Font>();

  useEffect(() => {
    const loadFont = async (url: string) => {
      const data = await opentype.load(url);
      setInfo(data);
      download(stringify(data), 'application/json', 'andika.json');
    };
    loadFont(url);
  }, [url]);
  return {}; // this would be the helpful info, but for now that data object is like machine code that would need to be de-compiled.
}

function download(content: string, mimeType: string, filename: string) {
  const a = document.createElement('a'); // Create "a" element
  const blob = new Blob([content], { type: mimeType }); // Create a blob (file-like object)
  const url = URL.createObjectURL(blob); // Create an object URL from blob
  a.setAttribute('href', url); // Set "a" element link
  a.setAttribute('download', filename); // Set download filename
  a.click(); // Start downloading
}
