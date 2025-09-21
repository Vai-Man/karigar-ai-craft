import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles } from 'lucide-react';
import { storage, type User } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    language: 'en' as 'en' | 'hi'
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Simple login - check if user exists in localStorage
        const existingUser = storage.getUser();
        if (existingUser && existingUser.username === formData.username) {
          toast({
            title: "Welcome back!",
            description: "Successfully logged in to Karigar.AI",
          });
          navigate('/dashboard');
        } else {
          // For demo purposes, allow any login
          const demoUser: User = {
            id: '1',
            username: formData.username,
            email: formData.email || `${formData.username}@demo.com`,
            name: formData.name || formData.username,
            language: formData.language,
            createdAt: new Date().toISOString()
          };
          storage.setUser(demoUser);
          toast({
            title: "Welcome!",
            description: "Successfully logged in to Karigar.AI",
          });
          navigate('/dashboard');
        }
      } else {
        // Sign up
        if (!formData.username || !formData.email || !formData.password || !formData.name) {
          toast({
            title: "Error",
            description: "Please fill in all fields",
            variant: "destructive"
          });
          return;
        }

        const newUser: User = {
          id: Date.now().toString(),
          username: formData.username,
          email: formData.email,
          name: formData.name,
          language: formData.language,
          createdAt: new Date().toISOString()
        };

        storage.setUser(newUser);
        
        toast({
          title: "Account created!",
          description: "Welcome to Karigar.AI! Let's get you started.",
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-warm">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold text-white">Karigar.AI</span>
          </div>
          <p className="text-white/80">Empower your artisan business with AI</p>
        </div>

        {/* Auth Card */}
        <Card className="artisan-card shadow-glow">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Sign in to continue your artisan journey' 
                : 'Join thousands of empowered artisans'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                  className="transition-smooth focus:glowing-border"
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="transition-smooth focus:glowing-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="transition-smooth focus:glowing-border"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="transition-smooth focus:glowing-border"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(value) => handleInputChange('language', value)}
                  >
                    <SelectTrigger className="transition-smooth focus:glowing-border">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button 
                type="submit" 
                variant="default"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-warm transition-bounce"
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Loading...' 
                  : isLogin 
                    ? 'Login to Karigar.AI' 
                    : 'Create Account'
                }
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Login"
                }
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;