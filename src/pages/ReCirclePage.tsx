import { useState, useMemo } from 'react';
import { ArrowLeft, Search, CheckCircle, XCircle, Lightbulb, MapPin, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoMiles } from '@/hooks/useEcoMiles';
import { recyclableItems, diyIdeas, recyclingCenters } from '@/data/sustainabilityData';
import { RecycleItem } from '@/types/sustainx';
import { StatCard } from '@/components/shared/StatCard';
import { cn } from '@/lib/utils';

export default function ReCirclePage() {
  const [recycleItems, setRecycleItems] = useLocalStorage<RecycleItem[]>('recycleItems', []);
  const { earnPoints } = useEcoMiles();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'check' | 'diy' | 'centers' | 'tracker'>('check');
  const [searchResult, setSearchResult] = useState<{ found: boolean; item?: typeof recyclableItems[string] & { name: string } } | null>(null);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    const found = Object.entries(recyclableItems).find(([key]) => 
      key.includes(query) || query.includes(key.split(' ')[0])
    );
    if (found) {
      setSearchResult({ found: true, item: { ...found[1], name: found[0] } });
      // Award EcoMiles for checking recyclability
      earnPoints('recycle_check');
    } else {
      setSearchResult({ found: false });
    }
  };

  const handleLogRecycle = () => {
    if (!searchResult?.item) return;
    const item: RecycleItem = {
      id: Date.now().toString(),
      name: searchResult.item.name,
      recyclable: searchResult.item.recyclable,
      material: searchResult.item.material,
      divertedWeight: 0.2,
      date: new Date().toISOString(),
    };
    setRecycleItems(prev => [item, ...prev]);
    setSearchQuery('');
    setSearchResult(null);
  };

  const totalDiverted = useMemo(() => {
    return recycleItems.reduce((sum, item) => sum + item.divertedWeight, 0);
  }, [recycleItems]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-eco-forest/10 px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-eco-forest/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">ReCircle</h1>
            <p className="text-sm text-muted-foreground">Recycling & reuse assistant</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'check', label: 'Is it Recyclable?' },
            { id: 'diy', label: 'DIY Ideas' },
            { id: 'centers', label: 'Centers' },
            { id: 'tracker', label: 'Tracker' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                activeTab === tab.id 
                  ? 'bg-eco-forest text-primary-foreground shadow-soft' 
                  : 'bg-card text-muted-foreground hover:bg-secondary'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-6">
        {activeTab === 'check' && (
          <div className="space-y-6 animate-slide-up">
            {/* Search */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search item (e.g., plastic bottle)"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} variant="eco">Check</Button>
              </div>
              
              {/* Search Result */}
              {searchResult && (
                <div className={cn(
                  'p-4 rounded-2xl border animate-slide-up',
                  searchResult.found && searchResult.item?.recyclable 
                    ? 'bg-primary/10 border-primary/30' 
                    : searchResult.found 
                    ? 'bg-accent/10 border-accent/30'
                    : 'bg-muted border-border'
                )}>
                  {searchResult.found && searchResult.item ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        {searchResult.item.recyclable ? (
                          <CheckCircle className="w-8 h-8 text-primary" />
                        ) : (
                          <XCircle className="w-8 h-8 text-accent" />
                        )}
                        <div>
                          <h3 className="font-semibold capitalize">{searchResult.item.name}</h3>
                          <p className={cn(
                            'text-sm font-medium',
                            searchResult.item.recyclable ? 'text-primary' : 'text-accent'
                          )}>
                            {searchResult.item.recyclable ? 'Recyclable ✓' : 'Not Recyclable ✗'}
                          </p>
                        </div>
                      </div>
                      <div className="bg-card/50 rounded-xl p-3">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Material:</span> {searchResult.item.material}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Tip:</span> {searchResult.item.tips}
                        </p>
                      </div>
                      <Button onClick={handleLogRecycle} variant="soft" size="sm" className="w-full">
                        Log this item
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-muted-foreground">Item not found. Try a different search term.</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try: plastic bottle, cardboard box, glass jar, aluminum can...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Items */}
            <div>
              <h3 className="font-semibold mb-3">Common Items</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(recyclableItems).slice(0, 6).map(([name, info]) => (
                  <button
                    key={name}
                    onClick={() => {
                      setSearchQuery(name);
                      setSearchResult({ found: true, item: { ...info, name } });
                    }}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all hover:shadow-soft',
                      info.recyclable ? 'bg-primary/5 border-primary/20' : 'bg-muted border-border'
                    )}
                  >
                    <p className="font-medium text-sm capitalize">{name}</p>
                    <p className={cn(
                      'text-xs',
                      info.recyclable ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {info.recyclable ? '♻️ Recyclable' : '✗ Not recyclable'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'diy' && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-accent" />
              <h3 className="font-semibold">Upcycling Ideas</h3>
            </div>
            {diyIdeas.map((idea, index) => (
              <div key={index} className="bg-card rounded-2xl p-4 border shadow-soft">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold">{idea.title}</h4>
                  <span className={cn(
                    'text-xs px-2 py-1 rounded-full',
                    idea.difficulty === 'Easy' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent-foreground'
                  )}>
                    {idea.difficulty}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {idea.materials.map((mat, i) => (
                    <span key={i} className="text-xs bg-muted px-2 py-1 rounded-lg">
                      {mat}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">⏱️ {idea.time}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'centers' && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-eco-forest" />
              <h3 className="font-semibold">Nearby Centers</h3>
            </div>
            {recyclingCenters.map((center, index) => (
              <div key={index} className="bg-card rounded-2xl p-4 border">
                <h4 className="font-semibold mb-1">{center.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{center.address}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {center.types.map((type, i) => (
                    <span key={i} className="text-xs bg-eco-forest/10 text-eco-forest px-2 py-1 rounded-lg">
                      {type}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">📞 {center.phone}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tracker' && (
          <div className="space-y-6 animate-slide-up">
            <StatCard
              icon={<Scale className="w-6 h-6 text-eco-forest" />}
              label="Total Waste Diverted"
              value={totalDiverted.toFixed(1)}
              unit="kg"
              variant="primary"
            />
            <div>
              <h3 className="font-semibold mb-3">Recycled Items</h3>
              <div className="space-y-2">
                {recycleItems.slice(0, 10).map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-card rounded-xl border">
                    <div className={cn(
                      'p-2 rounded-lg',
                      item.recyclable ? 'bg-primary/10' : 'bg-muted'
                    )}>
                      {item.recyclable ? (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm capitalize">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-primary">
                      +{item.divertedWeight}kg
                    </span>
                  </div>
                ))}
                {recycleItems.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Start checking items to track your recycling!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
