import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { useStore } from '../lib/store';
import { toast } from 'sonner@2.0.3';

export function LoginPage() {
  const { setUserMode } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    // Simulate login and redirect to buyer mode
    setUserMode('buyer');
    toast.success('Login successful! Welcome to Auraloom');
    
    setTimeout(() => {
      window.location.hash = 'buyer';
    }, 500);
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-primary mb-2">Auraloom</h1>
          <h2 className="mb-2">Login to Your Account</h2>
          <p className="text-muted-foreground">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block mb-2">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              className="text-primary hover:underline"
              onClick={() => {
                setUserMode('buyer');
                window.location.hash = 'buyer';
              }}
            >
              Sign up
            </button>
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <button
            className="text-sm text-muted-foreground hover:text-primary"
            onClick={() => window.location.hash = ''}
          >
            ← Back to Home
          </button>
        </div>
      </Card>
    </div>
  );
}
