const API_BASE = 'http://localhost:5000/api';

// =============================================
// AUTH STATE & GLOBAL INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if language is selected, redirect if not (except on language page itself)
    if (!localStorage.getItem('language') && !window.location.pathname.includes('language.html')) {
        window.location.href = 'language.html';
        return;
    }

    // Apply translations
    if (typeof applyTranslations === 'function') {
        applyTranslations();
    }

    // Language toggle button
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.textContent = typeof t === 'function' ? t('changeLang') : '🌐';
        langBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof toggleLanguage === 'function') toggleLanguage();
        });
    }

    const token = localStorage.getItem('token');
    if (document.getElementById('navLogin')) {
        if (token) {
            document.getElementById('navLogin').style.display = 'none';
            document.getElementById('navLogout').style.display = 'inline';
            document.getElementById('navTickets').style.display = 'inline';
            if (localStorage.getItem('role') === 'admin' && localStorage.getItem('email') === 'jeganbhudeva23@gmail.com') {
                document.getElementById('navAdmin').style.display = 'inline';
            }
        }
    }

    window.addEventListener('storage', (e) => {
        if (e.key === 'movieAdded' && document.getElementById('moviesGrid')) {
            loadMovies();
        }
    });

    if (document.getElementById('navLogout')) {
        document.getElementById('navLogout').addEventListener('click', (e) => {
            e.preventDefault();
            const wasAdmin = localStorage.getItem('role') === 'admin';
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('role');
            localStorage.removeItem('email');
            // Redirect admin back to login, regular users to homepage
            window.location.href = wasAdmin ? 'login.html' : 'index.html';
        });
    }

    // Forms
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.userId);
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('email', data.email);
                    window.location.href = 'index.html';
                } else {
                    alert(data.error || t('loginFailed'));
                }
            } catch (err) {
                console.error(err);
                alert(t('errorOccurred'));
            }
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const res = await fetch(`${API_BASE}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                if (res.ok) {
                    alert(t('signupSuccess'));
                    window.location.href = 'login.html';
                } else {
                    const data = await res.json();
                    alert(data.error || t('signupFailed'));
                }
            } catch (err) {
                console.error(err);
                alert(t('errorOccurred'));
            }
        });
    }
    
    // Search
    const searchBtn = document.getElementById('searchBtn');
    if(searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = document.getElementById('searchInput').value;
            loadMovies(query);
        });
    }
});

// =============================================
// HOME PAGE - LOAD MOVIES
// =============================================
async function loadMovies(search = '') {
    const grid = document.getElementById('moviesGrid');
    if (!grid) return;
    
    grid.innerHTML = `<p>${t('loadingMovies')}</p>`;
    
    try {
        const url = search ? `${API_BASE}/movies?search=${encodeURIComponent(search)}` : `${API_BASE}/movies`;
        const res = await fetch(url);
        const data = await res.json();
        const movies = data.movies !== undefined ? data.movies : data;
        
        grid.innerHTML = '';
        if(movies.length === 0) {
            grid.innerHTML = `<p>${t('noMoviesFound')}</p>`;
            return;
        }

        movies.forEach(movie => {
            // Tamil Dubbed Rule
            let displayLang = movie.language;
            if (displayLang !== 'Tamil' && !displayLang.includes('Dubbed')) {
                displayLang = `${displayLang} - Tamil Dubbed Version`;
            }

            const card = document.createElement('div');
            card.className = 'movie-card';
            const releaseDateStr = movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : 'N/A';
            card.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" style="cursor:pointer;" onclick="event.stopPropagation(); window.location.href='movie-details.html?id=${movie._id}'">
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:5px;">${displayLang} | ${releaseDateStr}</div>
                    <div class="movie-rating">⭐ ${movie.rating}</div>
                    <div class="movie-desc">${movie.description}</div>
                    <button class="btn" style="width:100%; margin-top:10px; cursor:pointer;" onclick="event.stopPropagation(); window.location.href='movie-details.html?id=${movie._id}'">${t('bookTicket')}</button>
                </div>
            `;
            card.addEventListener('click', () => {
                window.location.href = `movie-details.html?id=${movie._id}`;
            });
            grid.appendChild(card);
        });
    } catch (err) {
        grid.innerHTML = `<p>${t('failedToLoadMovies')}</p>`;
    }
}

// =============================================
// MOVIE DETAILS PAGE
// =============================================
async function loadMovieDetails() {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');
    if (!movieId) return;

    try {
        const res = await fetch(`${API_BASE}/movies/${movieId}`);
        const movie = await res.json();
        
        if (res.ok) {
            let displayLang = movie.language;
            if (displayLang !== 'Tamil' && !displayLang.includes('Dubbed')) {
                displayLang = `${displayLang} - Tamil Dubbed Version`;
            }
            document.getElementById('movieTitle').textContent = `${movie.title} (${displayLang})`;
            document.getElementById('moviePoster').src = movie.poster;
            document.getElementById('movieRating').textContent = `⭐ ${movie.rating}`;
            document.getElementById('movieReleaseDate').textContent = `${t('releaseDate')}: ${new Date(movie.releaseDate).toLocaleDateString()}`;
            document.getElementById('movieDesc').textContent = movie.description;
            document.getElementById('movieHero').style.backgroundImage = `linear-gradient(to right, rgba(15,23,42,1) 30%, rgba(15,23,42,0.4)), url('${movie.poster}')`;
            
            // Store temporarily for booking
            localStorage.setItem('currentMovieId', movie._id);
            localStorage.setItem('currentMovieName', movie.title);
            localStorage.setItem('currentMoviePoster', movie.poster);
        }
    } catch (err) {
        console.error(err);
    }
}

// =============================================
// ALL 32 TAMIL NADU DISTRICTS
// =============================================
const districtsByState = {
    "Tamil Nadu": [
        "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli",
        "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Dindigul",
        "Kallakurichi", "Kanchipuram", "Thanjavur", "Villupuram", "Tiruppur",
        "Namakkal", "Cuddalore", "Sivagangai", "Virudhunagar", "Ramanathapuram",
        "Krishnagiri", "Dharmapuri", "Nilgiris", "Ariyalur", "Perambalur",
        "Tenkasi", "Ranipet", "Tirupathur", "Mayiladuthurai", "Nagapattinam",
        "Pudukkottai", "Karur"
    ]
};

function setupLocationDropdowns() {
    const stateSelect = document.getElementById('stateSelect');
    const districtSelect = document.getElementById('districtSelect');
    const nextBtn = document.getElementById('nextToTheatreBtn');
    
    if(!districtSelect) return;

    // Show TN districts by default
    districtSelect.innerHTML = `<option value="">${t('selectDistrictOption')}</option>`;
    districtsByState["Tamil Nadu"].forEach(d => {
        districtSelect.innerHTML += `<option value="${d}">${d}</option>`;
    });

    if(stateSelect) {
        stateSelect.addEventListener('change', () => {
            const state = stateSelect.value || "Tamil Nadu";
            districtSelect.innerHTML = `<option value="">${t('selectDistrictOption')}</option>`;
            if(districtsByState[state]) {
                districtsByState[state].forEach(d => {
                    districtSelect.innerHTML += `<option value="${d}">${d}</option>`;
                });
            }
        });
    }

    nextBtn.addEventListener('click', () => {
        const state = stateSelect.value;
        const district = districtSelect.value;
        if (!state || !district) {
            alert(t('selectBothAlert'));
            return;
        }
        localStorage.setItem('bookingState', state);
        localStorage.setItem('bookingDistrict', district);
        window.location.href = `theatre.html?district=${encodeURIComponent(district)}&state=${encodeURIComponent(state)}`;
    });
}

// =============================================
// THEATRE PAGE
// =============================================
async function loadTheatres() {
    const params = new URLSearchParams(window.location.search);
    const district = params.get('district') || localStorage.getItem('bookingDistrict');
    const state = params.get('state') || localStorage.getItem('bookingState');
    const tList = document.getElementById('theatreList');
    
    if (!district || !tList) return;

    // Header Info
    const tMoviePoster = document.getElementById('theatreMoviePoster');
    const tMovieTitle = document.getElementById('theatreMovieTitle');
    const tLoc = document.getElementById('theatreLoc');
    if(tMoviePoster) tMoviePoster.src = localStorage.getItem('currentMoviePoster') || '';
    if(tMovieTitle) tMovieTitle.textContent = localStorage.getItem('currentMovieName') || t('selectMovie');
    if(tLoc) tLoc.textContent = `${localStorage.getItem('bookingState')} - ${localStorage.getItem('bookingDistrict')}`;

    tList.innerHTML = `<p>${t('searchingTheatres')}</p>`;

    try {
        const url = `${API_BASE}/theatres?district=${encodeURIComponent(district)}${state ? `&state=${encodeURIComponent(state)}` : ''}`;
        console.log("Fetching theatres from:", url);
        const res = await fetch(url);
        const theatres = await res.json();
        console.log("Theatres received:", theatres);
        
        tList.innerHTML = '';
        if(!theatres || theatres.length === 0) {
            tList.innerHTML = `<p>${t('noTheatresFound')}</p>`;
            return;
        }

        theatres.forEach(t_item => {
            const card = document.createElement('div');
            card.className = 'theatre-card';
            
            // Extract all unique timings from all screens
            let allTimings = [];
            if (t_item.screens && t_item.screens.length > 0) {
                t_item.screens.forEach(s => {
                    if (s.timings) allTimings = [...allTimings, ...s.timings];
                });
            }
            // Fallback
            if (allTimings.length === 0 && t_item.showTimings) allTimings = t_item.showTimings;
            
            const uniqueTimings = [...new Set(allTimings)];

            // Screen count badge
            const screenCount = t_item.screens ? t_item.screens.length : 0;
            const screenBadge = screenCount > 0 
                ? `<span style="display:inline-block; padding:3px 10px; background:rgba(225,29,72,0.15); color:var(--primary); border-radius:20px; font-size:0.8rem; font-weight:600; margin-left:8px;">${screenCount} ${screenCount === 1 ? 'Screen' : 'Screens'}</span>` 
                : '';

            let timingsHtml = '';
            uniqueTimings.forEach(time => {
                timingsHtml += `<span class="show-timing" onclick="selectShow('${t_item._id}', '${t_item.name.replace(/'/g, "\\'")}', '${time}')">${time}</span>`;
            });

            card.innerHTML = `
                <div class="theatre-info">
                    <h3>${t_item.name} ${screenBadge}</h3>
                    <p style="color:var(--text-muted); margin-top:5px;">${t_item.district}</p>
                    <div style="margin-top: 15px;">
                        ${timingsHtml || t('noShowsAvailable')}
                    </div>
                </div>
            `;
            tList.appendChild(card);
        });
    } catch (err) {
        console.error("Fetch Theatre Error:", err);
        tList.innerHTML = `<p>${t('failedToLoadTheatres')}</p>`;
    }
}

function selectShow(theatreId, theatreName, time) {
    if(!localStorage.getItem('token')) {
        alert(t('loginFirstAlert'));
        window.location.href = "login.html";
        return;
    }
    localStorage.setItem('currentTheatreId', theatreId);
    localStorage.setItem('currentTheatreName', theatreName);
    localStorage.setItem('currentShowTiming', time);
    window.location.href = 'screens.html'; // Go to screens step
}

// =============================================
// SCREENS PAGE
// =============================================
async function loadScreens() {
    const theatreId = localStorage.getItem('currentTheatreId');
    const movieId = localStorage.getItem('currentMovieId');
    const sList = document.getElementById('screensList');
    if(!theatreId || !sList) return;

    document.getElementById('screenTheatreName').textContent = localStorage.getItem('currentTheatreName');
    document.getElementById('screenMoviePoster').src = localStorage.getItem('currentMoviePoster') || '';
    
    try {
        const res = await fetch(`${API_BASE}/theatres`);
        const theatres = await res.json();
        const theatre = theatres.find(t_item => t_item._id === theatreId);
        
        if(!theatre) return;

        // Show movie info header
        const movieRes = await fetch(`${API_BASE}/movies/${movieId}`);
        const movie = await movieRes.json();
        document.getElementById('screenMovieTitle').textContent = movie.title;
        document.getElementById('screenMoviePoster').src = movie.poster;

        sList.innerHTML = '';
        const screens = theatre.screens || [
            { name: "Screen 1", timings: ["10:00 AM", "06:00 PM"] },
            { name: "Screen 2", timings: ["01:00 PM", "10:00 PM"] }
        ];

        screens.forEach(s => {
            const card = document.createElement('div');
            card.className = 'theatre-card';
            card.innerHTML = `
                <div class="theatre-info">
                    <h3>${s.name}</h3>
                    <p style="color:var(--text-muted);">${t('capacity')}: 60 ${t('seats')} | ${t('nowPlaying')}: <b>${s.movieTitle || movie.title}</b></p>
                    <div style="margin-top:15px;">
                        ${s.timings ? s.timings.map(tm => `<span class="show-timing ${tm === localStorage.getItem('currentShowTiming') ? 'selected' : ''}" onclick="selectScreen('${s.name}')">${tm}</span>`).join('') : `<span class="show-timing" onclick="selectScreen('${s.name}')">${t('proceedToSeats')}</span>`}
                    </div>
                </div>
                <button class="btn" style="width:auto; padding:10px 24px;" onclick="selectScreen('${s.name}')">${t('selectScreen')} </button>
            `;
            sList.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        sList.innerHTML = `<p>${t('failedToLoadScreens')}</p>`;
    }
}

function selectScreen(screenName) {
    localStorage.setItem('currentScreenName', screenName);
    window.location.href = 'seats.html';
}

// =============================================
// SEATS PAGE
// =============================================
let selectedSeats = [];
const TICKET_PRICE = 150;

async function generateSeats() {
    const grid = document.getElementById('seatGrid');
    if (!grid) return;

    // Header Info
    const sMoviePoster = document.getElementById('seatMoviePoster');
    const sMovieTitle = document.getElementById('seatMovieTitle');
    const sInfo = document.getElementById('seatTheatreInfo');
    if(sMoviePoster) sMoviePoster.src = localStorage.getItem('currentMoviePoster') || '';
    if(sMovieTitle) sMovieTitle.textContent = localStorage.getItem('currentMovieName') || 'Movie';
    if(sInfo) sInfo.textContent = `${localStorage.getItem('currentTheatreName')} | ${localStorage.getItem('currentScreenName')} | ${localStorage.getItem('currentShowTiming')}`;

    // Get parameters for fetching booked seats
    const movieId = localStorage.getItem('currentMovieId');
    const theatreId = localStorage.getItem('currentTheatreId');
    const screenName = localStorage.getItem('currentScreenName');
    const showTiming = localStorage.getItem('currentShowTiming');

    let bookedSeats = [];
    try {
        const res = await fetch(`${API_BASE}/bookings/booked-seats?movieId=${movieId}&theatreId=${theatreId}&screenName=${encodeURIComponent(screenName)}&showTiming=${encodeURIComponent(showTiming)}`);
        if (res.ok) {
            bookedSeats = await res.json();
        }
    } catch (err) {
        console.error("Error fetching booked seats:", err);
    }

    grid.innerHTML = '';
    for(let i=0; i<6; i++) {
        const row = document.createElement('div');
        row.className = 'seat-row';
        for(let j=1; j<=10; j++) {
            const seatId = `${String.fromCharCode(65+i)}${j}`;
            const seat = document.createElement('div');
            seat.className = 'seat';
            
            // Mark as booked if seat is in bookedSeats array
            const isBooked = bookedSeats.includes(seatId);
            if (isBooked) {
                seat.classList.add('booked');
            } else {
                seat.addEventListener('click', () => toggleSeatSelection(seat, seatId));
            }
            row.appendChild(seat);
        }
        grid.appendChild(row);
    }

    const confirmBtn = document.getElementById('confirmBookingBtn');
    if(confirmBtn) {
        // Clone and replace to avoid multiple listeners if re-rendered
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
        newBtn.addEventListener('click', confirmBooking);
    }
}

function toggleSeatSelection(seatEle, seatId) {
    if (seatEle.classList.contains('booked')) return;
    
    if (seatEle.classList.contains('selected')) {
        seatEle.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== seatId);
    } else {
        seatEle.classList.add('selected');
        selectedSeats.push(seatId);
    }
    
    updateBookingSummary();
}

function updateBookingSummary() {
    const slist = document.getElementById('selectedSeatsList');
    const price = document.getElementById('totalPrice');
    
    if(selectedSeats.length === 0) {
        slist.textContent = t('none');
        price.textContent = '0';
    } else {
        slist.textContent = selectedSeats.join(', ');
        price.textContent = selectedSeats.length * TICKET_PRICE;
    }
}

async function confirmBooking() {
    if(selectedSeats.length === 0) {
        alert(t('selectSeatAlert'));
        return;
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if(!token || !userId) {
        alert(t('loginFirstGeneral'));
        return;
    }

    const payload = {
        userId,
        movieId: localStorage.getItem('currentMovieId'),
        movieName: localStorage.getItem('currentMovieName'),
        theatreId: localStorage.getItem('currentTheatreId'),
        theatreName: localStorage.getItem('currentTheatreName'),
        screenName: localStorage.getItem('currentScreenName'),
        showTiming: localStorage.getItem('currentShowTiming'),
        state: localStorage.getItem('bookingState'),
        district: localStorage.getItem('bookingDistrict'),
        seats: selectedSeats,
        totalPrice: selectedSeats.length * TICKET_PRICE
    };

    try {
        const res = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if(res.ok) {
            alert(t('bookingConfirmed'));
            generateSeats(); 
            window.location.href = 'mytickets.html';
        } else {
            const data = await res.json();
            alert(data.error || t('bookingFailed'));
        }
    } catch(err) {
        console.error(err);
        alert(t('errorInBooking'));
    }
}

// =============================================
// TICKETS PAGE
// =============================================
async function loadTickets() {
    const userId = localStorage.getItem('userId');
    const tList = document.getElementById('ticketsList');
    if(!userId || !tList) return;

    tList.innerHTML = `<p>${t('loadingTickets')}</p>`;

    try {
        const res = await fetch(`${API_BASE}/bookings/user/${userId}`);
        const tickets = await res.json();
        
        tList.innerHTML = '';
        if(tickets.length === 0) {
            tList.innerHTML = `<p>${t('noBookings')}</p>`;
            return;
        }

        tickets.forEach(tick => {
            const ticketCard = document.createElement('div');
            ticketCard.className = 'ticket-card';
            ticketCard.id = `ticket-${tick.bookingId}`;
            ticketCard.innerHTML = `
                <div class="ticket-info">
                    <h3>${tick.movieName || 'Movie Title'}</h3>
                    <p>${t('theatre')}: ${tick.theatreName || 'Unknown'} - ${tick.district}</p>
                    <p>${t('screen')}: ${tick.screenName || 'N/A'} | ${t('time')}: ${tick.showTiming || 'N/A'}</p>
                    <p>${t('seats')}: ${tick.seats.join(', ')}</p>
                    <p>${t('totalPaid')}: ₹${tick.totalPrice}</p>
                    <p style="font-size:0.8rem; color:#888;">${t('bookingId')}: ${tick.bookingId}</p>
                </div>
                <div class="ticket-action" data-html2canvas-ignore>
                    <button class="btn" onclick="downloadTicket('ticket-${tick.bookingId}', '${tick.bookingId}')">${t('download')}</button>
                </div>
            `;
            tList.appendChild(ticketCard);
        });
    } catch (err) {
        console.error(err);
        tList.innerHTML = `<p>${t('failedToLoadTickets')}</p>`;
    }
}

window.downloadTicket = function(elementId, bId) {
    const el = document.getElementById(elementId);
    html2canvas(el, { backgroundColor: '#ffffff', scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.text("Showlix - Booking confirmation", 10, 10);
        pdf.addImage(imgData, 'PNG', 10, 20, pdfWidth - 20, pdfHeight - 20);
        pdf.save(`Showlix_Ticket_${bId}.pdf`);
    });
}

// =============================================
// ADMIN PAGE
// =============================================
function setupAdmin() {
    const role  = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    // Strict guard: must have a valid token, admin role, and the exact admin email.
    // Redirects to login (not index) so the admin can authenticate properly.
    if (!token || role !== 'admin' || email !== 'jeganbhudeva23@gmail.com') {
        window.location.href = 'login.html';
        return;
    }

    const mForm = document.getElementById('addMovieForm');
    const tForm = document.getElementById('addTheatreForm');
    const addScreenBtn = document.getElementById('addScreenBtn');
    const screensContainer = document.getElementById('screensContainer');

    if (addScreenBtn && screensContainer) {
        addScreenBtn.addEventListener('click', () => {
            const screenCount = screensContainer.querySelectorAll('.screen-config').length + 1;
            const screenDiv = document.createElement('div');
            screenDiv.className = 'screen-config';
            screenDiv.style = 'border: 1px solid #444; padding: 10px; margin-bottom: 10px; border-radius: 5px;';
            screenDiv.innerHTML = `
                <h4>Screen ${screenCount}</h4>
                <div class="form-group">
                    <label>${t('screenName')}</label>
                    <input type="text" class="sName" value="Screen ${screenCount}" required>
                </div>
                <div class="form-group">
                    <label>${t('showTimings')}</label>
                    <input type="text" class="sTimings" placeholder="10:00 AM, 01:00 PM, 06:00 PM" required>
                </div>
            `;
            screensContainer.appendChild(screenDiv);
        });
    }

    // Load existing items
    loadAdminLists();

    if(mForm) {
        mForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const payload = {
                title: document.getElementById('mTitle').value,
                poster: document.getElementById('mPoster').value,
                rating: parseFloat(document.getElementById('mRating').value),
                description: document.getElementById('mDesc').value,
                language: document.getElementById('mLanguage').value,
                releaseDate: document.getElementById('mReleaseDate').value
            };
            
            try {
                const res = await fetch(`${API_BASE}/movies`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    alert(t('movieAdded'));
                    mForm.reset();
                    loadAdminLists();
                } else {
                    alert(data.error || t('addMovieFailed'));
                }
            } catch(e) { 
                alert(t('addMovieFailed'));
            }
        });
    }

    if(tForm) {
        tForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const screenConfigs = document.querySelectorAll('.screen-config');
            const screens = [];
            
            screenConfigs.forEach(config => {
                const name = config.querySelector('.sName').value;
                const timingsStr = config.querySelector('.sTimings').value;
                const timings = timingsStr.split(',').map(t => t.trim());
                screens.push({ name, timings, seats: [] });
            });
            
            const payload = {
                name: document.getElementById('tName').value,
                district: document.getElementById('tDistrict').value,
                state: "Tamil Nadu",
                screens: screens
            };

            try {
                const res = await fetch(`${API_BASE}/theatres`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if(res.ok) {
                    alert(t('theatreAdded'));
                    tForm.reset();
                    // Reset screens to just one
                    screensContainer.innerHTML = `
                        <div class="screen-config" style="border: 1px solid #444; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                            <h4>Screen 1</h4>
                            <div class="form-group">
                                <label>${t('screenName')}</label>
                                <input type="text" class="sName" value="Screen 1" required>
                            </div>
                            <div class="form-group">
                                <label>${t('showTimings')}</label>
                                <input type="text" class="sTimings" placeholder="10:00 AM, 01:00 PM, 06:00 PM" required>
                            </div>
                        </div>
                    `;
                    loadAdminLists();
                } else {
                    alert(data.error || t('addTheatreFailed'));
                }
            } catch(e) { alert(t('addTheatreFailed')); }
        });
    }
}

async function loadAdminLists() {
    const movieManage = document.getElementById('movieManageList');
    const theatreManage = document.getElementById('theatreManageList');
    const token = localStorage.getItem('token');

    if(movieManage) {
        const res = await fetch(`${API_BASE}/movies`);
        const data = await res.json();
        const movies = data.movies !== undefined ? data.movies : data;
        const count = data.count !== undefined ? data.count : movies.length;
        
        movieManage.innerHTML = `<div style="font-weight:bold; font-size:1.1rem; margin-bottom:15px; color:#4caf50;">Total Movies Added: ${count}</div>` + 
        movies.map(m => `
            <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #333;">
                <span>${m.title}</span>
            </div>
        `).join('');
    }

    if(theatreManage) {
        const res = await fetch(`${API_BASE}/theatres`);
        const theatres = await res.json();
        theatreManage.innerHTML = theatres.map(t_item => `
            <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #333;">
                <span>${t_item.name}</span>
                <span style="color:var(--text-muted); font-size:0.85rem;">${t_item.district} (${t_item.screens ? t_item.screens.length : 0} screens)</span>
            </div>
        `).join('');
    }
}

// Removed delete functions as per requirements
