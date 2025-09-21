import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Upload, Sparkles, Edit, Trash2, Eye, Download } from 'lucide-react';
import { storage, type Product } from '@/lib/storage';
import { geminiService, type ProductListing } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

export const ProductManager = () => {
  const [products, setProducts] = useState<Product[]>(storage.getProducts());
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });
  const [generatedListing, setGeneratedListing] = useState<ProductListing | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Get currency symbol based on user's region setting
  const getCurrencySymbol = () => {
    const savedSettings = localStorage.getItem('karigar_settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      switch (settings.region) {
        case 'IN': return '₹';
        case 'GB': return '£';
        case 'EU': return '€';
        default: return '$';
      }
    }
    return '₹'; // Default to INR (Rupee)
  };

  const categories = [
    'Pottery & Ceramics',
    'Textiles & Weaving',
    'Jewelry & Accessories',
    'Wood Crafts',
    'Metal Work',
    'Paintings & Art',
    'Leather Goods',
    'Stone Carving',
    'Glass Work',
    'Other Handicrafts'
  ];

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', category: '', image: '' });
    setGeneratedListing(null);
    setEditingProduct(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      const compressedImage = await storage.compressImage(file, 800, 0.8);
      setFormData(prev => ({ ...prev, image: compressedImage }));
      toast({
        title: "Image uploaded",
        description: "Image successfully compressed and added",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGenerateAIListing = async () => {
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in title, description, price, and category first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const listing = await geminiService.generateProductListing(
        formData.title,
        formData.description,
        formData.price,
        formData.category
      );
      setGeneratedListing(listing);
      toast({
        title: "AI listing generated!",
        description: "Review the AI suggestions and apply them to your product",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate listing",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const applyGeneratedListing = () => {
    if (!generatedListing) return;
    
    setFormData(prev => ({
      ...prev,
      title: generatedListing.title,
      description: generatedListing.description
    }));
    
    toast({
      title: "Applied AI suggestions",
      description: "The AI-generated content has been applied to your form",
    });
  };

  const handleSaveProduct = () => {
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingProduct) {
        // Update existing product
        const updatedProduct = storage.updateProduct(editingProduct.id, {
          title: formData.title,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          image: formData.image,
          keywords: generatedListing?.keywords || [],
          hashtags: generatedListing?.hashtags || [],
          seoSuggestion: generatedListing?.seo_suggestion || '',
          pricingTips: generatedListing?.pricing_tips || []
        });
        
        if (updatedProduct) {
          setProducts(storage.getProducts());
          toast({
            title: "Product updated",
            description: "Your product has been successfully updated",
          });
        }
      } else {
        // Create new product
        const newProduct = storage.saveProduct({
          title: formData.title,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          image: formData.image,
          keywords: generatedListing?.keywords || [],
          hashtags: generatedListing?.hashtags || [],
          seoSuggestion: generatedListing?.seo_suggestion || '',
          pricingTips: generatedListing?.pricing_tips || []
        });
        
        setProducts(storage.getProducts());
        toast({
          title: "Product saved",
          description: "Your product has been successfully added",
        });
      }
      
      setIsAddingProduct(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save product. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || ''
    });
    setIsAddingProduct(true);
  };

  const handleDeleteProduct = (productId: string) => {
    storage.deleteProduct(productId);
    setProducts(storage.getProducts());
    toast({
      title: "Product deleted",
      description: "Product has been removed from your listings",
    });
  };

  const handleViewProduct = (productId: string) => {
    storage.incrementProductViews(productId);
    setProducts(storage.getProducts());
    toast({
      title: "View recorded",
      description: "Product view has been tracked",
    });
  };

  const exportData = () => {
    const data = storage.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'karigar-ai-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Your data has been downloaded as JSON file",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Product Management</h2>
          <p className="text-muted-foreground">Create and manage your product listings with AI assistance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={exportData} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary" onClick={() => setIsAddingProduct(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? 'Update your product details' : 'Create a new product listing with AI assistance'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Handcrafted Terracotta Pot"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product, materials used, crafting process..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ({getCurrencySymbol()}) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="299"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Product Image</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                      {formData.image && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {formData.image && (
                      <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded-lg border" />
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      onClick={handleGenerateAIListing}
                      disabled={isGenerating}
                      className="bg-gradient-warm flex-1"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate AI Listing
                        </>
                      )}
                    </Button>
                    <Button type="button" onClick={handleSaveProduct} className="bg-gradient-primary">
                      {editingProduct ? 'Update' : 'Save'} Product
                    </Button>
                  </div>
                </div>

                {/* AI Generated Content */}
                <div className="space-y-4">
                  {generatedListing ? (
                    <Card className="artisan-card">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Sparkles className="w-5 h-5 mr-2 text-primary" />
                          AI Generated Suggestions
                        </CardTitle>
                        <CardDescription>Review and apply AI improvements</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-semibold">Improved Title</Label>
                          <p className="text-sm bg-muted/50 p-2 rounded mt-1">{generatedListing.title}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold">Enhanced Description</Label>
                          <p className="text-sm bg-muted/50 p-2 rounded mt-1 max-h-24 overflow-y-auto">
                            {generatedListing.description}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold">SEO Keywords</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {generatedListing.keywords.map((keyword, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold">Hashtags</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {generatedListing.hashtags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {generatedListing.seo_suggestion && (
                          <div>
                            <Label className="text-sm font-semibold">SEO Tip</Label>
                            <p className="text-sm text-muted-foreground mt-1">{generatedListing.seo_suggestion}</p>
                          </div>
                        )}

                        <Button onClick={applyGeneratedListing} className="w-full bg-gradient-primary">
                          Apply AI Suggestions
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="artisan-card">
                      <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                        <Sparkles className="w-16 h-16 text-muted-foreground opacity-50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">AI Assistance Ready</h3>
                        <p className="text-muted-foreground text-sm">
                          Fill in the basic product details and click "Generate AI Listing" to get 
                          SEO-optimized titles, descriptions, and marketing suggestions.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card className="artisan-card">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-6">
              <Plus className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Create Your First Product</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start showcasing your beautiful handcrafted products to the world. 
              Our AI will help you create compelling listings that attract customers.
            </p>
            <Button 
              onClick={() => setIsAddingProduct(true)} 
              className="bg-gradient-primary"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="floating-card overflow-hidden">
              {product.image && (
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewProduct(product.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{product.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{getCurrencySymbol()}{product.price}</span>
                  <Badge variant="outline" className="text-xs">
                    {product.views} views
                  </Badge>
                </div>

                {product.keywords.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {product.keywords.slice(0, 3).map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {product.keywords.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{product.keywords.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};