import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ADMIN_CREDENTIALS, INITIAL_PRODUCTS } from '../constants';
import { Product, CATEGORIES, Category, Order } from '../types';
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

  // --- DERIVED DATA & STATS ---

  // Filter only Approved orders for revenue/sales stats
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
    
    // Most sold product
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

  // Chart Data (Group by Month - Last 6 months)
  const chartData = useMemo(() => {
    const data: Record<string, { name: string; sales: number; revenue: number }> = {};
    
    // Init last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${d.getMonth()}-${d.getFullYear()}`;
        const monthName = d.toLocaleString('pt-BR', { month: 'short' });
        data[key] = { name: monthName, sales: 0, revenue: 0 };
    }

    approvedOrders.forEach(order => {
        const d = new Date(order.date);
        const key = `${d.getMonth()}-${d.getFullYear()}`;
        if (data[key]) {
            data[key].sales += 1;
            data[key].revenue += order.totalAmount;
        }
    });

    return Object.values(data);
  }, [approvedOrders]);

  // Clients List (Derived from Orders)
  const clients = useMemo(() => {
    const clientMap: Record<string, { name: string; totalSpent: number; orderCount: number; lastOrder: string }> = {};
    
    // Look at ALL orders to find clients, but calculate spend only on APPROVED
    orders.forEach(order => {
        if (!clientMap[order.customerName]) {
            clientMap[order.customerName] = { 
                name: order.customerName, 
                totalSpent: 0, 
                orderCount: 0,
                lastOrder: order.date 
            };
        }
        
        clientMap[order.customerName].orderCount += 1;
        if (new Date(order.date) > new Date(clientMap[order.customerName].lastOrder)) {
            clientMap[order.customerName].lastOrder = order.date;
        }

        if (order.status === 'approved') {
            clientMap[order.customerName].totalSpent += order.totalAmount;
        }
    });

    return Object.values(clientMap);
  }, [orders]);


  // --- NEW PRODUCT STATE ---
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: 'Camisetas',
    stock: 0,
    description: '',
    images: ['']
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
    } else {
      alert('Credenciais inválidas!');
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name!,
      price: Number(newProduct.price),
      category: newProduct.category as Category,
      stock: Number(newProduct.stock) || 0,
      description: newProduct.description || '',
      images: newProduct.images?.length && newProduct.images[0] ? newProduct.images : ['https://via.placeholder.com/300']
    };

    addProduct(product);
    setNewProduct({ name: '', price: 0, category: 'Camisetas', stock: 0, description: '', images: [''] });
    alert('Produto adicionado com sucesso!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-black text-white mb-6 text-center uppercase tracking-widest">Painel Admin</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Usuário</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white focus:border-brand-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-sm mb-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white focus:border-brand-accent outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-brand-accent text-black font-bold py-3 rounded hover:bg-yellow-400 transition-colors">
              ENTRAR
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-8 animate-fade-in">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <p className="text-zinc-500 text-sm uppercase">Faturamento (Mês)</p>
                <h3 className="text-2xl font-bold text-white mt-1">{formatCurrency(stats.revenueMonth)}</h3>
                <p className="text-xs text-green-500 mt-1">Apenas pedidos aprovados</p>
            </div>
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <p className="text-zinc-500 text-sm uppercase">Total Pedidos Aprovados</p>
                <h3 className="text-2xl font-bold text-white mt-1">{approvedOrders.length}</h3>
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

        {/* Charts */}
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 h-96">
            <h3 className="text-lg font-bold text-white mb-6">Faturamento Real (Últimos 6 meses)</h3>
            {approvedOrders.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-500 flex-col">
                    <ShoppingBag className="w-12 h-12 mb-2 opacity-20" />
                    <p>Sem dados de vendas aprovadas no período.</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="name" stroke="#71717a" />
                        <YAxis stroke="#71717a" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', color: '#fff' }}
                            formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend />
                        <Bar dataKey="revenue" name="Receita (R$)" fill="#eab308" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-zinc-800">
             <h3 className="text-lg font-bold text-white">Gerenciamento de Pedidos</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase">
                    <tr>
                        <th className="p-4">Data/ID</th>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Itens</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {orders.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-zinc-500">Nenhum pedido realizado ainda.</td>
                        </tr>
                    ) : (
                        orders.map(order => (
                            <tr key={order.id} className="hover:bg-zinc-800/50">
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="text-white text-sm font-medium">{formatDate(order.date)}</span>
                                        <span className="text-zinc-500 text-xs">#{order.id.slice(-6)}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-white">{order.customerName}</td>
                                <td className="p-4 text-zinc-400 text-sm">
                                    {order.items.length} item(s)
                                    <div className="text-xs text-zinc-600 truncate max-w-[150px]">
                                        {order.items.map(i => i.name).join(', ')}
                                    </div>
                                </td>
                                <td className="p-4 text-brand-accent font-bold">{formatCurrency(order.totalAmount)}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                                        ${order.status === 'approved' ? 'bg-green-900/50 text-green-400 border border-green-800' : 
                                          order.status === 'rejected' ? 'bg-red-900/50 text-red-400 border border-red-800' : 
                                          'bg-yellow-900/50 text-yellow-400 border border-yellow-800'}`}>
                                        {order.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                        {order.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                                        {order.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                                        {order.status === 'pending' ? 'Pendente' : order.status === 'approved' ? 'Aprovado' : 'Recusado'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    {order.status === 'pending' && (
                                        <>
                                            <button 
                                                onClick={() => updateOrderStatus(order.id, 'approved')}
                                                className="bg-green-600 hover:bg-green-500 text-white p-2 rounded transition-colors"
                                                title="Aprovar Pedido"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => updateOrderStatus(order.id, 'rejected')}
                                                className="bg-red-600 hover:bg-red-500 text-white p-2 rounded transition-colors"
                                                title="Recusar Pedido"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    {order.status !== 'pending' && (
                                        <button 
                                            onClick={() => updateOrderStatus(order.id, 'pending')}
                                            className="text-zinc-500 hover:text-white p-2 text-xs underline"
                                        >
                                            Reverter
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );

  const renderProducts = () => (
      <div className="space-y-8 animate-fade-in">
        {/* Add Product Form */}
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-zinc-800 pb-2">Adicionar Novo Produto</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                    <label className="text-xs text-zinc-500 block mb-1">Nome</label>
                    <input required type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="text-xs text-zinc-500 block mb-1">Categoria</label>
                    <select className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-xs text-zinc-500 block mb-1">Preço (R$)</label>
                    <input required type="number" step="0.01" className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                </div>
                <div>
                    <label className="text-xs text-zinc-500 block mb-1">Estoque</label>
                    <input required type="number" className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
                </div>
                <div className="col-span-2">
                    <label className="text-xs text-zinc-500 block mb-1">URL Imagem</label>
                    <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" value={newProduct.images?.[0]} onChange={e => setNewProduct({...newProduct, images: [e.target.value]})} />
                </div>
                <div className="col-span-2">
                    <label className="text-xs text-zinc-500 block mb-1">Descrição</label>
                    <textarea className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white h-20" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                </div>
                <div className="col-span-2">
                    <button type="submit" className="bg-brand-accent text-black font-bold py-2 px-6 rounded hover:bg-yellow-400">Cadastrar Produto</button>
                </div>
            </form>
        </div>

        {/* Product List */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase">
                    <tr>
                        <th className="p-4">Produto</th>
                        <th className="p-4">Cat</th>
                        <th className="p-4">Preço</th>
                        <th className="p-4">Estoque</th>
                        <th className="p-4">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {products.map(p => (
                        <tr key={p.id} className="hover:bg-zinc-800/50">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover bg-zinc-800" />
                                    <span className="text-white font-medium text-sm">{p.name}</span>
                                </div>
                            </td>
                            <td className="p-4 text-zinc-400 text-sm">{p.category}</td>
                            <td className="p-4 text-white text-sm">{formatCurrency(p.price)}</td>
                            <td className="p-4 text-zinc-400 text-sm">{p.stock}</td>
                            <td className="p-4">
                                <button onClick={() => removeProduct(p.id)} className="text-red-500 hover:text-red-400">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
  );

  const renderClients = () => (
      <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Base de Clientes</h3>
              <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                  <input type="text" placeholder="Buscar cliente..." className="pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded text-sm text-white focus:border-brand-accent outline-none" />
              </div>
          </div>
          <table className="w-full text-left">
                <thead className="bg-zinc-950 text-zinc-400 text-xs uppercase">
                    <tr>
                        <th className="p-4">Nome</th>
                        <th className="p-4">Pedidos Total</th>
                        <th className="p-4">Última Compra</th>
                        <th className="p-4">Total Gasto (Aprovado)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {clients.length === 0 ? (
                        <tr><td colSpan={4} className="p-6 text-center text-zinc-500">Nenhum cliente registrado.</td></tr>
                    ) : (
                        clients.map((c, idx) => (
                            <tr key={idx} className="hover:bg-zinc-800/50">
                                <td className="p-4 text-white font-medium">{c.name}</td>
                                <td className="p-4 text-zinc-400">{c.orderCount}</td>
                                <td className="p-4 text-zinc-400">{formatDate(c.lastOrder)}</td>
                                <td className="p-4 text-brand-accent font-bold">{formatCurrency(c.totalSpent)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
          </table>
      </div>
  );

  return (
    <div className="min-h-screen bg-brand-black flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex-shrink-0">
        <div className="p-6">
            <h1 className="text-2xl font-black text-white tracking-tighter">GUETO <span className="text-brand-accent">ADMIN</span></h1>
        </div>
        <nav className="space-y-1 px-3">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-brand-accent text-black' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'orders' ? 'bg-brand-accent text-black' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
                <ShoppingBag className="w-5 h-5" />
                Pedidos
                {orders.filter(o => o.status === 'pending').length > 0 && (
                     <span className="ml-auto bg-brand-accent text-black text-xs font-bold px-2 py-0.5 rounded-full">
                        {orders.filter(o => o.status === 'pending').length}
                     </span>
                )}
            </button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'products' ? 'bg-brand-accent text-black' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
                <Package className="w-5 h-5" />
                Produtos
            </button>
            <button onClick={() => setActiveTab('clients')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'clients' ? 'bg-brand-accent text-black' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
                <Users className="w-5 h-5" />
                Clientes
            </button>
        </nav>
        <div className="absolute bottom-0 w-full md:w-64 p-4 border-t border-zinc-800">
            <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-zinc-800 rounded-md">
                <LogOut className="w-5 h-5" />
                Sair
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
                {activeTab === 'dashboard' && 'Visão Geral'}
                {activeTab === 'orders' && 'Gerenciar Pedidos'}
                {activeTab === 'products' && 'Gerenciar Produtos'}
                {activeTab === 'clients' && 'Lista de Clientes'}
            </h2>
            <div className="text-zinc-500 text-sm">
                Olá, <span className="text-white font-bold">Admin</span>
            </div>
        </header>
        
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'clients' && renderClients()}

      </main>

    </div>
  );
};

export default Admin;