// Find this section at the bottom of the file
// Replace the existing initialization with:

// Initial sync check
setTimeout(() => {
    const url = 'https://pukopnrxgitwataauvgo.supabase.co';
    const key = 'sb_publishable_vOC-igCOGRZ6lmIegNTZHA_2kWXn1ve';
    
    // Store credentials
    localStorage.setItem('supabase_url', url);
    localStorage.setItem('supabase_key', key);
    
    // Initialize sync
    SyncManager.init(url, key);
}, 2000);

// ============================================================
// KRT TRADERS ERP – Complete System
// Single File – All Modules
// ============================================================

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

const Utils = {
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
    },

    formatDate(date, format = 'full') {
        const d = new Date(date);
        const opts = {
            full: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
            date: { year: 'numeric', month: 'short', day: 'numeric' },
            time: { hour: '2-digit', minute: '2-digit' },
            short: { month: 'short', day: 'numeric' }
        };
        return d.toLocaleDateString('en-US', opts[format] || opts.full);
    },

    formatCurrency(amount, currency = 'PKR') {
        if (amount === undefined || amount === null) return '0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

    formatNumber(num) {
        if (num === undefined || num === null) return '0';
        return new Intl.NumberFormat('en-US').format(num);
    },

    debounce(fn, delay = 300) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    isValidPhone(phone) {
        return /^[\+\d\s\-\(\)]{7,20}$/.test(phone);
    },

    truncate(str, len = 50) {
        if (!str) return '';
        return str.length > len ? str.substring(0, len) + '...' : str;
    },

    randomColor() {
        const colors = ['#4F46E5', '#0EA5E9', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    downloadFile(content, filename, type = 'application/json') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    arrayToCSV(data, headers) {
        const headerRow = headers.join(',');
        const rows = data.map(item => headers.map(h => `"${item[h] || ''}"`).join(','));
        return [headerRow, ...rows].join('\n');
    },

    safeJSONParse(str, fallback = null) {
        try {
            return JSON.parse(str);
        } catch {
            return fallback;
        }
    },

    timeAgo(date) {
        const now = new Date();
        const diff = Math.floor((now - new Date(date)) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
        if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
        if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
        return this.formatDate(date, 'date');
    },

    generateBarcode(prefix = 'KRT') {
        const num = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `${prefix}-${num}`;
    },

    calculateTax(amount, rate) {
        return (amount * rate) / 100;
    },

    calculateProfit(sellPrice, buyPrice, qty = 1) {
        return (sellPrice - buyPrice) * qty;
    },

    calculateMargin(sellPrice, buyPrice) {
        if (buyPrice === 0) return 0;
        return ((sellPrice - buyPrice) / buyPrice) * 100;
    },

    groupBy(array, key) {
        return array.reduce((acc, item) => {
            const group = item[key] || 'undefined';
            if (!acc[group]) acc[group] = [];
            acc[group].push(item);
            return acc;
        }, {});
    },

    sumBy(array, key) {
        return array.reduce((sum, item) => sum + (parseFloat(item[key]) || 0), 0);
    },

    unique(arr) {
        return [...new Set(arr)];
    },

    paginate(array, page = 1, perPage = 20) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return {
            data: array.slice(start, end),
            total: array.length,
            page,
            perPage,
            totalPages: Math.ceil(array.length / perPage)
        };
    },

    searchFilter(array, searchTerm, keys) {
        if (!searchTerm) return array;
        const term = searchTerm.toLowerCase().trim();
        return array.filter(item => {
            return keys.some(key => {
                const val = String(item[key] || '').toLowerCase();
                return val.includes(term);
            });
        });
    },

    sortData(array, key, direction = 'asc') {
        const sorted = [...array];
        sorted.sort((a, b) => {
            const valA = a[key] || '';
            const valB = b[key] || '';
            if (typeof valA === 'string') {
                return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return direction === 'asc' ? valA - valB : valB - valA;
        });
        return sorted;
    },

    toast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 400);
        }, duration);
    },

    showModal(content, title = '', size = '') {
        const container = document.getElementById('modalContainer');
        if (!container) return null;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-box ${size}">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">${content}</div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-close-btn">Close</button>
                </div>
            </div>
        `;

        container.innerHTML = '';
        container.appendChild(modal);

        const closeModal = () => {
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.95)';
            setTimeout(() => modal.remove(), 300);
        };

        modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
        modal.querySelector('.modal-close-btn')?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        return modal;
    },

    confirm(message, title = 'Confirm') {
        return new Promise((resolve) => {
            const container = document.getElementById('modalContainer');
            if (!container) return resolve(false);

            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-box" style="max-width:420px;">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body" style="padding:20px 0;">
                        <p style="font-size:1rem;color:var(--text-secondary);">${message}</p>
                    </div>
                    <div class="modal-footer" style="justify-content:center;gap:12px;">
                        <button class="btn btn-outline" id="confirmNo">Cancel</button>
                        <button class="btn btn-danger" id="confirmYes">Confirm</button>
                    </div>
                </div>
            `;

            container.innerHTML = '';
            container.appendChild(modal);

            const closeModal = () => {
                modal.style.opacity = '0';
                setTimeout(() => modal.remove(), 300);
            };

            modal.querySelector('.modal-close').addEventListener('click', closeModal);
            modal.querySelector('#confirmNo').addEventListener('click', () => {
                closeModal();
                resolve(false);
            });
            modal.querySelector('#confirmYes').addEventListener('click', () => {
                closeModal();
                resolve(true);
            });
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                    resolve(false);
                }
            });
        });
    },

    getSettings() {
        const settings = DB.readAll(DB.TABLES.SETTINGS);
        if (settings.length === 0) {
            const defaults = {
                companyName: 'KRT TRADERS',
                companyLogo: '',
                address: 'Karachi, Pakistan',
                phone: '+92-300-1234567',
                taxRate: 0,
                currency: 'PKR',
                theme: 'light',
                invoicePrefix: 'INV-',
                footerNote: 'Thank you for your business!'
            };
            DB.create(DB.TABLES.SETTINGS, defaults);
            return defaults;
        }
        return settings[0];
    },

    updateSettings(updates) {
        const settings = this.getSettings();
        return DB.update(DB.TABLES.SETTINGS, settings.id, updates);
    }
};

// ============================================================
// DATABASE LAYER
// ============================================================

const DB = {
    TABLES: {
        USERS: 'krt_users',
        STOCK_IN: 'krt_stock_in',
        STOCK_OUT: 'krt_stock_out',
        ITEMS: 'krt_items',
        VENDORS: 'krt_vendors',
        CUSTOMERS: 'krt_customers',
        LEDGER: 'krt_ledger',
        SETTINGS: 'krt_settings',
        SYNC_QUEUE: 'krt_sync_queue'
    },

    _getTable(tableName) {
        try {
            const data = localStorage.getItem(tableName);
            return data ? Utils.safeJSONParse(data, []) : [];
        } catch {
            return [];
        }
    },

    _setTable(tableName, data) {
        try {
            localStorage.setItem(tableName, JSON.stringify(data));
        } catch (e) {
            Utils.toast('Storage error: ' + e.message, 'error');
        }
    },

    create(table, record) {
        const data = this._getTable(table);
        record.id = record.id || Utils.generateId();
        record.createdAt = record.createdAt || new Date().toISOString();
        record.updatedAt = new Date().toISOString();
        data.push(record);
        this._setTable(table, data);
        this._queueSync(table, 'create', record);
        return record;
    },

    read(table, id) {
        const data = this._getTable(table);
        return data.find(item => item.id === id) || null;
    },

    readAll(table, filters = {}) {
        let data = this._getTable(table);
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== '') {
                data = data.filter(item => {
                    const val = item[key];
                    const filterVal = filters[key];
                    if (typeof filterVal === 'string') {
                        return String(val).toLowerCase().includes(filterVal.toLowerCase());
                    }
                    return val === filterVal;
                });
            }
        });
        return data;
    },

    update(table, id, updates) {
        const data = this._getTable(table);
        const index = data.findIndex(item => item.id === id);
        if (index === -1) return null;
        data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
        this._setTable(table, data);
        this._queueSync(table, 'update', data[index]);
        return data[index];
    },

    delete(table, id) {
        const data = this._getTable(table);
        const index = data.findIndex(item => item.id === id);
        if (index === -1) return false;
        const deleted = data[index];
        data.splice(index, 1);
        this._setTable(table, data);
        this._queueSync(table, 'delete', { id });
        return true;
    },

    bulkCreate(table, records) {
        const data = this._getTable(table);
        records.forEach(record => {
            record.id = record.id || Utils.generateId();
            record.createdAt = record.createdAt || new Date().toISOString();
            record.updatedAt = new Date().toISOString();
            data.push(record);
        });
        this._setTable(table, data);
        records.forEach(r => this._queueSync(table, 'create', r));
        return records;
    },

    query(table, options = {}) {
        let data = this._getTable(table);
        const { search, searchKeys = [], filters = {}, sort, sortDir = 'asc', page = 1, perPage = 20 } = options;

        if (search && searchKeys.length) {
            const term = search.toLowerCase().trim();
            data = data.filter(item => {
                return searchKeys.some(key => {
                    const val = String(item[key] || '').toLowerCase();
                    return val.includes(term);
                });
            });
        }

        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== '') {
                data = data.filter(item => {
                    const val = item[key];
                    const filterVal = filters[key];
                    if (typeof filterVal === 'string') {
                        return String(val).toLowerCase().includes(filterVal.toLowerCase());
                    }
                    return val === filterVal;
                });
            }
        });

        if (sort) {
            data.sort((a, b) => {
                const valA = a[sort] || '';
                const valB = b[sort] || '';
                if (typeof valA === 'string') {
                    return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }
                return sortDir === 'asc' ? valA - valB : valB - valA;
            });
        }

        const total = data.length;
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const paginated = data.slice(start, end);

        return {
            data: paginated,
            total,
            page,
            perPage,
            totalPages: Math.ceil(total / perPage)
        };
    },

    _queueSync(table, action, data) {
        const queue = this._getTable(this.TABLES.SYNC_QUEUE);
        queue.push({
            id: Utils.generateId(),
            table,
            action,
            data,
            timestamp: new Date().toISOString(),
            attempts: 0,
            synced: false
        });
        this._setTable(this.TABLES.SYNC_QUEUE, queue);
        if (navigator.onLine) {
            setTimeout(() => SyncManager.processQueue(), 1000);
        }
    },

    getPendingSyncCount() {
        const queue = this._getTable(this.TABLES.SYNC_QUEUE);
        return queue.filter(item => !item.synced).length;
    },

    clearAll() {
        Object.values(this.TABLES).forEach(table => {
            localStorage.removeItem(table);
        });
        localStorage.removeItem('krt_session');
    },

    exportAll() {
        const data = {};
        Object.values(this.TABLES).forEach(table => {
            data[table] = this._getTable(table);
        });
        return data;
    },

    importAll(data) {
        Object.keys(data).forEach(table => {
            if (Object.values(this.TABLES).includes(table)) {
                this._setTable(table, data[table]);
            }
        });
    },

    getStockBalance() {
        const stockIn = this._getTable(this.TABLES.STOCK_IN);
        const stockOut = this._getTable(this.TABLES.STOCK_OUT);

        const inMap = {};
        stockIn.forEach(item => {
            const key = item.itemName + '|' + item.barcode;
            if (!inMap[key]) {
                inMap[key] = { ...item, totalIn: 0, totalOut: 0 };
            }
            inMap[key].totalIn += parseFloat(item.quantity) || 0;
            inMap[key].purchasePrice = parseFloat(item.purchasePrice) || 0;
            inMap[key].barcode = item.barcode;
            inMap[key].itemName = item.itemName;
            inMap[key].unit = item.unit || 'pcs';
        });

        const outMap = {};
        stockOut.forEach(item => {
            const key = item.itemName + '|' + item.barcode;
            if (!outMap[key]) {
                outMap[key] = { ...item, totalOut: 0 };
            }
            outMap[key].totalOut += parseFloat(item.quantity) || 0;
            outMap[key].salePrice = parseFloat(item.salePrice) || 0;
        });

        const result = [];
        Object.keys(inMap).forEach(key => {
            const inItem = inMap[key];
            const outItem = outMap[key] || { totalOut: 0, salePrice: inItem.purchasePrice || 0 };
            const available = inItem.totalIn - outItem.totalOut;
            result.push({
                barcode: inItem.barcode,
                itemName: inItem.itemName,
                totalIn: inItem.totalIn,
                totalOut: outItem.totalOut,
                available: available,
                purchasePrice: inItem.purchasePrice || 0,
                sellingPrice: outItem.salePrice || inItem.purchasePrice || 0,
                unit: inItem.unit || 'pcs',
                stockValue: available * (inItem.purchasePrice || 0),
                profit: available * ((outItem.salePrice || 0) - (inItem.purchasePrice || 0))
            });
        });

        return result.filter(item => item.available > 0 || item.totalIn > 0);
    }
};

// ============================================================
// SYNC MANAGER
// ============================================================

const SyncManager = {
    supabaseUrl: '',
    supabaseKey: '',
    isConnected: false,

    init(url, key) {
        this.supabaseUrl = url;
        this.supabaseKey = key;
        this._checkConnection();
        this._setupListeners();
    },

    _checkConnection() {
        this.isConnected = navigator.onLine;
        this._updateUI();
        if (this.isConnected && this.supabaseUrl) {
            this.processQueue();
        }
    },

    _setupListeners() {
        window.addEventListener('online', () => {
            this.isConnected = true;
            this._updateUI();
            Utils.toast('Internet connected! Syncing...', 'success');
            this.processQueue();
        });

        window.addEventListener('offline', () => {
            this.isConnected = false;
            this._updateUI();
            Utils.toast('Internet disconnected. Working offline.', 'warning');
        });

        // Periodic sync check
        setInterval(() => {
            if (this.isConnected && this.supabaseUrl) {
                this.processQueue();
            }
        }, 30000);
    },

    _updateUI() {
        const indicator = document.getElementById('syncIndicator');
        const lastSync = document.getElementById('lastSyncTime');
        const pending = DB.getPendingSyncCount();

        if (indicator) {
            if (this.isConnected) {
                indicator.className = 'sync-online';
                indicator.innerHTML = `<i class="fas fa-cloud"></i> Online`;
            } else {
                indicator.className = 'sync-offline';
                indicator.innerHTML = `<i class="fas fa-cloud"></i> Offline`;
            }
            if (pending > 0) {
                indicator.innerHTML += ` (${pending} pending)`;
            }
        }

        if (lastSync) {
            lastSync.textContent = pending > 0 ? 'Syncing...' : `Last sync: ${Utils.formatDate(new Date(), 'time')}`;
        }
    },

    async processQueue() {
        if (!this.isConnected || !this.supabaseUrl) return;

        const queue = DB._getTable(DB.TABLES.SYNC_QUEUE);
        const pending = queue.filter(item => !item.synced);

        if (pending.length === 0) {
            this._updateUI();
            return;
        }

        this._updateUI();
        Utils.toast(`Syncing ${pending.length} items...`, 'info');

        for (const item of pending) {
            try {
                await this._syncItem(item);
                item.synced = true;
                item.syncedAt = new Date().toISOString();
                DB._setTable(DB.TABLES.SYNC_QUEUE, queue);
            } catch (error) {
                item.attempts += 1;
                if (item.attempts > 5) {
                    item.synced = true; // Skip after 5 attempts
                    Utils.toast(`Sync failed for ${item.table}: ${error.message}`, 'error');
                }
                DB._setTable(DB.TABLES.SYNC_QUEUE, queue);
            }
        }

        // Clean up synced items
        const updatedQueue = DB._getTable(DB.TABLES.SYNC_QUEUE);
        const filtered = updatedQueue.filter(item => !item.synced || item.attempts > 5);
        DB._setTable(DB.TABLES.SYNC_QUEUE, filtered);

        this._updateUI();
        Utils.toast('Sync complete!', 'success');
    },

    async _syncItem(item) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(resolve, 200);
        });

        // Real implementation with Supabase:
        /*
        const { data, error } = await supabase
            .from(item.table)
            [item.action === 'delete' ? 'delete' : 'upsert'](item.data);
        if (error) throw error;
        */
    },

    forceSync() {
        if (!this.supabaseUrl) {
            Utils.toast('Please configure Supabase in Settings first', 'warning');
            return;
        }
        this.processQueue();
    }
};

// ============================================================
// AUTHENTICATION
// ============================================================

const Auth = {
    SESSION_KEY: 'krt_session',

    init() {
        const users = DB.readAll(DB.TABLES.USERS);
        if (users.length === 0) {
            DB.create(DB.TABLES.USERS, {
                username: 'admin',
                password: this.hashPassword('admin123'),
                name: 'Admin',
                email: 'admin@krttraders.com',
                role: 'admin',
                active: true
            });
        }
        this.checkSession();
    },

    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hashed_' + hash.toString(36);
    },

    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    },

    getUsers() {
        return DB.readAll(DB.TABLES.USERS);
    },

    createUser(data) {
        const users = this.getUsers();
        if (users.find(u => u.username === data.username)) {
            throw new Error('Username already exists');
        }
        return DB.create(DB.TABLES.USERS, data);
    },

    updateUser(id, updates) {
        return DB.update(DB.TABLES.USERS, id, updates);
    },

    deleteUser(id) {
        const session = this.getSession();
        if (session && session.id === id) {
            throw new Error('Cannot delete your own account');
        }
        return DB.delete(DB.TABLES.USERS, id);
    },

    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.active !== false);

        if (!user) {
            throw new Error('User not found');
        }

        if (!this.verifyPassword(password, user.password)) {
            throw new Error('Invalid password');
        }

        const session = {
            userId: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        this._updateUI(session);
        return session;
    },

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        this._updateUI(null);
        window.location.reload();
    },

    getSession() {
        const data = localStorage.getItem(this.SESSION_KEY);
        return data ? Utils.safeJSONParse(data) : null;
    },

    checkSession() {
        const session = this.getSession();
        if (session) {
            const user = DB.read(DB.TABLES.USERS, session.userId);
            if (!user || user.active === false) {
                this.logout();
                return;
            }
            this._updateUI(session);
            App.loadPage('dashboard');
        } else {
            this._showLogin();
        }
        return session;
    },

    isAuthenticated() {
        return !!this.getSession();
    },

    isAdmin() {
        const session = this.getSession();
        return session && session.role === 'admin';
    },

    _showLogin() {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div class="login-page" style="
                display:flex;
                align-items:center;
                justify-content:center;
                min-height:100vh;
                background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);
                padding:20px;
            ">
                <div class="login-box" style="
                    background:#fff;
                    padding:48px 40px;
                    border-radius:16px;
                    max-width:400px;
                    width:100%;
                    box-shadow:0 20px 60px rgba(0,0,0,0.3);
                ">
                    <div style="text-align:center;margin-bottom:32px;">
                        <div style="font-size:2.5rem;font-weight:800;background:linear-gradient(135deg,#818CF8,#4F46E5);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">
                            KRT TRADERS
                        </div>
                        <p style="color:var(--text-secondary);font-weight:500;">Enterprise ERP System</p>
                    </div>

                    <form id="loginForm">
                        <div class="form-group">
                            <label>Username</label>
                            <input type="text" id="loginUsername" class="form-control" placeholder="Enter username" value="admin" required>
                        </div>
                        <div class="form-group">
                            <label>Password</label>
                            <input type="password" id="loginPassword" class="form-control" placeholder="Enter password" value="admin123" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;padding:14px;font-size:1rem;">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>
                    </form>

                    <div style="margin-top:16px;text-align:center;font-size:0.85rem;color:var(--text-light);">
                        Default: admin / admin123
                    </div>
                </div>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            try {
                this.login(username, password);
                Utils.toast('Login successful!', 'success');
                window.location.reload();
            } catch (error) {
                Utils.toast(error.message, 'error');
            }
        });
    },

    _updateUI(session) {
        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userNameDisplay && session) {
            userNameDisplay.textContent = session.name || session.username;
        }
    },

    changePassword(userId, oldPassword, newPassword) {
        const user = DB.read(DB.TABLES.USERS, userId);
        if (!user) throw new Error('User not found');

        if (!this.verifyPassword(oldPassword, user.password)) {
            throw new Error('Current password is incorrect');
        }

        return this.updateUser(userId, {
            password: this.hashPassword(newPassword)
        });
    }
};

// ============================================================
// MAIN APPLICATION
// ============================================================

const App = {
    currentPage: 'dashboard',

    init() {
        this._setupNavigation();
        this._setupGlobalSearch();
        this._setupLogout();
        this._setupSidebarToggle();
        this._updateDateTime();
        setInterval(() => this._updateDateTime(), 1000);

        // Load default page
        if (Auth.isAuthenticated()) {
            this.loadPage('dashboard');
        }
    },

    _setupNavigation() {
        document.querySelectorAll('.sidebar-nav li').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) {
                    this.loadPage(page);
                    document.querySelectorAll('.sidebar-nav li').forEach(l => l.classList.remove('active'));
                    item.classList.add('active');
                }
            });
        });
    },

    _setupGlobalSearch() {
        const input = document.getElementById('globalSearchInput');
        const btn = document.getElementById('globalSearchBtn');

        const performSearch = () => {
            const query = input.value.trim();
            if (query) {
                this.loadPage('search');
                // Search will handle the query
                setTimeout(() => {
                    const searchInput = document.getElementById('searchQuery');
                    if (searchInput) {
                        searchInput.value = query;
                        searchInput.dispatchEvent(new Event('input'));
                    }
                }, 100);
            }
        };

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });

        btn.addEventListener('click', performSearch);
    },

    _setupLogout() {
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            Utils.confirm('Are you sure you want to logout?', 'Logout').then(confirmed => {
                if (confirmed) {
                    Auth.logout();
                }
            });
        });
    },

    _setupSidebarToggle() {
        const toggleBtn = document.getElementById('toggleSidebar');
        const sidebar = document.getElementById('sidebar');

        toggleBtn?.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close sidebar on outside click (mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    },

    _updateDateTime() {
        const el = document.getElementById('currentDateTime');
        if (el) {
            el.textContent = new Date().toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    },

    loadPage(page) {
        this.currentPage = page;
        const titleMap = {
            dashboard: 'Dashboard',
            'stock-in': 'Stock IN',
            'stock-out': 'Stock OUT',
            'stock-balance': 'Stock Balance',
            'daily-report': 'Daily Report',
            ledger: 'Ledger',
            reports: 'Reports',
            search: 'Search',
            settings: 'Settings',
            backup: 'Backup'
        };

        document.getElementById('pageTitle').textContent = titleMap[page] || page;

        const pageMap = {
            dashboard: this._renderDashboard,
            'stock-in': this._renderStockIn,
            'stock-out': this._renderStockOut,
            'stock-balance': this._renderStockBalance,
            'daily-report': this._renderDailyReport,
            ledger: this._renderLedger,
            reports: this._renderReports,
            search: this._renderSearch,
            settings: this._renderSettings,
            backup: this._renderBackup
        };

        const renderer = pageMap[page];
        if (renderer) {
            renderer.call(this);
        }
    },

    // ============================================================
    // DASHBOARD
    // ============================================================

    _renderDashboard() {
        const content = document.getElementById('pageContent');
        const stockIn = DB.readAll(DB.TABLES.STOCK_IN);
        const stockOut = DB.readAll(DB.TABLES.STOCK_OUT);
        const items = DB.readAll(DB.TABLES.ITEMS);
        const balance = DB.getStockBalance();

        const totalStock = balance.reduce((sum, item) => sum + item.available, 0);
        const stockValue = balance.reduce((sum, item) => sum + item.stockValue, 0);
        const totalProfit = balance.reduce((sum, item) => sum + item.profit, 0);

        const today = new Date().toISOString().split('T')[0];
        const todaySales = stockOut.filter(s => s.createdAt?.startsWith(today));
        const todayPurchases = stockIn.filter(s => s.createdAt?.startsWith(today));

        const lowStock = balance.filter(item => item.available <= 5);

        content.innerHTML = `
            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-boxes"></i></div>
                    <div class="stat-label">Total Stock</div>
                    <div class="stat-value">${Utils.formatNumber(totalStock)}</div>
                </div>
                <div class="stat-card color-success">
                    <div class="stat-icon"><i class="fas fa-money-bill-wave"></i></div>
                    <div class="stat-label">Stock Value</div>
                    <div class="stat-value">${Utils.formatCurrency(stockValue)}</div>
                </div>
                <div class="stat-card color-info">
                    <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-label">Total Profit</div>
                    <div class="stat-value">${Utils.formatCurrency(totalProfit)}</div>
                </div>
                <div class="stat-card color-warning">
                    <div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div class="stat-label">Today's Sales</div>
                    <div class="stat-value">${Utils.formatNumber(todaySales.length)}</div>
                </div>
                <div class="stat-card color-secondary">
                    <div class="stat-icon"><i class="fas fa-truck"></i></div>
                    <div class="stat-label">Today's Purchases</div>
                    <div class="stat-value">${Utils.formatNumber(todayPurchases.length)}</div>
                </div>
                <div class="stat-card color-danger">
                    <div class="stat-icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <div class="stat-label">Low Stock Items</div>
                    <div class="stat-value">${lowStock.length}</div>
                </div>
            </div>

            <div class="dashboard-bottom">
                <div class="card">
                    <h3><i class="fas fa-clock"></i> Recent Transactions</h3>
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this._getRecentTransactions().map(t => `
                                    <tr>
                                        <td>${Utils.formatDate(t.createdAt, 'short')}</td>
                                        <td><span class="badge ${t.type === 'IN' ? 'badge-success' : 'badge-info'}">${t.type}</span></td>
                                        <td>${t.itemName || 'N/A'}</td>
                                        <td>${t.quantity || 0}</td>
                                        <td>${Utils.formatCurrency(t.total || 0)}</td>
                                    </tr>
                                `).join('')}
                                ${this._getRecentTransactions().length === 0 ? '<tr><td colspan="5" class="text-center text-muted">No transactions</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card">
                    <h3><i class="fas fa-exclamation-circle"></i> Low Stock Alert</h3>
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Available</th>
                                    <th>Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${lowStock.slice(0, 10).map(item => `
                                    <tr>
                                        <td>${item.itemName}</td>
                                        <td class="text-danger">${item.available}</td>
                                        <td>${item.unit}</td>
                                    </tr>
                                `).join('')}
                                ${lowStock.length === 0 ? '<tr><td colspan="3" class="text-center text-muted">All items in stock</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card mt-24">
                <h3><i class="fas fa-cloud"></i> Sync Status</h3>
                <div style="display:flex;gap:20px;flex-wrap:wrap;">
                    <div>
                        <strong>Status:</strong>
                        <span id="syncStatusDash" class="${navigator.onLine ? 'text-success' : 'text-danger'}">
                            ${navigator.onLine ? '🟢 Online' : '🔴 Offline'}
                        </span>
                    </div>
                    <div>
                        <strong>Pending Sync:</strong>
                        <span>${DB.getPendingSyncCount()}</span>
                    </div>
                    <div>
                        <strong>Total Items:</strong>
                        <span>${items.length}</span>
                    </div>
                    <div>
                        <button class="btn btn-primary btn-sm" onclick="SyncManager.forceSync()">
                            <i class="fas fa-sync"></i> Sync Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    _getRecentTransactions() {
        const stockIn = DB.readAll(DB.TABLES.STOCK_IN);
        const stockOut = DB.readAll(DB.TABLES.STOCK_OUT);

        const inData = stockIn.map(s => ({ ...s, type: 'IN', total: s.quantity * s.purchasePrice }));
        const outData = stockOut.map(s => ({ ...s, type: 'OUT', total: s.quantity * s.salePrice }));

        const combined = [...inData, ...outData];
        return Utils.sortData(combined, 'createdAt', 'desc').slice(0, 10);
    },

    // ============================================================
    // STOCK IN
    // ============================================================

    _renderStockIn() {
        const content = document.getElementById('pageContent');
        const stockIn = DB.readAll(DB.TABLES.STOCK_IN);
        const vendors = DB.readAll(DB.TABLES.VENDORS);

        content.innerHTML = `
            <div class="flex-between mb-16">
                <h2>Stock IN</h2>
                <button class="btn btn-primary" onclick="App._showStockInForm()">
                    <i class="fas fa-plus"></i> New Purchase
                </button>
            </div>

            <div class="card mb-16">
                <div class="flex flex-wrap gap-8">
                    <input type="text" id="stockInSearch" class="form-control" style="flex:1;min-width:200px;" placeholder="Search by item, vendor, barcode...">
                    <input type="date" id="stockInDateFilter" class="form-control" style="width:160px;">
                    <button class="btn btn-outline" onclick="App._filterStockIn()"><i class="fas fa-filter"></i> Filter</button>
                    <button class="btn btn-outline" onclick="App._clearStockInFilter()"><i class="fas fa-undo"></i> Clear</button>
                    <button class="btn btn-success btn-sm" onclick="App._exportStockIn()"><i class="fas fa-file-excel"></i> Export</button>
                </div>
            </div>

            <div class="card">
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Vendor</th>
                                <th>Item</th>
                                <th>Barcode</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="stockInTable">
                            ${stockIn.map(item => `
                                <tr>
                                    <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                                    <td>${item.vendorName || 'N/A'}</td>
                                    <td>${item.itemName}</td>
                                    <td><span class="badge badge-info">${item.barcode}</span></td>
                                    <td>${item.quantity}</td>
                                    <td>${Utils.formatCurrency(item.purchasePrice)}</td>
                                    <td>${Utils.formatCurrency(item.quantity * item.purchasePrice)}</td>
                                    <td>
                                        <button class="btn btn-primary btn-xs" onclick="App._editStockIn('${item.id}')"><i class="fas fa-edit"></i></button>
                                        <button class="btn btn-danger btn-xs" onclick="App._deleteStockIn('${item.id}')"><i class="fas fa-trash"></i></button>
                                        <button class="btn btn-outline btn-xs" onclick="App._printPurchase('${item.id}')"><i class="fas fa-print"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${stockIn.length === 0 ? '<tr><td colspan="8" class="text-center text-muted">No stock entries</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Setup search and filter
        document.getElementById('stockInSearch')?.addEventListener('input', Utils.debounce(this._filterStockIn, 300));
        document.getElementById('stockInDateFilter')?.addEventListener('change', this._filterStockIn);
    },

    _filterStockIn() {
        const search = document.getElementById('stockInSearch')?.value || '';
        const date = document.getElementById('stockInDateFilter')?.value || '';
        let data = DB.readAll(DB.TABLES.STOCK_IN);

        if (search) {
            const term = search.toLowerCase();
            data = data.filter(item =>
                item.itemName?.toLowerCase().includes(term) ||
                item.vendorName?.toLowerCase().includes(term) ||
                item.barcode?.toLowerCase().includes(term)
            );
        }

        if (date) {
            data = data.filter(item => item.createdAt?.startsWith(date));
        }

        const tbody = document.getElementById('stockInTable');
        if (tbody) {
            tbody.innerHTML = data.map(item => `
                <tr>
                    <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                    <td>${item.vendorName || 'N/A'}</td>
                    <td>${item.itemName}</td>
                    <td><span class="badge badge-info">${item.barcode}</span></td>
                    <td>${item.quantity}</td>
                    <td>${Utils.formatCurrency(item.purchasePrice)}</td>
                    <td>${Utils.formatCurrency(item.quantity * item.purchasePrice)}</td>
                    <td>
                        <button class="btn btn-primary btn-xs" onclick="App._editStockIn('${item.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-xs" onclick="App._deleteStockIn('${item.id}')"><i class="fas fa-trash"></i></button>
                        <button class="btn btn-outline btn-xs" onclick="App._printPurchase('${item.id}')"><i class="fas fa-print"></i></button>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="8" class="text-center text-muted">No matching records</td></tr>';
        }
    },

    _clearStockInFilter() {
        document.getElementById('stockInSearch').value = '';
        document.getElementById('stockInDateFilter').value = '';
        this._filterStockIn();
    },

    _showStockInForm(data = null) {
        const isEdit = !!data;
        const vendors = DB.readAll(DB.TABLES.VENDORS);
        const vendorOptions = vendors.map(v => `<option value="${v.name}" ${data?.vendorName === v.name ? 'selected' : ''}>${v.name}</option>`).join('');

        const content = `
            <form id="stockInForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Date <span class="required">*</span></label>
                        <input type="date" id="siDate" class="form-control" value="${data?.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label>Vendor <span class="required">*</span></label>
                        <input type="text" id="siVendor" class="form-control" list="vendorList" placeholder="Vendor name" value="${data?.vendorName || ''}" required>
                        <datalist id="vendorList">${vendorOptions}</datalist>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Item Name <span class="required">*</span></label>
                        <input type="text" id="siItem" class="form-control" placeholder="Item name" value="${data?.itemName || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Barcode</label>
                        <div class="flex gap-8">
                            <input type="text" id="siBarcode" class="form-control" placeholder="Barcode" value="${data?.barcode || Utils.generateBarcode()}">
                            <button type="button" class="btn btn-outline" onclick="document.getElementById('siBarcode').value = Utils.generateBarcode()"><i class="fas fa-sync"></i></button>
                        </div>
                    </div>
                </div>
                <div class="form-row-3">
                    <div class="form-group">
                        <label>Quantity <span class="required">*</span></label>
                        <input type="number" id="siQty" class="form-control" placeholder="0" value="${data?.quantity || 1}" required min="1">
                    </div>
                    <div class="form-group">
                        <label>Purchase Price <span class="required">*</span></label>
                        <input type="number" id="siPrice" class="form-control" placeholder="0" value="${data?.purchasePrice || 0}" required min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Unit</label>
                        <select id="siUnit" class="form-control">
                            <option value="pcs" ${data?.unit === 'pcs' ? 'selected' : ''}>Pieces</option>
                            <option value="kg" ${data?.unit === 'kg' ? 'selected' : ''}>Kilogram</option>
                            <option value="g" ${data?.unit === 'g' ? 'selected' : ''}>Gram</option>
                            <option value="ltr" ${data?.unit === 'ltr' ? 'selected' : ''}>Liter</option>
                            <option value="m" ${data?.unit === 'm' ? 'selected' : ''}>Meter</option>
                            <option value="ft" ${data?.unit === 'ft' ? 'selected' : ''}>Feet</option>
                            <option value="box" ${data?.unit === 'box' ? 'selected' : ''}>Box</option>
                            <option value="pack" ${data?.unit === 'pack' ? 'selected' : ''}>Pack</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="siNotes" class="form-control" placeholder="Additional notes">${data?.notes || ''}</textarea>
                </div>
                <div class="flex gap-8" style="margin-top:12px;">
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Save'}</button>
                    <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
                </div>
            </form>
        `;

        const modal = Utils.showModal(content, isEdit ? 'Edit Stock Entry' : 'New Purchase Entry', 'large');

        document.getElementById('stockInForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                date: document.getElementById('siDate').value,
                vendorName: document.getElementById('siVendor').value.trim(),
                itemName: document.getElementById('siItem').value.trim(),
                barcode: document.getElementById('siBarcode').value.trim(),
                quantity: parseFloat(document.getElementById('siQty').value) || 0,
                purchasePrice: parseFloat(document.getElementById('siPrice').value) || 0,
                unit: document.getElementById('siUnit').value,
                notes: document.getElementById('siNotes').value.trim()
            };

            if (!formData.vendorName || !formData.itemName || !formData.quantity || !formData.purchasePrice) {
                Utils.toast('Please fill all required fields', 'error');
                return;
            }

            if (isEdit) {
                DB.update(DB.TABLES.STOCK_IN, data.id, formData);
                Utils.toast('Stock entry updated!', 'success');
            } else {
                DB.create(DB.TABLES.STOCK_IN, formData);
                Utils.toast('Stock entry saved!', 'success');
            }

            modal?.remove();
            this._renderStockIn();
        });
    },

    _editStockIn(id) {
        const data = DB.read(DB.TABLES.STOCK_IN, id);
        if (data) this._showStockInForm(data);
    },

    async _deleteStockIn(id) {
        const confirmed = await Utils.confirm('Are you sure you want to delete this entry?', 'Delete Entry');
        if (confirmed) {
            DB.delete(DB.TABLES.STOCK_IN, id);
            Utils.toast('Entry deleted!', 'success');
            this._renderStockIn();
        }
    },

    _printPurchase(id) {
        const data = DB.read(DB.TABLES.STOCK_IN, id);
        if (!data) return;

        const settings = Utils.getSettings();
        const printWindow = window.open('', '_blank', 'width=600,height=600');
        printWindow.document.write(`
            <html>
            <head><title>Purchase Entry</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                .header h1 { margin: 0; color: #4F46E5; }
                .details { margin-bottom: 20px; }
                .details table { width: 100%; }
                .details td { padding: 6px 0; }
                .footer { text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; color: #666; }
                .total { font-size: 1.2em; font-weight: bold; }
            </style>
            </head>
            <body>
                <div class="header">
                    <h1>${settings.companyName}</h1>
                    <p>${settings.address} | ${settings.phone}</p>
                    <p><strong>Purchase Entry</strong></p>
                </div>
                <div class="details">
                    <table>
                        <tr><td><strong>Date:</strong></td><td>${Utils.formatDate(data.createdAt)}</td></tr>
                        <tr><td><strong>Vendor:</strong></td><td>${data.vendorName}</td></tr>
                        <tr><td><strong>Item:</strong></td><td>${data.itemName}</td></tr>
                        <tr><td><strong>Barcode:</strong></td><td>${data.barcode}</td></tr>
                        <tr><td><strong>Quantity:</strong></td><td>${data.quantity} ${data.unit}</td></tr>
                        <tr><td><strong>Price:</strong></td><td>${Utils.formatCurrency(data.purchasePrice)}</td></tr>
                        <tr><td><strong>Total:</strong></td><td class="total">${Utils.formatCurrency(data.quantity * data.purchasePrice)}</td></tr>
                        ${data.notes ? `<tr><td><strong>Notes:</strong></td><td>${data.notes}</td></tr>` : ''}
                    </table>
                </div>
                <div class="footer">
                    <p>${settings.footerNote || 'Thank you for your business!'}</p>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    },

    _exportStockIn() {
        const data = DB.readAll(DB.TABLES.STOCK_IN);
        const headers = ['Date', 'Vendor', 'Item', 'Barcode', 'Quantity', 'Unit', 'Price', 'Total', 'Notes'];
        const csv = Utils.arrayToCSV(data.map(item => ({
            Date: Utils.formatDate(item.createdAt, 'date'),
            Vendor: item.vendorName || '',
            Item: item.itemName,
            Barcode: item.barcode,
            Quantity: item.quantity,
            Unit: item.unit || 'pcs',
            Price: item.purchasePrice,
            Total: item.quantity * item.purchasePrice,
            Notes: item.notes || ''
        })), headers);
        Utils.downloadFile(csv, 'stock_in_export.csv', 'text/csv');
        Utils.toast('Stock IN exported!', 'success');
    },

    // ============================================================
    // STOCK OUT
    // ============================================================

    _renderStockOut() {
        const content = document.getElementById('pageContent');
        const stockOut = DB.readAll(DB.TABLES.STOCK_OUT);

        content.innerHTML = `
            <div class="flex-between mb-16">
                <h2>Stock OUT</h2>
                <button class="btn btn-primary" onclick="App._showStockOutForm()">
                    <i class="fas fa-plus"></i> New Sale
                </button>
            </div>

            <div class="card mb-16">
                <div class="flex flex-wrap gap-8">
                    <input type="text" id="stockOutSearch" class="form-control" style="flex:1;min-width:200px;" placeholder="Search by item, customer, invoice...">
                    <input type="date" id="stockOutDateFilter" class="form-control" style="width:160px;">
                    <button class="btn btn-outline" onclick="App._filterStockOut()"><i class="fas fa-filter"></i> Filter</button>
                    <button class="btn btn-outline" onclick="App._clearStockOutFilter()"><i class="fas fa-undo"></i> Clear</button>
                    <button class="btn btn-success btn-sm" onclick="App._exportStockOut()"><i class="fas fa-file-excel"></i> Export</button>
                </div>
            </div>

            <div class="card">
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th>Profit</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="stockOutTable">
                            ${stockOut.map(item => `
                                <tr>
                                    <td><span class="badge badge-info">${item.invoiceNumber || 'N/A'}</span></td>
                                    <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                                    <td>${item.customerName || 'N/A'}</td>
                                    <td>${item.itemName}</td>
                                    <td>${item.quantity}</td>
                                    <td>${Utils.formatCurrency(item.salePrice)}</td>
                                    <td>${Utils.formatCurrency(item.quantity * item.salePrice)}</td>
                                    <td class="${(item.profit || 0) > 0 ? 'text-success' : 'text-danger'}">${Utils.formatCurrency(item.profit || 0)}</td>
                                    <td>
                                        <button class="btn btn-primary btn-xs" onclick="App._editStockOut('${item.id}')"><i class="fas fa-edit"></i></button>
                                        <button class="btn btn-danger btn-xs" onclick="App._deleteStockOut('${item.id}')"><i class="fas fa-trash"></i></button>
                                        <button class="btn btn-outline btn-xs" onclick="App._printInvoice('${item.id}')"><i class="fas fa-print"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${stockOut.length === 0 ? '<tr><td colspan="9" class="text-center text-muted">No sales entries</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('stockOutSearch')?.addEventListener('input', Utils.debounce(this._filterStockOut, 300));
        document.getElementById('stockOutDateFilter')?.addEventListener('change', this._filterStockOut);
    },

    _filterStockOut() {
        const search = document.getElementById('stockOutSearch')?.value || '';
        const date = document.getElementById('stockOutDateFilter')?.value || '';
        let data = DB.readAll(DB.TABLES.STOCK_OUT);

        if (search) {
            const term = search.toLowerCase();
            data = data.filter(item =>
                item.itemName?.toLowerCase().includes(term) ||
                item.customerName?.toLowerCase().includes(term) ||
                item.invoiceNumber?.toLowerCase().includes(term) ||
                item.barcode?.toLowerCase().includes(term)
            );
        }

        if (date) {
            data = data.filter(item => item.createdAt?.startsWith(date));
        }

        const tbody = document.getElementById('stockOutTable');
        if (tbody) {
            tbody.innerHTML = data.map(item => `
                <tr>
                    <td><span class="badge badge-info">${item.invoiceNumber || 'N/A'}</span></td>
                    <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                    <td>${item.customerName || 'N/A'}</td>
                    <td>${item.itemName}</td>
                    <td>${item.quantity}</td>
                    <td>${Utils.formatCurrency(item.salePrice)}</td>
                    <td>${Utils.formatCurrency(item.quantity * item.salePrice)}</td>
                    <td class="${(item.profit || 0) > 0 ? 'text-success' : 'text-danger'}">${Utils.formatCurrency(item.profit || 0)}</td>
                    <td>
                        <button class="btn btn-primary btn-xs" onclick="App._editStockOut('${item.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-xs" onclick="App._deleteStockOut('${item.id}')"><i class="fas fa-trash"></i></button>
                        <button class="btn btn-outline btn-xs" onclick="App._printInvoice('${item.id}')"><i class="fas fa-print"></i></button>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="9" class="text-center text-muted">No matching records</td></tr>';
        }
    },

    _clearStockOutFilter() {
        document.getElementById('stockOutSearch').value = '';
        document.getElementById('stockOutDateFilter').value = '';
        this._filterStockOut();
    },

    _showStockOutForm(data = null) {
        const isEdit = !!data;
        const customers = DB.readAll(DB.TABLES.CUSTOMERS);
        const customerOptions = customers.map(c => `<option value="${c.name}" ${data?.customerName === c.name ? 'selected' : ''}>${c.name}</option>`).join('');
        const settings = Utils.getSettings();

        const content = `
            <form id="stockOutForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Date <span class="required">*</span></label>
                        <input type="date" id="soDate" class="form-control" value="${data?.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label>Invoice Number</label>
                        <input type="text" id="soInvoice" class="form-control" placeholder="Auto-generated" value="${data?.invoiceNumber || settings.invoicePrefix + Date.now().toString().slice(-6)}" readonly>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Customer <span class="required">*</span></label>
                        <input type="text" id="soCustomer" class="form-control" list="customerList" placeholder="Customer name" value="${data?.customerName || ''}" required>
                        <datalist id="customerList">${customerOptions}</datalist>
                    </div>
                    <div class="form-group">
                        <label>Barcode</label>
                        <input type="text" id="soBarcode" class="form-control" placeholder="Scan or enter barcode" value="${data?.barcode || ''}">
                    </div>
                </div>
                <div class="form-row-3">
                    <div class="form-group">
                        <label>Item Name <span class="required">*</span></label>
                        <input type="text" id="soItem" class="form-control" placeholder="Item name" value="${data?.itemName || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Quantity <span class="required">*</span></label>
                        <input type="number" id="soQty" class="form-control" placeholder="0" value="${data?.quantity || 1}" required min="1">
                    </div>
                    <div class="form-group">
                        <label>Sale Price <span class="required">*</span></label>
                        <input type="number" id="soPrice" class="form-control" placeholder="0" value="${data?.salePrice || 0}" required min="0" step="0.01">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Discount (%)</label>
                        <input type="number" id="soDiscount" class="form-control" placeholder="0" value="${data?.discount || 0}" min="0" max="100">
                    </div>
                    <div class="form-group">
                        <label>Tax (%)</label>
                        <input type="number" id="soTax" class="form-control" placeholder="${settings.taxRate || 0}" value="${data?.tax || settings.taxRate || 0}" min="0" max="100">
                    </div>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="soNotes" class="form-control" placeholder="Additional notes">${data?.notes || ''}</textarea>
                </div>
                <div class="flex gap-8" style="margin-top:12px;">
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Save'}</button>
                    <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
                </div>
            </form>
        `;

        const modal = Utils.showModal(content, isEdit ? 'Edit Sale Entry' : 'New Sale Entry', 'large');

        document.getElementById('stockOutForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const qty = parseFloat(document.getElementById('soQty').value) || 0;
            const price = parseFloat(document.getElementById('soPrice').value) || 0;
            const discount = parseFloat(document.getElementById('soDiscount').value) || 0;
            const tax = parseFloat(document.getElementById('soTax').value) || 0;

            const subtotal = qty * price;
            const discountAmount = (subtotal * discount) / 100;
            const taxAmount = ((subtotal - discountAmount) * tax) / 100;
            const total = subtotal - discountAmount + taxAmount;

            // Calculate profit (need to find purchase price from stock in)
            const stockIn = DB.readAll(DB.TABLES.STOCK_IN);
            const purchaseItem = stockIn.find(s => s.itemName === document.getElementById('soItem').value.trim());
            const purchasePrice = purchaseItem?.purchasePrice || 0;
            const profit = (price - purchasePrice) * qty;

            const formData = {
                date: document.getElementById('soDate').value,
                invoiceNumber: document.getElementById('soInvoice').value,
                customerName: document.getElementById('soCustomer').value.trim(),
                barcode: document.getElementById('soBarcode').value.trim(),
                itemName: document.getElementById('soItem').value.trim(),
                quantity: qty,
                salePrice: price,
                discount: discount,
                tax: tax,
                total: total,
                profit: profit,
                notes: document.getElementById('soNotes').value.trim()
            };

            if (!formData.customerName || !formData.itemName || !qty || !price) {
                Utils.toast('Please fill all required fields', 'error');
                return;
            }

            // Check stock availability
            const balance = DB.getStockBalance();
            const stockItem = balance.find(b => b.itemName === formData.itemName);
            if (stockItem && stockItem.available < qty) {
                Utils.toast(`Insufficient stock! Available: ${stockItem.available} ${stockItem.unit}`, 'error');
                return;
            }

            if (isEdit) {
                DB.update(DB.TABLES.STOCK_OUT, data.id, formData);
                Utils.toast('Sale entry updated!', 'success');
            } else {
                DB.create(DB.TABLES.STOCK_OUT, formData);
                Utils.toast('Sale entry saved!', 'success');
            }

            modal?.remove();
            this._renderStockOut();
        });

        // Barcode lookup
        document.getElementById('soBarcode')?.addEventListener('change', (e) => {
            const barcode = e.target.value.trim();
            if (barcode) {
                const stockIn = DB.readAll(DB.TABLES.STOCK_IN);
                const item = stockIn.find(s => s.barcode === barcode);
                if (item) {
                    document.getElementById('soItem').value = item.itemName;
                    document.getElementById('soPrice').value = item.purchasePrice * 1.2; // 20% markup
                }
            }
        });
    },

    _editStockOut(id) {
        const data = DB.read(DB.TABLES.STOCK_OUT, id);
        if (data) this._showStockOutForm(data);
    },

    async _deleteStockOut(id) {
        const confirmed = await Utils.confirm('Are you sure you want to delete this sale?', 'Delete Sale');
        if (confirmed) {
            DB.delete(DB.TABLES.STOCK_OUT, id);
            Utils.toast('Sale deleted!', 'success');
            this._renderStockOut();
        }
    },

    _printInvoice(id) {
        const data = DB.read(DB.TABLES.STOCK_OUT, id);
        if (!data) return;

        const settings = Utils.getSettings();
        const total = data.quantity * data.salePrice;
        const discountAmount = (total * (data.discount || 0)) / 100;
        const taxAmount = ((total - discountAmount) * (data.tax || 0)) / 100;

        const printWindow = window.open('', '_blank', 'width=600,height=600');
        printWindow.document.write(`
            <html>
            <head><title>Invoice ${data.invoiceNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                .header h1 { margin: 0; color: #4F46E5; }
                .details { margin-bottom: 20px; }
                .details table { width: 100%; }
                .details td { padding: 6px 0; }
                .footer { text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; color: #666; }
                .total { font-size: 1.2em; font-weight: bold; }
                .amounts { margin-top: 20px; }
                .amounts table { width: 100%; }
                .amounts td { padding: 4px 0; }
            </style>
            </head>
            <body>
                <div class="header">
                    <h1>${settings.companyName}</h1>
                    <p>${settings.address} | ${settings.phone}</p>
                    <p><strong>INVOICE</strong></p>
                </div>
                <div class="details">
                    <table>
                        <tr><td><strong>Invoice #:</strong></td><td>${data.invoiceNumber}</td></tr>
                        <tr><td><strong>Date:</strong></td><td>${Utils.formatDate(data.createdAt)}</td></tr>
                        <tr><td><strong>Customer:</strong></td><td>${data.customerName}</td></tr>
                        <tr><td><strong>Item:</strong></td><td>${data.itemName}</td></tr>
                        <tr><td><strong>Barcode:</strong></td><td>${data.barcode || 'N/A'}</td></tr>
                        <tr><td><strong>Quantity:</strong></td><td>${data.quantity}</td></tr>
                        <tr><td><strong>Price:</strong></td><td>${Utils.formatCurrency(data.salePrice)}</td></tr>
                    </table>
                </div>
                <div class="amounts">
                    <table>
                        <tr><td>Subtotal:</td><td>${Utils.formatCurrency(total)}</td></tr>
                        ${data.discount ? `<tr><td>Discount (${data.discount}%):</td><td>-${Utils.formatCurrency(discountAmount)}</td></tr>` : ''}
                        ${data.tax ? `<tr><td>Tax (${data.tax}%):</td><td>${Utils.formatCurrency(taxAmount)}</td></tr>` : ''}
                        <tr><td><strong>Total:</strong></td><td><strong>${Utils.formatCurrency(total - discountAmount + taxAmount)}</strong></td></tr>
                    </table>
                </div>
                ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ''}
                <div class="footer">
                    <p>${settings.footerNote || 'Thank you for your business!'}</p>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    },

    _exportStockOut() {
        const data = DB.readAll(DB.TABLES.STOCK_OUT);
        const headers = ['Invoice', 'Date', 'Customer', 'Item', 'Barcode', 'Quantity', 'Price', 'Discount', 'Tax', 'Total', 'Profit', 'Notes'];
        const csv = Utils.arrayToCSV(data.map(item => ({
            Invoice: item.invoiceNumber || '',
            Date: Utils.formatDate(item.createdAt, 'date'),
            Customer: item.customerName || '',
            Item: item.itemName,
            Barcode: item.barcode || '',
            Quantity: item.quantity,
            Price: item.salePrice,
            Discount: item.discount || 0,
            Tax: item.tax || 0,
            Total: item.total || 0,
            Profit: item.profit || 0,
            Notes: item.notes || ''
        })), headers);
        Utils.downloadFile(csv, 'stock_out_export.csv', 'text/csv');
        Utils.toast('Stock OUT exported!', 'success');
    },

    // ============================================================
    // STOCK BALANCE
    // ============================================================

    _renderStockBalance() {
        const content = document.getElementById('pageContent');
        const balance = DB.getStockBalance();

        content.innerHTML = `
            <div class="flex-between mb-16">
                <h2>Current Stock Balance</h2>
                <div class="flex gap-8">
                    <button class="btn btn-success btn-sm" onclick="App._exportStockBalance()"><i class="fas fa-file-excel"></i> Export</button>
                    <button class="btn btn-primary btn-sm" onclick="App._printStockBalance()"><i class="fas fa-print"></i> Print</button>
                </div>
            </div>

            <div class="card mb-16">
                <div class="flex flex-wrap gap-8">
                    <input type="text" id="balanceSearch" class="form-control" style="flex:1;min-width:200px;" placeholder="Search by item or barcode...">
                    <select id="balanceFilter" class="form-control" style="width:160px;">
                        <option value="all">All Items</option>
                        <option value="in-stock">In Stock</option>
                        <option value="low-stock">Low Stock</option>
                        <option value="out-of-stock">Out of Stock</option>
                    </select>
                    <button class="btn btn-outline" onclick="App._filterBalance()"><i class="fas fa-filter"></i> Filter</button>
                </div>
            </div>

            <div class="card">
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Barcode</th>
                                <th>Item</th>
                                <th>Total In</th>
                                <th>Total Out</th>
                                <th>Available</th>
                                <th>Unit</th>
                                <th>Purchase Price</th>
                                <th>Selling Price</th>
                                <th>Stock Value</th>
                                <th>Profit</th>
                            </tr>
                        </thead>
                        <tbody id="balanceTable">
                            ${balance.map(item => `
                                <tr>
                                    <td><span class="badge badge-info">${item.barcode}</span></td>
                                    <td>${item.itemName}</td>
                                    <td>${item.totalIn}</td>
                                    <td>${item.totalOut}</td>
                                    <td class="${item.available <= 5 ? 'text-danger' : item.available <= 10 ? 'text-warning' : 'text-success'}">${item.available}</td>
                                    <td>${item.unit}</td>
                                    <td>${Utils.formatCurrency(item.purchasePrice)}</td>
                                    <td>${Utils.formatCurrency(item.sellingPrice)}</td>
                                    <td>${Utils.formatCurrency(item.stockValue)}</td>
                                    <td class="${item.profit > 0 ? 'text-success' : 'text-danger'}">${Utils.formatCurrency(item.profit)}</td>
                                </tr>
                            `).join('')}
                            ${balance.length === 0 ? '<tr><td colspan="10" class="text-center text-muted">No items in stock</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('balanceSearch')?.addEventListener('input', Utils.debounce(this._filterBalance, 300));
        document.getElementById('balanceFilter')?.addEventListener('change', this._filterBalance);
    },

    _filterBalance() {
        const search = document.getElementById('balanceSearch')?.value || '';
        const filter = document.getElementById('balanceFilter')?.value || 'all';
        let data = DB.getStockBalance();

        if (search) {
            const term = search.toLowerCase();
            data = data.filter(item =>
                item.itemName?.toLowerCase().includes(term) ||
                item.barcode?.toLowerCase().includes(term)
            );
        }

        if (filter === 'in-stock') {
            data = data.filter(item => item.available > 0);
        } else if (filter === 'low-stock') {
            data = data.filter(item => item.available > 0 && item.available <= 5);
        } else if (filter === 'out-of-stock') {
            data = data.filter(item => item.available <= 0);
        }

        const tbody = document.getElementById('balanceTable');
        if (tbody) {
            tbody.innerHTML = data.map(item => `
                <tr>
                    <td><span class="badge badge-info">${item.barcode}</span></td>
                    <td>${item.itemName}</td>
                    <td>${item.totalIn}</td>
                    <td>${item.totalOut}</td>
                    <td class="${item.available <= 5 ? 'text-danger' : item.available <= 10 ? 'text-warning' : 'text-success'}">${item.available}</td>
                    <td>${item.unit}</td>
                    <td>${Utils.formatCurrency(item.purchasePrice)}</td>
                    <td>${Utils.formatCurrency(item.sellingPrice)}</td>
                    <td>${Utils.formatCurrency(item.stockValue)}</td>
                    <td class="${item.profit > 0 ? 'text-success' : 'text-danger'}">${Utils.formatCurrency(item.profit)}</td>
                </tr>
            `).join('') || '<tr><td colspan="10" class="text-center text-muted">No matching items</td></tr>';
        }
    },

    _exportStockBalance() {
        const data = DB.getStockBalance();
        const headers = ['Barcode', 'Item', 'Total In', 'Total Out', 'Available', 'Unit', 'Purchase Price', 'Selling Price', 'Stock Value', 'Profit'];
        const csv = Utils.arrayToCSV(data.map(item => ({
            Barcode: item.barcode,
            Item: item.itemName,
            'Total In': item.totalIn,
            'Total Out': item.totalOut,
            Available: item.available,
            Unit: item.unit,
            'Purchase Price': item.purchasePrice,
            'Selling Price': item.sellingPrice,
            'Stock Value': item.stockValue,
            Profit: item.profit
        })), headers);
        Utils.downloadFile(csv, 'stock_balance_export.csv', 'text/csv');
        Utils.toast('Stock balance exported!', 'success');
    },

    _printStockBalance() {
        const data = DB.getStockBalance();
        const settings = Utils.getSettings();

        const printWindow = window.open('', '_blank', 'width=900,height=600');
        printWindow.document.write(`
            <html>
            <head><title>Stock Balance Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                .header h1 { margin: 0; color: #4F46E5; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th { background: #f0f0f0; padding: 8px; text-align: left; border: 1px solid #ddd; }
                td { padding: 6px 8px; border: 1px solid #ddd; }
                .footer { text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; color: #666; }
                .text-danger { color: #EF4444; }
                .text-success { color: #22C55E; }
            </style>
            </head>
            <body>
                <div class="header">
                    <h1>${settings.companyName}</h1>
                    <p>${settings.address} | ${settings.phone}</p>
                    <p><strong>Stock Balance Report</strong></p>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Barcode</th>
                            <th>Item</th>
                            <th>Total In</th>
                            <th>Total Out</th>
                            <th>Available</th>
                            <th>Unit</th>
                            <th>Purchase Price</th>
                            <th>Selling Price</th>
                            <th>Stock Value</th>
                            <th>Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => `
                            <tr>
                                <td>${item.barcode}</td>
                                <td>${item.itemName}</td>
                                <td>${item.totalIn}</td>
                                <td>${item.totalOut}</td>
                                <td class="${item.available <= 5 ? 'text-danger' : ''}">${item.available}</td>
                                <td>${item.unit}</td>
                                <td>${item.purchasePrice}</td>
                                <td>${item.sellingPrice}</td>
                                <td>${item.stockValue}</td>
                                <td class="${item.profit > 0 ? 'text-success' : 'text-danger'}">${item.profit}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="footer">
                    <p>${settings.footerNote || 'Thank you for your business!'}</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    },

    // ============================================================
    // DAILY REPORT
    // ============================================================

    _renderDailyReport() {
        const content = document.getElementById('pageContent');
        const today = new Date().toISOString().split('T')[0];

        content.innerHTML = `
            <div class="flex-between mb-16">
                <h2>Daily Report</h2>
                <div class="flex gap-8">
                    <button class="btn btn-success btn-sm" onclick="App._exportDailyReport()"><i class="fas fa-file-excel"></i> Export</button>
                    <button class="btn btn-primary btn-sm" onclick="App._printDailyReport()"><i class="fas fa-print"></i> Print</button>
                </div>
            </div>

            <div class="card mb-16">
                <div class="flex flex-wrap gap-8">
                    <select id="reportRange" class="form-control" style="width:150px;">
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="custom">Custom</option>
                    </select>
                    <input type="date" id="reportStart" class="form-control" style="width:150px;" value="${today}">
                    <input type="date" id="reportEnd" class="form-control" style="width:150px;" value="${today}">
                    <button class="btn btn-primary" onclick="App._generateReport()"><i class="fas fa-chart-bar"></i> Generate</button>
                </div>
            </div>

            <div id="reportResults">
                ${this._generateReportData(today, today)}
            </div>
        `;

        document.getElementById('reportRange')?.addEventListener('change', (e) => {
            const val = e.target.value;
            const today = new Date();
            let start = today.toISOString().split('T')[0];
            let end = today.toISOString().split('T')[0];

            if (val === 'yesterday') {
                const d = new Date(today);
                d.setDate(d.getDate() - 1);
                start = d.toISOString().split('T')[0];
                end = start;
            } else if (val === 'week') {
                const d = new Date(today);
                d.setDate(d.getDate() - 7);
                start = d.toISOString().split('T')[0];
            } else if (val === 'month') {
                const d = new Date(today);
                d.setDate(1);
                start = d.toISOString().split('T')[0];
            } else if (val === 'custom') {
                // Don't auto-set custom dates
            }

            document.getElementById('reportStart').value = start;
            document.getElementById('reportEnd').value = end;
            if (val !== 'custom') {
                this._generateReport();
            }
        });

        // Auto generate on load
        setTimeout(() => this._generateReport(), 100);
    },

    _generateReport() {
        const start = document.getElementById('reportStart')?.value || '';
        const end = document.getElementById('reportEnd')?.value || '';
        if (start && end) {
            const results = document.getElementById('reportResults');
            if (results) {
                results.innerHTML = this._generateReportData(start, end);
            }
        }
    },

    _generateReportData(startDate, endDate) {
        const stockIn = DB.readAll(DB.TABLES.STOCK_IN);
        const stockOut = DB.readAll(DB.TABLES.STOCK_OUT);

        const inData = stockIn.filter(item => {
            const date = item.createdAt?.split('T')[0] || '';
            return date >= startDate && date <= endDate;
        });

        const outData = stockOut.filter(item => {
            const date = item.createdAt?.split('T')[0] || '';
            return date >= startDate && date <= endDate;
        });

        const totalPurchases = inData.reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0);
        const totalSales = outData.reduce((sum, item) => sum + (item.quantity * item.salePrice), 0);
        const totalProfit = outData.reduce((sum, item) => sum + (item.profit || 0), 0);

        return `
            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Purchases</div>
                    <div class="stat-value">${Utils.formatCurrency(totalPurchases)}</div>
                    <div class="stat-label" style="font-size:0.8rem;">${inData.length} entries</div>
                </div>
                <div class="stat-card color-success">
                    <div class="stat-label">Total Sales</div>
                    <div class="stat-value">${Utils.formatCurrency(totalSales)}</div>
                    <div class="stat-label" style="font-size:0.8rem;">${outData.length} entries</div>
                </div>
                <div class="stat-card color-info">
                    <div class="stat-label">Total Profit</div>
                    <div class="stat-value ${totalProfit > 0 ? 'text-success' : 'text-danger'}">${Utils.formatCurrency(totalProfit)}</div>
                </div>
                <div class="stat-card color-warning">
                    <div class="stat-label">Net Balance</div>
                    <div class="stat-value ${(totalSales - totalPurchases) > 0 ? 'text-success' : 'text-danger'}">${Utils.formatCurrency(totalSales - totalPurchases)}</div>
                </div>
            </div>

            <div class="card mt-16">
                <h3><i class="fas fa-shopping-cart"></i> Purchases</h3>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Vendor</th><th>Item</th><th>Qty</th><th>Total</th></tr>
                        </thead>
                        <tbody>
                            ${inData.slice(0, 20).map(item => `
                                <tr>
                                    <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                                    <td>${item.vendorName}</td>
                                    <td>${item.itemName}</td>
                                    <td>${item.quantity}</td>
                                    <td>${Utils.formatCurrency(item.quantity * item.purchasePrice)}</td>
                                </tr>
                            `).join('')}
                            ${inData.length === 0 ? '<tr><td colspan="5" class="text-center text-muted">No purchases</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card mt-16">
                <h3><i class="fas fa-chart-line"></i> Sales</h3>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Customer</th><th>Item</th><th>Qty</th><th>Total</th><th>Profit</th></tr>
                        </thead>
                        <tbody>
                            ${outData.slice(0, 20).map(item => `
                                <tr>
                                    <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                                    <td>${item.customerName}</td>
                                    <td>${item.itemName}</td>
                                    <td>${item.quantity}</td>
                                    <td>${Utils.formatCurrency(item.quantity * item.salePrice)}</td>
                                    <td class="${(item.profit || 0) > 0 ? 'text-success' : 'text-danger'}">${Utils.formatCurrency(item.profit || 0)}</td>
                                </tr>
                            `).join('')}
                            ${outData.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">No sales</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    _exportDailyReport() {
        const start = document.getElementById('reportStart')?.value || '';
        const end = document.getElementById('reportEnd')?.value || '';
        if (!start || !end) return;

        const stockIn = DB.readAll(DB.TABLES.STOCK_IN);
        const stockOut = DB.readAll(DB.TABLES.STOCK_OUT);

        const inData = stockIn.filter(item => {
            const date = item.createdAt?.split('T')[0] || '';
            return date >= start && date <= end;
        });

        const outData = stockOut.filter(item => {
            const date = item.createdAt?.split('T')[0] || '';
            return date >= start && date <= end;
        });

        const allData = [
            ...inData.map(item => ({
                Type: 'Purchase',
                Date: Utils.formatDate(item.createdAt, 'date'),
                Party: item.vendorName,
                Item: item.itemName,
                Quantity: item.quantity,
                Unit: item.unit,
                Price: item.purchasePrice,
                Total: item.quantity * item.purchasePrice
            })),
            ...outData.map(item => ({
                Type: 'Sale',
                Date: Utils.formatDate(item.createdAt, 'date'),
                Party: item.customerName,
                Item: item.itemName,
                Quantity: item.quantity,
                Unit: 'pcs',
                Price: item.salePrice,
                Total: item.quantity * item.salePrice
            }))
        ];

        const headers = ['Type', 'Date', 'Party', 'Item', 'Quantity', 'Unit', 'Price', 'Total'];
        const csv = Utils.arrayToCSV(allData, headers);
        Utils.downloadFile(csv, `daily_report_${start}_to_${end}.csv`, 'text/csv');
        Utils.toast('Report exported!', 'success');
    },

    _printDailyReport() {
        const content = document.getElementById('reportResults');
        if (!content) return;

        const settings = Utils.getSettings();
        const printWindow = window.open('', '_blank', 'width=900,height=600');
        printWindow.document.write(`
            <html>
            <head><title>Daily Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                .header h1 { margin: 0; color: #4F46E5; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th { background: #f0f0f0; padding: 8px; text-align: left; border: 1px solid #ddd; }
                td { padding: 6px 8px; border: 1px solid #ddd; }
                .footer { text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; color: #666; }
            </style>
            </head>
            <body>
                <div class="header">
                    <h1>${settings.companyName}</h1>
                    <p>${settings.address} | ${settings.phone}</p>
                    <p><strong>Daily Report</strong></p>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                </div>
                ${content.innerHTML}
                <div class="footer">
                    <p>${settings.footerNote || 'Thank you for your business!'}</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    },

    // ============================================================
    // LEDGER
    // ============================================================

    _renderLedger() {
        const content = document.getElementById('pageContent');
        const ledger = DB.readAll(DB.TABLES.LEDGER);
        const parties = Utils.unique([
            ...DB.readAll(DB.TABLES.VENDORS).map(v => v.name),
            ...DB.readAll(DB.TABLES.CUSTOMERS).map(c => c.name)
        ]);

        content.innerHTML = `
            <div class="flex-between mb-16">
                <h2>Ledger</h2>
                <button class="btn btn-primary" onclick="App._showLedgerEntry()">
                    <i class="fas fa-plus"></i> New Entry
                </button>
            </div>

            <div class="card mb-16">
                <div class="flex flex-wrap gap-8">
                    <select id="ledgerParty" class="form-control" style="flex:1;min-width:150px;">
                        <option value="all">All Parties</option>
                        ${parties.map(p => `<option value="${p}">${p}</option>`).join('')}
                    </select>
                    <select id="ledgerType" class="form-control" style="width:130px;">
                        <option value="all">All Types</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>
                    <input type="date" id="ledgerStart" class="form-control" style="width:150px;">
                    <input type="date" id="ledgerEnd" class="form-control" style="width:150px;">
                    <button class="btn btn-primary" onclick="App._filterLedger()"><i class="fas fa-filter"></i> Filter</button>
                    <button class="btn btn-success btn-sm" onclick="App._exportLedger()"><i class="fas fa-file-excel"></i> Export</button>
                </div>
            </div>

            <div class="card">
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Party</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Credit</th>
                                <th>Debit</th>
                                <th>Balance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="ledgerTable">
                            ${ledger.map(item => `
                                <tr>
                                    <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                                    <td>${item.partyName}</td>
                                    <td><span class="badge ${item.type === 'credit' ? 'badge-success' : 'badge-danger'}">${item.type}</span></td>
                                    <td>${item.description || 'N/A'}</td>
                                    <td class="text-success">${item.type === 'credit' ? Utils.formatCurrency(item.amount) : '-'}</td>
                                    <td class="text-danger">${item.type === 'debit' ? Utils.formatCurrency(item.amount) : '-'}</td>
                                    <td>${Utils.formatCurrency(item.balance || 0)}</td>
                                    <td>
                                        <button class="btn btn-danger btn-xs" onclick="App._deleteLedger('${item.id}')"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${ledger.length === 0 ? '<tr><td colspan="8" class="text-center text-muted">No ledger entries</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // Set default dates
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        document.getElementById('ledgerStart').value = firstDay.toISOString().split('T')[0];
        document.getElementById('ledgerEnd').value = now.toISOString().split('T')[0];
    },

    _filterLedger() {
        const party = document.getElementById('ledgerParty')?.value || '';
        const type = document.getElementById('ledgerType')?.value || '';
        const start = document.getElementById('ledgerStart')?.value || '';
        const end = document.getElementById('ledgerEnd')?.value || '';

        let data = DB.readAll(DB.TABLES.LEDGER);

        if (party && party !== 'all') {
            data = data.filter(item => item.partyName === party);
        }
        if (type && type !== 'all') {
            data = data.filter(item => item.type === type);
        }
        if (start) {
            data = data.filter(item => (item.createdAt?.split('T')[0] || '') >= start);
        }
        if (end) {
            data = data.filter(item => (item.createdAt?.split('T')[0] || '') <= end);
        }

        // Calculate running balance
        let balance = 0;
        data = data.map(item => {
            if (item.type === 'credit') balance += item.amount;
            else balance -= item.amount;
            return { ...item, balance };
        });

        const tbody = document.getElementById('ledgerTable');
        if (tbody) {
            tbody.innerHTML = data.map(item => `
                <tr>
                    <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                    <td>${item.partyName}</td>
                    <td><span class="badge ${item.type === 'credit' ? 'badge-success' : 'badge-danger'}">${item.type}</span></td>
                    <td>${item.description || 'N/A'}</td>
                    <td class="text-success">${item.type === 'credit' ? Utils.formatCurrency(item.amount) : '-'}</td>
                    <td class="text-danger">${item.type === 'debit' ? Utils.formatCurrency(item.amount) : '-'}</td>
                    <td>${Utils.formatCurrency(item.balance)}</td>
                    <td>
                        <button class="btn btn-danger btn-xs" onclick="App._deleteLedger('${item.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="8" class="text-center text-muted">No matching entries</td></tr>';
        }
    },

    _showLedgerEntry(data = null) {
        const isEdit = !!data;
        const parties = Utils.unique([
            ...DB.readAll(DB.TABLES.VENDORS).map(v => v.name),
            ...DB.readAll(DB.TABLES.CUSTOMERS).map(c => c.name)
        ]);

        const content = `
            <form id="ledgerForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Party <span class="required">*</span></label>
                        <input type="text" id="ledgerPartyInput" class="form-control" list="partyList" placeholder="Party name" value="${data?.partyName || ''}" required>
                        <datalist id="partyList">${parties.map(p => `<option value="${p}">`).join('')}</datalist>
                    </div>
                    <div class="form-group">
                        <label>Type <span class="required">*</span></label>
                        <select id="ledgerTypeInput" class="form-control" required>
                            <option value="credit" ${data?.type === 'credit' ? 'selected' : ''}>Credit</option>
                            <option value="debit" ${data?.type === 'debit' ? 'selected' : ''}>Debit</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Amount <span class="required">*</span></label>
                        <input type="number" id="ledgerAmount" class="form-control" placeholder="0" value="${data?.amount || 0}" required min="0" step="0.01">
                    </div>
                    <div class="form-group">
                        <label>Date</label>
                        <input type="date" id="ledgerDate" class="form-control" value="${data?.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="ledgerDesc" class="form-control" placeholder="Description">${data?.description || ''}</textarea>
                </div>
                <div class="flex gap-8" style="margin-top:12px;">
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Save'}</button>
                    <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
                </div>
            </form>
        `;

        const modal = Utils.showModal(content, isEdit ? 'Edit Ledger Entry' : 'New Ledger Entry');

        document.getElementById('ledgerForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                partyName: document.getElementById('ledgerPartyInput').value.trim(),
                type: document.getElementById('ledgerTypeInput').value,
                amount: parseFloat(document.getElementById('ledgerAmount').value) || 0,
                date: document.getElementById('ledgerDate').value,
                description: document.getElementById('ledgerDesc').value.trim()
            };

            if (!formData.partyName || !formData.amount) {
                Utils.toast('Please fill all required fields', 'error');
                return;
            }

            // Calculate running balance
            const allEntries = DB.readAll(DB.TABLES.LEDGER);
            let balance = 0;
            allEntries.forEach(item => {
                if (item.type === 'credit') balance += item.amount;
                else balance -= item.amount;
            });

            if (isEdit) {
                DB.update(DB.TABLES.LEDGER, data.id, formData);
                Utils.toast('Ledger entry updated!', 'success');
            } else {
                formData.balance = formData.type === 'credit' ? balance + formData.amount : balance - formData.amount;
                DB.create(DB.TABLES.LEDGER, formData);
                Utils.toast('Ledger entry saved!', 'success');
            }

            modal?.remove();
            this._renderLedger();
        });
    },

    async _deleteLedger(id) {
        const confirmed = await Utils.confirm('Are you sure you want to delete this entry?', 'Delete Entry');
        if (confirmed) {
            DB.delete(DB.TABLES.LEDGER, id);
            Utils.toast('Entry deleted!', 'success');
            this._renderLedger();
        }
    },

    _exportLedger() {
        const data = DB.readAll(DB.TABLES.LEDGER);
        const headers = ['Date', 'Party', 'Type', 'Description', 'Amount', 'Balance'];
        const csv = Utils.arrayToCSV(data.map(item => ({
            Date: Utils.formatDate(item.createdAt, 'date'),
            Party: item.partyName,
            Type: item.type,
            Description: item.description || '',
            Amount: item.amount,
            Balance: item.balance || 0
        })), headers);
        Utils.downloadFile(csv, 'ledger_export.csv', 'text/csv');
        Utils.toast('Ledger exported!', 'success');
    },

    // ============================================================
    // REPORTS
    // ============================================================

    _renderReports() {
        const content = document.getElementById('pageContent');

        content.innerHTML = `
            <h2 class="mb-16">Reports</h2>

            <div class="dashboard-grid">
                <div class="stat-card" onclick="App._generateReportType('purchase')" style="cursor:pointer;">
                    <div class="stat-icon"><i class="fas fa-truck"></i></div>
                    <div class="stat-label">Purchase Report</div>
                </div>
                <div class="stat-card color-success" onclick="App._generateReportType('sales')" style="cursor:pointer;">
                    <div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>
                    <div class="stat-label">Sales Report</div>
                </div>
                <div class="stat-card color-info" onclick="App._generateReportType('profit')" style="cursor:pointer;">
                    <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                    <div class="stat-label">Profit Report</div>
                </div>
                <div class="stat-card color-warning" onclick="App._generateReportType('stock')" style="cursor:pointer;">
                    <div class="stat-icon"><i class="fas fa-boxes"></i></div>
                    <div class="stat-label">Stock Report</div>
                </div>
                <div class="stat-card color-secondary" onclick="App._generateReportType('customer')" style="cursor:pointer;">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-label">Customer Report</div>
                </div>
                <div class="stat-card" onclick="App._generateReportType('vendor')" style="cursor:pointer;">
                    <div class="stat-icon"><i class="fas fa-handshake"></i></div>
                    <div class="stat-label">Vendor Report</div>
                </div>
            </div>

            <div id="reportOutput" class="card mt-16">
                <p class="text-center text-muted" style="padding:40px;">Select a report type above to generate</p>
            </div>
        `;
    },

    _generateReportType(type) {
        const output = document.getElementById('reportOutput');
        if (!output) return;

        let data = [];
        let title = '';

        switch(type) {
            case 'purchase':
                data = DB.readAll(DB.TABLES.STOCK_IN);
                title = 'Purchase Report';
                break;
            case 'sales':
                data = DB.readAll(DB.TABLES.STOCK_OUT);
                title = 'Sales Report';
                break;
            case 'profit':
                data = DB.readAll(DB.TABLES.STOCK_OUT);
                title = 'Profit Report';
                break;
            case 'stock':
                data = DB.getStockBalance();
                title = 'Stock Report';
                break;
            case 'customer':
                data = DB.readAll(DB.TABLES.CUSTOMERS);
                title = 'Customer Report';
                break;
            case 'vendor':
                data = DB.readAll(DB.TABLES.VENDORS);
                title = 'Vendor Report';
                break;
        }

        const headers = data.length > 0 ? Object.keys(data[0]) : [];
        const displayHeaders = headers.filter(h => !['id', 'password', 'createdAt', 'updatedAt'].includes(h));

        output.innerHTML = `
            <div class="flex-between mb-16">
                <h3>${title}</h3>
                <div class="flex gap-8">
                    <button class="btn btn-success btn-sm" onclick="App._exportReport('${type}')"><i class="fas fa-file-excel"></i> Export</button>
                    <button class="btn btn-primary btn-sm" onclick="App._printReport('${type}')"><i class="fas fa-print"></i> Print</button>
                </div>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            ${displayHeaders.map(h => `<th>${h.replace(/([A-Z])/g, ' $1').trim()}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.slice(0, 100).map(item => `
                            <tr>
                                ${displayHeaders.map(h => {
                                    let val = item[h];
                                    if (typeof val === 'number') val = Utils.formatCurrency(val);
                                    else if (h.includes('Date') || h.includes('date')) val = Utils.formatDate(val, 'date');
                                    return `<td>${val || '-'}</td>`;
                                }).join('')}
                            </tr>
                        `).join('')}
                        ${data.length === 0 ? `<tr><td colspan="${displayHeaders.length}" class="text-center text-muted">No data</td></tr>` : ''}
                    </tbody>
                </table>
                ${data.length > 100 ? `<p class="text-muted mt-8">Showing first 100 of ${data.length} records</p>` : ''}
            </div>
        `;

        // Store report data for export
        window._reportData = { type, data, title };
    },

    _exportReport(type) {
        let data = [];
        switch(type) {
            case 'purchase': data = DB.readAll(DB.TABLES.STOCK_IN); break;
            case 'sales': data = DB.readAll(DB.TABLES.STOCK_OUT); break;
            case 'profit': data = DB.readAll(DB.TABLES.STOCK_OUT); break;
            case 'stock': data = DB.getStockBalance(); break;
            case 'customer': data = DB.readAll(DB.TABLES.CUSTOMERS); break;
            case 'vendor': data = DB.readAll(DB.TABLES.VENDORS); break;
        }

        if (data.length === 0) {
            Utils.toast('No data to export', 'warning');
            return;
        }

        const headers = Object.keys(data[0]).filter(h => !['id', 'password', 'createdAt', 'updatedAt'].includes(h));
        const csv = Utils.arrayToCSV(data.map(item => {
            const obj = {};
            headers.forEach(h => {
                let val = item[h];
                if (typeof val === 'number') val = val;
                obj[h] = val || '';
            });
            return obj;
        }), headers);
        Utils.downloadFile(csv, `${type}_report_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        Utils.toast('Report exported!', 'success');
    },

    _printReport(type) {
        const output = document.getElementById('reportOutput');
        if (!output) return;

        const settings = Utils.getSettings();
        const printWindow = window.open('', '_blank', 'width=900,height=600');
        printWindow.document.write(`
            <html>
            <head><title>${type} Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 30px; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                .header h1 { margin: 0; color: #4F46E5; }
                table { width: 100%; border-collapse: collapse; font-size: 11px; }
                th { background: #f0f0f0; padding: 6px; text-align: left; border: 1px solid #ddd; }
                td { padding: 4px 6px; border: 1px solid #ddd; }
                .footer { text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; color: #666; }
            </style>
            </head>
            <body>
                <div class="header">
                    <h1>${settings.companyName}</h1>
                    <p>${settings.address} | ${settings.phone}</p>
                    <p><strong>${type.toUpperCase()} Report</strong></p>
                    <p>Generated: ${new Date().toLocaleString()}</p>
                </div>
                ${output.innerHTML.replace(/<button[^>]*>.*?<\/button>/g, '')}
                <div class="footer">
                    <p>${settings.footerNote || 'Thank you for your business!'}</p>
                </div>
                <script>
                    window.onload = function() { window.print(); }
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    },

    // ============================================================
    // SEARCH
    // ============================================================

    _renderSearch() {
        const content = document.getElementById('pageContent');

        content.innerHTML = `
            <h2 class="mb-16">Global Search</h2>

            <div class="card mb-16">
                <div class="flex gap-8">
                    <input type="text" id="searchQuery" class="form-control" style="flex:1;" placeholder="Search by item, barcode, vendor, customer, invoice..." autofocus>
                    <button class="btn btn-primary" onclick="App._performSearch()"><i class="fas fa-search"></i> Search</button>
                    <button class="btn btn-outline" onclick="document.getElementById('searchQuery').value='';document.getElementById('searchResults').innerHTML='';"><i class="fas fa-undo"></i> Clear</button>
                </div>
                <div class="flex flex-wrap gap-8 mt-8">
                    <span class="badge badge-info" style="cursor:pointer;padding:4px 12px;" onclick="document.getElementById('searchQuery').value=this.textContent;App._performSearch();">Item</span>
                    <span class="badge badge-success" style="cursor:pointer;padding:4px 12px;" onclick="document.getElementById('searchQuery').value=this.textContent;App._performSearch();">Barcode</span>
                    <span class="badge badge-warning" style="cursor:pointer;padding:4px 12px;" onclick="document.getElementById('searchQuery').value=this.textContent;App._performSearch();">Vendor</span>
                    <span class="badge badge-danger" style="cursor:pointer;padding:4px 12px;" onclick="document.getElementById('searchQuery').value=this.textContent;App._performSearch();">Customer</span>
                    <span class="badge badge-secondary" style="cursor:pointer;padding:4px 12px;" onclick="document.getElementById('searchQuery').value=this.textContent;App._performSearch();">Invoice</span>
                </div>
            </div>

            <div id="searchResults"></div>
        `;

        // Auto-search if query was passed
        const query = new URLSearchParams(window.location.search).get('q');
        if (query) {
            document.getElementById('searchQuery').value = query;
            setTimeout(() => this._performSearch(), 100);
        }

        document.getElementById('searchQuery')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this._performSearch();
        });
    },

    _performSearch() {
        const query = document.getElementById('searchQuery')?.value.trim();
        const results = document.getElementById('searchResults');

        if (!query || !results) return;

        // Search in all tables
        const stockIn = DB.readAll(DB.TABLES.STOCK_IN);
        const stockOut = DB.readAll(DB.TABLES.STOCK_OUT);
        const vendors = DB.readAll(DB.TABLES.VENDORS);
        const customers = DB.readAll(DB.TABLES.CUSTOMERS);

        const term = query.toLowerCase();

        const inResults = stockIn.filter(item =>
            item.itemName?.toLowerCase().includes(term) ||
            item.barcode?.toLowerCase().includes(term) ||
            item.vendorName?.toLowerCase().includes(term)
        );

        const outResults = stockOut.filter(item =>
            item.itemName?.toLowerCase().includes(term) ||
            item.barcode?.toLowerCase().includes(term) ||
            item.customerName?.toLowerCase().includes(term) ||
            item.invoiceNumber?.toLowerCase().includes(term)
        );

        const vendorResults = vendors.filter(item =>
            item.name?.toLowerCase().includes(term) ||
            item.phone?.toLowerCase().includes(term)
        );

        const customerResults = customers.filter(item =>
            item.name?.toLowerCase().includes(term) ||
            item.phone?.toLowerCase().includes(term)
        );

        const totalResults = inResults.length + outResults.length + vendorResults.length + customerResults.length;

        if (totalResults === 0) {
            results.innerHTML = `
                <div class="card">
                    <p class="text-center text-muted" style="padding:40px;">
                        <i class="fas fa-search" style="font-size:2rem;display:block;margin-bottom:12px;"></i>
                        No results found for "<strong>${query}</strong>"
                    </p>
                </div>
            `;
            return;
        }

        results.innerHTML = `
            <h3 class="mb-16">Found ${totalResults} results for "<strong>${query}</strong>"</h3>

            ${inResults.length > 0 ? `
                <div class="card mb-16">
                    <h4><i class="fas fa-arrow-down text-success"></i> Stock IN (${inResults.length})</h4>
                    <div class="table-responsive">
                        <table>
                            <thead><tr><th>Date</th><th>Vendor</th><th>Item</th><th>Barcode</th><th>Qty</th><th>Price</th></tr></thead>
                            <tbody>
                                ${inResults.map(item => `
                                    <tr>
                                        <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                                        <td>${item.vendorName}</td>
                                        <td>${item.itemName}</td>
                                        <td><span class="badge badge-info">${item.barcode}</span></td>
                                        <td>${item.quantity}</td>
                                        <td>${Utils.formatCurrency(item.purchasePrice)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            ` : ''}

            ${outResults.length > 0 ? `
                <div class="card mb-16">
                    <h4><i class="fas fa-arrow-up text-danger"></i> Stock OUT (${outResults.length})</h4>
                    <div class="table-responsive">
                        <table>
                            <thead><tr><th>Date</th><th>Customer</th><th>Item</th><th>Invoice</th><th>Qty</th><th>Total</th></tr></thead>
                            <tbody>
                                ${outResults.map(item => `
                                    <tr>
                                        <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                                        <td>${item.customerName}</td>
                                        <td>${item.itemName}</td>
                                        <td><span class="badge badge-info">${item.invoiceNumber}</span></td>
                                        <td>${item.quantity}</td>
                                        <td>${Utils.formatCurrency(item.quantity * item.salePrice)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            ` : ''}

            ${vendorResults.length > 0 ? `
                <div class="card mb-16">
                    <h4><i class="fas fa-handshake text-warning"></i> Vendors (${vendorResults.length})</h4>
                    <div class="table-responsive">
                        <table>
                            <thead><tr><th>Name</th><th>Phone</th><th>Address</th></tr></thead>
                            <tbody>
                                ${vendorResults.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.phone || 'N/A'}</td>
                                        <td>${item.address || 'N/A'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            ` : ''}

            ${customerResults.length > 0 ? `
                <div class="card mb-16">
                    <h4><i class="fas fa-users text-primary"></i> Customers (${customerResults.length})</h4>
                    <div class="table-responsive">
                        <table>
                            <thead><tr><th>Name</th><th>Phone</th><th>Address</th></tr></thead>
                            <tbody>
                                ${customerResults.map(item => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.phone || 'N/A'}</td>
                                        <td>${item.address || 'N/A'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            ` : ''}
        `;
    },

    // ============================================================
    // SETTINGS
    // ============================================================

    _renderSettings() {
        const content = document.getElementById('pageContent');
        const settings = Utils.getSettings();

        content.innerHTML = `
            <h2 class="mb-16">Settings</h2>

            <div class="card">
                <form id="settingsForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Company Name</label>
                            <input type="text" id="setCompanyName" class="form-control" value="${settings.companyName || ''}">
                        </div>
                        <div class="form-group">
                            <label>Company Logo URL</label>
                            <input type="text" id="setLogo" class="form-control" placeholder="Logo URL" value="${settings.companyLogo || ''}">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Address</label>
                            <input type="text" id="setAddress" class="form-control" value="${settings.address || ''}">
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="text" id="setPhone" class="form-control" value="${settings.phone || ''}">
                        </div>
                    </div>
                    <div class="form-row-3">
                        <div class="form-group">
                            <label>Tax Rate (%)</label>
                            <input type="number" id="setTax" class="form-control" value="${settings.taxRate || 0}" min="0" max="100" step="0.1">
                        </div>
                        <div class="form-group">
                            <label>Currency</label>
                            <select id="setCurrency" class="form-control">
                                <option value="PKR" ${settings.currency === 'PKR' ? 'selected' : ''}>PKR</option>
                                <option value="USD" ${settings.currency === 'USD' ? 'selected' : ''}>USD</option>
                                <option value="EUR" ${settings.currency === 'EUR' ? 'selected' : ''}>EUR</option>
                                <option value="GBP" ${settings.currency === 'GBP' ? 'selected' : ''}>GBP</option>
                                <option value="INR" ${settings.currency === 'INR' ? 'selected' : ''}>INR</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Invoice Prefix</label>
                            <input type="text" id="setInvoicePrefix" class="form-control" value="${settings.invoicePrefix || 'INV-'}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Footer Note</label>
                        <input type="text" id="setFooter" class="form-control" value="${settings.footerNote || ''}" placeholder="Thank you for your business!">
                    </div>
                    <div class="form-group">
                        <label>Supabase URL (for cloud sync)</label>
                        <input type="text" id="setSupabaseUrl" class="form-control" placeholder="https://your-project.supabase.co" value="${localStorage.getItem('supabase_url') || ''}">
                    </div>
                    <div class="form-group">
                        <label>Supabase Key</label>
                        <input type="password" id="setSupabaseKey" class="form-control" placeholder="Your supabase anon key" value="${localStorage.getItem('supabase_key') || ''}">
                    </div>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Settings</button>
                </form>
            </div>

            <div class="card mt-16">
                <h3>Users Management</h3>
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Username</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            ${Auth.getUsers().map(user => `
                                <tr>
                                    <td>${user.username}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email || 'N/A'}</td>
                                    <td><span class="badge ${user.role === 'admin' ? 'badge-warning' : 'badge-info'}">${user.role}</span></td>
                                    <td><span class="badge ${user.active !== false ? 'badge-success' : 'badge-danger'}">${user.active !== false ? 'Active' : 'Inactive'}</span></td>
                                    <td>
                                        ${user.username !== 'admin' ? `
                                            <button class="btn btn-danger btn-xs" onclick="App._deleteUser('${user.id}')"><i class="fas fa-trash"></i></button>
                                        ` : ''}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <button class="btn btn-primary mt-8" onclick="App._showAddUser()"><i class="fas fa-user-plus"></i> Add User</button>
            </div>
        `;

        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const updates = {
                companyName: document.getElementById('setCompanyName').value.trim(),
                companyLogo: document.getElementById('setLogo').value.trim(),
                address: document.getElementById('setAddress').value.trim(),
                phone: document.getElementById('setPhone').value.trim(),
                taxRate: parseFloat(document.getElementById('setTax').value) || 0,
                currency: document.getElementById('setCurrency').value,
                invoicePrefix: document.getElementById('setInvoicePrefix').value.trim(),
                footerNote: document.getElementById('setFooter').value.trim()
            };

            Utils.updateSettings(updates);

            // Save Supabase config
            const supabaseUrl = document.getElementById('setSupabaseUrl').value.trim();
            const supabaseKey = document.getElementById('setSupabaseKey').value.trim();
            if (supabaseUrl && supabaseKey) {
                localStorage.setItem('supabase_url', supabaseUrl);
                localStorage.setItem('supabase_key', supabaseKey);
                SyncManager.init(supabaseUrl, supabaseKey);
            }

            Utils.toast('Settings saved!', 'success');
        });
    },

    _showAddUser() {
        const content = `
            <form id="addUserForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Username <span class="required">*</span></label>
                        <input type="text" id="newUsername" class="form-control" placeholder="Username" required>
                    </div>
                    <div class="form-group">
                        <label>Password <span class="required">*</span></label>
                        <input type="password" id="newPassword" class="form-control" placeholder="Password" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Name <span class="required">*</span></label>
                        <input type="text" id="newName" class="form-control" placeholder="Full name" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="newEmail" class="form-control" placeholder="Email">
                    </div>
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select id="newRole" class="form-control">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="flex gap-8" style="margin-top:12px;">
                    <button type="submit" class="btn btn-primary"><i class="fas fa-user-plus"></i> Add User</button>
                    <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
                </div>
            </form>
        `;

        const modal = Utils.showModal(content, 'Add New User');

        document.getElementById('addUserForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('newUsername').value.trim();
            const password = document.getElementById('newPassword').value;
            const name = document.getElementById('newName').value.trim();
            const email = document.getElementById('newEmail').value.trim();
            const role = document.getElementById('newRole').value;

            if (!username || !password || !name) {
                Utils.toast('Please fill all required fields', 'error');
                return;
            }

            try {
                Auth.createUser({
                    username,
                    password: Auth.hashPassword(password),
                    name,
                    email,
                    role,
                    active: true
                });
                Utils.toast('User created successfully!', 'success');
                modal?.remove();
                this._renderSettings();
            } catch (error) {
                Utils.toast(error.message, 'error');
            }
        });
    },

    async _deleteUser(id) {
        const confirmed = await Utils.confirm('Are you sure you want to delete this user?', 'Delete User');
        if (confirmed) {
            try {
                Auth.deleteUser(id);
                Utils.toast('User deleted!', 'success');
                this._renderSettings();
            } catch (error) {
                Utils.toast(error.message, 'error');
            }
        }
    },

    // ============================================================
    // BACKUP
    // ============================================================

    _renderBackup() {
        const content = document.getElementById('pageContent');

        content.innerHTML = `
            <h2 class="mb-16">Backup & Restore</h2>

            <div class="dashboard-grid">
                <div class="stat-card" onclick="App._createBackup()" style="cursor:pointer;">
                    <div class="stat-icon"><i class="fas fa-download"></i></div>
                    <div class="stat-label">Create Backup</div>
                    <div style="font-size:0.8rem;color:var(--text-light);">Export all data as JSON</div>
                </div>
                <div class="stat-card color-success" onclick="document.getElementById('restoreInput').click()" style="cursor:pointer;">
                    <div class="stat-icon"><i class="fas fa-upload"></i></div>
                    <div class="stat-label">Restore Backup</div>
                    <div style="font-size:0.8rem;color:var(--text-light);">Import from JSON file</div>
                    <input type="file" id="restoreInput" accept=".json" style="display:none;">
                </div>
                <div class="stat-card color-info" onclick="App._exportExcel()" style="cursor:pointer;">
                    <div class="stat-icon"><i class="fas fa-file-excel"></i></div>
                    <div class="stat-label">Export Excel</div>
                    <div style="font-size:0.8rem;color:var(--text-light);">Export all data to Excel</div>
                </div>
                <div class="stat-card color-danger" onclick="App._resetData()" style="cursor:pointer;">
                    <div class="stat-icon"><i class="fas fa-trash"></i></div>
                    <div class="stat-label">Reset All Data</div>
                    <div style="font-size:0.8rem;color:var(--text-light);">Clear all data (irreversible)</div>
                </div>
            </div>

            <div class="card mt-16">
                <h3>Backup Information</h3>
                <div class="flex flex-wrap gap-16">
                    <div>
                        <strong>Total Records:</strong>
                        <span>${Object.values(DB.TABLES).reduce((sum, table) => sum + DB.readAll(table).length, 0)}</span>
                    </div>
                    <div>
                        <strong>Last Backup:</strong>
                        <span>${localStorage.getItem('krt_last_backup') || 'Never'}</span>
                    </div>
                    <div>
                        <strong>Storage Used:</strong>
                        <span>${this._getStorageSize()}</span>
                    </div>
                </div>
            </div>
        `;

        // Restore handler
        document.getElementById('restoreInput')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this._restoreBackup(file);
            }
        });
    },

    _createBackup() {
        const data = DB.exportAll();
        data._metadata = {
            exportedAt: new Date().toISOString(),
            version: '1.0',
            company: Utils.getSettings().companyName,
            records: Object.values(data).reduce((sum, arr) => sum + arr.length, 0)
        };

        const json = JSON.stringify(data, null, 2);
        const filename = `krt_backup_${new Date().toISOString().split('T')[0]}.json`;
        Utils.downloadFile(json, filename, 'application/json');
        localStorage.setItem('krt_last_backup', new Date().toLocaleString());
        Utils.toast('Backup created successfully!', 'success');
        this._renderBackup();
    },

    _restoreBackup(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = Utils.safeJSONParse(e.target.result);
                if (!data || typeof data !== 'object') {
                    Utils.toast('Invalid backup file', 'error');
                    return;
                }

                const confirmed = await Utils.confirm(
                    'This will replace all existing data. Continue?',
                    'Restore Backup'
                );

                if (confirmed) {
                    DB.importAll(data);
                    Utils.toast('Backup restored successfully!', 'success');
                    this._renderBackup();
                }
            } catch (error) {
                Utils.toast('Error restoring backup: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    },

    _exportExcel() {
        const data = DB.exportAll();
        let allData = [];
        Object.keys(data).forEach(table => {
            data[table].forEach(item => {
                allData.push({ ...item, _table: table });
            });
        });

        if (allData.length === 0) {
            Utils.toast('No data to export', 'warning');
            return;
        }

        const headers = ['_table', ...Object.keys(allData[0]).filter(k => k !== '_table')];
        const csv = Utils.arrayToCSV(allData, headers);
        Utils.downloadFile(csv, `krt_data_export_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        Utils.toast('Data exported!', 'success');
    },

    async _resetData() {
        const confirmed = await Utils.confirm(
            '⚠️ This will permanently delete ALL data. Are you sure?',
            'Reset All Data'
        );

        if (confirmed) {
            const doubleConfirmed = await Utils.confirm(
                '⚠️ FINAL WARNING: This action cannot be undone. Continue?',
                'Permanent Delete'
            );

            if (doubleConfirmed) {
                DB.clearAll();
                // Recreate default admin
                Auth.init();
                Utils.toast('All data has been reset!', 'success');
                window.location.reload();
            }
        }
    },

    _getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length * 2; // UTF-16
            }
        }
        if (total < 1024) return total + ' B';
        if (total < 1048576) return (total / 1024).toFixed(2) + ' KB';
        return (total / 1048576).toFixed(2) + ' MB';
    }
};

// ============================================================
// INITIALIZE APPLICATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize auth first
    Auth.init();

    // Initialize app if authenticated
    if (Auth.isAuthenticated()) {
        App.init();

        // Setup online/offline listeners for sync
        window.addEventListener('online', () => {
            Utils.toast('Back online!', 'success');
            SyncManager.processQueue();
        });

        window.addEventListener('offline', () => {
            Utils.toast('You are offline. Working in offline mode.', 'warning');
        });

        // Initial sync check
        setTimeout(() => {
            const url = localStorage.getItem('supabase_url');
            const key = localStorage.getItem('supabase_key');
            if (url && key) {
                SyncManager.init(url, key);
            }
        }, 2000);
    }

    // Expose App globally for inline onclick handlers
    window.App = App;
    window.Utils = Utils;
    window.DB = DB;
    window.SyncManager = SyncManager;
    window.Auth = Auth;
});
