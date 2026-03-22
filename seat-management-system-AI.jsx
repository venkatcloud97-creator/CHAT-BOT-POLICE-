import { useState, useEffect } from "react";

const LOCATIONS = [
  { id: 1, city: "New York", country: "USA", flag: "🇺🇸", available: 34, total: 80, floor: "12F" },
  { id: 2, city: "London", country: "UK", flag: "🇬🇧", available: 12, total: 60, floor: "5F" },
  { id: 3, city: "Bangalore", country: "India", flag: "🇮🇳", available: 45, total: 100, floor: "8F" },
  { id: 4, city: "Singapore", country: "Singapore", flag: "🇸🇬", available: 8, total: 40, floor: "3F" },
  { id: 5, city: "Dubai", country: "UAE", flag: "🇦🇪", available: 22, total: 50, floor: "15F" },
  { id: 6, city: "Toronto", country: "Canada", flag: "🇨🇦", available: 19, total: 55, floor: "7F" },
  { id: 7, city: "Sydney", country: "Australia", flag: "🇦🇺", available: 30, total: 65, floor: "4F" },
  { id: 8, city: "Tokyo", country: "Japan", flag: "🇯🇵", available: 5, total: 45, floor: "10F" },
  { id: 9, city: "Berlin", country: "Germany", flag: "🇩🇪", available: 27, total: 70, floor: "6F" },
  { id: 10, city: "São Paulo", country: "Brazil", flag: "🇧🇷", available: 18, total: 50, floor: "9F" },
  { id: 11, city: "Paris", country: "France", flag: "🇫🇷", available: 14, total: 60, floor: "11F" },
  { id: 12, city: "Amsterdam", country: "Netherlands", flag: "🇳🇱", available: 33, total: 55, floor: "2F" },
];

const SEAT_TYPES = ["Hot Desk", "Dedicated", "Meeting Pod", "Phone Booth", "Standing Desk"];

const AMENITIES = ["Window View", "Dual Monitor", "Whiteboard", "Standing Desk", "Near Pantry", "Quiet Zone"];

function generateSeats(locationId) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const cols = 10;
  return rows.flatMap((row, ri) =>
    Array.from({ length: cols }, (_, ci) => {
      const id = `${row}${ci + 1}`;
      const rand = Math.random();
      const status = rand < 0.3 ? "booked" : rand < 0.35 ? "maintenance" : "available";
      return {
        id,
        row,
        col: ci + 1,
        status,
        type: SEAT_TYPES[Math.floor(Math.random() * SEAT_TYPES.length)],
        amenities: AMENITIES.filter(() => Math.random() > 0.6),
        bookedBy: status === "booked" ? ["Alice", "Bob", "Carol", "David", "Eve"][Math.floor(Math.random() * 5)] : null,
      };
    })
  );
}

const today = new Date();
const formatDate = (d) => d.toISOString().split("T")[0];
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const DAYS = Array.from({ length: 14 }, (_, i) => {
  const d = addDays(today, i);
  return {
    date: formatDate(d),
    label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
    isWeekend: [0, 6].includes(d.getDay()),
  };
});

export default function App() {
  const [view, setView] = useState("dashboard");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(DAYS[0].date);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [myBookings, setMyBookings] = useState([
    { id: "BK001", location: "Bangalore", seat: "C5", date: formatDate(addDays(today, 1)), type: "Hot Desk", status: "confirmed" },
    { id: "BK002", location: "New York", seat: "A3", date: formatDate(addDays(today, 3)), type: "Dedicated", status: "confirmed" },
  ]);
  const [employee] = useState({ name: "Rajesh Kumar", id: "EMP-4821", dept: "Engineering", avatar: "RK" });
  const [notification, setNotification] = useState(null);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (selectedLocation) setSeats(generateSeats(selectedLocation.id));
  }, [selectedLocation]);

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBook = () => {
    if (!selectedSeat) return;
    const newBooking = {
      id: `BK${String(Math.random()).slice(2, 7)}`,
      location: selectedLocation.city,
      seat: selectedSeat.id,
      date: selectedDate,
      type: selectedSeat.type,
      status: "confirmed",
    };
    setMyBookings((prev) => [newBooking, ...prev]);
    setSeats((prev) => prev.map(s => s.id === selectedSeat.id ? { ...s, status: "booked", bookedBy: employee.name } : s));
    setBookingSuccess(newBooking);
    setSelectedSeat(null);
    showNotif(`Seat ${newBooking.seat} booked at ${newBooking.location}!`);
  };

  const handleCancel = (id) => {
    setMyBookings((prev) => prev.filter(b => b.id !== id));
    showNotif("Booking cancelled successfully", "warning");
  };

  const filteredLocations = LOCATIONS.filter(l =>
    l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableSeats = seats.filter(s => s.status === "available");
  const bookedSeats = seats.filter(s => s.status === "booked");

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#0a0d14", minHeight: "100vh", color: "#e8eaf0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #12151f; }
        ::-webkit-scrollbar-thumb { background: #2a2f45; border-radius: 3px; }
        .nav-item { transition: all 0.2s; cursor: pointer; border-radius: 10px; }
        .nav-item:hover { background: rgba(99,102,241,0.12); }
        .nav-item.active { background: rgba(99,102,241,0.2); color: #818cf8; }
        .loc-card { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); cursor: pointer; border: 1px solid #1e2235; }
        .loc-card:hover { transform: translateY(-4px); border-color: #6366f1; box-shadow: 0 12px 40px rgba(99,102,241,0.15); }
        .seat-cell { transition: all 0.15s; cursor: pointer; border-radius: 6px; }
        .seat-cell:hover { transform: scale(1.15); z-index: 10; position: relative; }
        .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; color: white; cursor: pointer; border-radius: 10px; font-weight: 600; transition: all 0.2s; font-family: inherit; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
        .btn-secondary { background: #1e2235; border: 1px solid #2a2f45; color: #e8eaf0; cursor: pointer; border-radius: 10px; font-weight: 500; transition: all 0.2s; font-family: inherit; }
        .btn-secondary:hover { border-color: #6366f1; background: #252940; }
        .pill { border-radius: 20px; font-size: 11px; font-weight: 600; padding: 3px 10px; }
        .fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .notif { animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: none; } }
        .date-chip { cursor: pointer; transition: all 0.2s; border-radius: 10px; border: 1px solid #1e2235; }
        .date-chip:hover { border-color: #6366f1; }
        .date-chip.active { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-color: transparent; }
        input, select { background: #12151f; border: 1px solid #2a2f45; color: #e8eaf0; border-radius: 10px; font-family: inherit; transition: all 0.2s; }
        input:focus, select:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
        .badge-available { background: rgba(16,185,129,0.15); color: #34d399; }
        .badge-booked { background: rgba(239,68,68,0.15); color: #f87171; }
        .badge-maintenance { background: rgba(245,158,11,0.15); color: #fbbf24; }
        .badge-confirmed { background: rgba(16,185,129,0.15); color: #34d399; }
        .stat-card { background: #12151f; border: 1px solid #1e2235; border-radius: 16px; transition: all 0.2s; }
        .stat-card:hover { border-color: #2a2f45; }
        .progress-bar { background: #1e2235; border-radius: 999px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 999px; transition: width 0.6s ease; }
      `}</style>

      {/* Notification */}
      {notification && (
        <div className="notif" style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: notification.type === "success" ? "#065f46" : "#7c2d12", border: `1px solid ${notification.type === "success" ? "#34d399" : "#f97316"}`, borderRadius: 12, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 500, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <span>{notification.type === "success" ? "✓" : "⚠"}</span>
          {notification.msg}
        </div>
      )}

      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <div style={{ width: 240, background: "#0d1018", borderRight: "1px solid #1e2235", display: "flex", flexDirection: "column", padding: "24px 16px", position: "fixed", height: "100vh", zIndex: 100 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏢</div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: "#fff" }}>WorkNest</div>
                <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1 }}>SEAT MANAGEMENT</div>
              </div>
            </div>
          </div>

          <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { id: "dashboard", icon: "⊞", label: "Dashboard" },
              { id: "locations", icon: "🌍", label: "Locations" },
              { id: "book", icon: "📋", label: "Book a Seat" },
              { id: "mybookings", icon: "🗓", label: "My Bookings" },
              { id: "team", icon: "👥", label: "Team View" },
            ].map(item => (
              <div key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => setView(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", fontSize: 14, fontWeight: 500, color: view === item.id ? "#818cf8" : "#9ca3af" }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </div>
            ))}
          </nav>

          {/* Profile */}
          <div style={{ background: "#12151f", borderRadius: 12, padding: "12px 14px", border: "1px solid #1e2235" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #f59e0b, #ef4444)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{employee.avatar}</div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e8eaf0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{employee.name}</div>
                <div style={{ fontSize: 11, color: "#4b5563" }}>{employee.dept}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ marginLeft: 240, flex: 1, padding: "32px 36px", minHeight: "100vh" }}>

          {/* DASHBOARD */}
          {view === "dashboard" && (
            <div className="fade-in">
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Good morning, {employee.name.split(" ")[0]} 👋</h1>
                <p style={{ color: "#6b7280", fontSize: 15 }}>Your workspace overview for {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
              </div>

              {/* Stats Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Total Locations", value: "79", icon: "🌍", color: "#6366f1", sub: "Across 35 countries" },
                  { label: "Seats Available", value: "267", icon: "🟢", color: "#10b981", sub: "Right now globally" },
                  { label: "My Bookings", value: myBookings.length, icon: "📅", color: "#f59e0b", sub: "Active reservations" },
                  { label: "Office Days Left", value: "2", icon: "🏢", color: "#8b5cf6", sub: "This week" },
                ].map((stat, i) => (
                  <div key={i} className="stat-card" style={{ padding: "20px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ fontSize: 24 }}>{stat.icon}</div>
                      <div style={{ fontSize: 11, color: "#4b5563", background: "#1e2235", borderRadius: 6, padding: "2px 8px" }}>Live</div>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: stat.color, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e8eaf0", marginTop: 4 }}>{stat.label}</div>
                    <div style={{ fontSize: 11, color: "#4b5563", marginTop: 2 }}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Quick Book + My Schedule */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
                {/* Quick Book */}
                <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #1e2235 100%)", borderRadius: 20, padding: 28, border: "1px solid #312e81" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>Quick Book</div>
                  <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>Reserve a seat at your nearest office in seconds</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <select style={{ padding: "10px 14px", fontSize: 14, width: "100%" }}>
                      {LOCATIONS.map(l => <option key={l.id}>{l.flag} {l.city}, {l.country}</option>)}
                    </select>
                    <input type="date" defaultValue={formatDate(addDays(today, 1))} style={{ padding: "10px 14px", fontSize: 14, width: "100%" }} />
                    <button className="btn-primary" onClick={() => setView("book")} style={{ padding: "12px 20px", fontSize: 14 }}>
                      Find Available Seats →
                    </button>
                  </div>
                </div>

                {/* Work Schedule */}
                <div style={{ background: "#12151f", borderRadius: 20, padding: 28, border: "1px solid #1e2235" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>This Week's Schedule</div>
                  <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>Hybrid work pattern overview</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => {
                      const isOffice = [1, 3].includes(i);
                      const isWFH = [0, 2, 4].includes(i);
                      return (
                        <div key={day} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#0d1018", borderRadius: 8, border: `1px solid ${isOffice ? "#312e81" : "#1a2e1a"}` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: isOffice ? "#818cf8" : "#34d399" }}></div>
                            <span style={{ fontSize: 13, fontWeight: 500, color: "#e8eaf0" }}>{day}</span>
                          </div>
                          <span className="pill" style={{ background: isOffice ? "rgba(99,102,241,0.15)" : "rgba(16,185,129,0.15)", color: isOffice ? "#818cf8" : "#34d399" }}>
                            {isOffice ? "🏢 Office" : "🏠 Remote"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Top Locations */}
              <div style={{ background: "#12151f", borderRadius: 20, padding: 28, border: "1px solid #1e2235" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'Space Grotesk', sans-serif" }}>Top Locations by Occupancy</div>
                  <button className="btn-secondary" onClick={() => setView("locations")} style={{ padding: "8px 16px", fontSize: 13 }}>View All</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {LOCATIONS.slice(0, 5).map(loc => {
                    const pct = Math.round(((loc.total - loc.available) / loc.total) * 100);
                    return (
                      <div key={loc.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 36, height: 36, background: "#1e2235", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{loc.flag}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#e8eaf0" }}>{loc.city}</span>
                            <span style={{ fontSize: 12, color: "#6b7280" }}>{pct}% occupied · {loc.available} free</span>
                          </div>
                          <div className="progress-bar" style={{ height: 6 }}>
                            <div className="progress-fill" style={{ width: `${pct}%`, background: pct > 80 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#6366f1" }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* LOCATIONS VIEW */}
          {view === "locations" && (
            <div className="fade-in">
              <div style={{ marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Office Locations</h1>
                  <p style={{ color: "#6b7280", fontSize: 14 }}>{LOCATIONS.length} offices available globally</p>
                </div>
                <input placeholder="🔍  Search city or country…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: "10px 16px", fontSize: 14, width: 240 }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {filteredLocations.map(loc => {
                  const pct = Math.round(((loc.total - loc.available) / loc.total) * 100);
                  const isFull = loc.available < 5;
                  return (
                    <div key={loc.id} className="loc-card" style={{ background: "#12151f", borderRadius: 16, padding: 22, cursor: "pointer" }}
                      onClick={() => { setSelectedLocation(loc); setView("book"); }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ fontSize: 28 }}>{loc.flag}</div>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{loc.city}</div>
                            <div style={{ fontSize: 12, color: "#6b7280" }}>{loc.country}</div>
                          </div>
                        </div>
                        <span className="pill" style={isFull ? { background: "rgba(239,68,68,0.15)", color: "#f87171" } : { background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                          {isFull ? "Almost Full" : "Available"}
                        </span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 20, fontWeight: 700, color: "#34d399", fontFamily: "'Space Grotesk', sans-serif" }}>{loc.available}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>Available</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 20, fontWeight: 700, color: "#f87171", fontFamily: "'Space Grotesk', sans-serif" }}>{loc.total - loc.available}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>Booked</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 20, fontWeight: 700, color: "#e8eaf0", fontFamily: "'Space Grotesk', sans-serif" }}>{loc.total}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>Total</div>
                        </div>
                      </div>

                      <div className="progress-bar" style={{ height: 5, marginBottom: 12 }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: pct > 80 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#6366f1" }}></div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#4b5563" }}>Floor {loc.floor}</span>
                        <button className="btn-primary" style={{ padding: "6px 14px", fontSize: 12 }}>Book Seat</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BOOK A SEAT */}
          {view === "book" && (
            <div className="fade-in">
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Book a Seat</h1>
                <p style={{ color: "#6b7280", fontSize: 14 }}>Select a location, date, and your preferred seat</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 24 }}>
                {/* Left Panel */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Location Selector */}
                  <div style={{ background: "#12151f", borderRadius: 16, padding: 20, border: "1px solid #1e2235" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Office Location</div>
                    <select value={selectedLocation?.id || ""} onChange={e => setSelectedLocation(LOCATIONS.find(l => l.id === parseInt(e.target.value)))} style={{ width: "100%", padding: "10px 14px", fontSize: 14 }}>
                      <option value="">Select a location…</option>
                      {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.flag} {l.city}, {l.country}</option>)}
                    </select>

                    {selectedLocation && (
                      <div style={{ marginTop: 14, padding: 14, background: "#0d1018", borderRadius: 10, border: "1px solid #1e2235" }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{selectedLocation.flag}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{selectedLocation.city}</div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>{selectedLocation.country} · {selectedLocation.floor}</div>
                        <div style={{ display: "flex", gap: 16 }}>
                          <div><div style={{ fontSize: 18, fontWeight: 700, color: "#34d399" }}>{selectedLocation.available}</div><div style={{ fontSize: 11, color: "#6b7280" }}>Free</div></div>
                          <div><div style={{ fontSize: 18, fontWeight: 700, color: "#f87171" }}>{selectedLocation.total - selectedLocation.available}</div><div style={{ fontSize: 11, color: "#6b7280" }}>Taken</div></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Date Selector */}
                  <div style={{ background: "#12151f", borderRadius: 16, padding: 20, border: "1px solid #1e2235" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Select Date</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 260, overflowY: "auto" }}>
                      {DAYS.filter(d => !d.isWeekend).map(d => (
                        <div key={d.date} className={`date-chip ${selectedDate === d.date ? "active" : ""}`} onClick={() => setSelectedDate(d.date)} style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{d.label}</span>
                          {d.label === "Today" && <span className="pill" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>Today</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Seat Type Filter */}
                  <div style={{ background: "#12151f", borderRadius: 16, padding: 20, border: "1px solid #1e2235" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Seat Type</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {["All", ...SEAT_TYPES].map(t => (
                        <button key={t} onClick={() => setFilterType(t)} style={{ padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, border: `1px solid ${filterType === t ? "#6366f1" : "#2a2f45"}`, background: filterType === t ? "rgba(99,102,241,0.2)" : "#0d1018", color: filterType === t ? "#818cf8" : "#6b7280", cursor: "pointer", transition: "all 0.15s" }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div style={{ background: "#12151f", borderRadius: 16, padding: 20, border: "1px solid #1e2235" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Legend</div>
                    {[
                      { color: "#34d399", label: "Available" },
                      { color: "#f87171", label: "Booked" },
                      { color: "#fbbf24", label: "Maintenance" },
                      { color: "#6366f1", label: "Selected" },
                    ].map(l => (
                      <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 14, height: 14, borderRadius: 4, background: l.color, opacity: 0.8 }}></div>
                        <span style={{ fontSize: 13, color: "#9ca3af" }}>{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Floor Map */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {!selectedLocation ? (
                    <div style={{ background: "#12151f", borderRadius: 16, padding: 60, border: "2px dashed #1e2235", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                      <div style={{ fontSize: 48 }}>🏢</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: "#4b5563" }}>Select a location to view the floor map</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ background: "#12151f", borderRadius: 16, padding: 24, border: "1px solid #1e2235" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{selectedLocation.city} Office · {selectedLocation.floor}</div>
                            <div style={{ fontSize: 13, color: "#6b7280" }}>{availableSeats.length} seats available on {selectedDate}</div>
                          </div>
                          {selectedSeat && (
                            <div style={{ background: "rgba(99,102,241,0.1)", borderRadius: 10, padding: "8px 14px", border: "1px solid #312e81", fontSize: 13 }}>
                              Selected: <strong style={{ color: "#818cf8" }}>Seat {selectedSeat.id}</strong>
                            </div>
                          )}
                        </div>

                        {/* Floor Grid */}
                        <div style={{ overflowX: "auto", paddingBottom: 8 }}>
                          {/* Column Headers */}
                          <div style={{ display: "flex", gap: 4, marginBottom: 4, marginLeft: 28 }}>
                            {Array.from({ length: 10 }, (_, i) => (
                              <div key={i} style={{ width: 32, textAlign: "center", fontSize: 10, color: "#4b5563", fontWeight: 600 }}>{i + 1}</div>
                            ))}
                          </div>
                          {["A", "B", "C", "D", "E", "F", "G", "H"].map((row, ri) => (
                            <div key={row} style={{ display: "flex", gap: 4, marginBottom: ri === 3 ? 16 : 4, alignItems: "center" }}>
                              <div style={{ width: 20, textAlign: "center", fontSize: 11, color: "#4b5563", fontWeight: 700, marginRight: 4 }}>{row}</div>
                              {seats.filter(s => s.row === row).filter(s => filterType === "All" || s.type === filterType).map(seat => {
                                const isSelected = selectedSeat?.id === seat.id;
                                const color = isSelected ? "#6366f1" : seat.status === "available" ? "#34d399" : seat.status === "booked" ? "#f87171" : "#fbbf24";
                                return (
                                  <div key={seat.id} className="seat-cell"
                                    onClick={() => seat.status === "available" && setSelectedSeat(isSelected ? null : seat)}
                                    onMouseEnter={() => setHovered(seat)}
                                    onMouseLeave={() => setHovered(null)}
                                    style={{ width: 32, height: 32, background: `${color}22`, border: `2px solid ${color}`, borderRadius: 6, cursor: seat.status === "available" ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", opacity: seat.status === "maintenance" ? 0.4 : 1 }}>
                                    {isSelected && <div style={{ width: 10, height: 10, background: "#6366f1", borderRadius: 2 }}></div>}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>

                        {/* Hover Tooltip */}
                        {hovered && (
                          <div style={{ marginTop: 12, padding: "10px 14px", background: "#0d1018", borderRadius: 10, border: "1px solid #2a2f45", display: "flex", gap: 20, alignItems: "center" }}>
                            <div><span style={{ fontSize: 11, color: "#4b5563" }}>Seat</span><div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{hovered.id}</div></div>
                            <div><span style={{ fontSize: 11, color: "#4b5563" }}>Type</span><div style={{ fontSize: 13, color: "#e8eaf0" }}>{hovered.type}</div></div>
                            <div><span style={{ fontSize: 11, color: "#4b5563" }}>Status</span><div style={{ fontSize: 13 }}><span className={`pill badge-${hovered.status}`}>{hovered.status}</span></div></div>
                            {hovered.amenities.length > 0 && <div><span style={{ fontSize: 11, color: "#4b5563" }}>Amenities</span><div style={{ fontSize: 12, color: "#9ca3af" }}>{hovered.amenities.join(", ")}</div></div>}
                            {hovered.bookedBy && <div><span style={{ fontSize: 11, color: "#4b5563" }}>Booked by</span><div style={{ fontSize: 13, color: "#f87171" }}>{hovered.bookedBy}</div></div>}
                          </div>
                        )}
                      </div>

                      {/* Selected Seat Booking Panel */}
                      {selectedSeat && (
                        <div style={{ background: "linear-gradient(135deg, #1e1b4b, #1a1a2e)", borderRadius: 16, padding: 24, border: "1px solid #312e81" }} className="fade-in">
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 4, fontFamily: "'Space Grotesk', sans-serif" }}>Confirm Booking</div>
                              <div style={{ display: "flex", gap: 20, marginBottom: 14 }}>
                                <div><span style={{ fontSize: 11, color: "#6b7280" }}>Seat</span><div style={{ fontSize: 16, fontWeight: 700, color: "#818cf8" }}>{selectedSeat.id}</div></div>
                                <div><span style={{ fontSize: 11, color: "#6b7280" }}>Type</span><div style={{ fontSize: 14, color: "#e8eaf0" }}>{selectedSeat.type}</div></div>
                                <div><span style={{ fontSize: 11, color: "#6b7280" }}>Date</span><div style={{ fontSize: 14, color: "#e8eaf0" }}>{selectedDate}</div></div>
                                <div><span style={{ fontSize: 11, color: "#6b7280" }}>Location</span><div style={{ fontSize: 14, color: "#e8eaf0" }}>{selectedLocation.city}</div></div>
                              </div>
                              {selectedSeat.amenities.length > 0 && (
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                  {selectedSeat.amenities.map(a => (
                                    <span key={a} style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", fontSize: 11, padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>{a}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                              <button className="btn-secondary" onClick={() => setSelectedSeat(null)} style={{ padding: "10px 18px", fontSize: 14 }}>Cancel</button>
                              <button className="btn-primary" onClick={handleBook} style={{ padding: "10px 24px", fontSize: 14 }}>Confirm Booking ✓</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MY BOOKINGS */}
          {view === "mybookings" && (
            <div className="fade-in">
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4 }}>My Bookings</h1>
                <p style={{ color: "#6b7280", fontSize: 14 }}>{myBookings.length} active reservations</p>
              </div>

              {myBookings.length === 0 ? (
                <div style={{ background: "#12151f", borderRadius: 16, padding: 60, textAlign: "center", border: "2px dashed #1e2235" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <div style={{ fontSize: 16, color: "#4b5563" }}>No bookings yet. Book a seat to get started!</div>
                  <button className="btn-primary" onClick={() => setView("book")} style={{ marginTop: 20, padding: "12px 24px", fontSize: 14 }}>Book a Seat</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {myBookings.map(b => (
                    <div key={b.id} style={{ background: "#12151f", borderRadius: 14, padding: "20px 24px", border: "1px solid #1e2235", display: "flex", alignItems: "center", justifyContent: "space-between" }} className="fade-in">
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #312e81, #1e1b4b)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                          {LOCATIONS.find(l => l.city === b.location)?.flag || "🏢"}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{b.location} — Seat {b.seat}</div>
                          <div style={{ fontSize: 13, color: "#6b7280" }}>{b.type} · {new Date(b.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 4 }}>Booking ID</div>
                          <div style={{ fontSize: 13, fontFamily: "monospace", color: "#6b7280" }}>{b.id}</div>
                        </div>
                        <span className={`pill badge-${b.status}`}>{b.status}</span>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn-secondary" style={{ padding: "7px 14px", fontSize: 12 }}>View QR</button>
                          <button onClick={() => handleCancel(b.id)} style={{ padding: "7px 14px", fontSize: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontWeight: 500, transition: "all 0.2s" }}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TEAM VIEW */}
          {view === "team" && (
            <div className="fade-in">
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Team View</h1>
                <p style={{ color: "#6b7280", fontSize: 14 }}>See where your team is working this week</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {[
                  { name: "Alice Johnson", role: "Sr. Engineer", avatar: "AJ", color: "#6366f1", days: { Mon: "office", Tue: "remote", Wed: "office", Thu: "remote", Fri: "office" }, location: "Bangalore" },
                  { name: "Bob Smith", role: "Product Manager", avatar: "BS", color: "#f59e0b", days: { Mon: "remote", Tue: "office", Wed: "remote", Thu: "office", Fri: "remote" }, location: "New York" },
                  { name: "Carol Lee", role: "Designer", avatar: "CL", color: "#ec4899", days: { Mon: "office", Tue: "office", Wed: "remote", Thu: "remote", Fri: "office" }, location: "London" },
                  { name: "David Park", role: "DevOps", avatar: "DP", color: "#10b981", days: { Mon: "remote", Tue: "remote", Wed: "office", Thu: "office", Fri: "remote" }, location: "Singapore" },
                  { name: "Eve Chen", role: "Data Analyst", avatar: "EC", color: "#8b5cf6", days: { Mon: "office", Tue: "remote", Wed: "remote", Thu: "office", Fri: "office" }, location: "Tokyo" },
                  { name: "Frank Roy", role: "Backend Dev", avatar: "FR", color: "#ef4444", days: { Mon: "remote", Tue: "office", Wed: "office", Thu: "remote", Fri: "remote" }, location: "Berlin" },
                ].map((member, i) => (
                  <div key={i} style={{ background: "#12151f", borderRadius: 16, padding: 22, border: "1px solid #1e2235" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 40, height: 40, background: `linear-gradient(135deg, ${member.color}44, ${member.color}22)`, border: `2px solid ${member.color}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: member.color }}>{member.avatar}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{member.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{member.role} · {member.location}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {Object.entries(member.days).map(([day, status]) => (
                        <div key={day} style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: "#4b5563", marginBottom: 4, fontWeight: 600 }}>{day}</div>
                          <div style={{ padding: "5px 0", borderRadius: 6, background: status === "office" ? "rgba(99,102,241,0.2)" : "rgba(16,185,129,0.1)", border: `1px solid ${status === "office" ? "#312e81" : "#065f46"}`, fontSize: 14 }}>
                            {status === "office" ? "🏢" : "🏠"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
