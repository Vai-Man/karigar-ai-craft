import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, MessageCircle, Eye, Calendar, Target } from 'lucide-react';
import { storage, type Analytics } from '@/lib/storage';

export const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('all');
  const analytics = storage.getAnalytics();
  const products = storage.getProducts();
  const chats = storage.getChats();

  // Colors for charts
  const chartColors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--warning))'];

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalViews = analytics.totalViews;
    const totalProducts = analytics.totalProducts;
    const totalChats = analytics.totalChats;
    const avgViewsPerProduct = totalProducts > 0 ? Math.round(totalViews / totalProducts) : 0;

    // Calculate growth (mock data for demo)
    const currentWeek = analytics.weeklyStats[analytics.weeklyStats.length - 1];
    const previousWeek = analytics.weeklyStats[analytics.weeklyStats.length - 2];
    
    const viewsGrowth = currentWeek && previousWeek 
      ? ((currentWeek.views - previousWeek.views) / Math.max(previousWeek.views, 1)) * 100
      : 0;

    const productsGrowth = currentWeek && previousWeek
      ? ((currentWeek.products - previousWeek.products) / Math.max(previousWeek.products, 1)) * 100
      : 0;

    return {
      totalViews,
      totalProducts,
      totalChats,
      avgViewsPerProduct,
      viewsGrowth: Math.round(viewsGrowth),
      productsGrowth: Math.round(productsGrowth)
    };
  }, [analytics]);

  // Prepare chart data
  const weeklyData = analytics.weeklyStats.map(stat => ({
    week: stat.week.replace(/^\d{4}-W/, 'W'),
    products: stat.products,
    views: stat.views,
    chats: stat.chats
  }));

  // Product category distribution
  const categoryData = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    products.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });
    
    return Object.entries(categoryCount).map(([category, count]) => ({
      name: category.split(' ')[0], // Shorten category names
      value: count,
      fullName: category
    }));
  }, [products]);

  // Top performing products
  const topProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
      .map(product => ({
        name: product.title.length > 20 ? product.title.substring(0, 20) + '...' : product.title,
        views: product.views,
        price: parseFloat(product.price)
      }));
  }, [products]);

  // Recent activity data
  const recentActivity = useMemo(() => {
    const activities = [];
    
    // Add recent chats
    chats.slice(-3).forEach(chat => {
      activities.push({
        type: 'chat',
        message: `AI conversation: "${chat.message.substring(0, 30)}..."`,
        time: new Date(chat.timestamp).toLocaleDateString()
      });
    });

    // Add recent products
    products.slice(-3).forEach(product => {
      activities.push({
        type: 'product',
        message: `Product added: "${product.title}"`,
        time: new Date(product.createdAt).toLocaleDateString()
      });
    });

    return activities.slice(-5).reverse();
  }, [chats, products]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your business performance and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="floating-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProducts}</div>
            {metrics.productsGrowth !== 0 && (
              <p className={`text-xs ${metrics.productsGrowth > 0 ? 'text-success' : 'text-destructive'} flex items-center`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {metrics.productsGrowth > 0 ? '+' : ''}{metrics.productsGrowth}% from last week
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="floating-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalViews}</div>
            {metrics.viewsGrowth !== 0 && (
              <p className={`text-xs ${metrics.viewsGrowth > 0 ? 'text-success' : 'text-destructive'} flex items-center`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {metrics.viewsGrowth > 0 ? '+' : ''}{metrics.viewsGrowth}% from last week
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="floating-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Conversations</CardTitle>
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalChats}</div>
            <p className="text-xs text-muted-foreground">Chat sessions</p>
          </CardContent>
        </Card>

        <Card className="floating-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Views/Product</CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgViewsPerProduct}</div>
            <p className="text-xs text-muted-foreground">Per product average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trends */}
        <Card className="artisan-card">
          <CardHeader>
            <CardTitle>Weekly Activity Trends</CardTitle>
            <CardDescription>Track your weekly progress across all activities</CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="week" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Views"
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="products" 
                    stroke="hsl(var(--warning))" 
                    strokeWidth={2}
                    name="Products"
                    dot={{ fill: 'hsl(var(--warning))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="chats" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="Chats"
                    dot={{ fill: 'hsl(var(--success))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No data available yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Categories */}
        <Card className="artisan-card">
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>Distribution of your product categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">No products added yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="artisan-card">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Products with the most views</CardDescription>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topProducts} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={100}
                  />
                  <Tooltip 
                    formatter={(value) => [value, 'Views']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-muted-foreground">No product data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="artisan-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'chat' ? 'bg-primary/10' : 'bg-warning/10'
                    }`}>
                      {activity.type === 'chat' ? (
                        <MessageCircle className="w-4 h-4 text-primary" />
                      ) : (
                        <Package className="w-4 h-4 text-warning" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="artisan-card">
        <CardHeader>
          <CardTitle>Business Insights</CardTitle>
          <CardDescription>Key insights about your artisan business performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Most Popular Category
              </Badge>
              <p className="font-semibold">
                {categoryData.length > 0 
                  ? categoryData.sort((a, b) => b.value - a.value)[0]?.fullName || 'None'
                  : 'No products yet'
                }
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                AI Usage Rate
              </Badge>
              <p className="font-semibold">
                {products.length > 0 ? (metrics.totalChats / products.length).toFixed(1) : '0'} chats per product
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <Badge variant="secondary" className="bg-success/10 text-success">
                Engagement Score
              </Badge>
              <p className="font-semibold">
                {metrics.totalProducts > 0 
                  ? metrics.avgViewsPerProduct > 10 ? 'High' : metrics.avgViewsPerProduct > 5 ? 'Medium' : 'Growing'
                  : 'Start adding products'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};