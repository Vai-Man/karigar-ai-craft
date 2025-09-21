import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, TrendingUp, Package, DollarSign, Users, Sparkles, RefreshCw } from 'lucide-react';
import { geminiService, type BusinessTip } from '@/lib/gemini';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export const BusinessTips = () => {
  const [tips, setTips] = useState<BusinessTip[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { toast } = useToast();

  const categories = [
    { value: 'all', label: 'All Categories', icon: Lightbulb },
    { value: 'pricing', label: 'Pricing Strategy', icon: DollarSign },
    { value: 'marketing', label: 'Marketing', icon: TrendingUp },
    { value: 'packaging', label: 'Packaging', icon: Package },
    { value: 'platform', label: 'Platform', icon: Users },
    { value: 'general', label: 'General', icon: Lightbulb },
  ];

  const businessGoals = [
    'Increase online sales',
    'Build brand awareness',
    'Improve product photography',
    'Expand to new markets',
    'Reduce costs',
    'Improve customer service',
    'Seasonal promotions',
    'Social media presence'
  ];

  const priorityColors = {
    high: 'bg-destructive text-destructive-foreground',
    medium: 'bg-warning text-warning-foreground',
    low: 'bg-success text-success-foreground'
  };

  const priorityLabels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority'
  };

  useEffect(() => {
    // Load sample tips on component mount
    generateSampleTips();
  }, []);

  const generateSampleTips = () => {
    const sampleTips: BusinessTip[] = [
      {
        id: '1',
        title: 'Optimize Your Product Photography',
        description: 'Use natural lighting and clean backgrounds to showcase your crafts. Take photos from multiple angles and include detail shots of textures and materials.',
        category: 'marketing',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Competitive Pricing Strategy',
        description: 'Research similar artisan products online to understand market rates. Factor in material costs, time spent, and your skill level when pricing.',
        category: 'pricing',
        priority: 'high'
      },
      {
        id: '3',
        title: 'Storytelling in Product Descriptions',
        description: 'Share the story behind your craft - the tradition, your inspiration, and the process. Customers connect emotionally with authentic stories.',
        category: 'marketing',
        priority: 'medium'
      },
      {
        id: '4',
        title: 'Sustainable Packaging Solutions',
        description: 'Use eco-friendly packaging materials that align with artisan values. Consider reusable cloth bags or recycled paper boxes.',
        category: 'packaging',
        priority: 'medium'
      },
      {
        id: '5',
        title: 'Building Customer Relationships',
        description: 'Respond promptly to customer inquiries and provide personalized service. Consider offering customization options for special orders.',
        category: 'general',
        priority: 'low'
      }
    ];
    setTips(sampleTips);
  };

  const generateAITips = async () => {
    const products = storage.getProducts();
    if (products.length === 0) {
      toast({
        title: "No products found",
        description: "Add some products first to get personalized business tips",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Use the most common category from user's products
      const categoryCount: Record<string, number> = {};
      products.forEach(product => {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      });
      
      const mostCommonCategory = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'General Handicrafts';

      const newTips = await geminiService.generateBusinessTips(mostCommonCategory, selectedGoals);
      setTips(newTips);
      
      toast({
        title: "Tips generated!",
        description: `Generated ${newTips.length} personalized business tips`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate tips",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredTips = tips.filter(tip => 
    selectedCategory === 'all' || tip.category === selectedCategory
  );

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : Lightbulb;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Business Tips & Insights</h2>
          <p className="text-muted-foreground">AI-powered advice to grow your artisan business</p>
        </div>
        <Button 
          onClick={generateAITips} 
          disabled={isGenerating}
          className="bg-gradient-primary"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Tips
            </>
          )}
        </Button>
      </div>

      {/* Filters and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Filter */}
        <Card className="artisan-card">
          <CardHeader>
            <CardTitle className="text-lg">Filter by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center">
                      <category.icon className="w-4 h-4 mr-2" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Business Goals */}
        <Card className="artisan-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Your Business Goals</CardTitle>
            <CardDescription>Select goals to get more targeted tips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {businessGoals.map((goal) => (
                <Badge
                  key={goal}
                  variant={selectedGoals.includes(goal) ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedGoals.includes(goal) ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  onClick={() => toggleGoal(goal)}
                >
                  {goal}
                </Badge>
              ))}
            </div>
            {selectedGoals.length > 0 && (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} selected
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedGoals([])}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Grid */}
      {filteredTips.length === 0 ? (
        <Card className="artisan-card">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gradient-warm rounded-full flex items-center justify-center mb-6">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Get Personalized Business Tips</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Our AI will analyze your products and goals to provide tailored advice for growing your artisan business.
            </p>
            <Button 
              onClick={generateAITips} 
              disabled={isGenerating}
              className="bg-gradient-primary"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Generating Tips...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI Tips
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {filteredTips.length} tip{filteredTips.length !== 1 ? 's' : ''} 
              {selectedCategory !== 'all' && (
                <span className="text-muted-foreground">
                  {' '}in {categories.find(c => c.value === selectedCategory)?.label}
                </span>
              )}
            </h3>
            <Button variant="outline" size="sm" onClick={generateSampleTips}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Samples
            </Button>
          </div>

          {/* Tips List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredTips.map((tip) => {
              const CategoryIcon = getCategoryIcon(tip.category);
              return (
                <Card key={tip.id} className="floating-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <CategoryIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg leading-tight">{tip.title}</CardTitle>
                          <Badge 
                            variant="secondary" 
                            className={`mt-1 text-xs ${priorityColors[tip.priority]}`}
                          >
                            {priorityLabels[tip.priority]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{tip.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {categories.find(c => c.value === tip.category)?.label || tip.category}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-xs text-primary">
                        Learn More →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};