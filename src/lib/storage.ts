// localStorage utilities for Karigar.AI

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  language: 'en' | 'hi';
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  image?: string; // base64 encoded image
  keywords: string[];
  hashtags: string[];
  seoSuggestion: string;
  pricingTips: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: string;
}

export interface Analytics {
  totalProducts: number;
  totalViews: number;
  totalChats: number;
  weeklyStats: {
    week: string;
    products: number;
    views: number;
    chats: number;
  }[];
}

export class StorageService {
  private static instance: StorageService;
  private storageKeys = {
    user: 'karigar_user',
    products: 'karigar_products',
    chats: 'karigar_chats',
    analytics: 'karigar_analytics',
    settings: 'karigar_settings'
  };

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // User management
  setUser(user: User): void {
    localStorage.setItem(this.storageKeys.user, JSON.stringify(user));
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.storageKeys.user);
    return userData ? JSON.parse(userData) : null;
  }

  logout(): void {
    localStorage.removeItem(this.storageKeys.user);
  }

  // Product management
  saveProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'views'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0
    };
    
    products.push(newProduct);
    localStorage.setItem(this.storageKeys.products, JSON.stringify(products));
    this.updateAnalytics('product_created');
    return newProduct;
  }

  getProducts(): Product[] {
    const productsData = localStorage.getItem(this.storageKeys.products);
    return productsData ? JSON.parse(productsData) : [];
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.storageKeys.products, JSON.stringify(products));
    return products[index];
  }

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) return false;
    
    localStorage.setItem(this.storageKeys.products, JSON.stringify(filteredProducts));
    return true;
  }

  incrementProductViews(id: string): void {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    
    if (product) {
      product.views += 1;
      localStorage.setItem(this.storageKeys.products, JSON.stringify(products));
      this.updateAnalytics('product_viewed');
    }
  }

  // Chat management
  saveChatMessage(message: string, response: string): ChatMessage {
    const chats = this.getChats();
    const newChat: ChatMessage = {
      id: this.generateId(),
      message,
      response,
      timestamp: new Date().toISOString()
    };
    
    chats.push(newChat);
    localStorage.setItem(this.storageKeys.chats, JSON.stringify(chats));
    this.updateAnalytics('chat_sent');
    return newChat;
  }

  getChats(): ChatMessage[] {
    const chatsData = localStorage.getItem(this.storageKeys.chats);
    return chatsData ? JSON.parse(chatsData) : [];
  }

  clearChats(): void {
    localStorage.setItem(this.storageKeys.chats, JSON.stringify([]));
  }

  // Analytics
  private updateAnalytics(action: 'product_created' | 'product_viewed' | 'chat_sent'): void {
    let analytics = this.getAnalytics();
    
    switch (action) {
      case 'product_created':
        analytics.totalProducts += 1;
        break;
      case 'product_viewed':
        analytics.totalViews += 1;
        break;
      case 'chat_sent':
        analytics.totalChats += 1;
        break;
    }

    // Update weekly stats
    const currentWeek = this.getCurrentWeek();
    let weekStat = analytics.weeklyStats.find(w => w.week === currentWeek);
    
    if (!weekStat) {
      weekStat = { week: currentWeek, products: 0, views: 0, chats: 0 };
      analytics.weeklyStats.push(weekStat);
    }

    switch (action) {
      case 'product_created':
        weekStat.products += 1;
        break;
      case 'product_viewed':
        weekStat.views += 1;
        break;
      case 'chat_sent':
        weekStat.chats += 1;
        break;
    }

    // Keep only last 12 weeks
    analytics.weeklyStats = analytics.weeklyStats.slice(-12);
    
    localStorage.setItem(this.storageKeys.analytics, JSON.stringify(analytics));
  }

  getAnalytics(): Analytics {
    const analyticsData = localStorage.getItem(this.storageKeys.analytics);
    return analyticsData ? JSON.parse(analyticsData) : {
      totalProducts: 0,
      totalViews: 0,
      totalChats: 0,
      weeklyStats: []
    };
  }

  // Settings
  saveSetting(key: string, value: any): void {
    const settings = this.getSettings();
    settings[key] = value;
    localStorage.setItem(this.storageKeys.settings, JSON.stringify(settings));
  }

  getSetting(key: string, defaultValue: any = null): any {
    const settings = this.getSettings();
    return settings[key] ?? defaultValue;
  }

  private getSettings(): Record<string, any> {
    const settingsData = localStorage.getItem(this.storageKeys.settings);
    return settingsData ? JSON.parse(settingsData) : {};
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private getCurrentWeek(): string {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${week.toString().padStart(2, '0')}`;
  }

  // Image utilities
  compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  // Export/Import data
  exportData(): string {
    const data = {
      user: this.getUser(),
      products: this.getProducts(),
      chats: this.getChats(),
      analytics: this.getAnalytics(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.products) {
        localStorage.setItem(this.storageKeys.products, JSON.stringify(data.products));
      }
      if (data.chats) {
        localStorage.setItem(this.storageKeys.chats, JSON.stringify(data.chats));
      }
      if (data.analytics) {
        localStorage.setItem(this.storageKeys.analytics, JSON.stringify(data.analytics));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

export const storage = StorageService.getInstance();
