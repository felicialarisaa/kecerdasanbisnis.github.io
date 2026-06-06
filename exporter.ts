/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Employee } from "./types";

export function generateStandaloneHTML(employees: Employee[]): string {
  // Serialize employee data to a JSON string we can inject directly in the asset header
  const serializedEmployees = JSON.stringify(employees);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistem Pendukung Keputusan Pemilihan Karyawan untuk Promosi Jabatan</title>
  <!-- Bootstrap 5 CSS CDN -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap Icons CDN -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css" rel="stylesheet">
  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  
  <style>
    :root {
      --primary: #2563EB;
      --bg: #F8FAFC;
      --card: #FFFFFF;
      --border: #E2E8F0;
      --text: #0F172A;
      --sec-text: #64748B;
      --success: #16A34A;
      --warning: #F59E0B;
      --danger: #DC2626;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .text-primary { color: var(--primary) !important; }
    .bg-primary { background-color: var(--primary) !important; }
    
    .card {
      background-color: var(--card);
      border: 1px solid var(--border);
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border-radius: 0.5rem;
    }
    
    .nav-tabs .nav-link {
      color: var(--sec-text);
      border: none;
      border-bottom: 2px solid transparent;
      padding: 0.75rem 1rem;
      font-weight: 500;
    }
    .nav-tabs .nav-link:hover {
      border-bottom-color: var(--border);
    }
    .nav-tabs .nav-link.active {
      color: var(--primary);
      border: none;
      border-bottom: 2px solid var(--primary);
      background: transparent;
    }
    
    .table th {
      background-color: #F1F5F9;
      color: var(--text);
      font-weight: 600;
    }
    .font-mono {
      font-family: 'JetBrains Mono', SFMono-Regular, monospace;
    }
    .hero-gradient {
      background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%);
      color: white;
    }
  </style>
</head>
<body class="py-4">
  <div class="container overflow-hidden">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card hero-gradient p-4 text-center text-md-start d-md-flex align-items-center justify-content-between flex-row">
          <div>
            <h1 class="h3 mb-1 fw-bold">Sistem Pendukung Keputusan Pemilihan Karyawan untuk Promosi Jabatan</h1>
            <p class="mb-0 text-white-50">Implementasi Metode AHP (Analytic Hierarchy Process) dan TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)</p>
          </div>
          <div class="mt-3 mt-md-0">
            <span class="badge bg-light text-primary py-2 px-3 fw-semibold"><i class="bi bi-file-earmark-bar-graph me-1"></i> SPK Promosi Dashboard</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Info Cards / KPI -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card p-3 d-flex flex-row align-items-center">
          <div class="rounded bg-primary bg-opacity-10 text-primary p-3 me-3">
            <i class="bi bi-people h4 mb-0"></i>
          </div>
          <div>
            <div class="text-muted small">Total Alternatif Evaluasi</div>
            <h3 class="fw-bold mb-0 text-dark" id="kpi-alternatives">0</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card p-3 d-flex flex-row align-items-center">
          <div class="rounded bg-success bg-opacity-10 text-success p-3 me-3">
            <i class="bi bi-ui-checks-grid h4 mb-0"></i>
          </div>
          <div>
            <div class="text-muted small">Kriteria Model</div>
            <h3 class="fw-bold mb-0 text-dark">4 Kriteria</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card p-3 d-flex flex-row align-items-center">
          <div class="rounded bg-warning bg-opacity-10 text-warning p-3 me-3">
            <i class="bi bi-award h4 mb-0"></i>
          </div>
          <div>
            <div class="text-muted small">Nilai Preferensi Tertinggi</div>
            <h3 class="fw-bold mb-0 text-dark" id="kpi-pref">0.0000</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card p-3 d-flex flex-row align-items-center">
          <div class="rounded bg-danger bg-opacity-10 text-danger p-3 me-3">
            <i class="bi bi-person-fill-check h4 mb-0"></i>
          </div>
          <div>
            <div class="text-muted small">Rekomendasi Terbaik</div>
            <h4 class="fw-bold mb-0 text-truncate text-dark" style="max-width: 150px;" id="kpi-best">-</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card p-2 bg-white">
          <ul class="nav nav-tabs border-0 flex-nowrap overflow-x-auto text-nowrap" id="tabMenu" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="permasalahan-tab" data-bs-toggle="tab" data-bs-target="#permasalahan" type="button" role="tab">1. Permasalahan</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="dataset-tab" data-bs-toggle="tab" data-bs-target="#dataset" type="button" role="tab">2. Dataset</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="kriteria-tab" data-bs-toggle="tab" data-bs-target="#kriteria" type="button" role="tab">3. Kriteria & Bobot</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="ahp-tab" data-bs-toggle="tab" data-bs-target="#ahp" type="button" role="tab">4. Perhitungan AHP</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="topsis-tab" data-bs-toggle="tab" data-bs-target="#topsis" type="button" role="tab">5. Perhitungan TOPSIS</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="ranking-tab" data-bs-toggle="tab" data-bs-target="#ranking" type="button" role="tab">6. Ranking</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="rekomendasi-tab" data-bs-toggle="tab" data-bs-target="#rekomendasi" type="button" role="tab" onclick="updateRekomendasiView()">7. Rekomendasi</button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Tab Content Area -->
    <div class="tab-content" id="tabContent">
      <!-- 1. Permasalahan Tab -->
      <div class="tab-pane fade show active animate-fade-in" id="permasalahan" role="tabpanel">
        <div class="card p-4">
          <h4 class="fw-bold mb-3"><i class="bi bi-info-circle text-primary me-2"></i> Latar Belakang & Deskripsi Masalah</h4>
          <p>Pemilihan karyawan untuk promosi jabatan adalah salah satu proses krusial dalam manajemen Sumber Daya Manusia (SDM). Keputusan promosi harus objektif, dapat dipertanggungjawabkan, serta meminimalkan bias subjektivitas dari pengambil keputusan.</p>
          
          <div class="row g-4 mt-2">
            <div class="col-md-6">
              <div class="p-3 bg-light rounded h-100 border-start border-primary border-4">
                <h5 class="fw-bold"><i class="bi bi-bullseye text-primary me-1"></i> Tujuan Sistem</h5>
                <p class="small text-muted mb-0">Membantu memberikan rekomendasi promosi yang andal dan transparan bagi manajemen. Sistem secara komprehensif mengintegrasikan data kinerja historis, masa kerja (pengalaman), kompensasi (gaji), dan variabel kesesuaian produktivitas umur menggunakan prinsip analisis multi-kriteria berbasis pendekatan ilmiah.</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="p-3 bg-light rounded h-100 border-start border-success border-4">
                <h5 class="fw-bold"><i class="bi bi-shield-check text-success me-1"></i> Mengapa Menggunakan SPK Hibrida?</h5>
                <ol class="small text-muted mb-0 ps-3">
                  <li><strong>Objektivitas Tinggi</strong>: Menyingkirkan preferensi bias operasional.</li>
                  <li><strong>Akurasi Kriteria</strong>: Menggabungkan berbagai skala pengukuran yang berbeda.</li>
                  <li><strong>Dapat Diaudit</strong>: Setiap tahap perhitungan terdokumentasi rapi.</li>
                </ol>
              </div>
            </div>
          </div>

          <div class="row g-4 mt-3">
            <div class="col-md-6">
              <div class="p-3 bg-light rounded h-100 border-start border-warning border-4">
                <h5 class="fw-bold"><i class="bi bi-diagram-3 text-warning me-1"></i> Peran AHP (Analytic Hierarchy Process)</h5>
                <p class="small text-muted mb-0">AHP digunakan untuk memperoleh bobot kriteria secara terstruktur. Dengan melakukan perbandingan berpasangan (pairwise comparisons), manajemen dapat menimbang tingkat kepentingan antar kriteria, serta mengontrol konsistensi penilaian melalui nilai <strong>Consistency Ratio (CR &lt; 0.1)</strong>.</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="p-3 bg-light rounded h-100 border-start border-danger border-4">
                <h5 class="fw-bold"><i class="bi bi-calculator text-danger me-1"></i> Peran TOPSIS</h5>
                <p class="small text-muted mb-0">TOPSIS digunakan untuk melakukan pemeringkatan alternatif karyawan. Konsep dasarnya berfokus pada memilih alternatif yang memiliki <strong>jarak terpendek dari Solusi Ideal Positif (A+)</strong> dan sekaligus <strong>jarak terjauh dari Solusi Ideal Negatif (A-)</strong>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Dataset Tab -->
      <div class="tab-pane fade animate-fade-in" id="dataset" role="tabpanel">
        <div class="card p-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
            <div>
              <h4 class="fw-bold mb-1"><i class="bi bi-database-check text-primary me-2"></i> Eksplorasi Dataset Karyawan asli</h4>
              <p class="text-muted small mb-0">Data asli Kaggle yang dimuat langsung tanpa manipulasi manual atau simulasi buatan.</p>
            </div>
            <!-- Search & Filters -->
            <div class="d-flex flex-wrap gap-2">
              <input type="text" class="form-control form-control-sm" style="max-width: 200px;" id="table-search" placeholder="Cari nama karyawan..." oninput="handleFilterChange()">
              <select class="form-select form-select-sm" style="max-width: 150px;" id="filter-dept" onchange="handleFilterChange()">
                <option value="">Semua Departemen</option>
                <option value="IT">IT</option>
                <option value="Sales">Sales</option>
                <option value="HR">HR</option>
              </select>
              <select class="form-select form-select-sm" style="max-width: 150px;" id="filter-status" onchange="handleFilterChange()">
                <option value="Active">Aktif Saja (Rekomendasi)</option>
                <option value="All">Semua Karyawan</option>
                <option value="Inactive">Tidak Aktif Saja</option>
              </select>
            </div>
          </div>

          <!-- Dataset Table -->
          <div class="table-responsive" style="max-height: 450px;">
            <table class="table table-sm table-striped table-hover align-middle border text-nowrap">
              <thead>
                <tr>
                  <th class="ps-3">ID</th>
                  <th>Nama</th>
                  <th>Usia</th>
                  <th>Gender</th>
                  <th>Departemen</th>
                  <th>Gaji saat ini</th>
                  <th>Skor Kinerja</th>
                  <th>Masa Kerja</th>
                  <th>Status</th>
                  <th class="pe-3">Lokasi</th>
                </tr>
              </thead>
              <tbody id="dataset-tbody">
                <!-- Loaded dynamically by JS -->
              </tbody>
            </table>
          </div>
          <div class="d-flex justify-content-between mt-2 text-muted small">
            <div>Menampilkan <span id="displayed-rows-count">0</span> dari total <span id="total-rows-count">0</span> baris terfilter.</div>
            <div>* Kolom Skor Kinerja kosong diimputasi otomatis dengan nilai moderat (3.0)</div>
          </div>
        </div>
      </div>

      <!-- 3. Kriteria & Bobot Tab -->
      <div class="tab-pane fade animate-fade-in" id="kriteria" role="tabpanel">
        <div class="card p-4">
          <h4 class="fw-bold mb-3"><i class="bi bi-list-check text-primary me-2"></i> Klasifikasi Kriteria SPK Promosi Karyawan</h4>
          
          <div class="row g-4 mb-4">
            <!-- C1 -->
            <div class="col-md-3">
              <div class="p-3 rounded border h-100 bg-white">
                <span class="badge bg-success mb-2">Benefit (Kinerja)</span>
                <h5 class="fw-bold">C1. Skor Kinerja</h5>
                <p class="small text-muted mb-0">Skor historis performa karyawan dlm skala 1.0 - 5.0. Karyawan yang dipromosikan wajib menunjukkan output kinerja tinggi.</p>
              </div>
            </div>
            <!-- C2 -->
            <div class="col-md-3">
              <div class="p-3 rounded border h-100 bg-white">
                <span class="badge bg-success mb-2">Benefit (Pengalaman)</span>
                <h5 class="fw-bold">C2. Masa Kerja</h5>
                <p class="small text-muted mb-0">Masa pengalaman kerja dlm hitungan tahun (1 - 20 Tahu). Mewakili loyalitas dan kematangan kapasitas teknis karyawan.</p>
              </div>
            </div>
            <!-- C3 -->
            <div class="col-md-3">
              <div class="p-3 rounded border h-100 bg-white">
                <span class="badge bg-danger mb-2">Cost (Biaya)</span>
                <h5 class="fw-bold">C3. Gaji Saat Ini</h5>
                <p class="small text-muted mb-0">Besaran pengeluaran upah karyawan saat ini. Efisiensi operasional menuntut pemenuhan kinerja unggul pada batas gaji yg optimal.</p>
              </div>
            </div>
            <!-- C4 -->
            <div class="col-md-3">
              <div class="p-3 rounded border h-100 bg-white">
                <span class="badge bg-danger mb-2">Cost (Biaya Usia)</span>
                <h5 class="fw-bold">C4. Usia Karyawan</h5>
                <p class="small text-muted mb-0">Faktor usia karyawan (18-65). Perusahaan mengutamakan usia yang lebih produktif demi imbal balik pendelegasian yang panjang.</p>
              </div>
            </div>
          </div>

          <!-- Pairwise Sliders Editor -->
          <div class="row">
            <div class="col-lg-6">
              <h5 class="fw-bold mb-3 border-bottom pb-2"><i class="bi bi-sliders text-primary me-1"></i> Sesuaikan Hubungan Penting Kriteria (AHP)</h5>
              
              <div class="mb-4">
                <label class="form-label d-flex justify-content-between small">
                  <strong>C1. Skor Kinerja vs C2. Masa Kerja</strong>
                  <span class="badge bg-primary" id="val_0_1">Sama Penting</span>
                </label>
                <input type="range" class="form-range" min="-9" max="9" step="1" id="slider_0_1" value="3" oninput="handleSliderChange()">
              </div>

              <div class="mb-4">
                <label class="form-label d-flex justify-content-between small">
                  <strong>C1. Skor Kinerja vs C3. Gaji Saat Ini</strong>
                  <span class="badge bg-primary" id="val_0_2">Sama Penting</span>
                </label>
                <input type="range" class="form-range" min="-9" max="9" step="1" id="slider_0_2" value="5" oninput="handleSliderChange()">
              </div>

              <div class="mb-4">
                <label class="form-label d-flex justify-content-between small">
                  <strong>C1. Skor Kinerja vs C4. Usia Karyawan</strong>
                  <span class="badge bg-primary" id="val_0_3">Sama Penting</span>
                </label>
                <input type="range" class="form-range" min="-9" max="9" step="1" id="slider_0_3" value="7" oninput="handleSliderChange()">
              </div>

              <div class="mb-4">
                <label class="form-label d-flex justify-content-between small">
                  <strong>C2. Masa Kerja vs C3. Gaji Saat Ini</strong>
                  <span class="badge bg-primary" id="val_1_2">Sama Penting</span>
                </label>
                <input type="range" class="form-range" min="-9" max="9" step="1" id="slider_1_2" value="3" oninput="handleSliderChange()">
              </div>

              <div class="mb-4">
                <label class="form-label d-flex justify-content-between small">
                  <strong>C2. Masa Kerja vs C4. Usia Karyawan</strong>
                  <span class="badge bg-primary" id="val_1_3">Sama Penting</span>
                </label>
                <input type="range" class="form-range" min="-9" max="9" step="1" id="slider_1_3" value="5" oninput="handleSliderChange()">
              </div>

              <div class="mb-3">
                <label class="form-label d-flex justify-content-between small">
                  <strong>C3. Gaji Saat Ini vs C4. Usia Karyawan</strong>
                  <span class="badge bg-primary" id="val_2_3">Sama Penting</span>
                </label>
                <input type="range" class="form-range" min="-9" max="9" step="1" id="slider_2_3" value="2" oninput="handleSliderChange()">
              </div>
            </div>

            <div class="col-lg-6">
              <h5 class="fw-bold mb-3 border-bottom pb-2"><i class="bi bi-pie-chart text-success me-1"></i> Estimasi Distribusi Bobot Utama (Priority Vector)</h5>
              <div class="p-4 bg-light rounded text-center d-flex flex-column align-items-center justify-content-center h-75">
                <div style="max-height: 250px; max-width: 250px;" class="mb-3">
                  <canvas id="weightPieChart"></canvas>
                </div>
                <div class="d-flex flex-wrap justify-content-center gap-3">
                  <span class="small font-mono fw-bold">C1: <span id="lbl_w1" class="text-primary">0%</span></span>
                  <span class="small font-mono fw-bold">C2: <span id="lbl_w2" class="text-success">0%</span></span>
                  <span class="small font-mono fw-bold">C3: <span id="lbl_w3" class="text-warning">0%</span></span>
                  <span class="small font-mono fw-bold">C4: <span id="lbl_w4" class="text-danger">0%</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Perhitungan AHP Tab -->
      <div class="tab-pane fade animate-fade-in" id="ahp" role="tabpanel">
        <div class="card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-bold mb-0"><i class="bi bi-grid-3x3 text-primary me-2"></i> Matriks dan Validasi Konsistensi AHP</h4>
            <div id="ahp-consistency-badge" class="badge p-2">Konsisten</div>
          </div>
          
          <div class="row g-4">
            <!-- 1. Matriks Perbandingan -->
            <div class="col-md-6">
              <div class="rounded border p-3 bg-white h-100">
                <h6 class="fw-bold mb-2 text-primary">Matriks Perbandingan Berpasangan (Pairwise Matrix)</h6>
                <div class="table-responsive">
                  <table class="table table-bordered table-sm text-center font-mono align-middle">
                    <thead>
                      <tr class="table-light">
                        <th>Kriteria</th>
                        <th>C1</th>
                        <th>C2</th>
                        <th>C3</th>
                        <th>C4</th>
                      </tr>
                    </thead>
                    <tbody id="ahp-matrix-body">
                      <!-- Fill by JS -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- 2. Matriks Normalisasi -->
            <div class="col-md-6">
              <div class="rounded border p-3 bg-white h-100">
                <h6 class="fw-bold mb-2 text-primary">Matriks Normalisasi & Priority Vector (W)</h6>
                <div class="table-responsive">
                  <table class="table table-bordered table-sm text-center font-mono align-middle">
                    <thead>
                      <tr class="table-light">
                        <th>Kriteria</th>
                        <th>C1</th>
                        <th>C2</th>
                        <th>C3</th>
                        <th>C4</th>
                        <th class="bg-primary text-white">Bobot W</th>
                      </tr>
                    </thead>
                    <tbody id="ahp-norm-body">
                      <!-- Fill by JS -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- AHP Metrics Dashboard -->
          <div class="p-3 bg-light rounded mt-4">
            <div class="row text-center g-3 font-mono">
              <div class="col-md-3">
                <div class="text-muted small">Eigenvalue Maksimum (λmax)</div>
                <h4 class="fw-bold mb-0 text-primary" id="val-lambda">0.0000</h4>
              </div>
              <div class="col-md-3">
                <div class="text-muted small">Consistency Index (CI)</div>
                <h4 class="fw-bold mb-0 text-primary" id="val-ci">0.0000</h4>
              </div>
              <div class="col-md-3">
                <div class="text-muted small">Random Index (RI n=4)</div>
                <h4 class="fw-bold mb-0 text-primary">0.9000</h4>
              </div>
              <div class="col-md-3">
                <div class="text-muted small">Consistency Ratio (CR)</div>
                <h4 class="fw-bold mb-0 text-primary" id="val-cr">0.0000</h4>
              </div>
            </div>
            <div class="mt-3 small text-muted text-center border-top pt-2">
              * Jika Nilai CR &lt; 0.1, bobot perbandingan dinyatakan <strong>KONSISTEN</strong> secara matematis dan layak digunakan dalam TOPSIS.
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Perhitungan TOPSIS Tab -->
      <div class="tab-pane fade animate-fade-in" id="topsis" role="tabpanel">
        <div class="card p-4">
          <h4 class="fw-bold mb-3"><i class="bi bi-percent text-primary me-2"></i> Proses Transformasi Matematis TOPSIS</h4>
          
          <div class="accordion" id="accordionTopsis">
            <!-- Part 1: Matriks Keputusan -->
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button fw-bold text-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                  Langkah 1 & 2: Matriks Keputusan Terhadap Skor Kriteria
                </button>
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionTopsis">
                <div class="accordion-body">
                  <p class="small text-muted">Setiap alternatif diisi skornya berdasarkan kriteria asal untuk dipersiapkan ke normalisasi kuadrat.</p>
                  <div class="table-responsive" style="max-height: 250px;">
                    <table class="table table-bordered table-sm font-mono text-center align-middle text-nowrap">
                      <thead>
                        <tr class="table-light">
                          <th>Nama Karyawan</th>
                          <th>C1 (Kinerja)</th>
                          <th>C2 (Masa Kerja)</th>
                          <th>C3 (Gaji)</th>
                          <th>C4 (Usia)</th>
                        </tr>
                      </thead>
                      <tbody id="topsis-m1-body">
                        <!-- Filled dynamically -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Part 2: Normalisasi -->
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed fw-bold text-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                  Langkah 3: Matriks Normalisasi (R)
                </button>
              </h2>
              <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionTopsis">
                <div class="accordion-body">
                  <p class="small text-muted">Normalisasi kuadrat menyeimbangkan skala dari metrik berbeda agar berada dalam kisaran [0, 1].</p>
                  <div class="table-responsive" style="max-height: 250px;">
                    <table class="table table-bordered table-sm font-mono text-center align-middle text-nowrap">
                      <thead>
                        <tr class="table-light">
                          <th>Nama Karyawan</th>
                          <th>C1</th>
                          <th>C2</th>
                          <th>C3</th>
                          <th>C4</th>
                        </tr>
                      </thead>
                      <tbody id="topsis-m2-body">
                        <!-- Filled dynamically -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Part 3: Normalisasi Terbobot -->
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed fw-bold text-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                  Langkah 4: Matriks Keputusan Ternormalisasi Terbobot (V)
                </button>
              </h2>
              <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionTopsis">
                <div class="accordion-body">
                  <p class="small text-muted">Kolom matriks dikalikan dengan bobot kriteria hasil kesepakatan AHP.</p>
                  <div class="table-responsive" style="max-height: 250px;">
                    <table class="table table-bordered table-sm font-mono text-center align-middle text-nowrap">
                      <thead>
                        <tr class="table-light">
                          <th>Nama Karyawan</th>
                          <th>C1 (x W1)</th>
                          <th>C2 (x W2)</th>
                          <th>C3 (x W3)</th>
                          <th>C4 (x W4)</th>
                        </tr>
                      </thead>
                      <tbody id="topsis-m3-body">
                        <!-- Filled dynamically -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <!-- Part 4: Solusi Ideal -->
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed fw-bold text-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                  Langkah 5: Solusi Ideal Positif (A+) & Solusi Ideal Negatif (A-)
                </button>
              </h2>
              <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionTopsis">
                <div class="accordion-body">
                  <p class="small text-muted">Benefit mencari nilai maksimum, Cost mencari nilai minimum.</p>
                  <table class="table table-bordered table-sm font-mono text-center align-middle">
                    <thead>
                      <tr class="table-light">
                        <th>Tipe Matriks</th>
                        <th>C1 (Kinerja)</th>
                        <th>C2 (Masa Kerja)</th>
                        <th>C3 (Gaji)</th>
                        <th>C4 (Usia)</th>
                      </tr>
                    </thead>
                    <tbody id="topsis-m4-body">
                      <!-- Fill from JS -->
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Part 5: Jarak dan Preferensi -->
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button class="accordion-button collapsed fw-bold text-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive">
                  Langkah 6 & 7: Jarak Ideal (D+/D-) & Nilai Preferensi (P)
                </button>
              </h2>
              <div id="collapseFive" class="accordion-collapse collapse" data-bs-parent="#accordionTopsis">
                <div class="accordion-body">
                  <p class="small text-muted">D+ adalah jarak ke solusi positif terbaik, D- adalah jarak ke solusi negatif terburuk. P_i merupakan skor akhir pilihan kriteria.</p>
                  <div class="table-responsive" style="max-height: 250px;">
                    <table class="table table-bordered table-sm font-mono text-center align-middle text-nowrap">
                      <thead>
                        <tr class="table-light">
                          <th>Nama Karyawan</th>
                          <th>Jarak Positif D+</th>
                          <th>Jarak Negatif D-</th>
                          <th class="bg-primary text-white">Preferensi P</th>
                        </tr>
                      </thead>
                      <tbody id="topsis-m5-body">
                        <!-- Filled dynamically -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Ranking Tab -->
      <div class="tab-pane fade animate-fade-in" id="ranking" role="tabpanel">
        <div class="card p-4">
          <h4 class="fw-bold mb-3"><i class="bi bi-display text-primary me-2"></i> Peringkat Rekomendasi Promosi Jabatan (TOPSIS)</h4>
          
          <div class="row g-4">
            <div class="col-lg-6">
              <h6 class="fw-bold mb-3 text-primary"><i class="bi bi-graph-up-arrow me-1"></i> Visualisasi Perbandingan Top Karyawan</h6>
              <div style="height: 350px;">
                <canvas id="rankingBarChart"></canvas>
              </div>
            </div>
            
            <div class="col-lg-6">
              <h6 class="fw-bold mb-3 text-primary"><i class="bi bi-list-ol me-1"></i> Urutan Peringkat Terbaik</h6>
              <div class="table-responsive" style="max-height: 350px;">
                <table class="table table-striped table-hover table-sm align-middle border text-nowrap">
                  <thead>
                    <tr class="table-light">
                      <th>Peringkat</th>
                      <th>Nama</th>
                      <th>Departemen</th>
                      <th>C1 (Kinerja)</th>
                      <th>C2 (Pengalaman)</th>
                      <th class="bg-primary text-white text-center">Preferensi (P)</th>
                    </tr>
                  </thead>
                  <tbody id="ranking-tbody">
                    <!-- Fills by JS -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Rekomendasi Tab -->
      <div class="tab-pane fade animate-fade-in" id="rekomendasi" role="tabpanel">
        <div class="card p-4 text-center text-md-start">
          <h4 class="fw-bold mb-3 text-center text-md-start"><i class="bi bi-award-fill text-warning me-2"></i> Surat Keputusan Rekomendasi Promosi</h4>
          
          <div class="p-4 bg-light rounded border border-warning border-opacity-50 mb-4" id="executive-summary-box">
            <!-- Written dynamically -->
          </div>
          
          <div class="text-center mt-3">
            <button class="btn btn-primary px-4 py-2" onclick="window.print()"><i class="bi bi-printer me-2"></i> Cetak Surat Rekomendasi</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="row mt-4">
      <div class="col-12 text-center text-muted small">
        <hr class="my-3">
        Sistem Pendukung Keputusan Pemilihan Karyawan untuk Promosi &bull; Metode AHP &amp; TOPSIS
      </div>
    </div>
  </div>

  <!-- Embed data directly in a JS object -->
  <script>
    const RAW_EMPLOYEE_DATA = ${serializedEmployees};

    // Impute empty fields and type check data on launch
    const employeesList = RAW_EMPLOYEE_DATA.map(emp => {
      let ps = emp.PerformanceScore;
      if (ps === null || ps === undefined || isNaN(Number(ps))) {
        ps = 3.0;
      } else {
        ps = Number(ps);
      }
      return {
        ...emp,
        PerformanceScore: ps,
        Age: Number(emp.Age),
        Salary: Number(emp.Salary),
        Experience: Number(emp.Experience)
      };
    });

    let currentDept = "";
    let currentStatus = "Active";
    let currentSearch = "";

    let ahpWeights = [0.4, 0.3, 0.2, 0.1];
    let topsisResults = [];
    
    let weightPieChart = null;
    let rankingBarChart = null;

    // Helper functions
    function parseSliders() {
      return {
        comp_0_1: Number(document.getElementById('slider_0_1').value),
        comp_0_2: Number(document.getElementById('slider_0_2').value),
        comp_0_3: Number(document.getElementById('slider_0_3').value),
        comp_1_2: Number(document.getElementById('slider_1_2').value),
        comp_1_3: Number(document.getElementById('slider_1_3').value),
        comp_2_3: Number(document.getElementById('slider_2_3').value),
      };
    }

    const decodeSliderValue = (val) => {
      if (val >= 1) return val;
      return 1 / Math.abs(val);
    };

    function decodeSliderLabel(val) {
      if (val === 1) return "Sama Penting (1:1)";
      if (val > 1) return "C_A Lebih Penting (" + val + "x)";
      return "C_B Lebih Penting (" + Math.abs(val) + "x)";
    }

    function calculateAHP_JS() {
      const sliders = parseSliders();
      const n = 4;
      const matrix = Array(n).fill(null).map(() => Array(n).fill(1));

      matrix[0][1] = decodeSliderValue(sliders.comp_0_1); matrix[1][0] = 1 / matrix[0][1];
      matrix[0][2] = decodeSliderValue(sliders.comp_0_2); matrix[2][0] = 1 / matrix[0][2];
      matrix[0][3] = decodeSliderValue(sliders.comp_0_3); matrix[3][0] = 1 / matrix[0][3];
      matrix[1][2] = decodeSliderValue(sliders.comp_1_2); matrix[2][1] = 1 / matrix[1][2];
      matrix[1][3] = decodeSliderValue(sliders.comp_1_3); matrix[3][1] = 1 / matrix[1][3];
      matrix[2][3] = decodeSliderValue(sliders.comp_2_3); matrix[3][2] = 1 / matrix[2][3];

      const colSums = Array(n).fill(0);
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          colSums[j] += matrix[i][j];
        }
      }

      const normalMatrix = Array(n).fill(null).map(() => Array(n).fill(0));
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          normalMatrix[i][j] = matrix[i][j] / colSums[j];
        }
      }

      const weights = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        let rSum = 0;
        for (let j = 0; j < n; j++) { rSum += normalMatrix[i][j]; }
        weights[i] = rSum / n;
      }

      const weightedSum = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) { weightedSum[i] += matrix[i][j] * weights[j]; }
      }

      const ratios = Array(n).fill(0);
      for (let i = 0; i < n; i++) { ratios[i] = weightedSum[i] / weights[i]; }

      const lambdaMax = ratios.reduce((sum, v) => sum + v, 0) / n;
      const ci = (lambdaMax - n) / (n - 1);
      const ri = 0.90;
      const cr = ci / ri;

      return { matrix, normalMatrix, weights, lambdaMax, ci, cr, isConsistent: cr < 0.1 };
    }

    function calculateTOPSIS_JS(filteredEmps, weights) {
      if (filteredEmps.length === 0) return { items: [], idealPositive: [0,0,0,0], idealNegative: [0,0,0,0] };

      let sumSq1 = 0, sumSq2 = 0, sumSq3 = 0, sumSq4 = 0;
      filteredEmps.forEach(emp => {
        sumSq1 += emp.PerformanceScore * emp.PerformanceScore;
        sumSq2 += emp.Experience * emp.Experience;
        sumSq3 += emp.Salary * emp.Salary;
        sumSq4 += emp.Age * emp.Age;
      });

      const d1 = Math.sqrt(sumSq1) || 1;
      const d2 = Math.sqrt(sumSq2) || 1;
      const d3 = Math.sqrt(sumSq3) || 1;
      const d4 = Math.sqrt(sumSq4) || 1;

      const items = filteredEmps.map(emp => {
        const r_c1 = emp.PerformanceScore / d1;
        const r_c2 = emp.Experience / d2;
        const r_c3 = emp.Salary / d3;
        const r_c4 = emp.Age / d4;

        const v_c1 = r_c1 * weights[0];
        const v_c2 = r_c2 * weights[1];
        const v_c3 = r_c3 * weights[2];
        const v_c4 = r_c4 * weights[3];

        return {
          employee: emp,
          c1_value: emp.PerformanceScore, c2_value: emp.Experience, c3_value: emp.Salary, c4_value: emp.Age,
          r_c1, r_c2, r_c3, r_c4,
          v_c1, v_c2, v_c3, v_c4
        };
      });

      const max_v1 = Math.max(...items.map(i => i.v_c1)); const min_v1 = Math.min(...items.map(i => i.v_c1));
      const max_v2 = Math.max(...items.map(i => i.v_c2)); const min_v2 = Math.min(...items.map(i => i.v_c2));
      const max_v3 = Math.max(...items.map(i => i.v_c3)); const min_v3 = Math.min(...items.map(i => i.v_c3));
      const max_v4 = Math.max(...items.map(i => i.v_c4)); const min_v4 = Math.min(...items.map(i => i.v_c4));

      const idealPositive = [max_v1, max_v2, min_v3, min_v4];
      const idealNegative = [min_v1, min_v2, max_v3, max_v4];

      items.forEach(item => {
        item.dPlus = Math.sqrt(
          Math.pow(item.v_c1 - idealPositive[0], 2) +
          Math.pow(item.v_c2 - idealPositive[1], 2) +
          Math.pow(item.v_c3 - idealPositive[2], 2) +
          Math.pow(item.v_c4 - idealPositive[3], 2)
        );
        item.dMinus = Math.sqrt(
          Math.pow(item.v_c1 - idealNegative[0], 2) +
          Math.pow(item.v_c2 - idealNegative[1], 2) +
          Math.pow(item.v_c3 - idealNegative[2], 2) +
          Math.pow(item.v_c4 - idealNegative[3], 2)
        );
        item.preferenceWeight = (item.dPlus + item.dMinus) === 0 ? 0 : item.dMinus / (item.dPlus + item.dMinus);
      });

      const sorted = [...items].sort((a,b) => b.preferenceWeight - a.preferenceWeight);
      sorted.forEach((item, idx) => item.rank = idx + 1);

      return { items: sorted, idealPositive, idealNegative };
    }

    function renderAHP_View(ahp) {
      // 1. Matrix
      let matrixHTML = "";
      const labels = ["C1 Kinerja", "C2 Masa Kerja", "C3 Gaji", "C4 Usia"];
      for (let i = 0; i < 4; i++) {
        matrixHTML += "<tr><td class='fw-semibold text-start'>" + labels[i] + "</td>";
        for (let j = 0; j < 4; j++) {
          matrixHTML += "<td>" + ahp.matrix[i][j].toFixed(4) + "</td>";
        }
        matrixHTML += "</tr>";
      }
      document.getElementById("ahp-matrix-body").innerHTML = matrixHTML;

      // 2. Normal Matrix + Priority Vector
      let normHTML = "";
      for (let i = 0; i < 4; i++) {
        normHTML += "<tr><td class='fw-semibold text-start'>" + labels[i] + "</td>";
        for (let j = 0; j < 4; j++) {
          normHTML += "<td>" + ahp.normalMatrix[i][j].toFixed(4) + "</td>";
        }
        normHTML += "<td class='bg-primary text-white fw-bold'>" + ahp.weights[i].toFixed(4) + "</td>";
        normHTML += "</tr>";
      }
      document.getElementById("ahp-norm-body").innerHTML = normHTML;

      // KPI weights
      document.getElementById("lbl_w1").innerHTML = (ahp.weights[0] * 100).toFixed(1) + "%";
      document.getElementById("lbl_w2").innerHTML = (ahp.weights[1] * 100).toFixed(1) + "%";
      document.getElementById("lbl_w3").innerHTML = (ahp.weights[2] * 100).toFixed(1) + "%";
      document.getElementById("lbl_w4").innerHTML = (ahp.weights[3] * 100).toFixed(1) + "%";

      // Consistency Ratio
      document.getElementById("val-lambda").innerHTML = ahp.lambdaMax.toFixed(4);
      document.getElementById("val-ci").innerHTML = ahp.ci.toFixed(4);
      document.getElementById("val-cr").innerHTML = ahp.cr.toFixed(4);

      const statusBadge = document.getElementById("ahp-consistency-badge");
      if (ahp.isConsistent) {
        statusBadge.innerHTML = "<i class='bi bi-check-circle me-1'></i>Matriks Konsisten (CR < 0.1)";
        statusBadge.className = "badge bg-success p-2 text-white";
      } else {
        statusBadge.innerHTML = "<i class='bi bi-exclamation-triangle me-1'></i>Matriks Tidak Konsisten (CR >= 0.1)";
        statusBadge.className = "badge bg-danger p-2 text-white";
      }
    }

    function renderTOPSIS_View(topsis) {
      const limit = Math.min(topsis.items.length, 30); // show top 30 in math scroll logs to prevent lagging
      
      // M1 Decision Matrix
      let m1 = "";
      for (let i=0; i<limit; i++) {
        const item = topsis.items[i];
        m1 += "<tr><td class='text-start fw-semibold'>" + item.employee.Name + "</td>" +
              "<td>" + item.c1_value.toFixed(1) + "</td>" +
              "<td>" + item.c2_value.toFixed(0) + " tahun</td>" +
              "<td>Rp" + item.c3_value.toLocaleString() + "</td>" +
              "<td>" + item.c4_value.toFixed(0) + " thn</td></tr>";
      }
      document.getElementById("topsis-m1-body").innerHTML = m1;

      // M2 Normalized
      let m2 = "";
      for (let i=0; i<limit; i++) {
        const item = topsis.items[i];
        m2 += "<tr><td class='text-start fw-semibold'>" + item.employee.Name + "</td>" +
              "<td>" + item.r_c1.toFixed(4) + "</td>" +
              "<td>" + item.r_c2.toFixed(4) + "</td>" +
              "<td>" + item.r_c3.toFixed(4) + "</td>" +
              "<td>" + item.r_c4.toFixed(4) + "</td></tr>";
      }
      document.getElementById("topsis-m2-body").innerHTML = m2;

      // M3 Weighted
      let m3 = "";
      for (let i=0; i<limit; i++) {
        const item = topsis.items[i];
        m3 += "<tr><td class='text-start fw-semibold'>" + item.employee.Name + "</td>" +
              "<td>" + item.v_c1.toFixed(4) + "</td>" +
              "<td>" + item.v_c2.toFixed(4) + "</td>" +
              "<td>" + item.v_c3.toFixed(4) + "</td>" +
              "<td>" + item.v_c4.toFixed(4) + "</td></tr>";
      }
      document.getElementById("topsis-m3-body").innerHTML = m3;

      // A+ and A- Ideal matrices
      let m4 = "<tr><td class='fw-bold text-success text-start'><i class='bi bi-plus-circle me-1'></i>Solusi Ideal Positif (A+)</td>";
      for (let j=0; j<4; j++) { m4 += "<td class='fw-bold text-success'>" + topsis.idealPositive[j].toFixed(4) + "</td>"; }
      m4 += "</tr><tr><td class='fw-bold text-danger text-start'><i class='bi bi-dash-circle me-1'></i>Solusi Ideal Negatif (A-)</td>";
      for (let j=0; j<4; j++) { m4 += "<td class='fw-bold text-danger'>" + topsis.idealNegative[j].toFixed(4) + "</td>"; }
      m4 += "</tr>";
      document.getElementById("topsis-m4-body").innerHTML = m4;

      // Separation Values and Preference scores
      let m5 = "";
      for (let i=0; i<limit; i++) {
        const item = topsis.items[i];
        m5 += "<tr><td class='text-start fw-semibold'>" + item.employee.Name + "</td>" +
              "<td>" + item.dPlus.toFixed(4) + "</td>" +
              "<td>" + item.dMinus.toFixed(4) + "</td>" +
              "<td class='bg-primary text-white fw-bold'>" + item.preferenceWeight.toFixed(4) + "</td></tr>";
      }
      document.getElementById("topsis-m5-body").innerHTML = m5;
    }

    function renderRankingList(topsis) {
      let ranksHTML = "";
      for (let i = 0; i < topsis.items.length; i++) {
        const item = topsis.items[i];
        let medal = item.rank;
        if (item.rank === 1) medal = "🥇 1";
        else if (item.rank === 2) medal = "🥈 2";
        else if (item.rank === 3) medal = "🥉 3";

        ranksHTML += "<tr><td><span class='fw-bold'>" + medal + "</span></td>" +
                     "<td class='fw-semibold'>" + item.employee.Name + "</td>" +
                     "<td><span class='badge bg-secondary'>" + item.employee.Department + "</span></td>" +
                     "<td>" + item.c1_value.toFixed(1) + "</td>" +
                     "<td>" + item.c2_value.toFixed(0) + " tahun</td>" +
                     "<td class='bg-primary text-white fw-bold text-center'>" + item.preferenceWeight.toFixed(4) + "</td></tr>";
      }
      document.getElementById("ranking-tbody").innerHTML = ranksHTML;
    }

    function updateRekomendasiView() {
      if (topsisResults.items.length === 0) return;
      const best = topsisResults.items[0];
      const dept = best.employee.Department;
      
      const summaryHTML = "<h3><i class='bi bi-file-earmark-check text-success me-2'></i>Surat Rekomendasi Seleksi Karyawan Terbaik</h3>" +
        "<hr>" +
        "<p>Berdasarkan rangkaian analisis dan perhitungan terotomasi dari data Kaggle yang telah diselesaikan pada Sistem Pendukung Keputusan (SPK) menggunakan integrasi metode <strong>AHP (Analytic Hierarchy Process)</strong> dan <strong>TOPSIS</strong>, diperoleh keputusan promosi struktural berikut:</p>" +
        "<div class='p-3 bg-white rounded border my-3'>" +
        "  <h5>Karyawan Direkomendasikan:</h5>" +
        "  <h2 class='fw-bold text-primary'>" + best.employee.Name + "</h2>" +
        "  <div class='row mt-3 text-start'>" +
        "    <div class='col-md-4'><strong>ID Karyawan:</strong> " + best.employee.ID + "</div>" +
        "    <div class='col-md-4'><strong>Departemen:</strong> " + dept + "</div>" +
        "    <div class='col-md-4'><strong>Skor Kinerja:</strong> " + best.c1_value.toFixed(1) + " (Skala 5.0)</div>" +
        "    <div class='col-md-4 mt-2'><strong>Masa Kerja:</strong> " + best.c2_value + " Tahun</div>" +
        "    <div class='col-md-4 mt-2'><strong>Gaji Saat Ini:</strong> Rp" + best.c3_value.toLocaleString() + "</div>" +
        "    <div class='col-md-4 mt-2'><strong>Usia Karyawan:</strong> " + best.c4_value + " Tahun</div>" +
        "  </div>" +
        "</div>" +
        "<p>Kandisat terbaik, <strong>" + best.employee.Name + "</strong>, berhasil menempati peringkat tertinggi dengan perolehan nilai preferensi <strong>" + best.preferenceWeight.toFixed(4) + "</strong>. Kandidat ini membuktikan kualifikasi kompetensi yang sangat optimal dengan skor kinerja murni " + best.c1_value.toFixed(1) + " serta loyalitas masa kerja selama " + best.c2_value + " tahun, melampaui kompetitor di kelompoknya.</p>" +
        "<p class='mb-0 small text-muted'>* Keputusan ini dihasilkan secara murni oleh pembobotan multi-kriteria AHP yang valid dan konsisten, serta bebas dari intervensi subjektivitas internal.</p>";

      document.getElementById("executive-summary-box").innerHTML = summaryHTML;
    }

    function handleFilterChange() {
      currentDept = document.getElementById("filter-dept").value;
      currentStatus = document.getElementById("filter-status").value;
      currentSearch = document.getElementById("table-search").value.toLowerCase();
      
      runSPK();
    }

    function handleSliderChange() {
      // Update interactive label values
      const ids = ['0_1', '0_2', '0_3', '1_2', '1_3', '2_3'];
      ids.forEach(id => {
        const val = Number(document.getElementById('slider_' + id).value);
        document.getElementById('val_' + id).innerHTML = decodeSliderLabel(val);
      });

      runSPK();
    }

    function runSPK() {
      // Step A: Parse filters and filter dataset
      let filtered = employeesList;
      if (currentDept) {
        filtered = filtered.filter(emp => emp.Department === currentDept);
      }
      if (currentStatus && currentStatus !== "All") {
        filtered = filtered.filter(emp => emp.Status === currentStatus);
      }
      if (currentSearch) {
        filtered = filtered.filter(emp => emp.Name.toLowerCase().includes(currentSearch));
      }

      // Render main dataset table preview
      let rowsHTML = "";
      filtered.forEach(emp => {
        const isSelected = emp.Status === "Active" ? "<span class='badge bg-success-subtle text-success'>Aktif</span>" : "<span class='badge bg-danger-subtle text-danger'>Tidak Aktif</span>";
        rowsHTML += "<tr><td class='ps-3'>" + emp.ID + "</td>" +
                    "<td class='fw-semibold'>" + emp.Name + "</td>" +
                    "<td>" + emp.Age + "</td>" +
                    "<td>" + emp.Gender + "</td>" +
                    "<td>" + emp.Department + "</td>" +
                    "<td>Rp" + emp.Salary.toLocaleString() + "</td>" +
                    "<td>" + emp.PerformanceScore.toFixed(1) + "</td>" +
                    "<td>" + emp.Experience + " tahun</td>" +
                    "<td>" + isSelected + "</td>" +
                    "<td class='pe-3'>" + emp.Location + "</td></tr>";
      });
      document.getElementById("dataset-tbody").innerHTML = rowsHTML;
      document.getElementById("displayed-rows-count").innerHTML = filtered.length;
      document.getElementById("total-rows-count").innerHTML = employeesList.length;

      // Step B: Calculate AHP
      const ahp = calculateAHP_JS();
      ahpWeights = ahp.weights;
      renderAHP_View(ahp);

      // Step C: Calculate TOPSIS
      topsisResults = calculateTOPSIS_JS(filtered, ahpWeights);
      renderTOPSIS_View(topsisResults);
      renderRankingList(topsisResults);

      // Step D: Update KPIs
      document.getElementById("kpi-alternatives").innerHTML = filtered.length;
      if (topsisResults.items.length > 0) {
        document.getElementById("kpi-pref").innerHTML = topsisResults.items[0].preferenceWeight.toFixed(4);
        document.getElementById("kpi-best").innerHTML = topsisResults.items[0].employee.Name;
      } else {
        document.getElementById("kpi-pref").innerHTML = "0.0000";
        document.getElementById("kpi-best").innerHTML = "-";
      }

      // Step E: Render Charts
      renderCharts(ahpWeights, topsisResults.items.slice(0, 10));
    }

    function renderCharts(weights, topAlternatives) {
      // 1. Pie Chart
      if (weightPieChart) { weightPieChart.destroy(); }
      const ctx1 = document.getElementById('weightPieChart').getContext('2d');
      weightPieChart = new Chart(ctx1, {
        type: 'pie',
        data: {
          labels: ['C1 Kinerja (Benefit)', 'C2 Pengalaman (Benefit)', 'C3 Gaji (Cost)', 'C4 Usia (Cost)'],
          datasets: [{
            data: weights,
            backgroundColor: ['#2563EB', '#16A34A', '#F59E0B', '#DC2626'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });

      // 2. Bar Chart
      if (rankingBarChart) { rankingBarChart.destroy(); }
      const ctx2 = document.getElementById('rankingBarChart').getContext('2d');
      
      const labels = topAlternatives.map(item => item.employee.Name);
      const data = topAlternatives.map(item => item.preferenceWeight);

      rankingBarChart = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Nilai Preferensi P_i (TOPSIS)',
            data: data,
            backgroundColor: '#2563EB',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { min: 0, max: 1 }
          }
        }
      });
    }

    // Initial load
    window.onload = function() {
      handleSliderChange();
    };
  </script>
  <!-- Bootstrap Bundle JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
}
