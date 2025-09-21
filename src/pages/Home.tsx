import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, MessageCircle, Palette, Users, Zap } from 'lucide-react';
import { storage } from '@/lib/storage';
import heroImage from '@/assets/hero-artisans.jpg';

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = storage.getUser();

  const handleGetStarted = async () => {
    setIsLoading(true);
    
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
    
    setIsLoading(false);
  };

  const features = [
    {
      icon: Sparkles,
      title: 'AI Product Listings',
      description: 'Generate compelling product descriptions and SEO-optimized titles using advanced AI technology.',
      color: 'bg-gradient-warm',
    },
    {
      icon: TrendingUp,
      title: 'Business Insights',
      description: 'Get personalized tips on pricing, marketing, and growing your artisan business online.',
      color: 'bg-gradient-primary',
    },
    {
      icon: MessageCircle,
      title: 'Customer Support',
      description: 'AI-powered chat assistant to help you engage with customers and grow your business.',
      color: 'bg-gradient-hero',
    },
  ];

  const stats = [
    { label: 'Local Artisans Empowered', value: '10,000+', icon: Users },
    { label: 'Products Listed', value: '50,000+', icon: Palette },
    { label: 'Business Tips Generated', value: '100,000+', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Karigar.AI</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="outline" onClick={() => storage.logout()}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="outline" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Powered by Google Gemini AI
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Empower Your{' '}
            <span className="text-gradient">Artisan Business</span>
            <br />
            with AI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your traditional crafts into thriving online businesses with AI-powered tools 
            designed specifically for local artisans.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-warm transition-bounce text-lg px-8 py-6"
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Start Your Journey'}
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/20 hover:bg-primary/5 text-lg px-8 py-6"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="floating-card p-6 text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="text-gradient">Succeed Online</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides all the tools you need to showcase your crafts 
              and build a successful online business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="floating-card border-0 overflow-hidden">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-soft`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Craft Business?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of artisans who have already started their digital journey with Karigar.AI
          </p>
          
          <Button 
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 transition-bounce text-lg px-8 py-6"
            onClick={handleGetStarted}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Get Started Today'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gradient">Karigar.AI</span>
          </div>
          
          <p className="text-muted-foreground">
            Empowering local artisans with AI technology. Built for the GenAI Exchange Hackathon by Google.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;