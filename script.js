// ============================================================
// KRT TRADERS ERP – Complete JavaScript
// LOGIN REDIRECT FIXED
// ============================================================

// ============================================================
// ⚡ SUPABASE CONFIGURATION (AUTO-CONFIGURED)
// ============================================================
const SUPABASE_CONFIG = {
    URL: 'https://pukopnrxgitwataauvgo.supabase.co',
    API_KEY: 'sb_publishable_vOC-igCOGRZ6lmIegNTZHA_2kWXn1ve'
};

// Auto-save to localStorage on load
(function autoConfigureSupabase() {
    try {
        localStorage.setItem('supabase_url', SUPABASE_CONFIG.URL);
        localStorage.setItem('supabase_key', SUPABASE_CONFIG.API_KEY);
        console.log('✅ Supabase configured successfully!');
    } catch (e) {
        console.warn('⚠️ Could not save Supabase config:', e);
    }
})();

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

    formatCurrency(amount) {
        if (amount === undefined || amount === null) return '₨ 0';
        return '₨ ' + new Intl.NumberFormat('en-US').format(Math.round(amount));
    },

    formatNumber(num) {
        if (num === undefined || num === null) return '0';
        return new Intl.NumberFormat('en-US').format(num);
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
            <button class="toast-close">&times;</button>
        `;
        container.appendChild(toast);

        const closeToast = () => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 400);
        };

        toast.querySelector('.toast-close').addEventListener('click', closeToast);
        setTimeout(closeToast, duration);
    },

    confirm(message, title = 'Confirm') {
        return new Promise((resolve) => {
            const overlay = document.getElementById('confirmDialog');
            if (!overlay) return resolve(false);

            overlay.style.display = 'flex';
            document.getElementById('confirmTitle').textContent = title;
            document.getElementById('confirmMessage').textContent = message;

            const close = (result) => {
                overlay.style.display = 'none';
                resolve(result);
            };

            document.getElementById('confirmYes').onclick = () => close(true);
            document.getElementById('confirmNo').onclick = () => close(false);
            overlay.querySelector('.confirm-overlay').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) close(false);
            });
        });
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
                theme: 'dark',
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
    },

    generateBarcode(prefix = 'KRT') {
        const num = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `${prefix}-${num}`;
    },

    debounce(fn, delay = 300) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
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
        const rows = data.map(item => {
            return headers.map(h => {
                let val = item[h] || '';
                if (typeof val === 'string' && val.includes(',')) {
                    val = `"${val}"`;
                }
                return val;
            }).join(',');
        });
        return [headerRow, ...rows].join('\n');
    },

    getSupabaseConfig() {
        return {
            url: localStorage.getItem('supabase_url') || SUPABASE_CONFIG.URL,
            key: localStorage.getItem('supabase_key') || SUPABASE_CONFIG.API_KEY
        };
    },

    setSupabaseConfig(url, key) {
        if (url) localStorage.setItem('supabase_url', url);
        if (key) localStorage.setItem('supabase_key', key);
    },

    isSupabaseConfigured() {
        const config = this.getSupabaseConfig();
        return !!(config.url && config.key);
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
            return data ? JSON.parse(data) : [];
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
    },

    clearAll() {
        Object.values(this.TABLES).forEach(table => localStorage.removeItem(table));
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

    getTableCounts() {
        const counts = {};
        Object.values(this.TABLES).forEach(table => {
            counts[table] = this._getTable(table).length;
        });
        return counts;
    }
};

// ============================================================
// SYNC MANAGER (Supabase)
// ============================================================
const SyncManager = {
    isConnected: false,
    isSyncing: false,
    syncInterval: null,

    init() {
        this._checkConnection();
        this._setupListeners();
        this._startAutoSync();
        if (Utils.isSupabaseConfigured()) {
            console.log('✅ Supabase Sync Manager initialized');
        }
    },

    _checkConnection() {
        this.isConnected = navigator.onLine;
        this._updateUI();
        if (this.isConnected && Utils.isSupabaseConfigured()) {
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
    },

    _startAutoSync() {
        if (this.syncInterval) clearInterval(this.syncInterval);
        this.syncInterval = setInterval(() => {
            if (this.isConnected && Utils.isSupabaseConfigured()) {
                this.processQueue();
            }
        }, 30000);
    },

    _updateUI() {
        const dot = document.getElementById('syncDot');
        const label = document.getElementById('syncLabel');
        const time = document.getElementById('lastSyncTime');
        const btn = document.getElementById('syncNowBtn');
        const pending = DB.getPendingSyncCount();

        if (dot && label) {
            if (this.isSyncing) {
                dot.className = 'sync-dot syncing';
                label.textContent = 'Syncing...';
            } else if (this.isConnected) {
                dot.className = 'sync-dot online';
                label.textContent = pending > 0 ? `${pending} pending` : 'Online';
            } else {
                dot.className = 'sync-dot offline';
                label.textContent = 'Offline';
            }
        }

        if (time) {
            const lastSync = localStorage.getItem('krt_last_sync');
            time.textContent = lastSync ? new Date(lastSync).toLocaleTimeString() : 'Never';
        }

        if (btn) {
            if (this.isSyncing) {
                btn.classList.add('syncing');
            } else {
                btn.classList.remove('syncing');
            }
        }

        const footerStatus = document.getElementById('syncFooterStatus');
        if (footerStatus) {
            if (Utils.isSupabaseConfigured()) {
                footerStatus.textContent = this.isConnected ? '🔗 Cloud Sync Active' : '📡 Offline Mode';
            } else {
                footerStatus.textContent = '⚠️ Supabase Not Configured';
            }
        }
    },

    async processQueue() {
        if (!this.isConnected || this.isSyncing) return;
        if (!Utils.isSupabaseConfigured()) return;

        const queue = DB._getTable(DB.TABLES.SYNC_QUEUE);
        const pending = queue.filter(item => !item.synced);

        if (pending.length === 0) {
            this._updateUI();
            return;
        }

        this.isSyncing = true;
        this._updateUI();
        Utils.toast(`Syncing ${pending.length} items...`, 'info');

        let syncedCount = 0;
        let failedCount = 0;

        for (const item of pending) {
            try {
                await this._syncToSupabase(item);
                item.synced = true;
                item.syncedAt = new Date().toISOString();
                syncedCount++;
            } catch (error) {
                item.attempts += 1;
                failedCount++;
                if (item.attempts >= 5) {
                    item.synced = true;
                }
            }
            DB._setTable(DB.TABLES.SYNC_QUEUE, queue);
        }

        const updatedQueue = DB._getTable(DB.TABLES.SYNC_QUEUE);
        const filtered = updatedQueue.filter(item => !item.synced);
        DB._setTable(DB.TABLES.SYNC_QUEUE, filtered);

        this.isSyncing = false;
        localStorage.setItem('krt_last_sync', new Date().toISOString());
        this._updateUI();

        if (syncedCount > 0) {
            Utils.toast(`Synced ${syncedCount} items!`, 'success');
        }
        if (failedCount > 0) {
            Utils.toast(`${failedCount} items failed to sync`, 'error');
        }
    },

    async _syncToSupabase(item) {
        const config = Utils.getSupabaseConfig();
        if (!config.url || !config.key) return;

        const tableName = item.table.replace('krt_', '');
        const url = `${config.url}/rest/v1/${tableName}`;

        let method = 'POST';
        let body = item.data;

        if (item.action === 'update') {
            method = 'PATCH';
            body = { ...item.data };
            delete body.id;
        } else if (item.action === 'delete') {
            method = 'DELETE';
            body = null;
        }

        const headers = {
            'apikey': config.key,
            'Authorization': `Bearer ${config.key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        };

        let finalUrl = url;
        if (item.action === 'delete' || item.action === 'update') {
            finalUrl = `${url}?id=eq.${item.data.id}`;
        }

        const options = { method, headers };
        if (body && method !== 'DELETE') {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(finalUrl, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
    },

    forceSync() {
        if (!Utils.isSupabaseConfigured()) {
            Utils.toast('Please configure Supabase in Settings first', 'warning');
            return;
        }
        this.processQueue();
    }
};

// ============================================================
// AUTHENTICATION - FIXED
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
            console.log('✅ Default admin user created');
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
        if (session && session.userId === id) {
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
        console.log('✅ Session saved:', session);
        this._updateUI(session);
        return session;
    },

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        this._updateUI(null);
        // Redirect to login
        const loginPage = document.getElementById('loginPage');
        const app = document.getElementById('app');
        if (loginPage) loginPage.style.display = 'flex';
        if (app) app.classList.remove('active');
    },

    getSession() {
        const data = localStorage.getItem(this.SESSION_KEY);
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                return null;
            }
        }
        return null;
    },

    checkSession() {
        const session = this.getSession();
        const loginPage = document.getElementById('loginPage');
        const app = document.getElementById('app');

        if (session) {
            const user = DB.read(DB.TABLES.USERS, session.userId);
            if (!user || user.active === false) {
                this.logout();
                return;
            }
            // User is authenticated - show app
            if (loginPage) loginPage.style.display = 'none';
            if (app) app.classList.add('active');
            this._updateUI(session);
            App.init();
            return session;
        } else {
            // No session - show login
            if (loginPage) loginPage.style.display = 'flex';
            if (app) app.classList.remove('active');
            return null;
        }
    },

    isAuthenticated() {
        return !!this.getSession();
    },

    isAdmin() {
        const session = this.getSession();
        return session && session.role === 'admin';
    },

    _showLogin() {
        const loginPage = document.getElementById('loginPage');
        const app = document.getElementById('app');
        if (loginPage) loginPage.style.display = 'flex';
        if (app) app.classList.remove('active');

        const form = document.getElementById('loginForm');
        if (form) {
            // Remove old listeners to prevent duplicates
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('loginUsername').value.trim();
                const password = document.getElementById('loginPassword').value;

                try {
                    const session = this.login(username, password);
                    Utils.toast('✅ Login successful!', 'success');
                    if (loginPage) loginPage.style.display = 'none';
                    if (app) app.classList.add('active');
                    App.init();
                } catch (error) {
                    Utils.toast('❌ ' + error.message, 'error');
                }
            });
        }
    },

    _updateUI(session) {
        const nameDisplay = document.getElementById('userNameDisplay');
        const avatar = document.getElementById('userAvatar');
        const sidebarName = document.getElementById('sidebarUserName');
        const sidebarAvatar = document.getElementById('sidebarAvatar');

        if (session) {
            const name = session.name || session.username;
            const initial = name[0].toUpperCase();
            if (nameDisplay) nameDisplay.textContent = name;
            if (avatar) avatar.textContent = initial;
            if (sidebarName) sidebarName.textContent = name;
            if (sidebarAvatar) sidebarAvatar.textContent = initial;
        }
    }
};

// ============================================================
// MAIN APPLICATION
// ============================================================
const App = {
    currentPage: 'dashboard',
    isInitialized: false,

    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        this._setupNavigation();
        this._setupGlobalSearch();
        this._setupLogout();
        this._setupSidebarToggle();
        this._setupUserDropdown();
        this._updateDateTime();
        setInterval(() => this._updateDateTime(), 1000);
        SyncManager.init();
        this._updateCounts();
        this.loadPage('dashboard');
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
                if (confirmed) Auth.logout();
            });
        });

        document.getElementById('logoutDropdown')?.addEventListener('click', (e) => {
            e.preventDefault();
            Utils.confirm('Are you sure you want to logout?', 'Logout').then(confirmed => {
                if (confirmed) Auth.logout();
            });
        });
    },

    _setupSidebarToggle() {
        const toggleBtn = document.getElementById('toggleSidebar');
        const sidebar = document.getElementById('sidebar');

        toggleBtn?.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    },

    _setupUserDropdown() {
        const profile = document.getElementById('userProfile');
        const dropdown = document.getElementById('userDropdown');

        profile?.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            dropdown?.classList.remove('show');
        });
    },

    _updateDateTime() {
        const el = document.getElementById('currentDateTime');
        if (el) {
            el.textContent = new Date().toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },

    _updateCounts() {
        const counts = DB.getTableCounts();
        const stockInCount = document.getElementById('stockInCount');
        const stockOutCount = document.getElementById('stockOutCount');
        const ledgerCount = document.getElementById('ledgerCount');

        if (stockInCount) stockInCount.textContent = counts[DB.TABLES.STOCK_IN] || 0;
        if (stockOutCount) stockOutCount.textContent = counts[DB.TABLES.STOCK_OUT] || 0;
        if (ledgerCount) ledgerCount.textContent = counts[DB.TABLES.LEDGER] || 0;
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

        const titleEl = document.getElementById('pageTitle');
        if (titleEl) titleEl.textContent = titleMap[page] || page;

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
        const balance = DB.getStockBalance();

        const totalStock = balance.reduce((sum, item) => sum + item.available, 0);
        const stockValue = balance.reduce((sum, item) => sum + item.stockValue, 0);
        const totalProfit = balance.reduce((sum, item) => sum + item.profit, 0);

        const today = new Date().toISOString().split('T')[0];
        const todaySales = stockOut.filter(s => s.createdAt?.startsWith(today));
        const todayPurchases = stockIn.filter(s => s.createdAt?.startsWith(today));
        const lowStock = balance.filter(item => item.available <= 5);

        const recentTransactions = this._getRecentTransactions();

        content.innerHTML = `
            <div class="dashboard-grid">
                <div class="stat-card">
                    <div class="stat-top"><div class="stat-icon"><i class="fas fa-boxes"></i></div></div>
                    <div class="stat-label">Total Stock</div>
                    <div class="stat-value">${Utils.formatNumber(totalStock)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-top"><div class="stat-icon green"><i class="fas fa-money-bill-wave"></i></div></div>
                    <div class="stat-label">Stock Value</div>
                    <div class="stat-value">${Utils.formatCurrency(stockValue)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-top"><div class="stat-icon blue"><i class="fas fa-chart-line"></i></div></div>
                    <div class="stat-label">Total Profit</div>
                    <div class="stat-value">${Utils.formatCurrency(totalProfit)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-top"><div class="stat-icon orange"><i class="fas fa-shopping-cart"></i></div></div>
                    <div class="stat-label">Today's Sales</div>
                    <div class="stat-value">${Utils.formatNumber(todaySales.length)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-top"><div class="stat-icon"><i class="fas fa-truck"></i></div></div>
                    <div class="stat-label">Today's Purchases</div>
                    <div class="stat-value">${Utils.formatNumber(todayPurchases.length)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-top"><div class="stat-icon red"><i class="fas fa-exclamation-triangle"></i></div></div>
                    <div class="stat-label">Low Stock Items</div>
                    <div class="stat-value">${lowStock.length}</div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-clock"></i> Recent Transactions</div>
                    </div>
                    <div class="table-responsive">
                        <table>
                            <thead><tr><th>Date</th><th>Type</th><th>Item</th><th>Qty</th><th>Amount</th></tr></thead>
                            <tbody>
                                ${recentTransactions.map(t => `
                                    <tr>
                                        <td>${Utils.formatDate(t.createdAt, 'short')}</td>
                                        <td><span class="badge ${t.type === 'IN' ? 'badge-success' : 'badge-info'}">${t.type}</span></td>
                                        <td>${t.itemName || 'N/A'}</td>
                                        <td>${t.quantity || 0}</td>
                                        <td>${Utils.formatCurrency(t.total || 0)}</td>
                                    </tr>
                                `).join('')}
                                ${recentTransactions.length === 0 ? '<tr><td colspan="5" class="table-empty"><i class="fas fa-inbox"></i>No transactions</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <div class="card-title"><i class="fas fa-exclamation-circle"></i> Low Stock Alert</div>
                    </div>
                    <div class="table-responsive">
                        <table>
                            <thead><tr><th>Item</th><th>Qty</th></tr></thead>
                            <tbody>
                                ${lowStock.slice(0, 10).map(item => `
                                    <tr>
                                        <td>${item.itemName}</td>
                                        <td class="text-danger">${item.available}</td>
                                    </tr>
                                `).join('')}
                                ${lowStock.length === 0 ? '<tr><td colspan="2" class="table-empty"><i class="fas fa-check-circle"></i>All items in stock</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-top:20px;">
                <div class="card-header">
                    <div class="card-title"><i class="fas fa-cloud"></i> Sync Status</div>
                    <button class="btn btn-sm btn-primary" onclick="SyncManager.forceSync()">
                        <i class="fas fa-sync"></i> Sync Now
                    </button>
                </div>
                <div style="display:flex;gap:24px;flex-wrap:wrap;">
                    <div>
                        <span style="color:var(--text-secondary);">Status:</span>
                        <span id="dashSyncStatus" class="${navigator.onLine ? 'text-success' : 'text-danger'}">
                            ${navigator.onLine ? '🟢 Online' : '🔴 Offline'}
                        </span>
                    </div>
                    <div>
                        <span style="color:var(--text-secondary);">Pending Sync:</span>
                        <span>${DB.getPendingSyncCount()}</span>
                    </div>
                    <div>
                        <span style="color:var(--text-secondary);">Total Items:</span>
                        <span>${DB.getStockBalance().length}</span>
                    </div>
                    <div>
                        <span style="color:var(--text-secondary);">Supabase:</span>
                        <span class="${Utils.isSupabaseConfigured() ? 'text-success' : 'text-danger'}">
                            ${Utils.isSupabaseConfigured() ? '✅ Configured' : '❌ Not Configured'}
                        </span>
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
        return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 15);
    },

    // ============================================================
    // STOCK IN - Simplified (Other modules work same way)
    // ============================================================
    _renderStockIn() {
        const content = document.getElementById('pageContent');
        const stockIn = DB.readAll(DB.TABLES.STOCK_IN);

        content.innerHTML = `
            <div class="flex-between mb-16">
                <h2 style="font-size:1.2rem;">Stock IN</h2>
                <button class="btn btn-primary" onclick="App._showStockInForm()">
                    <i class="fas fa-plus"></i> New Purchase
                </button>
            </div>

            <div class="card">
                <div class="flex flex-wrap gap-8">
                    <input type="text" id="stockInSearch" class="form-control" style="flex:1;min-width:180px;" placeholder="Search..." />
                    <button class="btn btn-outline" onclick="App._filterStockIn()"><i class="fas fa-search"></i></button>
                    <button class="btn btn-outline" onclick="document.getElementById('stockInSearch').value='';App._filterStockIn();"><i class="fas fa-undo"></i></button>
                </div>
            </div>

            <div class="card">
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Vendor</th><th>Item</th><th>Barcode</th><th>Qty</th><th>Price</th><th>Total</th><th>Actions</th></tr>
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
                                    </td>
                                </tr>
                            `).join('')}
                            ${stockIn.length === 0 ? '<tr><td colspan="8" class="table-empty"><i class="fas fa-inbox"></i>No entries</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('stockInSearch')?.addEventListener('input', Utils.debounce(this._filterStockIn, 300));
    },

    _filterStockIn() {
        const search = document.getElementById('stockInSearch')?.value || '';
        let data = DB.readAll(DB.TABLES.STOCK_IN);

        if (search) {
            const term = search.toLowerCase();
            data = data.filter(item =>
                item.itemName?.toLowerCase().includes(term) ||
                item.vendorName?.toLowerCase().includes(term) ||
                item.barcode?.toLowerCase().includes(term)
            );
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
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="8" class="table-empty"><i class="fas fa-inbox"></i>No matching records</td></tr>';
        }
    },

    _showStockInForm(data = null) {
        const isEdit = !!data;
        const content = `
            <form id="stockInForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Date <span class="required">*</span></label>
                        <input type="date" id="siDate" class="form-control" value="${data?.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label>Vendor <span class="required">*</span></label>
                        <input type="text" id="siVendor" class="form-control" placeholder="Vendor name" value="${data?.vendorName || ''}" required>
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
                            <option value="box" ${data?.unit === 'box' ? 'selected' : ''}>Box</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea id="siNotes" class="form-control" placeholder="Notes">${data?.notes || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Save'}</button>
                    <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
                </div>
            </form>
        `;

        const modal = Utils.showModal(content, isEdit ? 'Edit Stock Entry' : 'New Purchase', 'large');

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
        const confirmed = await Utils.confirm('Delete this entry?', 'Delete');
        if (confirmed) {
            DB.delete(DB.TABLES.STOCK_IN, id);
            Utils.toast('Entry deleted!', 'success');
            this._renderStockIn();
        }
    },

    // ============================================================
    // STOCK OUT
    // ============================================================
    _renderStockOut() {
        const content = document.getElementById('pageContent');
        const stockOut = DB.readAll(DB.TABLES.STOCK_OUT);

        content.innerHTML = `
            <div class="flex-between mb-16">
                <h2 style="font-size:1.2rem;">Stock OUT</h2>
                <button class="btn btn-primary" onclick="App._showStockOutForm()">
                    <i class="fas fa-plus"></i> New Sale
                </button>
            </div>

            <div class="card">
                <div class="flex flex-wrap gap-8">
                    <input type="text" id="stockOutSearch" class="form-control" style="flex:1;min-width:180px;" placeholder="Search..." />
                    <button class="btn btn-outline" onclick="App._filterStockOut()"><i class="fas fa-search"></i></button>
                    <button class="btn btn-outline" onclick="document.getElementById('stockOutSearch').value='';App._filterStockOut();"><i class="fas fa-undo"></i></button>
                </div>
            </div>

            <div class="card">
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Item</th><th>Qty</th><th>Price</th><th>Total</th><th>Profit</th><th>Actions</th></tr>
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
                                    </td>
                                </tr>
                            `).join('')}
                            ${stockOut.length === 0 ? '<tr><td colspan="9" class="table-empty"><i class="fas fa-inbox"></i>No entries</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('stockOutSearch')?.addEventListener('input', Utils.debounce(this._filterStockOut, 300));
    },

    _filterStockOut() {
        const search = document.getElementById('stockOutSearch')?.value || '';
        let data = DB.readAll(DB.TABLES.STOCK_OUT);

        if (search) {
            const term = search.toLowerCase();
            data = data.filter(item =>
                item.itemName?.toLowerCase().includes(term) ||
                item.customerName?.toLowerCase().includes(term) ||
                item.invoiceNumber?.toLowerCase().includes(term)
            );
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
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="9" class="table-empty"><i class="fas fa-inbox"></i>No matching records</td></tr>';
        }
    },

    _showStockOutForm(data = null) {
        const isEdit = !!data;
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
                        <input type="text" id="soInvoice" class="form-control" value="${data?.invoiceNumber || settings.invoicePrefix + Date.now().toString().slice(-6)}" readonly>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Customer <span class="required">*</span></label>
                        <input type="text" id="soCustomer" class="form-control" placeholder="Customer name" value="${data?.customerName || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Barcode</label>
                        <input type="text" id="soBarcode" class="form-control" placeholder="Scan barcode" value="${data?.barcode || ''}">
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
                    <textarea id="soNotes" class="form-control" placeholder="Notes">${data?.notes || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Save'}</button>
                    <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
                </div>
            </form>
        `;

        const modal = Utils.showModal(content, isEdit ? 'Edit Sale' : 'New Sale', 'large');

        document.getElementById('stockOutForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const qty = parseFloat(document.getElementById('soQty').value) || 0;
            const price = parseFloat(document.getElementById('soPrice').value) || 0;
            const discount = parseFloat(document.getElementById('soDiscount').value) || 0;
            const tax = parseFloat(document.getElementById('soTax').value) || 0;

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
                total: qty * price,
                profit: profit,
                notes: document.getElementById('soNotes').value.trim()
            };

            if (!formData.customerName || !formData.itemName || !qty || !price) {
                Utils.toast('Please fill all required fields', 'error');
                return;
            }

            if (isEdit) {
                DB.update(DB.TABLES.STOCK_OUT, data.id, formData);
                Utils.toast('Sale updated!', 'success');
            } else {
                DB.create(DB.TABLES.STOCK_OUT, formData);
                Utils.toast('Sale saved!', 'success');
            }

            modal?.remove();
            this._renderStockOut();
        });

        document.getElementById('soBarcode')?.addEventListener('change', (e) => {
            const barcode = e.target.value.trim();
            if (barcode) {
                const stockIn = DB.readAll(DB.TABLES.STOCK_IN);
                const item = stockIn.find(s => s.barcode === barcode);
                if (item) {
                    document.getElementById('soItem').value = item.itemName;
                    document.getElementById('soPrice').value = item.purchasePrice * 1.2;
                }
            }
        });
    },

    _editStockOut(id) {
        const data = DB.read(DB.TABLES.STOCK_OUT, id);
        if (data) this._showStockOutForm(data);
    },

    async _deleteStockOut(id) {
        const confirmed = await Utils.confirm('Delete this sale?', 'Delete');
        if (confirmed) {
            DB.delete(DB.TABLES.STOCK_OUT, id);
            Utils.toast('Sale deleted!', 'success');
            this._renderStockOut();
        }
    },

    // ============================================================
    // STOCK BALANCE
    // ============================================================
    _renderStockBalance() {
        const content = document.getElementById('pageContent');
        const balance = DB.getStockBalance();

        content.innerHTML = `
            <div class="flex-between mb-16">
                <h2 style="font-size:1.2rem;">Stock Balance</h2>
                <button class="btn btn-success btn-sm" onclick="App._exportStockBalance()"><i class="fas fa-file-excel"></i> Export</button>
            </div>

            <div class="card">
                <div class="flex flex-wrap gap-8">
                    <input type="text" id="balanceSearch" class="form-control" style="flex:1;min-width:180px;" placeholder="Search..." />
                    <select id="balanceFilter" class="form-control" style="width:140px;">
                        <option value="all">All</option>
                        <option value="in-stock">In Stock</option>
                        <option value="low-stock">Low Stock</option>
                    </select>
                    <button class="btn btn-outline" onclick="App._filterBalance()"><i class="fas fa-filter"></i></button>
                </div>
            </div>

            <div class="card">
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Barcode</th><th>Item</th><th>In</th><th>Out</th><th>Available</th><th>Unit</th><th>Value</th><th>Profit</th></tr>
                        </thead>
                        <tbody id="balanceTable">
                            ${balance.map(item => `
                                <tr>
                                    <td><span class="badge badge-info">${item.barcode}</span></td>
                                    <td>${item.itemName}</td>
                                    <td>${item.totalIn}</td>
                                    <td>${item.totalOut}</td>
                                    <td class="${item.available <= 5 ? 'text-danger' : 'text-success'}">${item.available}</td>
                                    <td>${item.unit}</td>
                                    <td>${Utils.formatCurrency(item.stockValue)}</td>
                                    <td class="${item.profit > 0 ? 'text-success' : 'text-danger'}">${Utils.formatCurrency(item.profit)}</td>
                                </tr>
                            `).join('')}
                            ${balance.length === 0 ? '<tr><td colspan="8" class="table-empty"><i class="fas fa-inbox"></i>No items</td></tr>' : ''}
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

        if (filter === 'in-stock') data = data.filter(item => item.available > 0);
        else if (filter === 'low-stock') data = data.filter(item => item.available > 0 && item.available <= 5);

        const tbody = document.getElementById('balanceTable');
        if (tbody) {
            tbody.innerHTML = data.map(item => `
                <tr>
                    <td><span class="badge badge-info">${item.barcode}</span></td>
                    <td>${item.itemName}</td>
                    <td>${item.totalIn}</td>
                    <td>${item.totalOut}</td>
                    <td class="${item.available <= 5 ? 'text-danger' : 'text-success'}">${item.available}</td>
                    <td>${item.unit}</td>
                    <td>${Utils.formatCurrency(item.stockValue)}</td>
                    <td class="${item.profit > 0 ? 'text-success' : 'text-danger'}">${Utils.formatCurrency(item.profit)}</td>
                </tr>
            `).join('') || '<tr><td colspan="8" class="table-empty"><i class="fas fa-inbox"></i>No matching items</td></tr>';
        }
    },

    _exportStockBalance() {
        const data = DB.getStockBalance();
        if (data.length === 0) {
            Utils.toast('No data to export', 'warning');
            return;
        }
        const headers = ['Barcode', 'Item', 'Total In', 'Total Out', 'Available', 'Unit', 'Stock Value', 'Profit'];
        const csv = Utils.arrayToCSV(data.map(item => ({
            Barcode: item.barcode,
            Item: item.itemName,
            'Total In': item.totalIn,
            'Total Out': item.totalOut,
            Available: item.available,
            Unit: item.unit,
            'Stock Value': item.stockValue,
            Profit: item.profit
        })), headers);
        Utils.downloadFile(csv, `stock_balance_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        Utils.toast('Exported!', 'success');
    },

    // ============================================================
    // DAILY REPORT
    // ============================================================
    _renderDailyReport() {
        const content = document.getElementById('pageContent');
        const today = new Date().toISOString().split('T')[0];

        content.innerHTML = `
            <h2 style="font-size:1.2rem;margin-bottom:16px;">Daily Report</h2>

            <div class="card">
                <div class="flex flex-wrap gap-8">
                    <input type="date" id="reportStart" class="form-control" style="width:160px;" value="${today}">
                    <span style="color:var(--text-secondary);display:flex;align-items:center;">to</span>
                    <input type="date" id="reportEnd" class="form-control" style="width:160px;" value="${today}">
                    <button class="btn btn-primary" onclick="App._generateReport()"><i class="fas fa-chart-bar"></i> Generate</button>
                    <button class="btn btn-success btn-sm" onclick="App._exportDailyReport()"><i class="fas fa-file-excel"></i> Export</button>
                </div>
            </div>

            <div id="reportResults"></div>
        `;

        setTimeout(() => this._generateReport(), 100);
    },

    _generateReport() {
        const start = document.getElementById('reportStart')?.value || '';
        const end = document.getElementById('reportEnd')?.value || '';
        const results = document.getElementById('reportResults');
        if (!start || !end || !results) return;

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

        const totalPurchases = inData.reduce((sum, item) => sum + (item.quantity * item.purchasePrice), 0);
        const totalSales = outData.reduce((sum, item) => sum + (item.quantity * item.salePrice), 0);
        const totalProfit = outData.reduce((sum, item) => sum + (item.profit || 0), 0);

        results.innerHTML = `
            <div class="dashboard-grid" style="margin-top:20px;">
                <div class="stat-card">
                    <div class="stat-label">Purchases</div>
                    <div class="stat-value">${Utils.formatCurrency(totalPurchases)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Sales</div>
                    <div class="stat-value">${Utils.formatCurrency(totalSales)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Profit</div>
                    <div class="stat-value ${totalProfit > 0 ? 'text-success' : 'text-danger'}">${Utils.formatCurrency(totalProfit)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Net Balance</div>
                    <div class="stat-value ${(totalSales - totalPurchases) > 0 ? 'text-success' : 'text-danger'}">${Utils.formatCurrency(totalSales - totalPurchases)}</div>
                </div>
            </div>

            <div class="card">
                <div class="card-title"><i class="fas fa-shopping-cart"></i> Purchases (${inData.length})</div>
                <div class="table-responsive">
                    <table>
                        <thead><tr><th>Date</th><th>Vendor</th><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
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
                            ${inData.length === 0 ? '<tr><td colspan="5" class="table-empty"><i class="fas fa-inbox"></i>No purchases</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card">
                <div class="card-title"><i class="fas fa-chart-line"></i> Sales (${outData.length})</div>
                <div class="table-responsive">
                    <table>
                        <thead><tr><th>Date</th><th>Customer</th><th>Item</th><th>Qty</th><th>Total</th><th>Profit</th></tr></thead>
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
                            ${outData.length === 0 ? '<tr><td colspan="6" class="table-empty"><i class="fas fa-inbox"></i>No sales</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    _exportDailyReport() {
        const start = document.getElementById('reportStart')?.value || '';
        const end = document.getElementById('reportEnd')?.value || '';
        if (!start || !end) {
            Utils.toast('Please select date range', 'warning');
            return;
        }

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
                Total: item.quantity * item.purchasePrice
            })),
            ...outData.map(item => ({
                Type: 'Sale',
                Date: Utils.formatDate(item.createdAt, 'date'),
                Party: item.customerName,
                Item: item.itemName,
                Quantity: item.quantity,
                Total: item.quantity * item.salePrice
            }))
        ];

        if (allData.length === 0) {
            Utils.toast('No data to export', 'warning');
            return;
        }

        const headers = ['Type', 'Date', 'Party', 'Item', 'Quantity', 'Total'];
        const csv = Utils.arrayToCSV(allData, headers);
        Utils.downloadFile(csv, `daily_report_${start}_to_${end}.csv`, 'text/csv');
        Utils.toast('Report exported!', 'success');
    },

    // ============================================================
    // LEDGER
    // ============================================================
    _renderLedger() {
        const content = document.getElementById('pageContent');
        const ledger = DB.readAll(DB.TABLES.LEDGER);

        content.innerHTML = `
            <div class="flex-between mb-16">
                <h2 style="font-size:1.2rem;">Ledger</h2>
                <button class="btn btn-primary" onclick="App._showLedgerEntry()">
                    <i class="fas fa-plus"></i> New Entry
                </button>
            </div>

            <div class="card">
                <div class="flex flex-wrap gap-8">
                    <input type="text" id="ledgerSearch" class="form-control" style="flex:1;min-width:150px;" placeholder="Search party..." />
                    <select id="ledgerType" class="form-control" style="width:130px;">
                        <option value="all">All Types</option>
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>
                    <button class="btn btn-outline" onclick="App._filterLedger()"><i class="fas fa-filter"></i></button>
                </div>
            </div>

            <div class="card">
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Party</th><th>Type</th><th>Description</th><th>Amount</th><th>Balance</th><th>Actions</th></tr>
                        </thead>
                        <tbody id="ledgerTable">
                            ${ledger.map(item => `
                                <tr>
                                    <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                                    <td>${item.partyName}</td>
                                    <td><span class="badge ${item.type === 'credit' ? 'badge-success' : 'badge-danger'}">${item.type}</span></td>
                                    <td>${item.description || 'N/A'}</td>
                                    <td>${Utils.formatCurrency(item.amount)}</td>
                                    <td>${Utils.formatCurrency(item.balance || 0)}</td>
                                    <td>
                                        <button class="btn btn-danger btn-xs" onclick="App._deleteLedger('${item.id}')"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                            ${ledger.length === 0 ? '<tr><td colspan="7" class="table-empty"><i class="fas fa-inbox"></i>No entries</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        document.getElementById('ledgerSearch')?.addEventListener('input', Utils.debounce(this._filterLedger, 300));
        document.getElementById('ledgerType')?.addEventListener('change', this._filterLedger);
    },

    _filterLedger() {
        const search = document.getElementById('ledgerSearch')?.value || '';
        const type = document.getElementById('ledgerType')?.value || 'all';
        let data = DB.readAll(DB.TABLES.LEDGER);

        if (search) {
            const term = search.toLowerCase();
            data = data.filter(item => item.partyName?.toLowerCase().includes(term));
        }
        if (type !== 'all') {
            data = data.filter(item => item.type === type);
        }

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
                    <td>${Utils.formatCurrency(item.amount)}</td>
                    <td>${Utils.formatCurrency(item.balance)}</td>
                    <td>
                        <button class="btn btn-danger btn-xs" onclick="App._deleteLedger('${item.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `).join('') || '<tr><td colspan="7" class="table-empty"><i class="fas fa-inbox"></i>No matching entries</td></tr>';
        }
    },

    _showLedgerEntry(data = null) {
        const isEdit = !!data;
        const content = `
            <form id="ledgerForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Party <span class="required">*</span></label>
                        <input type="text" id="ledgerParty" class="form-control" placeholder="Party name" value="${data?.partyName || ''}" required>
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
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Save'}</button>
                    <button type="button" class="btn btn-outline modal-close-btn">Cancel</button>
                </div>
            </form>
        `;

        const modal = Utils.showModal(content, isEdit ? 'Edit Entry' : 'New Entry');

        document.getElementById('ledgerForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                partyName: document.getElementById('ledgerParty').value.trim(),
                type: document.getElementById('ledgerTypeInput').value,
                amount: parseFloat(document.getElementById('ledgerAmount').value) || 0,
                date: document.getElementById('ledgerDate').value,
                description: document.getElementById('ledgerDesc').value.trim()
            };

            if (!formData.partyName || !formData.amount) {
                Utils.toast('Please fill all required fields', 'error');
                return;
            }

            if (isEdit) {
                DB.update(DB.TABLES.LEDGER, data.id, formData);
                Utils.toast('Entry updated!', 'success');
            } else {
                DB.create(DB.TABLES.LEDGER, formData);
                Utils.toast('Entry saved!', 'success');
            }

            modal?.remove();
            this._renderLedger();
        });
    },

    async _deleteLedger(id) {
        const confirmed = await Utils.confirm('Delete this entry?', 'Delete');
        if (confirmed) {
            DB.delete(DB.TABLES.LEDGER, id);
            Utils.toast('Entry deleted!', 'success');
            this._renderLedger();
        }
    },

    // ============================================================
    // REPORTS
    // ============================================================
    _renderReports() {
        const content = document.getElementById('pageContent');

        content.innerHTML = `
            <h2 style="font-size:1.2rem;margin-bottom:16px;">Reports</h2>

            <div class="dashboard-grid">
                <div class="stat-card" onclick="App._showReport('purchase')" style="cursor:pointer;">
                    <div class="stat-top"><div class="stat-icon"><i class="fas fa-truck"></i></div></div>
                    <div class="stat-label">Purchase Report</div>
                </div>
                <div class="stat-card" onclick="App._showReport('sales')" style="cursor:pointer;">
                    <div class="stat-top"><div class="stat-icon green"><i class="fas fa-shopping-cart"></i></div></div>
                    <div class="stat-label">Sales Report</div>
                </div>
                <div class="stat-card" onclick="App._showReport('stock')" style="cursor:pointer;">
                    <div class="stat-top"><div class="stat-icon blue"><i class="fas fa-boxes"></i></div></div>
                    <div class="stat-label">Stock Report</div>
                </div>
                <div class="stat-card" onclick="App._showReport('profit')" style="cursor:pointer;">
                    <div class="stat-top"><div class="stat-icon orange"><i class="fas fa-chart-line"></i></div></div>
                    <div class="stat-label">Profit Report</div>
                </div>
            </div>

            <div id="reportOutput" class="card">
                <div class="table-empty"><i class="fas fa-file-alt"></i><p>Select a report type</p></div>
            </div>
        `;
    },

    _showReport(type) {
        const output = document.getElementById('reportOutput');
        if (!output) return;

        let data = [];
        let title = '';
        let headers = [];

        switch(type) {
            case 'purchase':
                data = DB.readAll(DB.TABLES.STOCK_IN);
                title = 'Purchase Report';
                headers = ['Date', 'Vendor', 'Item', 'Barcode', 'Quantity', 'Unit', 'Price', 'Total'];
                break;
            case 'sales':
                data = DB.readAll(DB.TABLES.STOCK_OUT);
                title = 'Sales Report';
                headers = ['Invoice', 'Date', 'Customer', 'Item', 'Quantity', 'Price', 'Total', 'Profit'];
                break;
            case 'stock':
                data = DB.getStockBalance();
                title = 'Stock Report';
                headers = ['Barcode', 'Item', 'Available', 'Unit', 'Stock Value', 'Profit'];
                break;
            case 'profit':
                data = DB.readAll(DB.TABLES.STOCK_OUT);
                title = 'Profit Report';
                headers = ['Invoice', 'Date', 'Customer', 'Item', 'Quantity', 'Price', 'Cost', 'Profit'];
                break;
        }

        if (data.length === 0) {
            output.innerHTML = `<div class="table-empty"><i class="fas fa-inbox"></i><p>No data available</p></div>`;
            return;
        }

        output.innerHTML = `
            <div class="flex-between mb-16">
                <h3>${title}</h3>
                <button class="btn btn-success btn-sm" onclick="App._exportReport('${type}')"><i class="fas fa-file-excel"></i> Export</button>
            </div>
            <div class="table-responsive">
                <table>
                    <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                    <tbody>
                        ${data.slice(0, 50).map(item => {
                            const row = headers.map(h => {
                                let val = item[h.toLowerCase()] || item[h] || '-';
                                if (typeof val === 'number') val = Utils.formatCurrency(val);
                                return `<td>${val}</td>`;
                            }).join('');
                            return `<tr>${row}</tr>`;
                        }).join('')}
                    </tbody>
                </table>
                ${data.length > 50 ? `<p class="text-muted mt-8">Showing 50 of ${data.length}</p>` : ''}
            </div>
        `;
    },

    _exportReport(type) {
        let data = [];
        switch(type) {
            case 'purchase': data = DB.readAll(DB.TABLES.STOCK_IN); break;
            case 'sales': data = DB.readAll(DB.TABLES.STOCK_OUT); break;
            case 'stock': data = DB.getStockBalance(); break;
            case 'profit': data = DB.readAll(DB.TABLES.STOCK_OUT); break;
        }

        if (data.length === 0) {
            Utils.toast('No data to export', 'warning');
            return;
        }

        const headers = Object.keys(data[0]).filter(h => !['id', 'createdAt', 'updatedAt'].includes(h));
        const csv = Utils.arrayToCSV(data, headers);
        Utils.downloadFile(csv, `${type}_report_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        Utils.toast('Report exported!', 'success');
    },

    // ============================================================
    // SEARCH
    // ============================================================
    _renderSearch() {
        const content = document.getElementById('pageContent');

        content.innerHTML = `
            <h2 style="font-size:1.2rem;margin-bottom:16px;">Global Search</h2>

            <div class="card">
                <div class="flex gap-8">
                    <input type="text" id="searchQuery" class="form-control" style="flex:1;" placeholder="Search items, vendors, customers..." autofocus>
                    <button class="btn btn-primary" onclick="App._performSearch()"><i class="fas fa-search"></i> Search</button>
                </div>
            </div>

            <div id="searchResults"></div>
        `;

        document.getElementById('searchQuery')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this._performSearch();
        });
    },

    _performSearch() {
        const query = document.getElementById('searchQuery')?.value.trim();
        const results = document.getElementById('searchResults');

        if (!query || !results) return;

        const stockIn = DB.readAll(DB.TABLES.STOCK_IN);
        const stockOut = DB.readAll(DB.TABLES.STOCK_OUT);
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

        const total = inResults.length + outResults.length;

        if (total === 0) {
            results.innerHTML = `
                <div class="card">
                    <div class="table-empty">
                        <i class="fas fa-search"></i>
                        <p>No results for "<strong>${query}</strong>"</p>
                    </div>
                </div>
            `;
            return;
        }

        results.innerHTML = `
            <h3 style="margin:16px 0;">Found ${total} results for "<strong>${query}</strong>"</h3>

            ${inResults.length > 0 ? `
                <div class="card">
                    <div class="card-title"><i class="fas fa-arrow-down text-success"></i> Stock IN (${inResults.length})</div>
                    <div class="table-responsive">
                        <table>
                            <thead><tr><th>Date</th><th>Vendor</th><th>Item</th><th>Barcode</th><th>Qty</th></tr></thead>
                            <tbody>
                                ${inResults.map(item => `
                                    <tr>
                                        <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                                        <td>${item.vendorName}</td>
                                        <td>${item.itemName}</td>
                                        <td><span class="badge badge-info">${item.barcode}</span></td>
                                        <td>${item.quantity}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            ` : ''}

            ${outResults.length > 0 ? `
                <div class="card">
                    <div class="card-title"><i class="fas fa-arrow-up text-danger"></i> Stock OUT (${outResults.length})</div>
                    <div class="table-responsive">
                        <table>
                            <thead><tr><th>Date</th><th>Customer</th><th>Item</th><th>Invoice</th><th>Qty</th></tr></thead>
                            <tbody>
                                ${outResults.map(item => `
                                    <tr>
                                        <td>${Utils.formatDate(item.createdAt, 'date')}</td>
                                        <td>${item.customerName}</td>
                                        <td>${item.itemName}</td>
                                        <td><span class="badge badge-info">${item.invoiceNumber}</span></td>
                                        <td>${item.quantity}</td>
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
        const config = Utils.getSupabaseConfig();

        content.innerHTML = `
            <h2 style="font-size:1.2rem;margin-bottom:16px;">Settings</h2>

            <div class="card">
                <h3 class="card-title"><i class="fas fa-building"></i> Company Settings</h3>
                <form id="settingsForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Company Name</label>
                            <input type="text" id="setCompanyName" class="form-control" value="${settings.companyName || ''}" />
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="text" id="setPhone" class="form-control" value="${settings.phone || ''}" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <input type="text" id="setAddress" class="form-control" value="${settings.address || ''}" />
                    </div>
                    <div class="form-row-3">
                        <div class="form-group">
                            <label>Tax Rate (%)</label>
                            <input type="number" id="setTax" class="form-control" value="${settings.taxRate || 0}" min="0" max="100" step="0.1" />
                        </div>
                        <div class="form-group">
                            <label>Currency</label>
                            <select id="setCurrency" class="form-control">
                                <option value="PKR" ${settings.currency === 'PKR' ? 'selected' : ''}>PKR</option>
                                <option value="USD" ${settings.currency === 'USD' ? 'selected' : ''}>USD</option>
                                <option value="EUR" ${settings.currency === 'EUR' ? 'selected' : ''}>EUR</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Invoice Prefix</label>
                            <input type="text" id="setInvoicePrefix" class="form-control" value="${settings.invoicePrefix || 'INV-'}" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Footer Note</label>
                        <input type="text" id="setFooter" class="form-control" value="${settings.footerNote || ''}" />
                    </div>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Settings</button>
                </form>
            </div>

            <div class="card">
                <h3 class="card-title"><i class="fas fa-cloud"></i> Supabase Cloud Sync</h3>
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
                    <span class="badge ${Utils.isSupabaseConfigured() ? 'badge-success' : 'badge-danger'}">
                        ${Utils.isSupabaseConfigured() ? '✅ Configured' : '❌ Not Configured'}
                    </span>
                    <span class="badge ${navigator.onLine ? 'badge-success' : 'badge-danger'}">
                        ${navigator.onLine ? '🟢 Online' : '🔴 Offline'}
                    </span>
                </div>
                <form id="supabaseForm">
                    <div class="form-group">
                        <label>Supabase URL</label>
                        <input type="text" id="setSupabaseUrl" class="form-control" placeholder="https://your-project.supabase.co" value="${config.url || ''}" />
                    </div>
                    <div class="form-group">
                        <label>Supabase API Key</label>
                        <input type="password" id="setSupabaseKey" class="form-control" placeholder="Your supabase anon key" value="${config.key || ''}" />
                    </div>
                    <div class="flex gap-8">
                        <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save</button>
                        <button type="button" class="btn btn-success" onclick="SyncManager.forceSync()"><i class="fas fa-sync"></i> Test Sync</button>
                    </div>
                </form>
            </div>

            <div class="card">
                <h3 class="card-title"><i class="fas fa-users"></i> User Management</h3>
                <div class="table-responsive">
                    <table>
                        <thead><tr><th>Username</th><th>Name</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            ${Auth.getUsers().map(user => `
                                <tr>
                                    <td>${user.username}</td>
                                    <td>${user.name}</td>
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
            Utils.updateSettings({
                companyName: document.getElementById('setCompanyName').value.trim(),
                phone: document.getElementById('setPhone').value.trim(),
                address: document.getElementById('setAddress').value.trim(),
                taxRate: parseFloat(document.getElementById('setTax').value) || 0,
                currency: document.getElementById('setCurrency').value,
                invoicePrefix: document.getElementById('setInvoicePrefix').value.trim(),
                footerNote: document.getElementById('setFooter').value.trim()
            });
            Utils.toast('Settings saved!', 'success');
        });

        document.getElementById('supabaseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const url = document.getElementById('setSupabaseUrl').value.trim();
            const key = document.getElementById('setSupabaseKey').value.trim();

            if (url && key) {
                Utils.setSupabaseConfig(url, key);
                Utils.toast('Supabase configured!', 'success');
                SyncManager.init();
            } else {
                Utils.toast('Please enter both URL and Key', 'warning');
            }
        });
    },

    _showAddUser() {
        const content = `
            <form id="addUserForm">
                <div class="form-row">
                    <div class="form-group">
                        <label>Username <span class="required">*</span></label>
                        <input type="text" id="newUsername" class="form-control" placeholder="Username" required />
                    </div>
                    <div class="form-group">
                        <label>Password <span class="required">*</span></label>
                        <input type="password" id="newPassword" class="form-control" placeholder="Password" required />
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Name <span class="required">*</span></label>
                        <input type="text" id="newName" class="form-control" placeholder="Full name" required />
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="newEmail" class="form-control" placeholder="Email" />
                    </div>
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select id="newRole" class="form-control">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-actions">
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
                Utils.toast('User created!', 'success');
                modal?.remove();
                this._renderSettings();
            } catch (error) {
                Utils.toast(error.message, 'error');
            }
        });
    },

    async _deleteUser(id) {
        const confirmed = await Utils.confirm('Delete this user?', 'Delete');
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
            <h2 style="font-size:1.2rem;margin-bottom:16px;">Backup & Restore</h2>

            <div class="dashboard-grid">
                <div class="stat-card" onclick="App._createBackup()" style="cursor:pointer;">
                    <div class="stat-top"><div class="stat-icon"><i class="fas fa-download"></i></div></div>
                    <div class="stat-label">Create Backup</div>
                </div>
                <div class="stat-card" onclick="document.getElementById('restoreInput').click()" style="cursor:pointer;">
                    <div class="stat-top"><div class="stat-icon green"><i class="fas fa-upload"></i></div></div>
                    <div class="stat-label">Restore Backup</div>
                    <input type="file" id="restoreInput" accept=".json" style="display:none;" />
                </div>
                <div class="stat-card" onclick="App._exportExcel()" style="cursor:pointer;">
                    <div class="stat-top"><div class="stat-icon blue"><i class="fas fa-file-excel"></i></div></div>
                    <div class="stat-label">Export Excel</div>
                </div>
                <div class="stat-card" onclick="App._resetData()" style="cursor:pointer;">
                    <div class="stat-top"><div class="stat-icon red"><i class="fas fa-trash"></i></div></div>
                    <div class="stat-label">Reset All Data</div>
                </div>
            </div>

            <div class="card">
                <h3 class="card-title"><i class="fas fa-info-circle"></i> Backup Info</h3>
                <div class="flex flex-wrap gap-16">
                    <div><strong>Records:</strong> ${Object.values(DB.TABLES).reduce((sum, table) => sum + DB.readAll(table).length, 0)}</div>
                    <div><strong>Last Backup:</strong> ${localStorage.getItem('krt_last_backup') || 'Never'}</div>
                    <div><strong>Storage:</strong> ${this._getStorageSize()}</div>
                    <div><strong>Pending Sync:</strong> ${DB.getPendingSyncCount()}</div>
                </div>
            </div>
        `;

        document.getElementById('restoreInput')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this._restoreBackup(file);
        });
    },

    _createBackup() {
        const data = DB.exportAll();
        data._metadata = {
            exportedAt: new Date().toISOString(),
            version: '2.0',
            company: Utils.getSettings().companyName,
            records: Object.values(data).reduce((sum, arr) => sum + arr.length, 0)
        };
        const json = JSON.stringify(data, null, 2);
        Utils.downloadFile(json, `krt_backup_${new Date().toISOString().split('T')[0]}.json`, 'application/json');
        localStorage.setItem('krt_last_backup', new Date().toLocaleString());
        Utils.toast('Backup created!', 'success');
        this._renderBackup();
    },

    _restoreBackup(file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const confirmed = await Utils.confirm('This will replace all data. Continue?', 'Restore');
                if (confirmed) {
                    DB.importAll(data);
                    Utils.toast('Backup restored!', 'success');
                    this._renderBackup();
                }
            } catch (error) {
                Utils.toast('Invalid backup file', 'error');
            }
        };
        reader.readAsText(file);
    },

    _exportExcel() {
        const data = DB.exportAll();
        let allData = [];
        Object.keys(data).forEach(table => {
            data[table].forEach(item => allData.push({ ...item, _table: table }));
        });

        if (allData.length === 0) {
            Utils.toast('No data to export', 'warning');
            return;
        }

        const headers = ['_table', ...Object.keys(allData[0]).filter(k => k !== '_table')];
        const csv = Utils.arrayToCSV(allData, headers);
        Utils.downloadFile(csv, `krt_export_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
        Utils.toast('Data exported!', 'success');
    },

    async _resetData() {
        const confirmed = await Utils.confirm('⚠️ Delete ALL data?', 'Reset');
        if (confirmed) {
            const doubleConfirm = await Utils.confirm('⚠️ Cannot be undone!', 'Final Warning');
            if (doubleConfirm) {
                DB.clearAll();
                Auth.init();
                Utils.toast('Data reset!', 'success');
                window.location.reload();
            }
        }
    },

    _getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length * 2;
            }
        }
        if (total < 1024) return total + ' B';
        if (total < 1048576) return (total / 1024).toFixed(2) + ' KB';
        return (total / 1048576).toFixed(2) + ' MB';
    }
};

// ============================================================
// INITIALIZE
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 KRT TRADERS ERP v2.0');
    console.log('📡 Supabase URL:', SUPABASE_CONFIG.URL);
    console.log('🔑 Supabase Key:', SUPABASE_CONFIG.API_KEY.substring(0, 20) + '...');
    
    // Initialize Auth
    Auth.init();
    
    // Expose globals
    window.App = App;
    window.Utils = Utils;
    window.DB = DB;
    window.Auth = Auth;
    window.SyncManager = SyncManager;
    
    console.log('✅ System ready!');
});
