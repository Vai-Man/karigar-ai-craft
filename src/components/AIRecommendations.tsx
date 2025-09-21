import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  TrendingUp, 
  Star, 
  Clock, 
  DollarSign,
  Users,
  Camera,
  Lightbulb,
  Target,
  RefreshCw,
  ChevronRight,
  Brain
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface Recommendation {
  id: string;
  type: 'pricing' | 'marketing' | 'product' | 'growth' | 'optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  timeToImplement: string;
  potentialIncrease: string;
  confidence: number;
  actionSteps: string[];
  tags: string[];
}

export const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  
  const { toast } = useToast();
  const products = storage.getProducts();
  const analytics = storage.getAnalytics();

  useEffect(() => {
    generateRecommendations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateRecommendations = () => {
    setIsGenerating(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const aiRecommendations: Recommendation[] = [
        {
          id: '1',
          type: 'pricing',
          title: 'Dynamic Pricing Strategy',
          description: 'Based on market analysis, implementing seasonal pricing could increase revenue by 25%. Your handmade items are underpriced compared to similar artisan products.',
          impact: 'high',
          effort: 'low',
          timeToImplement: '1-2 days',
          potentialIncrease: '+25% revenue',
          confidence: 87,
          actionSteps: [
            'Research competitor pricing for similar products',
            'Implement 15-20% price increase on premium items',
            'Create seasonal pricing calendar',
            'Add value propositions to justify pricing'
          ],
          tags: ['revenue', 'market-research', 'competitive-analysis']
        },
        {
          id: '2',
          type: 'marketing',
          title: 'Social Proof Integration',
          description: 'Adding customer testimonials and reviews to your product listings could boost conversion rates by 40%. Your products have great potential for storytelling.',
          impact: 'high',
          effort: 'medium',
          timeToImplement: '3-5 days',
          potentialIncrease: '+40% conversions',
          confidence: 92,
          actionSteps: [
            'Collect customer testimonials and reviews',
            'Create photo testimonials with product usage',
            'Add social proof badges to listings',
            'Implement review request automation'
          ],
          tags: ['conversion', 'social-proof', 'customer-experience']
        },
        {
          id: '3',
          type: 'product',
          title: 'Product Bundling Opportunity',
          description: 'Create complementary product bundles to increase average order value. Your tea set and ceramic items could be bundled for gift packages.',
          impact: 'medium',
          effort: 'medium',
          timeToImplement: '1 week',
          potentialIncrease: '+35% AOV',
          confidence: 78,
          actionSteps: [
            'Identify complementary products',
            'Create themed gift bundles',
            'Design seasonal collections',
            'Offer bundle discounts'
          ],
          tags: ['upsell', 'bundles', 'gift-market']
        },
        {
          id: '4',
          type: 'optimization',
          title: 'Mobile Experience Enhancement',
          description: 'Optimizing your product photos for mobile viewing could improve engagement by 30%. Most customers browse on mobile devices.',
          impact: 'medium',
          effort: 'low',
          timeToImplement: '2-3 days',
          potentialIncrease: '+30% engagement',
          confidence: 85,
          actionSteps: [
            'Retake photos with mobile viewing in mind',
            'Create square format images for social media',
            'Add zoom functionality to product images',
            'Optimize image loading speed'
          ],
          tags: ['mobile', 'photography', 'user-experience']
        },
        {
          id: '5',
          type: 'growth',
          title: 'Seasonal Marketing Campaign',
          description: 'Launch a targeted seasonal campaign for upcoming festivals. Historical data shows 60% increase in handmade product demand during festival seasons.',
          impact: 'high',
          effort: 'high',
          timeToImplement: '2 weeks',
          potentialIncrease: '+60% seasonal sales',
          confidence: 90,
          actionSteps: [
            'Identify upcoming festivals and celebrations',
            'Create festival-themed product collections',
            'Design targeted marketing materials',
            'Launch pre-order campaigns'
          ],
          tags: ['seasonal', 'festivals', 'campaigns']
        },
        {
          id: '6',
          type: 'marketing',
          title: 'Influencer Collaboration',
          description: 'Partner with micro-influencers in the handmade and sustainable living space. Small collaborations can yield 200% ROI for artisan products.',
          impact: 'high',
          effort: 'medium',
          timeToImplement: '1-2 weeks',
          potentialIncrease: '+200% ROI',
          confidence: 75,
          actionSteps: [
            'Research relevant micro-influencers',
            'Create collaboration packages',
            'Develop content guidelines',
            'Track campaign performance'
          ],
          tags: ['influencer', 'collaboration', 'content-marketing']
        }
      ];

      setRecommendations(aiRecommendations);
      setIsGenerating(false);
      
      toast({
        title: "AI Analysis Complete",
        description: `Generated ${aiRecommendations.length} personalized recommendations based on your business data.`,
      });
    }, 2000);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pricing': return 'bg-green-100 text-green-800';
      case 'marketing': return 'bg-blue-100 text-blue-800';
      case 'product': return 'bg-purple-100 text-purple-800';
      case 'growth': return 'bg-orange-100 text-orange-800';
      case 'optimization': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'medium': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'low': return <Clock className="w-4 h-4 text-gray-500" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const filteredRecommendations = recommendations.filter(rec => 
    selectedType === 'all' || rec.type === selectedType
  );

  const typeFilters = [
    { value: 'all', label: 'All Recommendations', count: recommendations.length },
    { value: 'pricing', label: 'Pricing', count: recommendations.filter(r => r.type === 'pricing').length },
    { value: 'marketing', label: 'Marketing', count: recommendations.filter(r => r.type === 'marketing').length },
    { value: 'product', label: 'Product', count: recommendations.filter(r => r.type === 'product').length },
    { value: 'growth', label: 'Growth', count: recommendations.filter(r => r.type === 'growth').length },
    { value: 'optimization', label: 'Optimization', count: recommendations.filter(r => r.type === 'optimization').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center">
            <Brain className="w-8 h-8 mr-3 text-primary" />
            AI Recommendations
          </h2>
          <p className="text-muted-foreground">Personalized growth strategies powered by machine learning</p>
        </div>
        <Button 
          onClick={generateRecommendations} 
          disabled={isGenerating}
          className="bg-gradient-primary"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Refresh Analysis
            </>
          )}
        </Button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="floating-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Products Analyzed</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Target className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="floating-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Confidence</p>
                <p className="text-2xl font-bold">84%</p>
              </div>
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="floating-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Revenue</p>
                <p className="text-2xl font-bold">+45%</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="floating-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quick Wins</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Clock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        {typeFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={selectedType === filter.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(filter.value)}
            className="h-auto py-2"
          >
            {filter.label}
            <Badge variant="secondary" className="ml-2">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {filteredRecommendations.map((recommendation) => (
          <Card key={recommendation.id} className="artisan-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getImpactIcon(recommendation.impact)}
                  <div>
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getTypeColor(recommendation.type)} variant="secondary">
                        {recommendation.type}
                      </Badge>
                      <Badge variant="outline">
                        {recommendation.impact} impact
                      </Badge>
                      <Badge variant="outline">
                        {recommendation.effort} effort
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Confidence</div>
                  <div className="flex items-center space-x-2">
                    <Progress value={recommendation.confidence} className="w-16 h-2" />
                    <span className="text-sm font-medium">{recommendation.confidence}%</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{recommendation.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-sm font-medium">{recommendation.timeToImplement}</div>
                  <div className="text-xs text-muted-foreground">Time to implement</div>
                </div>
                
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-sm font-medium">{recommendation.potentialIncrease}</div>
                  <div className="text-xs text-muted-foreground">Potential increase</div>
                </div>
                
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-sm font-medium">{recommendation.effort} effort</div>
                  <div className="text-xs text-muted-foreground">Implementation effort</div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Action Steps:</h4>
                <ul className="space-y-1">
                  {recommendation.actionSteps.map((step, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <ChevronRight className="w-4 h-4 mr-1 mt-0.5 text-primary flex-shrink-0" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-wrap gap-1">
                  {recommendation.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <Button size="sm" className="bg-gradient-primary">
                  Implement This
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecommendations.length === 0 && (
        <Card className="artisan-card">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Brain className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recommendations found</h3>
            <p className="text-muted-foreground mb-4">
              Try selecting a different category or refresh the analysis
            </p>
            <Button onClick={generateRecommendations} variant="outline">
              Generate New Recommendations
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};