// Capsule: Estoque
const Estoque = {
    _name: 'Estoque',
    _flows: ['reservar', 'consultar', 'liberar'],

    async reservar(id) {
        // Dynamic topology routing
        const resolver = global.TopologyResolver || require('./runtime.js').TopologyResolver;
        const route = resolver.resolve('Estoque');
        
        if (route.local) {
            // Same node - direct call to implementation
            return this._impl_reservar(id);
        } else {
            // Different node - RPC call
            const response = await fetch(route.url + '/Estoque/reservar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            return await response.json();
        }
    },

    _impl_reservar(id) {
        throw new Error('Estoque.reservar not implemented');
    },

    async consultar(id) {
        // Dynamic topology routing
        const resolver = global.TopologyResolver || require('./runtime.js').TopologyResolver;
        const route = resolver.resolve('Estoque');
        
        if (route.local) {
            // Same node - direct call to implementation
            return this._impl_consultar(id);
        } else {
            // Different node - RPC call
            const response = await fetch(route.url + '/Estoque/consultar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            return await response.json();
        }
    },

    _impl_consultar(id) {
        throw new Error('Estoque.consultar not implemented');
    },

    async liberar(id) {
        // Dynamic topology routing
        const resolver = global.TopologyResolver || require('./runtime.js').TopologyResolver;
        const route = resolver.resolve('Estoque');
        
        if (route.local) {
            // Same node - direct call to implementation
            return this._impl_liberar(id);
        } else {
            // Different node - RPC call
            const response = await fetch(route.url + '/Estoque/liberar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            return await response.json();
        }
    },

    _impl_liberar(id) {
        throw new Error('Estoque.liberar not implemented');
    },

};

// Capsule: Pedidos
const Pedidos = {
    _name: 'Pedidos',
    _flows: ['criar', 'cancelar'],

    async criar(user_id, produto_id) {
        // Dynamic topology routing
        const resolver = global.TopologyResolver || require('./runtime.js').TopologyResolver;
        const route = resolver.resolve('Pedidos');
        
        if (route.local) {
            // Same node - direct call to implementation
            return this._impl_criar(user_id, produto_id);
        } else {
            // Different node - RPC call
            const response = await fetch(route.url + '/Pedidos/criar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user_id, produto_id: produto_id })
            });
            return await response.json();
        }
    },

    _impl_criar(user_id, produto_id) {
        throw new Error('Pedidos.criar not implemented');
    },

    async cancelar(id) {
        // Dynamic topology routing
        const resolver = global.TopologyResolver || require('./runtime.js').TopologyResolver;
        const route = resolver.resolve('Pedidos');
        
        if (route.local) {
            // Same node - direct call to implementation
            return this._impl_cancelar(id);
        } else {
            // Different node - RPC call
            const response = await fetch(route.url + '/Pedidos/cancelar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            return await response.json();
        }
    },

    _impl_cancelar(id) {
        throw new Error('Pedidos.cancelar not implemented');
    },

};

// Capsule: Pagamentos
const Pagamentos = {
    _name: 'Pagamentos',
    _flows: ['processar', 'estornar'],

    async processar(valor, pedido_id) {
        // Dynamic topology routing
        const resolver = global.TopologyResolver || require('./runtime.js').TopologyResolver;
        const route = resolver.resolve('Pagamentos');
        
        if (route.local) {
            // Same node - direct call to implementation
            return this._impl_processar(valor, pedido_id);
        } else {
            // Different node - RPC call
            const response = await fetch(route.url + '/Pagamentos/processar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valor: valor, pedido_id: pedido_id })
            });
            return await response.json();
        }
    },

    _impl_processar(valor, pedido_id) {
        throw new Error('Pagamentos.processar not implemented');
    },

    async estornar(id) {
        // Dynamic topology routing
        const resolver = global.TopologyResolver || require('./runtime.js').TopologyResolver;
        const route = resolver.resolve('Pagamentos');
        
        if (route.local) {
            // Same node - direct call to implementation
            return this._impl_estornar(id);
        } else {
            // Different node - RPC call
            const response = await fetch(route.url + '/Pagamentos/estornar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id })
            });
            return await response.json();
        }
    },

    _impl_estornar(id) {
        throw new Error('Pagamentos.estornar not implemented');
    },

};

