'use client'
import { toPng } from 'html-to-image';
import React, { useEffect, useRef, useState } from 'react';

interface CodeBlockProps {
  title: string | undefined;
  code: string;
  slideNumber: string;
  onImageGenerated: (dataUrl: string, slideNumber: string) => void;
}

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeBlock = ({ title, code, slideNumber, onImageGenerated }: CodeBlockProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateImage = React.useCallback(async () => {
      console.log('Generating image for slide', slideNumber);
      
      if (!ref.current) {
        const errorMsg = 'Ref not attached to any element';
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }
      
      setIsGenerating(true);
      setError(null);
      
      try {
        console.log('Converting to PNG...');
        const dataUrl = await toPng(ref.current, {
          quality: 1.0,
          pixelRatio: 2, // For better quality on high-DPI displays
          cacheBust: true, // Prevent caching
          skipFonts: true, // Skip loading external fonts
        });
        
        if (!dataUrl || typeof dataUrl !== 'string') {
          throw new Error('Failed to generate image: Invalid data URL');
        }
        
        console.log('Image generated for slide', slideNumber, 'Size:', (dataUrl.length * 3/4).toFixed(2), 'KB');
        onImageGenerated(dataUrl, slideNumber);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error generating image for slide', slideNumber, ':', error);
        setError(`Error: ${errorMsg}`);
      } finally {
        setIsGenerating(false);
      }
    }, [onImageGenerated, slideNumber]);

    // Generate image when component mounts and when code changes
    useEffect(() => {
      // Small delay to ensure component is fully rendered
      let timer: NodeJS.Timeout;
      
      // First try after a short delay
      timer = setTimeout(() => {
        generateImage();
        
        // // If still not generated after initial delay, try again
        // const retryTimer = setTimeout(() => {
        //   if (!images.some((img: { slideNumber: string; }) => img.slideNumber === slideNumber)) {
        //     console.log('Retrying image generation for slide', slideNumber);
        //     generateImage();
        //   }
        // }, 2000);
        
      }, 500);
      
      return () => clearTimeout(timer);
    }, [code, generateImage]);
  return (
    <div ref={ref} className="h-[1080px] aspect-[3/4] bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-bold">
            @AMARDEEP.WEBDEV
            </div>
          </div>
          <div className="text-white text-6xl font-bold opacity-50">
            {slideNumber}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-white text-8xl font-bold mb-12 leading-tight">
          {title}
        </h1>

        {/* Terminal Window */}
        <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-gray-700 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          
          {/* Code Content */}
          <div className="p-6 bg-gray-900">
            <pre className="text-sm leading-relaxed">
                {/* iNSTEAD I HAVE TO USE sYNTEX HIGHTLIGHTER LIB HERE  */}
                <SyntaxHighlighter 
customStyle={{
    backgroundColor: 'transparent',
}}                language="javascript" style={dracula}>
                    {code}
                </SyntaxHighlighter>
            </pre>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default CodeBlock;