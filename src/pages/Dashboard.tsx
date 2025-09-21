import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Package, TrendingUp, MessageCircle, BarChart3, Plus, LogOut, Settings } from 'lucide-react';
import { storage, type User, type Product } from '@/lib/storage';
import { ProductManager } from '@/components/ProductManager';
import { BusinessTips } from '@/components/BusinessTips';
import { ChatAssistant } from '@/components/ChatAssistant';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    
    setUser(currentUser);
    setProducts(storage.getProducts());
  }, [navigate]);

  const handleLogout = () => {
    storage.logout();
    toast({
      title: "Logged out",
      description: "See you soon! Keep crafting amazing products.",
    });
    navigate('/');
  };

  const analytics = storage.getAnalytics();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">Karigar.AI</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5 bg-muted/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="tips" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Tips</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
              <p className="text-muted-foreground">Track your business growth and AI assistance usage</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="floating-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalProducts}</div>
                  <p className="text-xs text-muted-foreground">Products listed</p>
                </CardContent>
              </Card>

              <Card className="floating-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Product Views</CardTitle>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalViews}</div>
                  <p className="text-xs text-muted-foreground">Total views</p>
                </CardContent>
              </Card>

              <Card className="floating-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">AI Conversations</CardTitle>
                  <MessageCircle className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalChats}</div>
                  <p className="text-xs text-muted-foreground">Chat sessions</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Products */}
            <Card className="artisan-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Products</CardTitle>
                    <CardDescription>Your latest product listings</CardDescription>
                  </div>
                  <Button onClick={() => setActiveTab('products')} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                    <p className="text-muted-foreground mb-4">Start by adding your first product listing</p>
                    <Button onClick={() => setActiveTab('products')} className="bg-gradient-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.slice(0, 3).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-smooth">
                        <div className="flex items-center space-x-4">
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold">{product.title}</h4>
                            <p className="text-sm text-muted-foreground">₹{product.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{product.views} views</Badge>
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                      </div>
                    ))}
                    {products.length > 3 && (
                      <Button 
                        onClick={() => setActiveTab('products')} 
                        variant="ghost" 
                        className="w-full"
                      >
                        View All {products.length} Products
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          {/* Business Tips Tab */}
          <TabsContent value="tips">
            <BusinessTips />
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <ChatAssistant />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;