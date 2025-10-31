import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useStore } from '../lib/store';
import { toast } from 'sonner@2.0.3';

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProductModal({ open, onClose }: CreateProductModalProps) {
  const { user, products, addProduct } = useStore();
  const [formData, setFormData] = useState({
    title: '',
    titleBn: '',
    price: '',
    moq: '',
    blend: '',
    category: 'fabric' as 'fabric' | 'yarn' | 'jute' | 'leather' | 'fiber',
    image: '',
    description: '',
    descriptionBn: '',
  });
  
  const userProducts = products.filter((p) => p.sellerId === user?.id);
  const isFree = user?.membership !== 'premium';
  const hasReachedLimit = isFree && userProducts.length >= 2;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.titleBn || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (hasReachedLimit) {
      toast.error('Upgrade to premium for unlimited products');
      window.location.hash = 'subscription';
      onClose();
      return;
    }
    
    addProduct({
      id: `p-${Date.now()}`,
      sellerId: user!.id,
      title: formData.title,
      titleBn: formData.titleBn,
      price: parseFloat(formData.price),
      moq: formData.moq,
      blend: formData.blend,
      category: formData.category,
      image: formData.image || 'https://images.unsplash.com/photo-1632932580949-3182167aaebb',
      description: formData.description,
      descriptionBn: formData.descriptionBn,
    });
    
    toast.success('প্রোডাক্ট সফলভাবে যোগ হয়েছে!');
    
    setFormData({
      title: '',
      titleBn: '',
      price: '',
      moq: '',
      blend: '',
      category: 'fabric',
      image: '',
      description: '',
      descriptionBn: '',
    });
    
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>নতুন প্রোডাক্ট যোগ করুন</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Product Title (English) *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Cotton Fabric"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2">প্রোডাক্ট নাম (বাংলা) *</label>
                <Input
                  value={formData.titleBn}
                  onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                  placeholder="যেমন: কটন ফেব্রিক"
                  required
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Price (৳ per yard) *</label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="450"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2">MOQ (Minimum Order)</label>
                <Input
                  value={formData.moq}
                  onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                  placeholder="500 yards"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Blend / Composition</label>
                <Input
                  value={formData.blend}
                  onChange={(e) => setFormData({ ...formData, blend: e.target.value })}
                  placeholder="100% Cotton"
                />
              </div>
              
              <div>
                <label className="block mb-2">Category *</label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fabric">Fabric</SelectItem>
                    <SelectItem value="yarn">Yarn</SelectItem>
                    <SelectItem value="jute">Jute</SelectItem>
                    <SelectItem value="leather">Leather</SelectItem>
                    <SelectItem value="fiber">Fiber</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="block mb-2">Image URL (optional)</label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave blank to use default image
              </p>
            </div>
            
            <div>
              <label className="block mb-2">Description (English)</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description..."
                rows={3}
              />
            </div>
            
            <div>
              <label className="block mb-2">বিবরণ (বাংলা)</label>
              <Textarea
                value={formData.descriptionBn}
                onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                placeholder="প্রোডাক্ট বিবরণ..."
                rows={3}
              />
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-muted-foreground">
                {userProducts.length}/{isFree ? '2' : '∞'} প্রোডাক্ট যোগ করা হয়েছে
              </p>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  বাতিল করুন
                </Button>
                <Button type="submit" disabled={hasReachedLimit}>
                  {hasReachedLimit ? 'লিমিট পৌঁছেছে' : 'প্রোডাক্ট যোগ করুন'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
