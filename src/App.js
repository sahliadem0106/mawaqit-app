import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Loader2, Search, Globe, Wifi, Phone, Mail, User, Calendar, Moon, Sun, Navigation, Linkedin } from 'lucide-react';

const PROXY_API_BASE = '/api';

export default function MawaqitApp() {
  const [location, setLocation] = useState(null);
  const [mosques, setMosques] = useState([]);
  const [selectedMosque, setSelectedMosque] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [language, setLanguage] = useState('en');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    getUserLocation();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const translations = {
    en: {
      title: "Mawaqit",
      subtitle: "Prayer Times & Mosques",
      yourLocation: "Your location",
      nearbyMosques: "Nearby Mosques",
      prayerTimes: "Prayer Times",
      within: "Within 1km of your location",
      selectMosque: "Select a mosque to view prayer times",
      today: "Today's Prayer Times",
      fajr: "Fajr",
      sunrise: "Sunrise",
      dhuhr: "Dhuhr",
      asr: "Asr",
      maghrib: "Maghrib",
      isha: "Isha",
      jumua: "Jumu'ah",
      adhan: "Adhan",
      iqama: "Iqama",
      contact: "Contact Information",
      phone: "Phone",
      email: "Email",
      website: "Website",
      facilities: "Facilities",
      away: "away",
      poweredBy: "Powered by Mawaqit",
      noMosques: "No mosques found nearby",
      errorTitle: "Error",
      makeProxy: "Make sure the proxy server is running",
      showMap: "Show Map",
      hideMap: "Hide Map",
      getDirections: "Get Directions",
      developedBy: "Developed by",
      visitMawaqit: "Visit Official Mawaqit Website"
    },
    ar: {
      title: "مواقيت",
      subtitle: "أوقات الصلاة والمساجد",
      yourLocation: "موقعك",
      nearbyMosques: "المساجد القريبة",
      prayerTimes: "أوقات الصلاة",
      within: "ضمن 1 كم من موقعك",
      selectMosque: "اختر مسجدًا لعرض أوقات الصلاة",
      today: "أوقات الصلاة اليوم",
      fajr: "الفجر",
      sunrise: "الشروق",
      dhuhr: "الظهر",
      asr: "العصر",
      maghrib: "المغرب",
      isha: "العشاء",
      jumua: "الجمعة",
      adhan: "الأذان",
      iqama: "الإقامة",
      contact: "معلومات الاتصال",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      website: "الموقع",
      facilities: "المرافق",
      away: "بعيدًا",
      poweredBy: "مدعوم من مواقيت",
      noMosques: "لم يتم العثور على مساجد قريبة",
      errorTitle: "خطأ",
      makeProxy: "تأكد من تشغيل الخادم الوكيل",
      showMap: "عرض الخريطة",
      hideMap: "إخفاء الخريطة",
      getDirections: "احصل على الاتجاهات",
      developedBy: "تطوير",
      visitMawaqit: "زيارة الموقع الرسمي لمواقيت"
    }
  };

  const t = translations[language];

  const getUserLocation = () => {
    setLoading(true);
    setError('');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setLocation(loc);
          fetchNearbyMosques(loc);
        },
        (err) => {
          setError(t.errorTitle + ': ' + err.message);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported');
      setLoading(false);
    }
  };

  const fetchNearbyMosques = async (loc) => {
  try {
    const url = `/api/mosque-search?lat=${loc.lat}&lon=${loc.lon}&distance=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    setMosques(data || []);
    setLoading(false);
  } catch (err) {
    setError(`${t.errorTitle}: ${err.message}`);
    setLoading(false);
  }
};

  const handleMosqueSelect = async (mosque) => {
  setSelectedMosque(mosque);
  setError('');
  setShowMap(false);
  setLoading(true);
  
  try {
    const response = await fetch(`/api/mosque-details?id=${mosque.uuid}`);
    if (!response.ok) throw new Error('Failed to fetch details');
    const data = await response.json();
    setPrayerTimes(data);
    setLoading(false);
  } catch (err) {
    setError(`${t.errorTitle}: ${err.message}`);
    setPrayerTimes(mosque); // Fallback to basic mosque data
    setLoading(false);
  }
};

  const openInMaps = () => {
    if (!selectedMosque || !location) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lon}&destination=${selectedMosque.latitude},${selectedMosque.longitude}&travelmode=walking`;
    window.open(url, '_blank');
  };

  const getMapEmbedUrl = () => {
    if (!selectedMosque || !location) return '';
    return `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${location.lat},${location.lon}&destination=${selectedMosque.latitude},${selectedMosque.longitude}&mode=walking&zoom=15`;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2);
  };

  const prayerConfig = [
    { key: 0, name: t.fajr, icon: Moon, gradient: 'from-indigo-500 via-purple-500 to-pink-500', bg: 'from-indigo-50 to-purple-50' },
    { key: 1, name: t.sunrise, icon: Sun, gradient: 'from-amber-400 via-orange-400 to-red-400', bg: 'from-amber-50 to-orange-50', noIqama: true },
    { key: 2, name: t.dhuhr, icon: Sun, gradient: 'from-yellow-400 via-amber-400 to-orange-400', bg: 'from-yellow-50 to-amber-50', iqamaIndex: 1 },
    { key: 3, name: t.asr, icon: Sun, gradient: 'from-blue-400 via-cyan-400 to-teal-400', bg: 'from-blue-50 to-cyan-50', iqamaIndex: 2 },
    { key: 4, name: t.maghrib, icon: Moon, gradient: 'from-orange-500 via-red-500 to-pink-500', bg: 'from-orange-50 to-red-50', iqamaIndex: 3 },
    { key: 5, name: t.isha, icon: Moon, gradient: 'from-purple-600 via-indigo-600 to-blue-600', bg: 'from-purple-50 to-indigo-50', iqamaIndex: 4 }
  ];

  const getFacilities = (mosque) => {
    const facilities = [];
    if (mosque.parking) facilities.push({ icon: '🚗', text: 'Parking' });
    if (mosque.womenSpace) facilities.push({ icon: '👩', text: 'Women Space' });
    if (mosque.adultCourses) facilities.push({ icon: '📚', text: 'Adult Courses' });
    if (mosque.childrenCourses) facilities.push({ icon: '👶', text: 'Children Courses' });
    if (mosque.ablutions) facilities.push({ icon: '💧', text: 'Ablution' });
    if (mosque.handicapAccessibility) facilities.push({ icon: '♿', text: 'Accessible' });
    if (mosque.aidPrayer) facilities.push({ icon: '🌙', text: 'Eid Prayer' });
    if (mosque.janazaPrayer) facilities.push({ icon: '🤲', text: 'Janazah' });
    return facilities;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white/5 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm">
            <a 
              href="https://mawaqit.net" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-200 hover:text-white transition-colors flex items-center gap-1 sm:gap-2 bg-white/5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10"
            >
              <Globe size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t.visitMawaqit}</span>
              <span className="sm:hidden">Mawaqit.net</span>
            </a>
            <a 
              href="https://apps.apple.com/fr/app/mawaqit-horaires-de-pri%C3%A8re/id1460522683" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-200 hover:text-white transition-colors flex items-center gap-1 sm:gap-2 bg-white/5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10"
            >
              📱 Google Play
            </a>
            <a 
              href="https://apps.apple.com/app/mawaqit/id1492041104" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-200 hover:text-white transition-colors flex items-center gap-1 sm:gap-2 bg-white/5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-white/10"
            >
              🍎 App Store
            </a>
          </div>
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="bg-white/10 backdrop-blur-md text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 hover:bg-white/20 transition-all duration-300 border border-white/20 text-sm sm:text-base"
          >
            <Globe size={16} className="sm:w-5 sm:h-5" />
            <span className="font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

        <div className="text-center mb-6 sm:mb-8 relative">
          <div className="inline-block mb-3 sm:mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-2xl opacity-50 rounded-full"></div>
              <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 tracking-tight" style={{ fontFamily: language === 'ar' ? 'Cairo, sans-serif' : 'Inter, sans-serif' }}>
                {t.title}
              </h1>
            </div>
          </div>
          <p className="text-purple-200 text-base sm:text-lg font-medium">{t.subtitle}</p>
          
          <div className="mt-3 sm:mt-4 text-white/80 text-xs sm:text-sm">
            <Clock className="inline mr-2" size={14} />
            {currentTime.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl mb-4 sm:mb-6 animate-fade-in">
            <p className="font-semibold flex items-center gap-2 text-sm sm:text-base">
              ⚠️ {t.errorTitle}
            </p>
            <p className="text-xs sm:text-sm mt-1 text-red-100">{error}</p>
          </div>
        )}

        {location && (
          <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-md border border-white/20 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-purple-300 sm:w-5 sm:h-5" />
                <span className="font-medium">{t.yourLocation}:</span>
              </span>
              <span className="text-purple-200 text-xs sm:text-sm ml-6 sm:ml-0">
                {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
              </span>
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <MapPin size={20} className="sm:w-6 sm:h-6" />
                </div>
                <span className="hidden sm:inline">{t.nearbyMosques}</span>
                <span className="sm:hidden text-base">{t.nearbyMosques}</span>
              </h2>
              {loading && <Loader2 className="animate-spin text-purple-300" size={20} />}
            </div>

            {location && (
              <p className="text-purple-200 text-xs sm:text-sm mb-3 sm:mb-4">{t.within}</p>
            )}

            <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
              {mosques.length === 0 && !loading && location && (
                <div className="text-center py-8 sm:py-12">
                  <Search className="mx-auto mb-3 sm:mb-4 text-purple-300" size={40} />
                  <p className="text-purple-200 text-sm sm:text-base">{t.noMosques}</p>
                </div>
              )}

              {mosques.map((mosque) => {
                const facilities = getFacilities(mosque);
                return (
                  <button
                    key={mosque.uuid}
                    onClick={() => handleMosqueSelect(mosque)}
                    className={`w-full text-left p-3 sm:p-5 rounded-2xl transition-all duration-300 group ${
                      selectedMosque?.uuid === mosque.uuid
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg scale-105'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <h3 className="font-bold text-white mb-1 sm:mb-2 text-base sm:text-lg group-hover:text-purple-100 transition-colors">
                      {mosque.label || mosque.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-purple-200 mb-2 sm:mb-3">
                      {mosque.localisation}
                    </p>
                    
                    {facilities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                        {facilities.slice(0, 3).map((facility, idx) => (
                          <span key={idx} className="text-xs bg-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
                            {facility.icon} <span className="hidden sm:inline">{facility.text}</span>
                          </span>
                        ))}
                        {facilities.length > 3 && (
                          <span className="text-xs bg-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
                            +{facilities.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {location && mosque.latitude && mosque.longitude && (
                      <p className="text-xs text-purple-300 font-medium flex items-center gap-1">
                        <MapPin size={10} className="sm:w-3 sm:h-3" />
                        {calculateDistance(location.lat, location.lon, mosque.latitude, mosque.longitude)} km {t.away}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-4 sm:p-6 border border-white/20">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl">
                <Clock size={20} className="sm:w-6 sm:h-6" />
              </div>
              {t.prayerTimes}
            </h2>

            {!selectedMosque && (
              <div className="text-center py-12 sm:py-20">
                <Search className="mx-auto mb-4 sm:mb-6 text-purple-300" size={48} />
                <p className="text-purple-200 text-base sm:text-lg">{t.selectMosque}</p>
              </div>
            )}

            {prayerTimes && (
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 sm:p-6 border border-white/20 mb-4 sm:mb-6">
                  <h3 className="font-bold text-xl sm:text-2xl text-white mb-2">
                    {prayerTimes.label || prayerTimes.name}
                  </h3>
                  <p className="text-purple-200 mb-3 sm:mb-4 text-sm sm:text-base">
                    {prayerTimes.localisation}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <MapPin size={18} className="sm:w-5 sm:h-5" />
                      {showMap ? t.hideMap : t.showMap}
                    </button>
                    <button
                      onClick={openInMaps}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Navigation size={18} className="sm:w-5 sm:h-5" />
                      {t.getDirections}
                    </button>
                  </div>

                  {showMap && (
                    <div className="mb-3 sm:mb-4 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl animate-fade-in">
                      <iframe
                        width="100%"
                        height="350"
                        className="sm:h-[450px]"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={getMapEmbedUrl()}
                      ></iframe>
                    </div>
                  )}
                  
                  {getFacilities(prayerTimes).length > 0 && (
                    <div>
                      <h4 className="text-white font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">{t.facilities}</h4>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        {getFacilities(prayerTimes).map((facility, idx) => (
                          <div key={idx} className="bg-white/10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm text-white flex items-center gap-1.5 sm:gap-2">
                            <span>{facility.icon}</span>
                            <span className="truncate">{facility.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {prayerTimes.times && prayerTimes.times.length >= 6 && (
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-purple-200 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                      <Calendar size={16} className="sm:w-5 sm:h-5" />
                      {t.today}
                    </p>

                    {prayerConfig.map((prayer) => {
                      const Icon = prayer.icon;
                      return (
                        <div
                          key={prayer.key}
                          className={`bg-gradient-to-r ${prayer.bg} rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30 hover:scale-102`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-4">
                              <div className={`p-2 sm:p-3 bg-gradient-to-br ${prayer.gradient} rounded-lg sm:rounded-xl shadow-lg`}>
                                <Icon size={20} className="text-white sm:w-6 sm:h-6" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-base sm:text-lg">{prayer.name}</p>
                                <div className="text-xs sm:text-sm text-gray-600 mt-1 flex flex-col sm:flex-row sm:gap-4">
                                  <span className="flex items-center gap-1">
                                    <span className="text-xs">{t.adhan}:</span>
                                    <span className="font-bold text-base sm:text-lg text-gray-900">
                                      {prayerTimes.times[prayer.key]}
                                    </span>
                                  </span>
                                  {!prayer.noIqama && prayerTimes.iqama && prayerTimes.iqama[prayer.iqamaIndex || prayer.key] && (
                                    <span className="flex items-center gap-1">
                                      <span className="text-xs">{t.iqama}:</span>
                                      <span className="font-semibold text-sm sm:text-base text-purple-700">
                                        {prayerTimes.iqama[prayer.iqamaIndex || prayer.key]}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {prayerTimes.jumua && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg border border-green-200">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg sm:rounded-xl shadow-lg">
                            <Calendar size={20} className="text-white sm:w-6 sm:h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-base sm:text-lg">{t.jumua}</p>
                            <span className="font-bold text-xl sm:text-2xl text-green-700">
                              {prayerTimes.jumua}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(prayerTimes.phone || prayerTimes.email || prayerTimes.site) && (
                  <div className="mt-4 sm:mt-6 bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10">
                    <h4 className="font-bold text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                      <Phone size={16} className="sm:w-5 sm:h-5" />
                      {t.contact}
                    </h4>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      {prayerTimes.phone && (
                        <a href={`tel:${prayerTimes.phone}`} className="flex items-center gap-2 sm:gap-3 text-purple-200 hover:text-white transition-colors">
                          <Phone size={14} className="sm:w-4 sm:h-4" />
                          <span className="break-all">{prayerTimes.phone}</span>
                        </a>
                      )}
                      {prayerTimes.email && (
                        <a href={`mailto:${prayerTimes.email}`} className="flex items-center gap-2 sm:gap-3 text-purple-200 hover:text-white transition-colors">
                          <Mail size={14} className="sm:w-4 sm:h-4" />
                          <span className="break-all">{prayerTimes.email}</span>
                        </a>
                      )}
                      {prayerTimes.site && (
                        <a href={prayerTimes.site} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 sm:gap-3 text-purple-200 hover:text-white transition-colors">
                          <Globe size={14} className="sm:w-4 sm:h-4" />
                          <span className="break-all">{prayerTimes.site}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6 sm:mt-8 pt-6 border-t border-white/10">
          <p className="text-purple-300 text-xs sm:text-sm mb-2">{t.poweredBy}</p>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-purple-200">
            <span>{t.developedBy} Claude Sonnet 4.5 × Adem Sehly</span>
            <a
              href="https://www.linkedin.com/in/adem-sahli-322654345/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        @media (max-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
        }
      `}</style>
    </div>
  );
}