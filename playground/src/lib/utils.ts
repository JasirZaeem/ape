import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

async function blobTob64(blob: Blob) {
  const reader = new FileReader();
  const promise: Promise<string> = new Promise((resolve) => {
    reader.onloadend = () => {
      // @ts-ignore
      resolve(reader.result);
    };
  });
  reader.readAsDataURL(blob);
  return (await promise).replace(/^data:(.*;base64,)?/, "");
}

export async function compressText(text: string) {
  const inputStream = new Blob([text]).stream();
  // Make a transformed stream
  const compressedReader = inputStream
    .pipeThrough(new CompressionStream("gzip"))
    .getReader();
  const chunks = [];
  // Read compressed data
  while (true) {
    const { done, value } = await compressedReader.read();
    if (done) break;
    chunks.push(value);
  }
  // Convert to base64
  return await blobTob64(new Blob(chunks));
}

export async function decompressText(b64: string) {
  const inputBlob = await fetch("data:application/gzip;base64," + b64).then(
    (res) => res.blob()
  );
  const inputReader = inputBlob.stream().getReader();
  const inputChunks = [];
  while (true) {
    const { done, value } = await inputReader.read();
    if (done) break;
    inputChunks.push(value);
  }
  const decompressedReader = new Blob(inputChunks)
    .stream()
    .pipeThrough(new DecompressionStream("gzip"))
    .getReader();
  const decompressedChunks = [];
  while (true) {
    const { done, value } = await decompressedReader.read();
    if (done) break;
    decompressedChunks.push(value);
  }
  return await new Blob(decompressedChunks).text();
}
