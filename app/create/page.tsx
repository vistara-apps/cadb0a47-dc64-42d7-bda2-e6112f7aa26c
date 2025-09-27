'use client';

import { useState, useEffect } from 'react';
import { Play, Upload, Wand2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { getAvailableTemplates } from '@/lib/video-generation';

interface Template {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  category: string;
}

interface Asset {
  id: string;
  name: string;
  thumbnailUrl: string;
  assetType: 'image' | 'video' | 'audio';
}

export default function CreateVideoPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [duration, setDuration] = useState(15);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed' | 'failed'>('idle');
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);

  useEffect(() => {
    // Load templates
    const loadedTemplates = getAvailableTemplates();
    setTemplates(loadedTemplates);

    // Mock available assets - replace with actual API call
    const mockAssets: Asset[] = [
      {
        id: 'asset_1',
        name: 'Neon Cityscape',
        thumbnailUrl: '/assets/neon-city.jpg',
        assetType: 'image',
      },
      {
        id: 'asset_2',
        name: 'Synthwave Track',
        thumbnailUrl: '/assets/synthwave.jpg',
        assetType: 'audio',
      },
    ];
    setAvailableAssets(mockAssets);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationStatus('generating');

    try {
      // Mock API call - replace with actual video generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate success
      setGenerationStatus('completed');
      setGeneratedVideo('/videos/generated_sample.mp4');
    } catch (error) {
      setGenerationStatus('failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAsset = (asset: Asset) => {
    setSelectedAssets(prev =>
      prev.find(a => a.id === asset.id)
        ? prev.filter(a => a.id !== asset.id)
        : [...prev, asset]
    );
  };

  const renderStatus = () => {
    switch (generationStatus) {
      case 'generating':
        return (
          <Card className="border-accent border-opacity-50">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h3 className="font-bold text-fg">Generating Your Video</h3>
                <p className="text-sm text-text-secondary">This may take a few minutes...</p>
              </div>
            </div>
          </Card>
        );

      case 'completed':
        return (
          <Card className="border-green-500 border-opacity-50">
            <div className="flex items-center space-x-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-bold text-fg">Video Generated Successfully!</h3>
                <p className="text-sm text-text-secondary">Your video is ready to download.</p>
              </div>
            </div>
            {generatedVideo && (
              <div className="mt-4">
                <video
                  src={generatedVideo}
                  controls
                  className="w-full rounded-lg"
                  poster="/thumbnails/video-poster.jpg"
                />
                <div className="flex space-x-2 mt-4">
                  <Button className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Download Video
                  </Button>
                  <Button variant="outline">
                    Share
                  </Button>
                </div>
              </div>
            )}
          </Card>
        );

      case 'failed':
        return (
          <Card className="border-red-500 border-opacity-50">
            <div className="flex items-center space-x-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <div>
                <h3 className="font-bold text-fg">Generation Failed</h3>
                <p className="text-sm text-text-secondary">Please try again or contact support.</p>
              </div>
            </div>
            <Button
              onClick={() => setGenerationStatus('idle')}
              className="mt-4"
            >
              Try Again
            </Button>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-fg mb-4">Create AI Video</h1>
        <p className="text-xl text-text-secondary">
          Transform your ideas into stunning videos with AI-powered generation
        </p>
      </div>

      {/* Generation Status */}
      {renderStatus()}

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <Card>
            <h3 className="text-lg font-bold text-fg mb-4">Describe Your Video</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cyberpunk city at night with neon lights reflecting off wet streets, flying cars zooming through the sky..."
              className="w-full h-32 p-3 bg-bg border border-accent border-opacity-30 rounded-lg text-fg placeholder-text-secondary focus:outline-none focus:border-accent resize-none"
              disabled={isGenerating}
            />
            <p className="text-xs text-text-secondary mt-2">
              Be specific about scenes, mood, colors, and actions for best results.
            </p>
          </Card>

          {/* Template Selection */}
          <Card>
            <h3 className="text-lg font-bold text-fg mb-4">Choose a Template</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-left
                    ${selectedTemplate?.id === template.id
                      ? 'border-accent bg-accent bg-opacity-10'
                      : 'border-accent border-opacity-30 hover:border-accent hover:border-opacity-50'
                    }
                  `}
                  disabled={isGenerating}
                >
                  <img
                    src={template.previewUrl}
                    alt={template.name}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                  <h4 className="font-bold text-fg text-sm">{template.name}</h4>
                  <p className="text-xs text-text-secondary">{template.description}</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Duration */}
          <Card>
            <h3 className="text-lg font-bold text-fg mb-4">Video Duration</h3>
            <div className="flex items-center space-x-4">
              <Input
                type="range"
                min="5"
                max="60"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="flex-1"
                disabled={isGenerating}
              />
              <span className="text-fg font-bold min-w-[60px]">{duration}s</span>
            </div>
            <p className="text-xs text-text-secondary mt-2">
              Longer videos cost more credits
            </p>
          </Card>

          {/* Asset Library */}
          <Card>
            <h3 className="text-lg font-bold text-fg mb-4">Add Assets (Optional)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {availableAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => toggleAsset(asset)}
                  className={`
                    p-2 rounded border-2 transition-all duration-200
                    ${selectedAssets.find(a => a.id === asset.id)
                      ? 'border-accent bg-accent bg-opacity-10'
                      : 'border-accent border-opacity-30 hover:border-accent hover:border-opacity-50'
                    }
                  `}
                  disabled={isGenerating}
                >
                  <img
                    src={asset.thumbnailUrl}
                    alt={asset.name}
                    className="w-full h-16 object-cover rounded mb-1"
                  />
                  <p className="text-xs text-fg font-medium truncate">{asset.name}</p>
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" disabled={isGenerating}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Custom Asset
            </Button>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={!prompt.trim() || !selectedTemplate}
            className="w-full py-4 text-lg"
          >
            <Wand2 className="w-5 h-5 mr-2" />
            Generate Video
          </Button>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-fg mb-4">Preview</h3>
            <div className="aspect-video bg-surface rounded-lg flex items-center justify-center">
              {selectedTemplate ? (
                <div className="text-center">
                  <img
                    src={selectedTemplate.previewUrl}
                    alt={selectedTemplate.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <Play className="w-12 h-12 mx-auto mb-2 opacity-80" />
                      <p className="text-sm opacity-80">Preview Template</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-text-secondary">
                  <Wand2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a template to see preview</p>
                </div>
              )}
            </div>
          </Card>

          {/* Selected Assets */}
          {selectedAssets.length > 0 && (
            <Card>
              <h3 className="text-lg font-bold text-fg mb-4">Selected Assets</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedAssets.map((asset) => (
                  <div key={asset.id} className="flex items-center space-x-2 p-2 bg-surface rounded">
                    <img
                      src={asset.thumbnailUrl}
                      alt={asset.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <span className="text-sm text-fg truncate">{asset.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Cost Estimate */}
          <Card>
            <h3 className="text-lg font-bold text-fg mb-4">Cost Estimate</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Base Generation:</span>
                <span className="text-fg">0.01 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Duration ({duration}s):</span>
                <span className="text-fg">+{(duration / 15 * 0.01).toFixed(3)} ETH</span>
              </div>
              {selectedAssets.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Premium Assets:</span>
                  <span className="text-fg">+0.005 ETH</span>
                </div>
              )}
              <hr className="border-accent border-opacity-30" />
              <div className="flex justify-between font-bold">
                <span className="text-fg">Total:</span>
                <span className="text-accent">
                  {(0.01 + (duration / 15 * 0.01) + (selectedAssets.length > 0 ? 0.005 : 0)).toFixed(3)} ETH
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

