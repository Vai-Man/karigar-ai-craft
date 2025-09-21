import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Globe, 
  Save,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

export const SettingsPanel = () => {
  const [user, setUser] = useState(storage.getUser());
  
  // Load saved settings from localStorage
  const loadSavedSettings = () => {
    const savedSettings = localStorage.getItem('karigar_settings');
    const savedTheme = localStorage.getItem('karigar_theme');
    
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    
    return {
      theme: savedTheme || 'light',
      language: 'en',
      region: 'US',
      notifications: {
        email: true,
        push: true,
        marketing: false,
        updates: true
      },
      privacy: {
        profilePublic: false,
        showOnlineStatus: true,
        allowMessaging: true
      },
      business: {
        storeName: user?.name || '',
        storeDescription: '',
        contactEmail: user?.email || '',
        phoneNumber: '',
        location: '',
        businessType: 'handmade'
      }
    };
  };

  const [settings, setSettings] = useState(loadSavedSettings);
  
  // Apply theme on component mount
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else { // system
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);
  
  const { toast } = useToast();

  // Helper functions for region-specific formatting
  const getPhonePlaceholder = () => {
    return settings.region === 'IN' ? '+91 98765 43210' : '+1 (555) 123-4567';
  };

  const getCurrencySymbol = () => {
    return settings.region === 'IN' ? '₹' : '$';
  };

  const getCountryCode = () => {
    return settings.region === 'IN' ? '+91' : '+1';
  };

  const handleSave = () => {
    // Save theme to localStorage and apply it
    localStorage.setItem('karigar_theme', settings.theme);
    
    // Apply theme immediately
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else { // system
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Save settings to storage
    const updatedUser = {
      ...user,
      name: settings.business.storeName,
      email: settings.business.contactEmail
    };
    
    if (updatedUser) {
      storage.setUser(updatedUser);
      setUser(updatedUser);
    }
    
    // Save all settings to localStorage
    localStorage.setItem('karigar_settings', JSON.stringify(settings));
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const updatePrivacySetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const updateBusinessSetting = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      business: {
        ...prev.business,
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <Button onClick={handleSave} variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="artisan-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>
              Update your personal information and business details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.business.storeName}
                onChange={(e) => updateBusinessSetting('storeName', e.target.value)}
                placeholder="Your artisan business name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.business.contactEmail}
                onChange={(e) => updateBusinessSetting('contactEmail', e.target.value)}
                placeholder="business@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={settings.business.phoneNumber}
                onChange={(e) => updateBusinessSetting('phoneNumber', e.target.value)}
                placeholder={getPhonePlaceholder()}
              />
              <p className="text-xs text-muted-foreground">
                Format: {getCountryCode()} XXXXX XXXXX {settings.region === 'IN' ? '(India)' : '(US)'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={settings.business.location}
                onChange={(e) => updateBusinessSetting('location', e.target.value)}
                placeholder="City, State/Province, Country"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select 
                value={settings.business.businessType} 
                onValueChange={(value) => updateBusinessSetting('businessType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="handmade">Handmade Crafts</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="textiles">Textiles & Clothing</SelectItem>
                  <SelectItem value="pottery">Pottery & Ceramics</SelectItem>
                  <SelectItem value="woodwork">Woodworking</SelectItem>
                  <SelectItem value="art">Art & Paintings</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={settings.business.storeDescription}
                onChange={(e) => updateBusinessSetting('storeDescription', e.target.value)}
                placeholder="Tell customers about your craft and story..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Privacy */}
        <Card className="artisan-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose how you want to be notified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Browser notifications
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => updateNotificationSetting('push', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Tips and promotions
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.marketing}
                  onCheckedChange={(checked) => updateNotificationSetting('marketing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Product Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    New features and improvements
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.updates}
                  onCheckedChange={(checked) => updateNotificationSetting('updates', checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center">
                <Shield className="w-4 h-4 mr-2 text-primary" />
                Privacy Settings
              </h4>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to others
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.profilePublic}
                  onCheckedChange={(checked) => updatePrivacySetting('profilePublic', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Online Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Show when you're online
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.showOnlineStatus}
                  onCheckedChange={(checked) => updatePrivacySetting('showOnlineStatus', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Messaging</Label>
                  <p className="text-sm text-muted-foreground">
                    Let customers message you directly
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.allowMessaging}
                  onCheckedChange={(checked) => updatePrivacySetting('allowMessaging', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance & Preferences */}
        <Card className="artisan-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center">
                        <Sun className="w-4 h-4 mr-2" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center">
                        <Moon className="w-4 h-4 mr-2" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center">
                        <Smartphone className="w-4 h-4 mr-2" />
                        System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                    <SelectItem value="bn">বাংলা</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Region & Currency</Label>
                <Select value={settings.region} onValueChange={(value) => setSettings(prev => ({ ...prev, region: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">🇺🇸 United States (USD $)</SelectItem>
                    <SelectItem value="IN">🇮🇳 India (INR ₹)</SelectItem>
                    <SelectItem value="GB">🇬🇧 United Kingdom (GBP £)</SelectItem>
                    <SelectItem value="EU">🇪🇺 Europe (EUR €)</SelectItem>
                    <SelectItem value="CA">🇨🇦 Canada (CAD $)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This affects currency symbols and phone number formats
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold flex items-center">
                <Globe className="w-4 h-4 mr-2 text-primary" />
                Platform Status
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Account Status</span>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Plan</span>
                  <Badge variant="outline">Free Tier</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Quota</span>
                  <Badge variant="secondary">85/100</Badge>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};