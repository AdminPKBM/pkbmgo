// assets/script.js

// GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT ANDA
const SPREADSHEET_URL_GET = 'https://script.google.com/macros/s/AKfycbz1y-CN1FzNtd2ZrdO28mKKi2kcKpyGBC2jZaRqZJ31oqN2Het7cpSnvyE8HENAEtEF/exec';
const SPREADSHEET_URL_POST = 'https://script.google.com/macros/s/AKfycbz1y-CN1FzNtd2ZrdO28mKKi2kcKpyGBC2jZaRqZJ31oqN2Het7cpSnvyE8HENAEtEF/exec';

/**
 * Cek apakah pengguna sudah login. Jika tidak, redirect ke halaman login.
 * Fungsi ini harus dipanggil di setiap halaman yang dilindungi.
 */
function checkLogin() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'index.html';
    }
}

/**
 * Cek apakah pengguna adalah admin. Jika tidak, redirect ke dashboard.
 * Khusus untuk halaman yang hanya bisa diakses admin.
 */
function checkAdminAccess() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            alert('Akses ditolak. Anda bukan admin.');
            window.location.href = 'dashboard.html';
        }
    } catch (e) {
        window.location.href = 'index.html';
    }
}

/**
 * Mendapatkan data pengguna dari localStorage.
 * @returns {object|null} Objek pengguna atau null jika tidak ada.
 */
function getUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        return null;
    }
}

/**
 * Fungsi untuk Logout.
 */
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

/**
 * Render sidebar navigasi. Menampilkan/menyembunyikan link Admin Panel berdasarkan role.
 */
function renderSidebar(activePage) {
    const user = getUser();
    const isAdmin = user && user.role === 'admin';

    const sidebarHTML = `
        <h2>Platform Belajar</h2>
        <ul>
            <li><a href="dashboard.html" class="${activePage === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
            <li><a href="pembelajaran.html" class="${activePage === 'pembelajaran' ? 'active' : ''}">Pembelajaran</a></li>
            <li><a href="tugas.html" class="${activePage === 'tugas' ? 'active' : ''}">Tugas</a></li>
            <li><a href="absensi.html" class="${activePage === 'absensi' ? 'active' : ''}">Absensi</a></li>
            <li><a href="chatbot.html" class="${activePage === 'chatbot' ? 'active' : ''}">Chatbot AI</a></li>
            <li><a href="forum.html" class="${activePage === 'forum' ? 'active' : ''}">Forum</a></li>
            ${isAdmin ? `<li><a href="admin-panel.html" class="${activePage === 'admin-panel' ? 'active' : ''}">Admin Panel</a></li>` : ''}
        </ul>
        <button onclick="logout()" class="logout-btn">Logout</button>
    `;
    document.querySelector('nav.sidebar').innerHTML = sidebarHTML;
}

/**
 * Contoh fungsi untuk mengambil data dari Google Sheet via Apps Script.
 * @param {string} sheetName Nama sheet yang ingin diakses.
 * @returns {Promise<any>}
 */
async function fetchDataFromSheet(sheetName) {
    const url = `${SPREADSHEET_URL_GET}?action=read&sheet=${sheetName}`;
    console.log(`Fetching data from: ${url}`);
    // Untuk demo, kita kembalikan data palsu. Hapus ini saat sudah ada URL asli.
    if (sheetName === 'absensi') return Promise.resolve([{nama: 'Siswa Demo', waktu: new Date().toLocaleString(), status: 'Hadir'}]);
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data from Spreadsheet:', error);
        alert('Gagal mengambil data dari server. Lihat console untuk detail.');
        return null;
    }
}

/**
 * Contoh fungsi untuk mengirim data ke Google Sheet via Apps Script.
 * @param {string} sheetName Nama sheet tujuan.
 * @param {object} data Objek data yang akan dikirim.
 * @returns {Promise<any>}
 */
async function postDataToSheet(sheetName, data) {
    const payload = {
        action: 'write',
        sheet: sheetName,
        data: data
    };
    console.log('Posting data:', payload);
    // Untuk demo, kita tampilkan alert. Hapus ini saat sudah ada URL asli.
    alert(`Data akan dikirim ke sheet "${sheetName}":\n${JSON.stringify(data)}`);
    return Promise.resolve({status: 'success', message: 'Data berhasil disimulasikan.'});

    try {
        const response = await fetch(SPREADSHEET_URL_POST, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // Apps Script seringkali lebih mudah menangani text/plain
            },
            mode: 'no-cors' // Penting jika Web App Anda tidak di-deploy dengan benar untuk CORS
        });
        // Karena mode 'no-cors', kita tidak bisa membaca response. Jadi kita anggap sukses.
        console.log('Data sent to spreadsheet');
        return { status: 'success' };
    } catch (error) {
        console.error('Error posting data to Spreadsheet:', error);
        alert('Gagal mengirim data ke server. Lihat console untuk detail.');
        return null;
    }
}
