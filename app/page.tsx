// app/instagram-album/page.tsx
'use client';
import CodeBlock from '@/components/CodeBlock';
import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { experimental_useObject as useObject } from '@ai-sdk/react';
import z from 'zod';
import { slideSchema } from './api/chat/schema';
import { AlertCircle, CheckCircle, Clock, Code, Download, ImageIcon, Info, Instagram, Loader, Loader2, Send, Sparkles } from 'lucide-react';

export default function InstagramAlbumPoster() {
  const { object, submit, isLoading } = useObject({
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
          caption: ` ${object?.slides?.[0]?.title || ""}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold ">
              Instagram Code Slides Generator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Generate beautiful code slides and post them to Instagram automatically
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Control Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Input Section */}
            <div className="flex-1">
              <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                What would you like to teach?
              </label>
              <div className="relative">
                <input
                  id="prompt"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., JavaScript array methods, async/await, loops..."
                  className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 transition-all"
                />
                <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
              <button
                onClick={() => submit(prompt)}
                disabled={!prompt.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? <div className='flex items-center gap-2'><Loader className='w-4 h-4 animate-spin' />Generating...</div> : <div className='flex items-center gap-2'><Send className='w-4 h-4' />Generate</div>}
              </button>

              <button
                onClick={() => uploadAllImagesToPinata(images)}
                disabled={isDownloading || images.length === 0}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isDownloading ? 'Downloading...' : `Download All (${images.length})`}
              </button>

              <button
                onClick={() => postAlbum(images)}
                disabled={images.length === 0 || isPosting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {isPosting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Instagram className="w-4 h-4" />
                )}
                {isPosting ? 'Posting...' : `Post to Instagram (${images.length}/${object?.slides?.length || 0})`}
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          {object?.slides && object.slides.length > 0 && (
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Slide Generation Progress
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {images.length} / {object.slides.length} ready
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(images.length / object.slides.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Result Display */}
        {result && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {result.success ? 'Successfully Posted to Instagram!' : 'Posting Failed'}
              </h3>
            </div>
            <div className="bg-slate-900 rounded-xl overflow-hidden">
              <SyntaxHighlighter
                language="json"
                style={dracula}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '0.875rem'
                }}
              >
                {JSON.stringify(result, null, 2)}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
        {object?.slides?.[0]?.title || ""}
        {/* Slides Grid */}
        {object?.slides && object.slides.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Generated Slides
              </h2>
              <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                {object.slides.length} slides
              </div>
            </div>
          
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {object.slides.map((slide, index) => {
                const isReady = images.some(img => img.slideNumber === slide?.slideNumber);

                return (
                  <div key={index} className="group relative">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${isReady
                            ? 'bg-green-100/90 text-green-700 border border-green-200'
                            : 'bg-yellow-100/90 text-yellow-700 border border-yellow-200'
                          }`}>
                          {isReady ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Ready
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Generating...
                            </>
                          )}
                        </div>
                      </div>

                      {/* Slide Preview */}
                      <div className="aspect-[3/4] overflow-hidden">
                        <CodeBlock
                          title={slide?.title || 'Untitled'}
                          code={slide?.code || ''}
                          slideNumber={slide?.slideNumber || ''}
                          onImageGenerated={handleImageGenerated}
                        />
                      </div>

                      {/* Slide Info */}
                      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {slide?.title || 'Untitled'}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Slide {slide?.slideNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {isReady ? 'Image ready' : 'Processing...'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Debug Info */}
        {object?.slides && (
          <div className="mt-12 bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-slate-700">
              <Info className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Debug Information</h3>
            </div>
            <div className="p-0">
              <SyntaxHighlighter
                language="json"
                style={dracula}
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  fontSize: '0.875rem'
                }}
              >
                {JSON.stringify({
                  totalSlides: object?.slides?.length,
                  generatedImages: images.length,
                  slideNumbers: object?.slides?.map(s => s?.slideNumber),
                  generatedSlideNumbers: images.map(i => i.slideNumber)
                }, null, 2)}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}