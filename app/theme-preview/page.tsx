'use client';

import { useState } from 'react';
import { Palette, Monitor } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';

const themes = [
  { key: 'default', name: 'Cyberpunk Gaming', description: 'Dark purple with neon green accents' },
  { key: 'celo', name: 'Celo', description: 'Black background with yellow accents' },
  { key: 'solana', name: 'Solana', description: 'Dark purple with magenta accents' },
  { key: 'base', name: 'Base', description: 'Dark blue with Base blue accents' },
  { key: 'coinbase', name: 'Coinbase', description: 'Dark navy with Coinbase blue accents' },
];

export default function ThemePreview() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const applyTheme = () => {
    setTheme(selectedTheme);
  };

  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Palette className="w-8 h-8 text-accent" />
            <h1 className="text-4xl font-bold text-glow">Theme Preview</h1>
          </div>
          <p className="text-text-secondary text-lg">
            Preview and switch between different blockchain themes
          </p>
        </div>

        {/* Theme Selector */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-fg flex items-center">
              <Monitor className="w-5 h-5 mr-2 text-accent" />
              Select Theme
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.key}
                  onClick={() => setSelectedTheme(themeOption.key as any)}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-300 text-left
                    ${selectedTheme === themeOption.key
                      ? 'border-accent bg-accent bg-opacity-20'
                      : 'border-gray-600 hover:border-accent hover:border-opacity-50'
                    }
                  `}
                >
                  <h3 className="font-bold text-fg mb-1">{themeOption.name}</h3>
                  <p className="text-sm text-text-secondary">{themeOption.description}</p>
                </button>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button onClick={applyTheme}>
                Apply Theme
              </Button>
            </div>
          </div>
        </Card>

        {/* Component Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Buttons */}
          <Card>
            <h3 className="text-lg font-bold text-fg mb-4">Buttons</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </Card>

          {/* Inputs */}
          <Card>
            <h3 className="text-lg font-bold text-fg mb-4">Inputs</h3>
            <div className="space-y-4">
              <Input placeholder="Default input" />
              <Input 
                placeholder="Input with icon" 
                variant="withIcon"
                icon={<Monitor className="w-4 h-4" />}
              />
              <Input 
                placeholder="Input with label" 
                label="Label"
              />
            </div>
          </Card>

          {/* Colors */}
          <Card>
            <h3 className="text-lg font-bold text-fg mb-4">Color Palette</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="w-full h-12 bg-bg rounded border border-accent"></div>
                <span className="text-sm text-text-secondary">Background</span>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-surface rounded border border-accent"></div>
                <span className="text-sm text-text-secondary">Surface</span>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-accent rounded"></div>
                <span className="text-sm text-text-secondary">Accent</span>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-fg rounded"></div>
                <span className="text-sm text-text-secondary">Foreground</span>
              </div>
            </div>
          </Card>

          {/* Typography */}
          <Card>
            <h3 className="text-lg font-bold text-fg mb-4">Typography</h3>
            <div className="space-y-3">
              <div className="text-4xl font-bold text-fg">Display Text</div>
              <div className="text-2xl font-semibold text-fg">Heading Text</div>
              <div className="text-base text-fg">Body text with normal weight</div>
              <div className="text-sm font-medium text-text-secondary">Caption text</div>
            </div>
          </Card>
        </div>

        {/* Current Theme Info */}
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-bold text-fg mb-2">Current Theme</h3>
            <p className="text-accent font-bold text-xl">
              {themes.find(t => t.key === theme)?.name || 'Unknown'}
            </p>
            <p className="text-text-secondary">
              {themes.find(t => t.key === theme)?.description || 'No description'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
