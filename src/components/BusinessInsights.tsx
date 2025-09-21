import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Eye, 
  ShoppingCart, 
  Star,
  Target,
  Calendar,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { storage } from '@/lib/storage';

interface InsightData {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'performance' | 'marketing' | 'pricing' | 'customer';
  actionable: boolean;
  progress?: number;
}

export const BusinessInsights = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const analytics = storage.getAnalytics();
  const products = storage.getProducts();

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = () => {
    setIsLoading(true);
    
    // Simulate AI-generated insights based on user data
    const generatedInsights: InsightData[] = [
      {
        id: '1',
        title: 'Peak Activity Hours',
        description: 'Your products get 40% more views between 2-4 PM. Consider posting new items during this window.',
        impact: 'high',
        category: 'performance',
        actionable: true,
        progress: 75
      },
      {
        id: '2',
        title: 'Pricing Opportunity',
        description: 'Similar handmade products in your category are priced 20% higher. You might be undervaluing your work.',
        impact: 'high',
        category: 'pricing',
        actionable: true,
        progress: 0
      },
      {
        id: '3',
        title: 'Customer Engagement',
        description: 'Products with detailed stories get 3x more inquiries. Consider adding more background about your craft process.',
        impact: 'medium',
        category: 'marketing',
        actionable: true,
        progress: 30
      },
      {
        id: '4',
        title: 'Seasonal Trend Alert',
        description: 'Based on market data, demand for your product category typically increases by 60% in the next month.',
        impact: 'high',
        category: 'marketing',
        actionable: true,
        progress: 0
      },
      {
        id: '5',
        title: 'Photo Quality Impact',
        description: 'Products with high-quality photos convert 85% better. Consider retaking photos with natural lighting.',
        impact: 'medium',
        category: 'performance',
        actionable: true,
        progress: 50
      },
      {
        id: '6',
        title: 'Customer Retention',
        description: 'You have a 70% repeat customer rate - above industry average! Consider a loyalty program.',
        impact: 'medium',
        category: 'customer',
        actionable: true,
        progress: 80
      }
    ];

    setInsights(generatedInsights);
    setIsLoading(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return BarChart3;
      case 'marketing': return TrendingUp;
      case 'pricing': return DollarSign;
      case 'customer': return Star;
      default: return Lightbulb;
    }
  };

  const performanceMetrics = [
    {
      label: 'Total Revenue',
      value: '₹12,450',
      change: '+23%',
      trend: 'up',
      icon: DollarSign
    },
    {
      label: 'Product Views',
      value: analytics.totalViews.toLocaleString(),
      change: '+15%',
      trend: 'up',
      icon: Eye
    },
    {
      label: 'Conversion Rate',
      value: '3.2%',
      change: '+0.8%',
      trend: 'up',
      icon: ShoppingCart
    },
    {
      label: 'Avg. Rating',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      icon: Star
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Business Insights</h2>
          <p className="text-muted-foreground">AI-powered recommendations to grow your business</p>
        </div>
        <Button onClick={generateInsights} disabled={isLoading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="floating-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <metric.icon className="w-8 h-8 text-primary" />
                <div className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-success' : 'text-destructive'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {metric.change}
                </div>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight) => {
          const CategoryIcon = getCategoryIcon(insight.category);
          
          return (
            <Card key={insight.id} className="artisan-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CategoryIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                      <CardDescription className="capitalize">{insight.category}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getImpactColor(insight.impact)} variant="secondary">
                    {insight.impact} impact
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>
                
                {insight.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Implementation Progress</span>
                      <span className="font-medium">{insight.progress}%</span>
                    </div>
                    <Progress value={insight.progress} className="h-2" />
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    {insight.actionable ? (
                      <CheckCircle className="w-4 h-4 mr-1 text-success" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mr-1 text-warning" />
                    )}
                    {insight.actionable ? 'Actionable' : 'Monitor'}
                  </div>
                  
                  {insight.actionable && (
                    <Button size="sm" variant="outline">
                      Take Action
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="artisan-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Based on your insights, here are recommended next steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col items-start space-y-2 bg-gradient-primary text-left">
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                <span className="font-semibold">Review Pricing</span>
              </div>
              <span className="text-xs opacity-90">
                Analyze competitor pricing and adjust your rates
              </span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2 text-left">
              <div className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                <span className="font-semibold">Improve Photos</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Retake product photos with better lighting
              </span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2 text-left">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span className="font-semibold">Plan Seasonal</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Prepare inventory for upcoming peak season
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};