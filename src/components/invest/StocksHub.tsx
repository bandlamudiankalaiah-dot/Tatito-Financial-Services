import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Stock, PortfolioHolding } from '../../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Star, 
  SlidersHorizontal, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  X,
  Play,
  Pause,
  RefreshCw,
  Wallet
} from 'lucide-react';

export const StocksHub: React.FC<{ onOpenWallet: () => void }> = ({ onOpenWallet }) => {
  const { 
    stocks, 
    holdings, 
    watchlist, 
    toggleWatchlist, 
    buyStock, 
    sellStock, 
    user, 
    isMarketLive, 
    setIsMarketLive 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'screener' | 'holdings' | 'watchlist'>('screener');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  // Order pad state
  const [orderAction, setOrderAction] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(5);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [productType, setProductType] = useState<'DELIVERY' | 'INTRADAY'>('DELIVERY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');

  // Screener filtering
  const sectors = ['all', 'Banking & Financials', 'IT Services', 'Automobile', 'Energy & Retail', 'Telecom', 'Infrastructure & Engineering', 'FMCG & Hotels'];

  const filteredStocks = stocks.filter((stock) => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'all' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const watchlistStocks = stocks.filter((s) => watchlist.includes(s.symbol));

  const totalHoldingValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalInvestedValue = holdings.reduce((sum, h) => sum + h.investedValue, 0);
  const totalPnl = totalHoldingValue - totalInvestedValue;
  const totalPnlPct = totalInvestedValue > 0 ? (totalPnl / totalInvestedValue) * 100 : 0;

  const handleOpenOrder = (stock: Stock, action: 'BUY' | 'SELL') => {
    setSelectedStock(stock);
    setOrderAction(action);
    setOrderMessage('');
    const existingHolding = holdings.find((h) => h.symbol === stock.symbol);
    setQuantity(action === 'SELL' && existingHolding ? Math.min(5, existingHolding.quantity) : 5);
  };

  const handleExecuteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock || quantity <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (orderAction === 'BUY') {
        const ok = buyStock(selectedStock.symbol, quantity, orderType, productType);
        if (ok) {
          setOrderMessage(`Successfully bought ${quantity} shares of ${selectedStock.symbol}!`);
          setTimeout(() => setSelectedStock(null), 1000);
        }
      } else {
        const ok = sellStock(selectedStock.symbol, quantity);
        if (ok) {
          setOrderMessage(`Successfully sold ${quantity} shares of ${selectedStock.symbol}!`);
          setTimeout(() => setSelectedStock(null), 1000);
        }
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Market status & Portfolio Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span className={`inline-block w-2 h-2 rounded-full ${isMarketLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span>NSE / BSE Live Trading Hub</span>
            <span>·</span>
            <span>Brokerage: ₹0 Delivery · ₹20/order Intraday</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Stocks & Equity Screener</h1>
          <p className="text-xs text-slate-500 mt-0.5">Angel One / Groww style market watch, instant execution, and Demat delivery</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMarketLive(!isMarketLive)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              isMarketLive ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isMarketLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isMarketLive ? 'Live Ticker ON' : 'Ticker Paused'}
          </button>

          <button
            onClick={onOpenWallet}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Wallet className="w-3.5 h-3.5" />
            Wallet: ₹{user.walletBalance.toLocaleString('en-IN')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-6 pt-3">
        <button
          onClick={() => setActiveTab('screener')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'screener' ? 'border-blue-600 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Market Watch & Screener ({stocks.length})
        </button>
        <button
          onClick={() => setActiveTab('holdings')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'holdings' ? 'border-blue-600 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          My Holdings & P&L ({holdings.length})
        </button>
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'watchlist' ? 'border-blue-600 text-blue-900' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Watchlist ({watchlist.length})
        </button>
      </div>

      {/* TAB 1: SCREENER */}
      {activeTab === 'screener' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search symbol (e.g. RELIANCE, TCS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sector filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {sectors.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                    selectedSector === sec
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {sec === 'all' ? 'All Sectors' : sec}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-8"></th>
                  <th className="py-2.5 px-3">Company & Symbol</th>
                  <th className="py-2.5 px-3">Sector</th>
                  <th className="py-2.5 px-3 text-right">LTP (₹)</th>
                  <th className="py-2.5 px-3 text-right">Day Chg (%)</th>
                  <th className="py-2.5 px-3 text-right">Day High / Low</th>
                  <th className="py-2.5 px-3 text-right">P/E Ratio</th>
                  <th className="py-2.5 px-3 text-right">Market Cap</th>
                  <th className="py-2.5 px-3 text-center">Trend</th>
                  <th className="py-2.5 px-3 text-right">Quick Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStocks.map((stock) => {
                  const isPositive = stock.change >= 0;
                  const isWatchlisted = watchlist.includes(stock.symbol);

                  return (
                    <tr key={stock.symbol} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleWatchlist(stock.symbol)}
                          className={`p-1 rounded transition-colors ${
                            isWatchlisted ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{stock.symbol}</span>
                          <span className="text-[10px] font-mono font-normal text-slate-400">{stock.exchange}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{stock.name}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{stock.sector}</td>
                      <td className="py-3 px-3 text-right font-mono-numbers font-bold text-slate-900">
                        ₹{stock.price.toFixed(2)}
                      </td>
                      <td className={`py-3 px-3 text-right font-mono-numbers font-semibold ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </td>
                      <td className="py-3 px-3 text-right font-mono-numbers text-slate-500 text-[11px]">
                        ₹{stock.high.toFixed(1)} / ₹{stock.low.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono-numbers text-slate-700">{stock.peRatio}</td>
                      <td className="py-3 px-3 text-right font-mono-numbers text-slate-700">{stock.marketCap}</td>
                      <td className="py-3 px-3 text-center">
                        {/* Mini visual trendline */}
                        <div className="w-16 h-4 mx-auto flex items-end gap-0.5">
                          {stock.sparkline.map((val, idx) => {
                            const minVal = Math.min(...stock.sparkline);
                            const maxVal = Math.max(...stock.sparkline);
                            const range = maxVal - minVal || 1;
                            const hPct = Math.max(20, ((val - minVal) / range) * 100);
                            return (
                              <div
                                key={idx}
                                className={`flex-1 rounded-xs ${isPositive ? 'bg-emerald-400' : 'bg-rose-400'}`}
                                style={{ height: `${hPct}%` }}
                              ></div>
                            );
                          })}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenOrder(stock, 'BUY')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors"
                          >
                            Buy
                          </button>
                          <button
                            onClick={() => handleOpenOrder(stock, 'SELL')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold transition-colors"
                          >
                            Sell
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: HOLDINGS */}
      {activeTab === 'holdings' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500">Current Value</span>
              <div className="text-2xl font-bold font-mono-numbers text-slate-900 mt-1">
                ₹{totalHoldingValue.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500">Total Invested</span>
              <div className="text-2xl font-bold font-mono-numbers text-slate-900 mt-1">
                ₹{totalInvestedValue.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs text-slate-500">Total Unrealized P&L</span>
              <div className={`text-2xl font-bold font-mono-numbers mt-1 ${totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toLocaleString('en-IN')} ({totalPnl >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%)
              </div>
            </div>
          </div>

          {holdings.length === 0 ? (
            <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <p className="text-xs">You have no active stock holdings.</p>
              <button
                onClick={() => setActiveTab('screener')}
                className="mt-3 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Browse Stocks & Buy
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Stock</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Avg Cost</th>
                    <th className="py-2.5 px-3 text-right">Current Price</th>
                    <th className="py-2.5 px-3 text-right">Invested Value</th>
                    <th className="py-2.5 px-3 text-right">Current Value</th>
                    <th className="py-2.5 px-3 text-right">P&L (₹)</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {holdings.map((h) => {
                    const isProfit = h.pnl >= 0;
                    const liveStock = stocks.find((s) => s.symbol === h.symbol);

                    return (
                      <tr key={h.symbol} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{h.symbol}</div>
                          <div className="text-[11px] text-slate-500">{h.name}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono-numbers font-semibold text-slate-900">{h.quantity}</td>
                        <td className="py-3 px-3 text-right font-mono-numbers text-slate-600">₹{h.avgBuyPrice.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-mono-numbers font-bold text-slate-900">₹{h.currentPrice.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right font-mono-numbers text-slate-700">₹{h.investedValue.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 text-right font-mono-numbers font-bold text-slate-900">₹{h.currentValue.toLocaleString('en-IN')}</td>
                        <td className={`py-3 px-3 text-right font-mono-numbers font-bold ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isProfit ? '+' : ''}₹{h.pnl.toLocaleString('en-IN')} ({isProfit ? '+' : ''}{h.pnlPercent}%)
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => liveStock && handleOpenOrder(liveStock, 'SELL')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold transition-colors"
                          >
                            Exit / Sell
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: WATCHLIST */}
      {activeTab === 'watchlist' && (
        <div className="bg-white rounded-b-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="text-xs text-slate-500">Quickly monitor favorite instruments. Click the star on any screener stock to pin here.</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {watchlistStocks.map((stock) => {
              const isPositive = stock.change >= 0;
              return (
                <div key={stock.symbol} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-slate-900">{stock.symbol}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{stock.name}</div>
                    </div>
                    <button onClick={() => toggleWatchlist(stock.symbol)} className="text-amber-500 p-1">
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-lg font-bold font-mono-numbers text-slate-900">₹{stock.price.toFixed(2)}</span>
                    <span className={`text-xs font-mono-numbers font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                    <button
                      onClick={() => handleOpenOrder(stock, 'BUY')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => handleOpenOrder(stock, 'SELL')}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold rounded"
                    >
                      Sell
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BUY / SELL ORDER MODAL */}
      {selectedStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className={`px-6 py-4 text-white flex items-center justify-between ${
              orderAction === 'BUY' ? 'bg-emerald-700' : 'bg-rose-700'
            }`}>
              <div>
                <div className="text-sm font-bold flex items-center gap-2">
                  <span>{orderAction} ORDER</span>
                  <span>·</span>
                  <span className="font-mono">{selectedStock.symbol}</span>
                </div>
                <div className="text-xs text-white/80">{selectedStock.name}</div>
              </div>
              <button onClick={() => setSelectedStock(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteOrder} className="p-6 space-y-4 text-xs">
              {orderMessage ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{orderMessage}</span>
                </div>
              ) : (
                <>
                  {/* LTP card */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500">Market Price (LTP)</span>
                    <span className="text-lg font-bold font-mono-numbers text-slate-900">₹{selectedStock.price.toFixed(2)}</span>
                  </div>

                  {/* Product Type (Delivery vs Intraday) */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Product Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setProductType('DELIVERY')}
                        className={`p-2 rounded-lg border text-left ${
                          productType === 'DELIVERY' ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold' : 'border-slate-200'
                        }`}
                      >
                        Delivery (CNC)
                        <div className="text-[10px] text-slate-500 font-normal">Demat hold for long term</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProductType('INTRADAY')}
                        className={`p-2 rounded-lg border text-left ${
                          productType === 'INTRADAY' ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold' : 'border-slate-200'
                        }`}
                      >
                        Intraday (MIS)
                        <div className="text-[10px] text-slate-500 font-normal">Auto square-off 3:20 PM</div>
                      </button>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Quantity (Shares)</label>
                    <input
                      type="number"
                      min={1}
                      max={orderAction === 'SELL' ? 1000 : 500}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full p-2.5 border border-slate-300 rounded-lg font-mono-numbers text-base font-bold outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  {/* Order Total & Wallet check */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Order Value:</span>
                      <span className="font-bold font-mono-numbers text-slate-900">
                        ₹{(selectedStock.price * quantity).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Available Wallet Balance:</span>
                      <span className="font-mono-numbers text-slate-700">₹{user.walletBalance.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || (orderAction === 'BUY' && user.walletBalance < selectedStock.price * quantity)}
                    className={`w-full py-3 text-white font-bold text-xs rounded-xl transition-colors ${
                      orderAction === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                    } disabled:bg-slate-300`}
                  >
                    {isSubmitting
                      ? 'Transmitting Order to Exchange...'
                      : `${orderAction} ${quantity} ${selectedStock.symbol} @ ₹${selectedStock.price.toFixed(2)}`}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
