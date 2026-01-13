import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ADMIN_CREDENTIALS } from '../constants';
import { Product, CATEGORIES, Category, AVAILABLE_SIZES } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LayoutDashboard, Package, Users, LogOut, Trash2, Search, ShoppingBag, CheckCircle, XCircle, Clock } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'clients'>('dashboard');
  
  // Store context
  const { products, orders, addProduct, removeProduct, updateOrderStatus } = useStore();

  // --- DERIVED DATA ---
  const approvedOrders = useMemo(() => orders.filter(o => o.status === 'approved'), [orders]);
  
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const revenueTotal = approvedOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    const revenueMonth = approvedOrders
      .filter(o => {
        const d = new Date(o.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, o) => acc + o.totalAmount, 0);

    const ticketAvg = approvedOrders.length > 0 ? revenueTotal / approvedOrders.length : 0;
    
    // Most sold
    const productCounts: Record<string, number> = {};
    approvedOrders.forEach(order => {
      order.items.forEach(item => {
        productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
      });
    });
    const mostSoldEntry = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];
    const mostSold = mostSoldEntry ? mostSoldEntry[0] : 'N/A';

    return { revenueTotal, revenueMonth, ticketAvg, mostSold };
  }, [approvedOrders]);

  // Chart Data
  const chartData = useMemo(() => {
    const data: Record<string, { name: string; revenue: number }> = {};
    for (let i = 2; i >= 0; i--) { // Last 3 months
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${d.getMonth()}-${d.getFullYear()}`;
        const monthName = d.toLocaleString('pt-BR', { month: 'short' });
        data[key] = { name: monthName, revenue: 0 };
    }

    approvedOrders.forEach(order => {
        const d = new Date(order.date);
        const key = `${d.getMonth()}-${d.getFullYear()}`;
        if (data[key]) {
            data[key].revenue += order.totalAmount;
        }
    });

    return Object.values(data);
  }, [approvedOrders]);

  // Clients List
  const clients = useMemo(() => {
    const clientMap: Record<string, { name: string; email: string; phone: string; totalSpent: number; orderCount: number; lastOrder: string }> = {};
    
    orders.forEach(order => {
        const email = order.customer.email;
        if (!clientMap[email]) {
            clientMap[email] = { 
                name: order.customer.name, 
                email: order.customer.email,
                phone: order.customer.phone,
                totalSpent: 0, 
                orderCount: 0,
                lastOrder: order.date 
            };
        }
        
        clientMap[email].orderCount += 1;
        if (new Date(order.date) > new Date(clientMap[email].lastOrder)) {
            clientMap[email].lastOrder = order.date;
        }

        if (order.status === 'approved') {
            clientMap[email].totalSpent += order.totalAmount;
        }
    });

    return Object.values(clientMap);
  }, [orders]);


  // --- NEW PRODUCT STATE ---
  const [newProduct, setNewProduct] = useState<Partial<Product> & { imagesStr: string }>({
    name: '',
    price: 0,
    category: 'Camisetas',
    stock: 0,
    description: '',
    sizes: [],
    images: [],
    imagesStr: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
    } else {
      alert('Credenciais inválidas!');
    }
  };

  const toggleSize = (size: string) => {
    setNewProduct(prev => {
        const currentSizes = prev.sizes || [];
        if (currentSizes.includes(size)) {
            return { ...prev, sizes: currentSizes.filter(s => s !== size) };
        } else {
            return { ...prev, sizes: [...currentSizes, size] };
        }
    });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    // Process images
    const imgArray = newProduct.imagesStr ? newProduct.imagesStr.split(',').map(s => s.trim()).filter(s => s !== '') : ['https://via.placeholder.com/300'];

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name!,
      price: Number(newProduct.price),
      category: newProduct.category as Category,
      stock: Number(newProduct.stock) || 0,
      description: newProduct.description || '',
      sizes: newProduct.sizes || [],
      images: imgArray
    };

    addProduct(product);
    setNewProduct({ name: '', price: 0, category: 'Camisetas', stock: 0, description: '', sizes: [], images: [], imagesStr: '' });
    alert('Produto adicionado com sucesso!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-black text-white mb-6 text-center uppercase tracking-widest">Painel Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white focus:border-brand-accent outline-none" />
            <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white focus:border-brand-accent outline-none" />
            <button type="submit" className="w-full bg-brand-accent text-black font-bold py-3 rounded hover:bg-yellow-400 transition-colors">ENTRAR</button>
          </form>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <p className="text-zinc-500 text-sm uppercase">Faturamento (Mês)</p>
                <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.revenueMonth)}</h3>
            </div>
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <p className="text-zinc-500 text-sm uppercase">Ticket Médio</p>
                <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.ticketAvg)}</h3>
            </div>
             <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <p className="text-zinc-500 text-sm uppercase">Mais Vendido</p>
                <h3 className="text-lg font-bold text-brand-accent mt-1 truncate">{stats.mostSold}</h3>
            </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 h-96">
            <h3 className="text-lg font-bold text-white mb-6">Faturamento (Últimos 3 Meses)</h3>
            {approvedOrders.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-500">Sem vendas no período.</div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="name" stroke="#71717a" />
                        <YAxis stroke="#71717a" />
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff' }} formatter={(value: number) => formatCurrency(value)} />
                        <Bar dataKey="revenue" name="Receita" fill="#eab308" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden animate-fade-in">
        <table className="w-full text-left">
            <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase">
                <tr>
                    <th className="p-4">ID/Data</th>
                    <th className="p-4">Cliente</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
                {orders.map(order => (
                    <tr key={order.id} className="hover:bg-zinc-800/50">
                        <td className="p-4">
                            <span className="text-white text-sm block">{formatDate(order.date)}</span>
                            <span className="text-zinc-500 text-xs">#{order.id.slice(-6)}</span>
                        </td>
                        <td className="p-4 text-white">
                            <div className="font-bold">{order.customer.name}</div>
                            <div className="text-xs text-zinc-400">{order.customer.phone}</div>
                        </td>
                        <td className="p-4 text-brand-accent font-bold">{formatCurrency(order.totalAmount)}</td>
                        <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'approved' ? 'bg-green-900 text-green-400' : order.status === 'rejected' ? 'bg-red-900 text-red-400' : 'bg-yellow-900 text-yellow-400'}`}>
                                {order.status}
                            </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                            {order.status === 'pending' && (
                                <>
                                    <button onClick={() => updateOrderStatus(order.id, 'approved')} className="text-green-500 hover:text-green-400"><CheckCircle /></button>
                                    <button onClick={() => updateOrderStatus(order.id, 'rejected')} className="text-red-500 hover:text-red-400"><XCircle /></button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );

  const renderProducts = () => (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-4">Adicionar Produto</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required placeholder="Nome" className="bg-zinc-950 border border-zinc-800 rounded p-2 text-white" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <select className="bg-zinc-950 border border-zinc-800 rounded p-2 text-white" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input required type="number" placeholder="Preço" className="bg-zinc-950 border border-zinc-800 rounded p-2 text-white" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                <input required type="number" placeholder="Estoque" className="bg-zinc-950 border border-zinc-800 rounded p-2 text-white" value={newProduct.stock || ''} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
                
                <div className="col-span-2">
                    <label className="text-zinc-500 text-xs block mb-2">Tamanhos Disponíveis</label>
                    <div className="flex gap-2 flex-wrap">
                        {AVAILABLE_SIZES.map(size => (
                            <button 
                                key={size} 
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`px-3 py-1 rounded border text-sm ${newProduct.sizes?.includes(size) ? 'bg-brand-accent text-black border-brand-accent' : 'bg-zinc-950 text-zinc-400 border-zinc-800'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="col-span-2">
                    <label className="text-zinc-500 text-xs block mb-1">URLs das Imagens (separadas por vírgula)</label>
                    <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" value={newProduct.imagesStr} onChange={e => setNewProduct({...newProduct, imagesStr: e.target.value})} />
                </div>
                
                <textarea placeholder="Descrição" className="col-span-2 bg-zinc-950 border border-zinc-800 rounded p-2 text-white h-20" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                <button type="submit" className="col-span-2 bg-brand-accent text-black font-bold py-2 rounded">Salvar Produto</button>
            </form>
        </div>
        <div className="grid gap-2">
            {products.map(p => (
                <div key={p.id} className="bg-zinc-900 p-4 rounded flex justify-between items-center border border-zinc-800">
                    <div className="flex items-center gap-3">
                        <img src={p.images[0]} className="w-10 h-10 rounded object-cover" />
                        <div>
                            <p className="text-white font-bold">{p.name}</p>
                            <p className="text-xs text-zinc-500">{p.sizes.join(', ')}</p>
                        </div>
                    </div>
                    <button onClick={() => removeProduct(p.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
            ))}
        </div>
      </div>
  );

  const renderClients = () => (
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden animate-fade-in">
          <table className="w-full text-left">
                <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase">
                    <tr>
                        <th className="p-4">Nome</th>
                        <th className="p-4">Contato</th>
                        <th className="p-4">Gasto (Aprovado)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {clients.map((c, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/50">
                            <td className="p-4 text-white">{c.name}</td>
                            <td className="p-4 text-zinc-400 text-xs">
                                <div>{c.email}</div>
                                <div>{c.phone}</div>
                            </td>
                            <td className="p-4 text-brand-accent font-bold">{formatCurrency(c.totalSpent)}</td>
                        </tr>
                    ))}
                </tbody>
          </table>
      </div>
  );

  return (
    <div className="min-h-screen bg-brand-black flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex-shrink-0">
        <div className="p-6"><h1 className="text-2xl font-black text-white">ADMIN</h1></div>
        <nav className="space-y-1 px-3">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded ${activeTab === 'dashboard' ? 'bg-brand-accent text-black' : 'text-zinc-400'}`}><LayoutDashboard className="w-4 h-4" /> Dashboard</button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded ${activeTab === 'orders' ? 'bg-brand-accent text-black' : 'text-zinc-400'}`}><ShoppingBag className="w-4 h-4" /> Pedidos</button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded ${activeTab === 'products' ? 'bg-brand-accent text-black' : 'text-zinc-400'}`}><Package className="w-4 h-4" /> Produtos</button>
            <button onClick={() => setActiveTab('clients')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded ${activeTab === 'clients' ? 'bg-brand-accent text-black' : 'text-zinc-400'}`}><Users className="w-4 h-4" /> Clientes</button>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'clients' && renderClients()}
      </main>
    </div>
  );
};

export default Admin;