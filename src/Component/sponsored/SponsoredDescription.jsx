import React, { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Link, Image, AlignLeft, AlignCenter, AlignRight, Eye, Sparkles } from 'lucide-react';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

const SponsoredDescription = ({ description, setDescription }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [previewMode, setPreviewMode] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'features', label: 'Key Features', icon: '⭐' },
    { id: 'special', label: 'What Makes It Special', icon: '✨' },
    { id: 'sponsored', label: 'Why It\'s Sponsored', icon: '👑' },
    { id: 'notes', label: 'Additional Notes', icon: '📝' }
  ];

  const formatText = (command, value = null) => {
    const textarea = document.getElementById(`editor-${activeTab}`);
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = '';

    switch (command) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'list':
        formattedText = `\n• ${selectedText}`;
        break;
      case 'orderedList':
        formattedText = `\n1. ${selectedText}`;
        break;
      case 'link':
        formattedText = `[${selectedText}](url)`;
        break;
      case 'image':
        formattedText = `![${selectedText}](image-url)`;
        break;
      default:
        formattedText = selectedText;
    }

    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    setDescription({
      ...description,
      [activeTab]: newValue
    });

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  const generateAIContent = (section) => {
    const templates = {
      overview: [
        "Discover this exceptional opportunity that stands out from the rest. Our carefully curated offering combines quality, value, and innovation to deliver an unmatched experience.",
        "Experience the perfect blend of functionality and elegance. This premium solution is designed to exceed your expectations and provide lasting value.",
        "Unlock the potential with this remarkable offering. Meticulously crafted with attention to detail, this represents the pinnacle of quality and sophistication."
      ],
      features: [
        "• Premium quality materials and construction\n• Expertly designed for optimal performance\n• Backed by comprehensive warranty and support\n• Trusted by thousands of satisfied customers\n• Innovative features that set new standards",
        "• Cutting-edge technology integration\n• User-friendly interface and operation\n• Environmentally conscious design\n• Cost-effective solution for long-term use\n• Regular updates and improvements",
        "• Professional grade reliability\n• Extensive testing and quality assurance\n• Customizable to your specific needs\n• Seamless integration with existing systems\n• Award-winning design and functionality"
      ],
      special: [
        "What truly sets this apart is our unwavering commitment to excellence. Every aspect has been carefully considered and perfected to ensure you receive nothing but the best.",
        "This isn't just another option – it's a game-changer. Our unique approach combines traditional craftsmanship with modern innovation, creating something truly extraordinary.",
        "The difference lies in the details. From the premium materials to the thoughtful design, every element works in harmony to deliver an experience that's simply unmatched."
      ],
      sponsored: [
        "As a sponsored listing, this advert receives premium placement across our platform, ensuring maximum visibility to qualified buyers and increased engagement rates.",
        "This sponsored position guarantees your advert appears at the top of search results, featured in our newsletter, and promoted across our social media channels for optimal exposure.",
        "Sponsored adverts like this one receive 5x more views on average, with enhanced placement, priority support, and advanced analytics to track performance and optimize results."
      ],
      notes: [
        "Additional information available upon request. We're happy to provide more details, answer questions, or arrange demonstrations to help you make an informed decision.",
        "Please note that availability may be limited due to high demand. We recommend early inquiry to secure this opportunity and avoid disappointment.",
        "Special terms and conditions may apply. Contact us directly to discuss custom options, bulk pricing, or any specific requirements you may have."
      ]
    };

    const suggestions = templates[section] || [];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    
    setDescription({
      ...description,
      [section]: randomSuggestion
    });
  };

  const renderPreview = (text) => {
    if (!text) return <p className="text-gray-500 italic">No content added yet...</p>;
    
    // Simple markdown-like preview
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\• (.*?)(\n|$)/g, '<li>$1</li>')
      .replace(/\d+\. (.*?)(\n|$)/g, '<li>$1</li>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-500 underline">$1</a>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded" />')
      .replace(/\n/g, '<br />');
    
    return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Detailed Description</h2>
        <p className="text-gray-600">Create compelling content that showcases your advert's value</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Editor Toolbar */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => formatText('bold')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('italic')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <button
              onClick={() => formatText('list')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('orderedList')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <button
              onClick={() => formatText('link')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insert Link"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('image')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insert Image"
            >
              <Image className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => generateAIContent(activeTab)}
              className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm rounded-md hover:from-purple-600 hover:to-blue-600 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              AI Generate
            </button>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`
                px-3 py-1 text-sm rounded-md transition-colors flex items-center gap-1
                ${previewMode 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              <Eye className="w-3 h-3" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="p-4">
          {previewMode ? (
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-3">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <div className="text-gray-700 leading-relaxed">
                {renderPreview(description[activeTab])}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </label>
              <textarea
                id={`editor-${activeTab}`}
                value={description[activeTab] || ''}
                onChange={(e) => setDescription({
                  ...description,
                  [activeTab]: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={12}
                placeholder={`Enter ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} here...`}
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">
                  Use markdown formatting for rich text
                </span>
                <span className="text-xs text-gray-500">
                  {description[activeTab]?.length || 0} characters
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-3">💡 Pro Tips for This Section</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700 mb-1">Overview:</p>
            <p className="text-gray-600">Start with a compelling hook that grabs attention and clearly states what you're offering.</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Key Features:</p>
            <p className="text-gray-600">Use bullet points to highlight the most important benefits and unique selling points.</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">What Makes It Special:</p>
            <p className="text-gray-600">Focus on what differentiates your offering from competitors and why it's worth the premium.</p>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">Why It's Sponsored:</p>
            <p className="text-gray-600">Explain the benefits of sponsored placement and how it adds value for potential buyers.</p>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Description Progress</span>
          <span className="text-sm text-gray-500">
            {Object.values(description).filter(Boolean).length} / {tabs.length} sections completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(Object.values(description).filter(Boolean).length / tabs.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SponsoredDescription;
