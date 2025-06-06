// app/instagram-album/page.tsx
'use client';
import CodeBlock from '@/components/CodeBlock';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { experimental_useObject as useObject } from '@ai-sdk/react';
import z from 'zod';
import { slideSchema } from './api/chat/route';

export default function InstagramAlbumPoster() {
  const { object, submit } = useObject({
    api: '/api/chat',
    schema: z.object({
      slides: z.array(slideSchema),
    }),
  })
  const [prompt, setPrompt] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [images, setImages] = useState<{ url: string; slideNumber: string }[]>([]);
  const [result, setResult] = useState<any>(null);

  const handleImageGenerated = (url: string, slideNumber: string) => {
    console.log('Image generated for slide', slideNumber, 'URL length:', url.length);
    setImages(prev => {
      // Avoid duplicates
      if (prev.some(img => img.slideNumber === slideNumber)) {
        return prev;
      }
      console.log('Adding image to state, total images:', prev.length + 1);
      return [...prev, { url, slideNumber }];
    });
  };

  const uploadAllImagesToPinata = async (images: { url: string; slideNumber: string }[]) => {
    setIsDownloading(true);

    const uploadedImages: { url: string; slideNumber: string }[] = [];

    for (const { url, slideNumber } of images) {
      const res = await fetch(url);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append('file', blob, `slide${slideNumber}.png`);

      const metadata = JSON.stringify({
        name: `slide${slideNumber}`,
      });
      formData.append('pinataMetadata', metadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 1,
      });
      formData.append('pinataOptions', pinataOptions);

      const uploadRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`, // Use .env for secret
        },
        body: formData,
      });

      const json = await uploadRes.json();
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${json.IpfsHash}`;

      uploadedImages.push({ url: ipfsUrl, slideNumber });
    }

    setIsDownloading(false);
    postAlbum(uploadedImages);
  };


  const postAlbum = async (uploadedImages: { url: string; slideNumber: string }[]) => {
    setIsPosting(true);

    const pinataPaths = uploadedImages.map(({ url }) => ({
      url,
      type: 'photo',
    }));

    try {
      const response = await fetch('/api/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: `
          Post by: @amardeep.webdev

-——————————————— !! FOLLOW US TO LEARN ALL ABOUT WEB DEVELOPMENT !! -——————————————— #webdevelopment #programminglife #codingbootcamp #codingmemes #weprogrammers #frontendchallenge #fullstack #backend #programmingmemes #pythonprogramming #javascripts #webdevelopmentcompany #100dayproject #css #javaprogramming #codegeass #freecodecamp #codetutorials #appdeveloper #amardeep.webdev #webdesign #webdesignanddevelopment -———————————————

Removal of the post could be requested by the Copyright Holder of the property through DM.

©️ No Copyright infringement intended.
          `,
          items: pinataPaths,
          location: {
            name: 'Times Square',
            lat: 40.7580,
            lng: -73.9855,
          },
        }),
      });

      setResult(await response.json());
    } finally {
      setIsPosting(false);
    }
  };

  console.log('Rendering page. Total slides:', object?.slides?.length, 'Generated images:', images.length);

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button onClick={() => submit(prompt)}>Generate</button>
        <button
          onClick={() => uploadAllImagesToPinata(images)}
          disabled={isDownloading || images.length === 0}
          className={`px-4 py-2 rounded ${images.length === 0 ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {isDownloading ? 'Downloading...' : `Download All Slides (${images.length})`}
        </button>
        <button
          onClick={() => postAlbum(images)}
          disabled={images.length === 0}
          className={`px-4 py-2 rounded ${images.length === 0 ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white`}
        >
          {isPosting ? 'Posting...' : `Post Album (${images.length}/${object?.slides?.length} ready)`}
        </button>
      </div>

      {result && <SyntaxHighlighter language="json" style={dracula} customStyle={{
      }} className="mt-4 p-4 bg-gray-900 rounded">{JSON.stringify(result, null, 2)}</SyntaxHighlighter>}

      <div className="grid gap-4">
        {object?.slides?.map((slide, index) => {
          console.log(`Rendering slide ${index} (${slide?.slideNumber})`);
          return (
            <div key={index} className="relative border rounded-lg p-2">
              <CodeBlock title={slide?.title || 'Untitled'}  // Provide a default title
                code={slide?.code || ''}
                slideNumber={slide?.slideNumber || ''}
                onImageGenerated={handleImageGenerated} />
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {images.some(img => img.slideNumber === slide?.slideNumber) ? '✅ Ready' : '⏳ Generating...'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-gray-900 rounded">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <SyntaxHighlighter language="json" style={dracula} customStyle={{
        }} className="text-xs">
          {JSON.stringify({
            totalSlides: object?.slides?.length,
            generatedImages: images.length,
            slideNumbers: object?.slides?.map(s => s?.slideNumber),
            generatedSlideNumbers: images.map(i => i.slideNumber)
          }, null, 2)}
        </SyntaxHighlighter>
      </div>

     
    </div>
  );
}