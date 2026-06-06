/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { 
  parseEmployeeData, 
  calculateAHP, 
  calculateTOPSIS 
} from "./solver";
import { generateStandaloneHTML } from "./exporter";
import { Employee } from "./types";
import { 
  Users, 
  Award, 
  ShieldCheck, 
  Database, 
  Sliders, 
  Calculator, 
  Medal, 
  Printer, 
  Download, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Coins, 
  Info,
  Layers,
  Sparkles
} from "lucide-react";

export default function App() {
  // Parse original CSV dataset (only 120 lines to protect against frame constraints, with real values)
  const fullEmployeeList: Employee[] = useMemo(() => parseEmployeeData(), []);

  // Filter States
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("Active"); // Defaulting to "Active" for realistic promotion assessments
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Tab State
  const [activeTab, setActiveTab] = useState<string>("permasalahan");

  // AHP Sliders State (Pairwise Comparisons)
  // Scale ranges from -9 (y strongly dominating) to 9 (x strongly dominating)
  const [sliders, setSliders] = useState({
    comp_0_1: 3, // Performance vs Experience
    comp_0_2: 5, // Performance vs Salary
    comp_0_3: 7, // Performance vs Age
    comp_1_2: 3, // Experience vs Salary
    comp_1_3: 5, // Experience vs Age
    comp_2_3: 2  // Salary vs Age
  });

  // Calculate AHP dynamically when sliders shift
  const ahpResult = useMemo(() => {
    return calculateAHP(sliders);
  }, [sliders]);

  // Apply general search query & dropdown filters to dataset to construct candidates array
  const filteredEmployees = useMemo(() => {
    return fullEmployeeList.filter(emp => {
      const matchDept = deptFilter === "All" || emp.Department === deptFilter;
      const matchStatus = statusFilter === "All" || emp.Status === statusFilter;
      const matchSearch = emp.Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.ID.toString() === searchQuery.trim();
      return matchDept && matchStatus && matchSearch;
    });
  }, [fullEmployeeList, deptFilter, statusFilter, searchQuery]);

  // Calculate TOPSIS based on current filtered subset and criteria weights
  const topsisResult = useMemo(() => {
    return calculateTOPSIS(filteredEmployees, ahpResult.weights);
  }, [filteredEmployees, ahpResult.weights]);

  // Handle single slide changes
  const handleSliderChange = (key: string, val: number) => {
    setSliders(prev => ({
      ...prev,
      [key]: val
    }));
  };

  // Human descriptive text for pairwise scale values
  const getScaleLabel = (val: number) => {
    if (val === 1) return "Sama Penting (1:1)";
    if (val > 1) return `Kriteria Kiri Lebih Penting (${val}x)`;
    return `Kriteria Kanan Lebih Penting (${Math.abs(val)}x)`;
  };

  // Exporter to trigger download of self-contained Single-File HTML
  const triggerHTMLDownload = () => {
    const htmlReport = generateStandaloneHTML(fullEmployeeList);
    const blob = new Blob([htmlReport], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Sistem_Pendukung_Keputusan_AHP_TOPSIS.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Retrieve the top scoring individual
  const bestCandidate = topsisResult.items[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Dynamic Header */}
      <header className="h-20 border-b border-slate-200 bg-white sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 flex-shrink-0">
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-blue-600">SPK Promosi Jabatan</h1>
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-widest">
            Metode AHP &amp; TOPSIS • Dataset Karyawan Kaggle
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status Perhitungan</span>
            {ahpResult.isConsistent ? (
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Konsisten (CR = {ahpResult.cr.toFixed(3)})
              </span>
            ) : (
              <span className="text-xs text-rose-600 font-bold flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Tidak Konsisten (CR = {ahpResult.cr.toFixed(3)})
              </span>
            )}
          </div>
          <div className="hidden sm:block h-10 w-px bg-slate-200 mx-1"></div>
          <button 
            onClick={triggerHTMLDownload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download Report
          </button>
        </div>
      </header>

      {/* Primary KPI Segment */}
      <section className="bg-white border-b border-slate-205 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Alternatif */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">Total Alternatif</p>
              <p className="text-3xl font-extrabold text-slate-900 font-mono tracking-tighter">
                {filteredEmployees.length}
              </p>
            </div>
            <div className="mt-2 flex items-center text-[10px] text-green-600 font-bold uppercase tracking-wider font-sans">
              <span>Validated Dataset</span>
            </div>
          </div>

          {/* Card 2: Total Kriteria */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">Total Kriteria</p>
              <p className="text-3xl font-extrabold text-slate-900 font-mono tracking-tighter">
                04
              </p>
            </div>
            <div className="mt-2 flex items-center text-[10px] text-blue-600 font-bold uppercase tracking-wider font-sans">
              <span>AHP Weighted</span>
            </div>
          </div>

          {/* Card 3: Best Pref score */}
          <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex flex-col justify-between hover:border-yellow-300 transition-colors">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-sans">Best Preference</p>
              <p className="text-3xl font-extrabold text-slate-900 font-mono tracking-tighter">
                {bestCandidate ? bestCandidate.preferenceWeight.toFixed(3) : "0.000"}
              </p>
            </div>
            <div className="mt-2 flex items-center text-[10px] text-amber-600 font-bold uppercase tracking-wider font-sans">
              <span>TOPSIS Final</span>
            </div>
          </div>

          {/* Card 4: Top Candidate (Main recommendation highlight) */}
          <div className="bg-blue-600 border border-blue-600 p-5 rounded-xl shadow-md flex flex-col justify-between">
            <div className="text-white">
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1 font-sans">Top Candidate</p>
              <h3 className="text-lg sm:text-xl font-bold leading-tight truncate" title={bestCandidate ? bestCandidate.employee.Name : "-"}>
                {bestCandidate ? bestCandidate.employee.Name : "-"}
              </h3>
            </div>
            <div className="mt-1 text-[10px] text-blue-100 font-bold uppercase tracking-wider font-mono">
              <span>{bestCandidate ? `Emp ID: ${bestCandidate.employee.ID}` : "-"}</span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Responsive Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Navigation Tabs (Sidebar style on Large, Tabs on Small) */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 scrollbar-none">
            
            <button 
              onClick={() => setActiveTab("permasalahan")}
              className={`flex items-center px-4 lg:px-6 py-3 text-xs sm:text-sm font-medium transition-all cursor-pointer rounded-lg text-nowrap ${
                activeTab === "permasalahan" 
                  ? "bg-slate-50 text-blue-600 lg:border-r-3 lg:border-blue-600 lg:rounded-r-none font-bold" 
                  : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              <span>01</span>
              <span className="ml-3">Permasalahan</span>
            </button>
            <button 
              onClick={() => setActiveTab("dataset")}
              className={`flex items-center px-4 lg:px-6 py-3 text-xs sm:text-sm font-medium transition-all cursor-pointer rounded-lg text-nowrap ${
                activeTab === "dataset" 
                  ? "bg-slate-50 text-blue-600 lg:border-r-3 lg:border-blue-600 lg:rounded-r-none font-bold"
                  : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              <span>02</span>
              <span className="ml-3">Dataset Raw</span>
            </button>
            <button 
              onClick={() => setActiveTab("kriteria")}
              className={`flex items-center px-4 lg:px-6 py-3 text-xs sm:text-sm font-medium transition-all cursor-pointer rounded-lg text-nowrap ${
                activeTab === "kriteria" 
                  ? "bg-slate-50 text-blue-600 lg:border-r-3 lg:border-blue-600 lg:rounded-r-none font-bold" 
                  : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              <span>03</span>
              <span className="ml-3">Kriteria &amp; Bobot</span>
            </button>
            <button 
              onClick={() => setActiveTab("perhitungan-ahp")}
              className={`flex items-center px-4 lg:px-6 py-3 text-xs sm:text-sm font-medium transition-all cursor-pointer rounded-lg text-nowrap ${
                activeTab === "perhitungan-ahp" 
                  ? "bg-slate-50 text-blue-600 lg:border-r-3 lg:border-blue-600 lg:rounded-r-none font-bold" 
                  : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              <span>04</span>
              <span className="ml-3">Proses AHP</span>
            </button>
            <button 
              onClick={() => setActiveTab("perhitungan-topsis")}
              className={`flex items-center px-4 lg:px-6 py-3 text-xs sm:text-sm font-medium transition-all cursor-pointer rounded-lg text-nowrap ${
                activeTab === "perhitungan-topsis" 
                  ? "bg-slate-50 text-blue-600 lg:border-r-3 lg:border-blue-600 lg:rounded-r-none font-bold" 
                  : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              <span>05</span>
              <span className="ml-3">Proses TOPSIS</span>
            </button>
            <button 
              onClick={() => setActiveTab("ranking")}
              className={`flex items-center px-4 lg:px-6 py-3 text-xs sm:text-sm font-medium transition-all cursor-pointer rounded-lg text-nowrap ${
                activeTab === "ranking" 
                  ? "bg-slate-50 text-blue-600 lg:border-r-3 lg:border-blue-600 lg:rounded-r-none font-bold" 
                  : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              <span>06</span>
              <span className="ml-3">Ranking Akhir</span>
            </button>
            <button 
              onClick={() => setActiveTab("rekomendasi")}
              className={`flex items-center px-4 lg:px-6 py-3 text-xs sm:text-sm font-medium transition-all cursor-pointer rounded-lg text-nowrap ${
                activeTab === "rekomendasi" 
                  ? "bg-slate-50 text-blue-600 lg:border-r-3 lg:border-blue-600 lg:rounded-r-none font-bold" 
                  : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              <span>07</span>
              <span className="ml-3">Rekomendasi</span>
            </button>
            
          </div>

          {/* Academic Stamp card - upgraded design to look exactly like the design HTML side panel */}
          <div className="p-4 border border-slate-100 rounded-xl bg-blue-50 text-blue-800">
            <p className="text-[10px] font-bold uppercase mb-1 opacity-60 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Selected Best
            </p>
            <p className="text-xs font-bold font-mono">EMP-ID: {bestCandidate ? bestCandidate.employee.ID : "-"}</p>
            <p className="text-[10px] font-medium opacity-85">
              Score: {bestCandidate ? bestCandidate.preferenceWeight.toFixed(4) : "0.0000"}
            </p>
          </div>
        </div>

        {/* Dynamic Display Board */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs min-w-0">

          {/* Tab 1: PERMASALAHAN */}
          {activeTab === "permasalahan" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Info className="text-blue-600 h-5 w-5" />
                Latar Belakang &amp; Permasalahan
              </h3>
              
              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Proses promosi merupakan instrumen strategis yang digunakan manajemen perusahaan untuk mengapresiasi kinerja terbaik serta mendayagunakan bakat berpotensi tinggi pada jenjang kepemimpinan baru. Namun, pendelegasian ini seringkali menghadapi tantangan <strong>subjektivitas parsial, bias kepemimpinan pribadi, dan kurangnya akuntabilitas penilaian kriteria majemuk</strong>.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <h5 className="font-bold text-slate-800 text-sm mb-2">Tujuan Aplikasi SPK</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Merancang rekomendasi pemilihan kandidat promosi jabatan secara transparan dari dataset riil karyawan. Sistem menyeimbangkan indikator penilaian murni tanpa manipulasi simulatif.
                    </p>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <h5 className="font-bold text-slate-800 text-sm mb-2">Keunggulan Hibrida AHP-TOPSIS</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Sinergi yang optimal: **Metode AHP** merampingkan pembobotan kriteria secara terstruktur dan rasional, sementara **Metode TOPSIS** menyederhanakan perhitungan jarak matematis alternatif secara komprehensif.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-slate-800 text-sm">Alasan Penggunaan Metode:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-500">
                    <li><strong>AHP (Analytic Hierarchy Process)</strong>: Memecah persoalan terstruktur bertingkat, menimbang perbandingan berpasangan, dan mengukur presisi konsistensi penilaian (Consistency Ratio &lt; 10%).</li>
                    <li><strong>TOPSIS</strong>: Algoritma yang andal dalam menyelesaikan penentuan nilai alternatif terbaik yang tidak hanya dekat dengan solusi ideal positif (A+), tetapi juga terpisah sejauh mungkin dari solusi ideal negatif (A-).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: DATASET */}
          {activeTab === "dataset" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Database className="text-blue-600 h-5 w-5" />
                  Eksplorasi Dataset Riil
                </h3>
                
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Cari karyawan..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs w-full sm:w-44 focus:bg-white"
                    />
                  </div>
                  
                  <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg bg-slate-50 px-2 py-1">
                    <Filter className="h-3 w-3 text-slate-400" />
                    <select 
                      value={deptFilter} 
                      onChange={(e) => setDeptFilter(e.target.value)}
                      className="bg-transparent border-0 text-xs text-slate-700 outline-none pr-1"
                    >
                      <option value="All">Semua Divisi</option>
                      <option value="IT">IT</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                    </select>
                  </div>

                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium"
                  >
                    <option value="Active">Hanya Aktif (Seleksi)</option>
                    <option value="All">Semua Karyawan</option>
                    <option value="Inactive">Hanya Inaktif</option>
                  </select>
                </div>
              </div>

              {/* Table rendering */}
              <div className="overflow-x-auto border border-slate-150 rounded-xl max-h-[380px]">
                <table className="table-auto w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 uppercase text-[10px] text-slate-500 font-bold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Nama Lengkap</th>
                      <th className="px-4 py-3">Usia</th>
                      <th className="px-2 py-3">Gender</th>
                      <th className="px-4 py-3">Divisi</th>
                      <th className="px-4 py-3 text-right">Gaji Lancar</th>
                      <th className="px-4 py-3 text-center">Score Kinerja</th>
                      <th className="px-4 py-3">Masa Kerja</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-12 text-center text-slate-400 font-normal">
                          Tidak ditemukan kecocokan karyawan pada filter kriteria.
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map(emp => (
                        <tr key={emp.ID} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2.5 font-mono text-slate-400">{emp.ID}</td>
                          <td className="px-4 py-2.5 font-bold text-slate-800">{emp.Name}</td>
                          <td className="px-4 py-2.5 text-slate-600">{emp.Age} Thn</td>
                          <td className="px-2 py-2.5 text-slate-500">{emp.Gender}</td>
                          <td className="px-4 py-2.5">
                            <span className="px-2 py-0.5 roundedbg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold">{emp.Department}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono text-slate-600">Rp{emp.Salary.toLocaleString("id-ID")}</td>
                          <td className="px-4 py-2.5 text-center text-blue-600 font-bold">{emp.PerformanceScore.toFixed(1)}</td>
                          <td className="px-4 py-2.5 text-slate-600">{emp.Experience} Thn</td>
                          <td className="px-4 py-2.5 text-center">
                            {emp.Status === "Active" ? (
                              <span className="px-2 py-0.5 rounded-full bg-green-50 border border-green-100 text-green-600 text-[10px]">Aktif</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 text-[10px]">Inaktif</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
                <div>Menampilkan {filteredEmployees.length} dari total {fullEmployeeList.length} rekam data mentah.</div>
                <div>* Skor performa kosong otomatis diisi nilai tengah 3.0</div>
              </div>
            </div>
          )}

          {/* Tab 3: KRITERIA & BOBOT */}
          {activeTab === "kriteria" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Sliders className="text-blue-600 h-5 w-5" />
                Matriks Perbandingan Berpasangan AHP
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Sliders className="h-4 w-4 text-blue-600" />
                    Timbangan Prioritas Kerelasian Kriteria
                  </h4>
                  
                  {/* Slider controls */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1">
                        <span>C1. Skor Kinerja vs C2. Masa Kerja</span>
                        <span className="text-blue-600 font-bold text-[10px]">{getScaleLabel(sliders.comp_0_1)}</span>
                      </label>
                      <input 
                        type="range" min="-9" max="9" step="1" 
                        value={sliders.comp_0_1}
                        onChange={(e) => handleSliderChange("comp_0_1", Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1">
                        <span>C1. Skor Kinerja vs C3. Gaji Saat Ini</span>
                        <span className="text-blue-600 font-bold text-[10px]">{getScaleLabel(sliders.comp_0_2)}</span>
                      </label>
                      <input 
                        type="range" min="-9" max="9" step="1" 
                        value={sliders.comp_0_2}
                        onChange={(e) => handleSliderChange("comp_0_2", Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1">
                        <span>C1. Skor Kinerja vs C4. Usia Karyawan</span>
                        <span className="text-blue-600 font-bold text-[10px]">{getScaleLabel(sliders.comp_0_3)}</span>
                      </label>
                      <input 
                        type="range" min="-9" max="9" step="1" 
                        value={sliders.comp_0_3}
                        onChange={(e) => handleSliderChange("comp_0_3", Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1">
                        <span>C2. Masa Kerja vs C3. Gaji Saat Ini</span>
                        <span className="text-blue-600 font-bold text-[10px]">{getScaleLabel(sliders.comp_1_2)}</span>
                      </label>
                      <input 
                        type="range" min="-9" max="9" step="1" 
                        value={sliders.comp_1_2}
                        onChange={(e) => handleSliderChange("comp_1_2", Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1">
                        <span>C2. Masa Kerja vs C4. Usia Karyawan</span>
                        <span className="text-blue-600 font-bold text-[10px]">{getScaleLabel(sliders.comp_1_3)}</span>
                      </label>
                      <input 
                        type="range" min="-9" max="9" step="1" 
                        value={sliders.comp_1_3}
                        onChange={(e) => handleSliderChange("comp_1_3", Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1">
                        <span>C3. Gaji Saat Ini vs C4. Usia Karyawan</span>
                        <span className="text-blue-600 font-bold text-[10px]">{getScaleLabel(sliders.comp_2_3)}</span>
                      </label>
                      <input 
                        type="range" min="-9" max="9" step="1" 
                        value={sliders.comp_2_3}
                        onChange={(e) => handleSliderChange("comp_2_3", Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2">Bobot Relatif Hasil Pembobotan (PV)</h4>
                    <p className="text-xs text-slate-450 leading-relaxed mb-4">
                      Sliders di sebelah kiri secara otomatis menghitung nilai bobot kriteria AHP di bawah ini secara dinamis:
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Visual custom slider indicators */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-indigo-600">C1. Skor Kinerja ({ahpResult.weights[0] > 0 ? "Benefit" : ""})</span>
                        <span className="font-mono">{(ahpResult.weights[0] * 100).toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-indigo-600 h-2.5 rounded-full transition-all" style={{ width: `${ahpResult.weights[0] * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-emerald-600">C2. Masa Kerja ({ahpResult.weights[1] > 0 ? "Benefit" : ""})</span>
                        <span className="font-mono">{(ahpResult.weights[1] * 100).toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-emerald-600 h-2.5 rounded-full transition-all" style={{ width: `${ahpResult.weights[1] * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-amber-600">C3. Gaji Saat Ini ({ahpResult.weights[2] > 0 ? "Cost" : ""})</span>
                        <span className="font-mono">{(ahpResult.weights[2] * 100).toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-amber-600 h-2.5 rounded-full transition-all" style={{ width: `${ahpResult.weights[2] * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-rose-600">C4. Usia Karyawan ({ahpResult.weights[3] > 0 ? "Cost" : ""})</span>
                        <span className="font-mono">{(ahpResult.weights[3] * 100).toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-rose-600 h-2.5 rounded-full transition-all" style={{ width: `${ahpResult.weights[3] * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: PERHITUNGAN AHP */}
          {activeTab === "perhitungan-ahp" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calculator className="text-blue-600 h-5 w-5" />
                  Rincian Matriks &amp; Normalisasi AHP
                </h3>
                
                {ahpResult.isConsistent ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="h-3.5 w-3.5" />
                    KONSISTEN (CR &lt; 0.1)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <XCircle className="h-3.5 w-3.5" />
                    TIDAK KONSISTEN (CR &gt;= 0.1)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* 1. Matriks Perbandingan */}
                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Matriks Perbandingan Berpasangan (Diagonal 1)
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full text-xs text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                          <th className="px-3 py-2 text-left">Kriteria</th>
                          <th className="px-2 py-2">C1 (Perf)</th>
                          <th className="px-2 py-2">C2 (Exp)</th>
                          <th className="px-2 py-2">C3 (Sal)</th>
                          <th className="px-2 py-2">C4 (Age)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {["C1. Kinerja", "C2. Masa Kerja", "C3. Gaji", "C4. Usia"].map((label, idxRow) => (
                          <tr key={label}>
                            <td className="px-3 py-2 text-left font-sans font-semibold text-slate-700">{label}</td>
                            <td className="px-2 py-2">{ahpResult.matrix[idxRow][0].toFixed(4)}</td>
                            <td className="px-2 py-2">{ahpResult.matrix[idxRow][1].toFixed(4)}</td>
                            <td className="px-2 py-2">{ahpResult.matrix[idxRow][2].toFixed(4)}</td>
                            <td className="px-2 py-2">{ahpResult.matrix[idxRow][3].toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Matriks Normalisasi */}
                <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                  <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Hasil Matriks Normalisasi &amp; Priority Vector W
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full text-xs text-center border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                          <th className="px-3 py-2 text-left">Kriteria</th>
                          <th className="px-2 py-2">C1</th>
                          <th className="px-2 py-2">C2</th>
                          <th className="px-2 py-2">C3</th>
                          <th className="px-2 py-2">C4</th>
                          <th className="px-3 py-2 bg-blue-50 text-blue-700 font-bold">W</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {["C1. Kinerja", "C2. Masa Kerja", "C3. Gaji", "C4. Usia"].map((label, idxRow) => (
                          <tr key={label}>
                            <td className="px-3 py-2 text-left font-sans font-semibold text-slate-700">{label}</td>
                            <td className="px-2 py-2">{ahpResult.normalMatrix[idxRow][0].toFixed(4)}</td>
                            <td className="px-2 py-2">{ahpResult.normalMatrix[idxRow][1].toFixed(4)}</td>
                            <td className="px-2 py-2">{ahpResult.normalMatrix[idxRow][2].toFixed(4)}</td>
                            <td className="px-2 py-2">{ahpResult.normalMatrix[idxRow][3].toFixed(4)}</td>
                            <td className="px-3 py-2 bg-blue-50/50 text-blue-700 font-bold">{ahpResult.weights[idxRow].toFixed(4)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Mathematikal diagnostic card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-[11px] sm:text-xs">
                <h5 className="font-bold text-slate-800 font-sans text-xs mb-3 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-blue-500" />
                  Alur Diagnostik Indeks Konsistensi AHP:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div className="bg-white border rounded-lg p-3">
                    <p className="text-slate-400 mb-0.5">Eigenvalue Maksimum (λmax)</p>
                    <p className="text-sm font-bold text-slate-800">{ahpResult.lambdaMax.toFixed(5)}</p>
                  </div>
                  <div className="bg-white border rounded-lg p-3">
                    <p className="text-slate-400 mb-0.5">Consistency Index (CI)</p>
                    <p className="text-sm font-bold text-slate-800">{ahpResult.ci.toFixed(5)}</p>
                  </div>
                  <div className="bg-white border rounded-lg p-3">
                    <p className="text-slate-400 mb-0.5">Random Index (RI, n=4)</p>
                    <p className="text-sm font-bold text-slate-800">0.90</p>
                  </div>
                  <div className="bg-white border rounded-lg p-3">
                    <p className="text-slate-400 mb-0.5">Consistency Ratio (CR)</p>
                    <p className={`text-sm font-bold ${ahpResult.isConsistent ? "text-green-600" : "text-rose-600"}`}>
                      {ahpResult.cr.toFixed(5)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: PERHITUNGAN TOPSIS */}
          {activeTab === "perhitungan-topsis" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Calculator className="text-blue-600 h-5 w-5" />
                Langkah Perhitungan TOPSIS (Sampel 15 Teratas)
              </h3>

              {topsisResult.items.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  Tidak ada data untuk dihitung. Silakan atur filter pada tab Dataset.
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Step A: Decision Matrix */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-sm text-slate-800">
                      Langkah 1 &amp; 2: Matriks Keputusan (X) &amp; Normalisasi (R)
                    </h5>
                    <p className="text-xs text-slate-500">
                      Normalisasi dihitung dengan membagi setiap elemen dengan akar jumlah kuadrat elemen kriteria yang sejenis.
                    </p>
                    
                    <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-[180px]">
                      <table className="table-auto w-full text-xs text-center border-collapse">
                        <thead className="bg-slate-50 font-bold text-slate-500 sticky top-0 border-b">
                          <tr>
                            <th className="px-3 py-2 text-left">Nama</th>
                            <th className="px-2 py-2">r1 (Kinerja)</th>
                            <th className="px-2 py-2">r2 (Pengalaman)</th>
                            <th className="px-2 py-2">r3 (Gaji)</th>
                            <th className="px-2 py-2">r4 (Usia)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {topsisResult.items.slice(0, 15).map(item => (
                            <tr key={item.employee.ID}>
                              <td className="px-3 py-1.5 text-left font-sans font-semibold text-slate-700">{item.employee.Name}</td>
                              <td className="px-2 py-1.5">{item.r_c1.toFixed(4)}</td>
                              <td className="px-2 py-1.5">{item.r_c2.toFixed(4)}</td>
                              <td className="px-2 py-1.5">{item.r_c3.toFixed(4)}</td>
                              <td className="px-2 py-1.5">{item.r_c4.toFixed(4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Step B: Weighted normalized */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-sm text-slate-800">
                      Langkah 3 &amp; 4: Matriks Ternormalisasi Terbobot (V)
                    </h5>
                    <p className="text-xs text-slate-500">
                      Masing-masing kolom dikalikan dengan bobot kriteria hasil AHP (W_1: {ahpResult.weights[0].toFixed(3)}, W_2: {ahpResult.weights[1].toFixed(3)}, W_3: {ahpResult.weights[2].toFixed(3)}, W_4: {ahpResult.weights[3].toFixed(3)}).
                    </p>
                    
                    <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-[180px]">
                      <table className="table-auto w-full text-xs text-center border-collapse">
                        <thead className="bg-slate-50 font-bold text-slate-500 sticky top-0 border-b">
                          <tr>
                            <th className="px-3 py-2 text-left">Nama</th>
                            <th className="px-2 py-2">v1 (Kinerja)</th>
                            <th className="px-2 py-2">v2 (Pengalaman)</th>
                            <th className="px-2 py-2">v3 (Gaji)</th>
                            <th className="px-2 py-2">v4 (Usia)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {topsisResult.items.slice(0, 15).map(item => (
                            <tr key={item.employee.ID}>
                              <td className="px-3 py-1.5 text-left font-sans font-semibold text-slate-700">{item.employee.Name}</td>
                              <td className="px-2 py-1.5">{item.v_c1.toFixed(4)}</td>
                              <td className="px-2 py-1.5">{item.v_c2.toFixed(4)}</td>
                              <td className="px-2 py-1.5">{item.v_c3.toFixed(4)}</td>
                              <td className="px-2 py-1.5">{item.v_c4.toFixed(4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Step C: Ideal solutions */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-sm text-slate-800">
                      Langkah 5: Penentuan Solusi Ideal Positif (A+) &amp; Negatif (A-)
                    </h5>
                    
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="table-auto w-full text-xs text-center border-collapse">
                        <thead className="bg-slate-50 font-bold text-slate-500 border-b">
                          <tr>
                            <th className="px-3 py-2 text-left">Jenis Solusi</th>
                            <th className="px-2 py-2">C1 (Perf)</th>
                            <th className="px-2 py-2">C2 (Exp)</th>
                            <th className="px-2 py-2">C3 (Sal) [Cost]</th>
                            <th className="px-2 py-2">C4 (Age) [Cost]</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          <tr className="bg-emerald-50/50">
                            <td className="px-3 py-2.5 text-left font-sans font-bold text-emerald-800">Ideal Positif (A+)</td>
                            <td className="px-2 py-2.5 text-emerald-700 font-semibold">{topsisResult.idealPositive[0].toFixed(5)}</td>
                            <td className="px-2 py-2.5 text-emerald-700 font-semibold">{topsisResult.idealPositive[1].toFixed(5)}</td>
                            <td className="px-2 py-2.5 text-emerald-700 font-semibold">{topsisResult.idealPositive[2].toFixed(5)}</td>
                            <td className="px-2 py-2.5 text-emerald-700 font-semibold">{topsisResult.idealPositive[3].toFixed(5)}</td>
                          </tr>
                          <tr className="bg-rose-50/50">
                            <td className="px-3 py-2.5 text-left font-sans font-bold text-rose-800">Ideal Negatif (A-)</td>
                            <td className="px-2 py-2.5 text-rose-700 font-semibold">{topsisResult.idealNegative[0].toFixed(5)}</td>
                            <td className="px-2 py-2.5 text-rose-700 font-semibold">{topsisResult.idealNegative[1].toFixed(5)}</td>
                            <td className="px-2 py-2.5 text-rose-700 font-semibold">{topsisResult.idealNegative[2].toFixed(5)}</td>
                            <td className="px-2 py-2.5 text-rose-700 font-semibold">{topsisResult.idealNegative[3].toFixed(5)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* Tab 6: RANKING */}
          {activeTab === "ranking" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-150 pb-3 gap-2">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Award className="text-blue-600 h-5 w-5" />
                  Matriks Pembobotan Preferensi Akhir &amp; Urutan Ranking
                </h3>
              </div>

              {topsisResult.items.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-sans">
                  Tidak ada data untuk diurutkan. Silakan atur filter pada tab Dataset.
                </div>
              ) : (
                <div className="flex flex-col xl:flex-row gap-6">
                  {/* Left Column: Chart Card */}
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                      <h4 className="font-bold text-slate-800 text-sm">Visualisasi Ranking TOPSIS (Top 10)</h4>
                      <div className="flex gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-slate-200 text-slate-500">D+ High</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-slate-200 text-slate-500">D- Low</span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between gap-6 bg-slate-50/40">
                      <div className="space-y-4">
                        {topsisResult.items.slice(0, 10).map((item, index) => {
                          let rankColor = "bg-blue-600";
                          if (index === 0) rankColor = "bg-yellow-500";
                          else if (index === 1) rankColor = "bg-slate-400";
                          else if (index === 2) rankColor = "bg-amber-600";
                          
                          return (
                            <div key={item.employee.ID}>
                              <div className="flex justify-between items-end mb-1">
                                <span className="text-xs font-bold text-slate-700">
                                  {index + 1}. {item.employee.Name} <span className="text-slate-400 font-mono text-[10px] font-normal">({item.employee.Department})</span>
                                </span>
                                <span className="text-[10px] font-mono font-bold text-blue-600">
                                  {item.preferenceWeight.toFixed(4)}
                                </span>
                              </div>
                              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-500 ${rankColor}`} 
                                  style={{ width: `${item.preferenceWeight * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-4 bg-white rounded-xl border border-dashed border-slate-300 shadow-3xs mt-4">
                        <p className="text-[11px] text-slate-500 leading-relaxed italic">
                          "Analisis menunjukkan <b>{bestCandidate?.employee.Name}</b> memiliki skor tertinggi berkat konsistensi pada kriteria <b>Skor Kinerja</b> dan masa kontribusi optimal, yang memiliki bobot AHP tertinggi ({(ahpResult.weights[0] * 100).toFixed(1)}%)."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Decisions Table */}
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 flex flex-col shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-white">
                      <h4 className="font-bold text-slate-800 text-sm">Tabel Keputusan &amp; Preferensi</h4>
                    </div>
                    
                    <div className="p-0 flex-1 overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                            <th className="px-4 py-3">Rank</th>
                            <th className="px-4 py-3">Alternatif / Karyawan</th>
                            <th className="px-4 py-3 text-right">Skor (Preferensi)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {topsisResult.items.map((item, index) => {
                            return (
                              <tr 
                                key={item.employee.ID} 
                                className={`hover:bg-slate-50/70 transition-colors ${index === 0 ? "bg-blue-50/20" : ""}`}
                              >
                                <td className={`px-4 py-3.5 font-bold ${index === 0 ? "text-blue-600" : "text-slate-400 font-mono text-[11px]"}`}>
                                  {index === 0 ? "🥇 01" : index === 1 ? "🥈 02" : index === 2 ? "🥉 03" : `#${index + 1}`}
                                </td>
                                <td className="px-4 py-3.5 text-slate-800 font-bold">
                                  {item.employee.Name}
                                  <div className="text-[9px] text-slate-400 font-mono font-medium mt-0.5">
                                    ID: {item.employee.ID} • {item.employee.Department}
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-bold text-blue-600">
                                  {item.preferenceWeight.toFixed(4)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 7: REKOMENDASI */}
          {activeTab === "rekomendasi" && (
            <div className="space-y-6 animate-fade-in printing-area font-sans">
              
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="text-blue-600 h-5 w-5" />
                  Rekomendasi Utama Promosi Struktural
                </h3>
                <button 
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-300 text-slate-800 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Cetak Surat Keputusan
                </button>
              </div>

              {!bestCandidate ? (
                <div className="p-8 text-center text-slate-400">
                  Tidak ada alternatif yang dibandingkan. Atur ulang filter departemen atau pencarian.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-6">
                  
                  {/* Letterhead */}
                  <div className="border-b-2 border-slate-400 pb-4 text-center">
                    <h4 className="font-extrabold text-[#111827] uppercase tracking-wide text-sm sm:text-base">
                      SURAT UTUSAN REKOMENDASI PROMOSI JABATAN
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">Ref No: SK-SPK/{bestCandidate.employee.ID}/UI-2026</p>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 font-sans">
                    <p>
                      Berdasarkan hasil analisis sistem pendukung keputusan promosi jabatan menggunakan gabungan terstruktur dari metode <strong>AHP (Analytis Hierarchy Process)</strong> dan <strong>TOPSIS</strong>, dengan rincian data karyawan murni perusahaan yang sah, diputuskan bahwa kandidat berikut menduduki pemeringkatan tertinggi:
                    </p>

                    <div className="bg-white border rounded-xl p-4 sm:p-5 space-y-3 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-2">
                        <span className="text-xs text-slate-450">ID / Nama Karyawan</span>
                        <span className="font-bold text-slate-900 text-sm">{bestCandidate.employee.Name} (ID #{bestCandidate.employee.ID})</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                        <div>
                          <p className="text-slate-450 mb-0.5">Departemen Asal</p>
                          <p className="text-slate-800 font-bold">{bestCandidate.employee.Department}</p>
                        </div>
                        <div>
                          <p className="text-slate-450 mb-0.5">Gender / Lokasi</p>
                          <p className="text-slate-800 font-bold">{bestCandidate.employee.Gender} / {bestCandidate.employee.Location}</p>
                        </div>
                        <div>
                          <p className="text-slate-450 mb-0.5">Masa Kerja (C2)</p>
                          <p className="text-slate-800 font-bold">{bestCandidate.c2_value} Tahun</p>
                        </div>
                        <div>
                          <p className="text-slate-450 mb-0.5">Usia Karyawan (C4)</p>
                          <p className="text-slate-800 font-bold">{bestCandidate.c4_value} Tahun</p>
                        </div>
                        <div>
                          <p className="text-slate-450 mb-0.5">Gaji Saat Ini (C3)</p>
                          <p className="text-slate-800 font-bold">Rp{bestCandidate.c3_value.toLocaleString("id-ID")}</p>
                        </div>
                        <div>
                          <p className="text-slate-450 mb-0.5 font-bold text-indigo-600">Skor Kinerja (C1)</p>
                          <p className="text-indigo-600 font-extrabold">{bestCandidate.c1_value.toFixed(1)} / 5.0</p>
                        </div>
                      </div>

                      <div className="bg-blue-50 text-blue-700 p-3 rounded-lg flex justify-between items-center text-xs font-bold border border-blue-200 mt-2">
                        <span>Skor Preferensi TOPSIS (P_i)</span>
                        <span className="font-mono text-sm">{bestCandidate.preferenceWeight.toFixed(5)}</span>
                      </div>
                    </div>

                    <p>
                      Kandidat <strong>{bestCandidate.employee.Name}</strong> terpilih karena mengantongi parameter keserasian kriteria yang superior. Sesuai bobot nilai prioritas AHP yang condong pada **Skor Kinerja unggul** ({ (ahpResult.weights[0] * 100).toFixed(1) }%), serta optimalitas kriteria birokrasi biaya gaji dan faktor sisa usia masa produktif, kandidat ini dinilai paling relevan dicalonkan menjadi pimpinan divisi struktural berikutnya.
                    </p>
                  </div>

                  <div className="pt-6 flex justify-between text-xs font-semibold text-slate-500 border-t">
                    <div className="text-center">
                      <p className="mb-12">Ketua Tim Penilai Promosi</p>
                      <p className="border-t border-slate-400 pt-1 font-bold text-slate-700">Titis I. D., M.Kom.</p>
                    </div>
                    <div className="text-center">
                      <p className="mb-12">Jakarta, 5 Juni 2026</p>
                      <p className="border-t border-slate-400 pt-1 font-bold text-slate-700">Sistem SPK Terautomasi</p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
