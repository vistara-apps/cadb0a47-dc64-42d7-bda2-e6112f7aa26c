'use client';

import { useState } from 'react';
import { Wand2, Upload, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';

interface CreateVideoFormProps {
  onGenerate: (data: VideoGenerationData) => void;
}

interface VideoGenerationData {
  prompt: string;
  template: string;
  assets: string[];
  duration: number;
}

export function CreateVideoForm({ onGenerate }: CreateVideoFormProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [duration, setDuration] = useState(15);
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    { id: 'cyberpunk', name: 'Cyberpunk', preview: '/templates/cyberpunk.jpg' },
    { id: 'neon-city', name: 'Neon City', preview: '/templates/neon-city.jpg' },
    { id: 'digital-art', name: 'Digital Art', preview: '/templates/digital-art.jpg' },
    { id: 'gaming', name: 'Gaming', preview: '/templates/gaming.jpg' },
  ];

  const handleGenerate = async () => {
    if (!prompt || !selectedTemplate) return;
    
    setIsGenerating(true);
    try {
      await onGenerate({
        prompt,
        template: selectedTemplate,
        assets: selectedAssets,
        duration
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Prompt Input */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-fg">Describe Your Video</h3>
          </div>
          
          <Input
            placeholder="A futuristic cityscape with neon lights and flying cars..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>{prompt.length}/500 characters</span>
            <span>Be specific for better results</span>
          </div>
        </div>
      </Card>

      {/* Template Selection */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-fg">Choose Template</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`
                  relative aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300
                  ${selectedTemplate === template.id 
                    ? 'border-accent shadow-lg shadow-accent/20' 
                    : 'border-gray-600 hover:border-accent/50'
                  }
                `}
              >
                <img
                  src={template.preview || '/placeholder-template.jpg'}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{template.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Duration Settings */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-fg">Video Duration</h3>
          
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="5"
              max="60"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="flex-1 h-2 bg-surface rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-accent font-bold min-w-[60px]">{duration}s</span>
          </div>
        </div>
      </Card>

      {/* Asset Upload */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-bold text-fg">Upload Assets (Optional)</h3>
          </div>
          
          <div className="border-2 border-dashed border-accent border-opacity-50 rounded-lg p-8 text-center hover:border-opacity-100 transition-colors duration-300">
            <Upload className="w-12 h-12 text-accent mx-auto mb-4" />
            <p className="text-text-secondary mb-2">Drag & drop your media files here</p>
            <p className="text-sm text-text-secondary">or click to browse</p>
            <Button variant="outline" size="sm" className="mt-4">
              Browse Files
            </Button>
          </div>
        </div>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleGenerate}
          loading={isGenerating}
          disabled={!prompt || !selectedTemplate}
          className="px-12"
        >
          <Wand2 className="w-5 h-5 mr-2" />
          Generate Video
        </Button>
      </div>
    </div>
  );
}
