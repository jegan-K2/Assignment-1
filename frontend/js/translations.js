// ========================================
// SHOWLIX - Translation System
// Supports: English (en) & Tamil (ta)
// ========================================

const TRANSLATIONS = {
    // Navbar
    home: { en: "Home", ta: "முகப்பு" },
    myTickets: { en: "My Tickets", ta: "எனது டிக்கெட்டுகள்" },
    admin: { en: "Admin", ta: "நிர்வாகி" },
    login: { en: "Login", ta: "உள்நுழை" },
    logout: { en: "Logout", ta: "வெளியேறு" },

    // Hero / Index
    heroTitle: { en: "Unlimited Movies, Blockbuster Entertainment", ta: "வரம்பற்ற திரைப்படங்கள், சூப்பர்ஹிட் பொழுதுபோக்கு" },
    searchPlaceholder: { en: "Search for movies...", ta: "திரைப்படங்களைத் தேடுங்கள்..." },
    search: { en: "Search", ta: "தேடு" },
    trendingMovies: { en: "Trending Movies", ta: "டிரெண்டிங் திரைப்படங்கள்" },
    bookTicket: { en: "Book Ticket", ta: "டிக்கெட் முன்பதிவு" },
    loadingMovies: { en: "Loading movies...", ta: "திரைப்படங்கள் ஏற்றுகிறது..." },
    noMoviesFound: { en: "No movies found.", ta: "திரைப்படங்கள் இல்லை." },
    failedToLoadMovies: { en: "Failed to load movies.", ta: "திரைப்படங்களை ஏற்ற முடியவில்லை." },

    // Movie Details
    selectDistrict: { en: "Tamil Nadu - Select District", ta: "தமிழ்நாடு - மாவட்டம் தேர்வு செய்க" },
    state: { en: "State", ta: "மாநிலம்" },
    district: { en: "District", ta: "மாவட்டம்" },
    selectDistrictOption: { en: "Select District", ta: "மாவட்டம் தேர்வு செய்க" },
    next: { en: "Next", ta: "அடுத்து" },
    releaseDate: { en: "Release Date", ta: "வெளியீட்டு தேதி" },
    selectBothAlert: { en: "Please select both State and District.", ta: "மாநிலம் மற்றும் மாவட்டம் இரண்டையும் தேர்வு செய்க." },

    // Theatre
    availableTheatres: { en: "Available Theatres", ta: "கிடைக்கும் திரையரங்குகள்" },
    searchingTheatres: { en: "Searching for theatres...", ta: "திரையரங்குகளைத் தேடுகிறது..." },
    noTheatresFound: { en: "No theatres found in this location.", ta: "இந்த இடத்தில் திரையரங்குகள் இல்லை." },
    noShowsAvailable: { en: "No shows available", ta: "நிகழ்ச்சிகள் இல்லை" },
    failedToLoadTheatres: { en: "Failed to load theatres.", ta: "திரையரங்குகளை ஏற்ற முடியவில்லை." },
    selectMovie: { en: "Select Movie", ta: "திரைப்படம் தேர்வு செய்க" },

    // Screens
    selectScreen: { en: "Select Screen", ta: "திரை தேர்வு செய்க" },
    capacity: { en: "Capacity", ta: "இருக்கைகள்" },
    seats: { en: "Seats", ta: "இருக்கைகள்" },
    nowPlaying: { en: "Now Playing", ta: "இப்போது திரையிடப்படுகிறது" },
    proceedToSeats: { en: "Proceed to Seats", ta: "இருக்கைக்கு செல்ல" },
    loadingScreens: { en: "Loading screens...", ta: "திரைகள் ஏற்றுகிறது..." },
    failedToLoadScreens: { en: "Failed to load screens.", ta: "திரைகளை ஏற்ற முடியவில்லை." },

    // Seats
    screenThisWay: { en: "SCREEN THIS WAY", ta: "திரை இந்த பக்கம்" },
    bookingSummary: { en: "Booking Summary", ta: "முன்பதிவு சுருக்கம்" },
    seatsSelected: { en: "Seats Selected", ta: "தேர்ந்தெடுக்கப்பட்ட இருக்கைகள்" },
    none: { en: "None", ta: "எதுவுமில்லை" },
    totalPrice: { en: "Total Price", ta: "மொத்த விலை" },
    confirmBooking: { en: "Confirm Booking", ta: "முன்பதிவை உறுதிப்படுத்து" },
    loginFirstAlert: { en: "Please login first to book tickets.", ta: "டிக்கெட் முன்பதிவு செய்ய முதலில் உள்நுழையவும்." },
    selectSeatAlert: { en: "Please select at least one seat.", ta: "குறைந்தது ஒரு இருக்கையை தேர்வு செய்யவும்." },
    loginFirstGeneral: { en: "Please login first.", ta: "முதலில் உள்நுழையவும்." },
    bookingConfirmed: { en: "Booking Confirmed!", ta: "முன்பதிவு உறுதிப்படுத்தப்பட்டது!" },
    bookingFailed: { en: "Booking failed.", ta: "முன்பதிவு தோல்வியடைந்தது." },
    errorInBooking: { en: "Error in booking.", ta: "முன்பதிவில் பிழை." },

    // Login & Signup
    loginTitle: { en: "Login to Account", ta: "கணக்கில் உள்நுழைக" },
    email: { en: "Email", ta: "மின்னஞ்சல்" },
    password: { en: "Password", ta: "கடவுச்சொல்" },
    loginBtn: { en: "Login", ta: "உள்நுழை" },
    noAccount: { en: "Don't have an account?", ta: "கணக்கு இல்லை?" },
    signUp: { en: "Sign Up", ta: "பதிவு செய்" },
    signupTitle: { en: "Create an Account", ta: "கணக்கை உருவாக்கு" },
    signupBtn: { en: "Sign Up", ta: "பதிவு செய்" },
    haveAccount: { en: "Already have an account?", ta: "ஏற்கனவே கணக்கு உள்ளதா?" },
    signupSuccess: { en: "Signup successful! Please login.", ta: "பதிவு வெற்றி! தயவுசெய்து உள்நுழையவும்." },
    loginFailed: { en: "Login failed", ta: "உள்நுழைவு தோல்வி" },
    signupFailed: { en: "Signup failed", ta: "பதிவு தோல்வி" },
    errorOccurred: { en: "An error occurred. Please try again.", ta: "பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்." },

    // My Tickets
    myTicketsTitle: { en: "My Tickets", ta: "எனது டிக்கெட்டுகள்" },
    loadingTickets: { en: "Loading your tickets...", ta: "உங்கள் டிக்கெட்டுகள் ஏற்றுகிறது..." },
    noBookings: { en: "You have no bookings yet.", ta: "இதுவரை முன்பதிவுகள் இல்லை." },
    failedToLoadTickets: { en: "Failed to load tickets.", ta: "டிக்கெட்டுகளை ஏற்ற முடியவில்லை." },
    download: { en: "Download", ta: "பதிவிறக்கம்" },
    theatre: { en: "Theatre", ta: "திரையரங்கு" },
    screen: { en: "Screen", ta: "திரை" },
    time: { en: "Time", ta: "நேரம்" },
    totalPaid: { en: "Total Paid", ta: "மொத்தம் செலுத்தியது" },
    bookingId: { en: "Booking ID", ta: "முன்பதிவு எண்" },

    // Admin
    addMovie: { en: "Add New Movie", ta: "புதிய திரைப்படம் சேர்" },
    movieTitle: { en: "Movie Title", ta: "திரைப்பட பெயர்" },
    posterUrl: { en: "Poster Image URL", ta: "போஸ்டர் URL" },
    releaseDateLabel: { en: "Release Date", ta: "வெளியீட்டு தேதி" },
    rating: { en: "Rating", ta: "மதிப்பீடு" },
    language: { en: "Language", ta: "மொழி" },
    description: { en: "Description", ta: "விவரம்" },
    addMovieBtn: { en: "Add Movie", ta: "திரைப்படம் சேர்" },
    addTheatre: { en: "Add New Theatre", ta: "புதிய திரையரங்கு சேர்" },
    theatreName: { en: "Theatre Name", ta: "திரையரங்கு பெயர்" },
    districtLabel: { en: "District", ta: "மாவட்டம்" },
    screenName: { en: "Screen Name", ta: "திரை பெயர்" },
    showTimings: { en: "Show Timings (comma separated)", ta: "நிகழ்ச்சி நேரங்கள் (கமாவால் பிரிக்கவும்)" },
    addScreen: { en: "+ Add Another Screen", ta: "+ மற்றொரு திரை சேர்" },
    addTheatreBtn: { en: "Add Theatre", ta: "திரையரங்கு சேர்" },
    activeMovies: { en: "Active Movies", ta: "செயலில் உள்ள திரைப்படங்கள்" },
    activeTheatres: { en: "Active Theatres", ta: "செயலில் உள்ள திரையரங்குகள்" },
    movieAdded: { en: "Movie added successfully!", ta: "திரைப்படம் வெற்றிகரமாக சேர்க்கப்பட்டது!" },
    theatreAdded: { en: "Theatre added successfully!", ta: "திரையரங்கு வெற்றிகரமாக சேர்க்கப்பட்டது!" },
    addMovieFailed: { en: "Add movie failed", ta: "திரைப்படம் சேர்க்க தோல்வி" },
    addTheatreFailed: { en: "Failed to add theatre", ta: "திரையரங்கு சேர்க்க தோல்வி" },
    accessDenied: { en: "Access Denied: Only the owner can access this page.", ta: "அணுகல் மறுக்கப்பட்டது: உரிமையாளர் மட்டுமே இப்பக்கத்தை அணுகலாம்." },

    // Language
    changeLang: { en: "🌐 தமிழ்", ta: "🌐 English" },
};

// Get current language
function getLang() {
    return localStorage.getItem('language') || 'en';
}

// Get translated text
function t(key) {
    const lang = getLang();
    if (TRANSLATIONS[key]) {
        return TRANSLATIONS[key][lang] || TRANSLATIONS[key]['en'];
    }
    return key;
}

// Apply translations to elements with data-t attribute
function applyTranslations() {
    const lang = getLang();
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (TRANSLATIONS[key]) {
            el.textContent = TRANSLATIONS[key][lang] || TRANSLATIONS[key]['en'];
        }
    });
    document.querySelectorAll('[data-t-placeholder]').forEach(el => {
        const key = el.getAttribute('data-t-placeholder');
        if (TRANSLATIONS[key]) {
            el.placeholder = TRANSLATIONS[key][lang] || TRANSLATIONS[key]['en'];
        }
    });
}

// Toggle language
function toggleLanguage() {
    const current = getLang();
    const newLang = current === 'en' ? 'ta' : 'en';
    localStorage.setItem('language', newLang);
    applyTranslations();
    // Update the toggle button text
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) langBtn.textContent = t('changeLang');
    // Reload to re-render dynamic content
    window.location.reload();
}
