import { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Apple, Droplets, Zap, Package, Calendar, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoMiles } from '@/hooks/useEcoMiles';
import { WasteLog, ExpiryItem } from '@/types/sustainx';
import { StatCard } from '@/components/shared/StatCard';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const logCategories = [
  { type: 'food', icon: Apple, label: 'Food Waste', unit: 'kg', color: 'text-destructive', bg: 'bg-destructive/10', action: 'food_log' as const },
  { type: 'plastic', icon: Package, label: 'Plastic Usage', unit: 'items', color: 'text-accent', bg: 'bg-accent/10', action: 'plastic_log' as const },
  { type: 'water', icon: Droplets, label: 'Water Usage', unit: 'L', color: 'text-eco-water', bg: 'bg-eco-water/10', action: 'water_log' as const },
  { type: 'electricity', icon: Zap, label: 'Electricity', unit: 'kWh', color: 'text-eco-leaf', bg: 'bg-eco-leaf/10', action: 'electricity_log' as const },
];

export default function EcoTrackPage() {
  const [wasteLogs, setWasteLogs] = useLocalStorage<WasteLog[]>('wasteLogs', []);
  const [expiryItems, setExpiryItems] = useLocalStorage<ExpiryItem[]>('expiryItems', []);
  const { earnPoints } = useEcoMiles();
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isExpiryDialogOpen, setIsExpiryDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'expiry' | 'report'>('logs');
  
  const [newLog, setNewLog] = useState({ type: 'food', amount: '', notes: '' });
  const [newExpiry, setNewExpiry] = useState({ name: '', expiryDate: '', category: 'food' });

  const thisMonthLogs = useMemo(() => {
    const now = new Date();
    return wasteLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    });
  }, [wasteLogs]);

  const stats = useMemo(() => {
    return logCategories.map(cat => ({
      ...cat,
      total: thisMonthLogs.filter(l => l.type === cat.type).reduce((sum, l) => sum + l.amount, 0)
    }));
  }, [thisMonthLogs]);

  const handleAddLog = () => {
    if (!newLog.amount) return;
    const category = logCategories.find(c => c.type === newLog.type);
    const log: WasteLog = {
      id: Date.now().toString(),
      type: newLog.type as WasteLog['type'],
      amount: parseFloat(newLog.amount),
      unit: category?.unit || '',
      date: new Date().toISOString(),
      notes: newLog.notes,
    };
    setWasteLogs(prev => [log, ...prev]);
    
    // Award EcoMiles based on log type
    if (category) {
      earnPoints(category.action);
    }
    
    setNewLog({ type: 'food', amount: '', notes: '' });
    setIsLogDialogOpen(false);
  };

  const handleAddExpiry = () => {
    if (!newExpiry.name || !newExpiry.expiryDate) return;
    const item: ExpiryItem = {
      id: Date.now().toString(),
      name: newExpiry.name,
      expiryDate: newExpiry.expiryDate,
      category: newExpiry.category,
      reminded: false,
    };
    setExpiryItems(prev => [item, ...prev]);
    setNewExpiry({ name: '', expiryDate: '', category: 'food' });
    setIsExpiryDialogOpen(false);
  };

  const upcomingExpiry = expiryItems
    .filter(item => new Date(item.expiryDate) >= new Date())
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    .slice(0, 5);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-primary/10 px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">EcoTrack</h1>
            <p className="text-sm text-muted-foreground">Daily consumption manager</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'logs', label: 'Logs' },
            { id: 'expiry', label: 'Expiry Tracker' },
            { id: 'report', label: 'Report' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-soft' 
                  : 'bg-card text-muted-foreground hover:bg-secondary'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-6">
        {activeTab === 'logs' && (
          <div className="space-y-6 animate-slide-up">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map(stat => (
                <StatCard
                  key={stat.type}
                  icon={<stat.icon className={cn('w-5 h-5', stat.color)} />}
                  label={stat.label}
                  value={stat.total.toFixed(1)}
                  unit={stat.unit}
                />
              ))}
            </div>

            {/* Add Log Button */}
            <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="eco" size="lg" className="w-full">
                  <Plus className="w-5 h-5" />
                  Add Log Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Log Consumption</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newLog.type} onValueChange={(v) => setNewLog(p => ({ ...p, type: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {logCategories.map(cat => (
                          <SelectItem key={cat.type} value={cat.type}>
                            <span className="flex items-center gap-2">
                              <cat.icon className={cn('w-4 h-4', cat.color)} />
                              {cat.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount ({logCategories.find(c => c.type === newLog.type)?.unit})</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter amount"
                      value={newLog.amount}
                      onChange={(e) => setNewLog(p => ({ ...p, amount: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes (optional)</Label>
                    <Input 
                      placeholder="Add notes..."
                      value={newLog.notes}
                      onChange={(e) => setNewLog(p => ({ ...p, notes: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleAddLog} className="w-full" variant="eco">
                    Save Log
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Recent Logs */}
            <div>
              <h3 className="font-semibold mb-3">Recent Logs</h3>
              <div className="space-y-2">
                {wasteLogs.slice(0, 10).map(log => {
                  const cat = logCategories.find(c => c.type === log.type);
                  return (
                    <div key={log.id} className="flex items-center gap-3 p-3 bg-card rounded-xl border">
                      <div className={cn('p-2 rounded-lg', cat?.bg)}>
                        {cat && <cat.icon className={cn('w-4 h-4', cat.color)} />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{cat?.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-semibold text-sm">
                        {log.amount} {log.unit}
                      </span>
                    </div>
                  );
                })}
                {wasteLogs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No logs yet. Start tracking!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expiry' && (
          <div className="space-y-6 animate-slide-up">
            <Dialog open={isExpiryDialogOpen} onOpenChange={setIsExpiryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="eco" size="lg" className="w-full">
                  <Plus className="w-5 h-5" />
                  Add Expiry Item
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Track Expiry Date</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Item Name</Label>
                    <Input 
                      placeholder="e.g., Milk, Yogurt..."
                      value={newExpiry.name}
                      onChange={(e) => setNewExpiry(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input 
                      type="date"
                      value={newExpiry.expiryDate}
                      onChange={(e) => setNewExpiry(p => ({ ...p, expiryDate: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleAddExpiry} className="w-full" variant="eco">
                    Save Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Upcoming Expiry
              </h3>
              <div className="space-y-2">
                {upcomingExpiry.map(item => {
                  const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / 86400000);
                  return (
                    <div key={item.id} className={cn(
                      'p-4 rounded-xl border',
                      daysLeft <= 2 ? 'bg-destructive/10 border-destructive/30' : 
                      daysLeft <= 5 ? 'bg-accent/10 border-accent/30' : 'bg-card'
                    )}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Expires: {new Date(item.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={cn(
                          'text-sm font-semibold px-2 py-1 rounded-full',
                          daysLeft <= 2 ? 'bg-destructive/20 text-destructive' : 
                          daysLeft <= 5 ? 'bg-accent/20 text-accent-foreground' : 'bg-primary/20 text-primary'
                        )}>
                          {daysLeft} days
                        </span>
                      </div>
                    </div>
                  );
                })}
                {upcomingExpiry.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No items tracked yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-card rounded-2xl p-5 border">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="w-6 h-6 text-primary" />
                <h3 className="font-semibold">Monthly Summary</h3>
              </div>
              <div className="space-y-4">
                {stats.map(stat => (
                  <ProgressBar
                    key={stat.type}
                    value={stat.total}
                    max={stat.type === 'water' ? 5000 : stat.type === 'electricity' ? 300 : stat.type === 'food' ? 10 : 50}
                    label={stat.label}
                    variant={stat.type === 'water' ? 'water' : stat.type === 'food' ? 'accent' : 'primary'}
                  />
                ))}
              </div>
            </div>
            <div className="bg-primary/10 rounded-2xl p-5 border border-primary/20">
              <h4 className="font-semibold mb-2">Eco Tip</h4>
              <p className="text-sm text-muted-foreground">
                Based on your logs, try reducing food waste by meal planning. 
                Even a 10% reduction can save up to 1kg of waste monthly!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
