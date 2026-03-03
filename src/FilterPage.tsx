import {
  useLoaderData,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Province {
  id: number;
  name: string;
}
interface Regency {
  id: number;
  name: string;
  province_id: number;
}
interface District {
  id: number;
  name: string;
  regency_id: number;
}
interface RegionData {
  provinces: Province[];
  regencies: Regency[];
  districts: District[];
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────
function IconProvince() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.893V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.746c-.917-.432-2.107-.773-3.287-.893-1.093-.11-2.278-.039-3.213.493V2.687z"/>
    </svg>
  );
}

function IconRegency() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916l-7.5-5zM12.375 6v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zM8 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM.5 15a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H.5z"/>
    </svg>
  );
}

function IconDistrict() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
    </svg>
  );
}

function IconNoFilter() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2zm1 .5v1.792l4.372 4.858A.5.5 0 0 1 7 9v5l2-.667V9a.5.5 0 0 1 .128-.334L13.5 3.792V2h-11z"/>
      <path d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0z"/>
    </svg>
  );
}

// ─── Loader ───────────────────────────────────────────────────────────────────
export async function loader() {
  const res = await fetch('/data/indonesia_regions.json');
  if (!res.ok) throw new Error('Gagal memuat data wilayah');
  const data: RegionData = await res.json();
  return data;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FilterPage() {
  const { provinces, regencies, districts } = useLoaderData() as RegionData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Ambil nilai dari URL search params (agar tahan refresh)
  const selectedProvinceId = searchParams.get('province')
    ? Number(searchParams.get('province'))
    : null;
  const selectedRegencyId = searchParams.get('regency')
    ? Number(searchParams.get('regency'))
    : null;
  const selectedDistrictId = searchParams.get('district')
    ? Number(searchParams.get('district'))
    : null;

  // Data turunan berdasarkan pilihan
  const filteredRegencies = selectedProvinceId
    ? regencies.filter((r) => r.province_id === selectedProvinceId)
    : [];
  const filteredDistricts = selectedRegencyId
    ? districts.filter((d) => d.regency_id === selectedRegencyId)
    : [];

  // Objek terpilih untuk ditampilkan
  const selectedProvince = provinces.find((p) => p.id === selectedProvinceId);
  const selectedRegency = regencies.find((r) => r.id === selectedRegencyId);
  const selectedDistrict = districts.find((d) => d.id === selectedDistrictId);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  function handleProvinceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val) {
      setSearchParams({ province: val });
    } else {
      setSearchParams({});
    }
  }

  function handleRegencyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val && selectedProvinceId) {
      setSearchParams({ province: String(selectedProvinceId), regency: val });
    } else if (selectedProvinceId) {
      setSearchParams({ province: String(selectedProvinceId) });
    }
  }

  function handleDistrictChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val && selectedProvinceId && selectedRegencyId) {
      setSearchParams({
        province: String(selectedProvinceId),
        regency: String(selectedRegencyId),
        district: val,
      });
    } else if (selectedProvinceId && selectedRegencyId) {
      setSearchParams({
        province: String(selectedProvinceId),
        regency: String(selectedRegencyId),
      });
    }
  }

  function handleReset() {
    navigate('/');
  }

  // ─── Breadcrumb Items ───────────────────────────────────────────────────────
  const breadcrumbs = [
    { label: 'Indonesia', active: false },
    ...(selectedProvince
      ? [{ label: selectedProvince.name, active: !selectedRegency }]
      : []),
    ...(selectedRegency
      ? [{ label: selectedRegency.name, active: !selectedDistrict }]
      : []),
    ...(selectedDistrict
      ? [{ label: selectedDistrict.name, active: true }]
      : []),
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* ── Sidebar ── */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col p-6 gap-6 shadow-sm">
        {/* Logo / Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-blue-600" viewBox="0 0 16 16">
              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
            </svg>
          </div>
          <span className="font-bold text-gray-800 text-lg">
            Frontend Assessment
          </span>
        </div>


        {/* Filter Label */}
        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
            Filter Wilayah
          </p>

          {/* Provinsi */}
          <div className="mb-4">
            <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">
              Provinsi
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IconProvince />
              </span>
              <select
                name="province"
                value={selectedProvinceId ?? ''}
                onChange={handleProvinceChange}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Pilih Provinsi</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▾
              </span>
            </div>
          </div>

          {/* Kota/Kabupaten */}
          <div className="mb-4">
            <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">
              Kota/Kabupaten
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IconRegency />
              </span>
              <select
                name="regency"
                value={selectedRegencyId ?? ''}
                onChange={handleRegencyChange}
                disabled={!selectedProvinceId}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Pilih Kota/Kabupaten</option>
                {filteredRegencies.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▾
              </span>
            </div>
          </div>

          {/* Kecamatan */}
          <div className="mb-6">
            <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">
              Kecamatan
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IconDistrict />
              </span>
              <select
                name="district"
                value={selectedDistrictId ?? ''}
                onChange={handleDistrictChange}
                disabled={!selectedRegencyId}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Pilih Kecamatan</option>
                {filteredDistricts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▾
              </span>
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="w-full py-2 border-2 border-blue-500 text-blue-500 rounded-lg text-sm font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <IconNoFilter />
            RESET
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb */}
        <nav className="px-8 py-4 border-b border-gray-200 bg-white">
          <ol className="breadcrumb flex items-center gap-1 text-sm text-gray-500">
            {breadcrumbs.map((crumb, idx) => (
              <li key={idx} className="flex items-center gap-1">
                {idx > 0 && <span className="text-gray-400">›</span>}
                <span
                  className={
                    crumb.active
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-500'
                  }
                >
                  {crumb.label}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        {/* Main Area */}
        <main className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
          {!selectedProvince ? (
            <p className="text-gray-400 text-lg">
              Pilih Provinsi untuk memulai
            </p>
          ) : (
            <>
              {/* Provinsi */}
              <div className="text-center">
                <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-1">
                  Provinsi
                </p>
                <h1 className="text-6xl font-black text-gray-900">
                  {selectedProvince.name}
                </h1>
              </div>

              {selectedRegency && (
                <>
                  <span className="text-2xl text-gray-300">↓</span>
                  <div className="text-center">
                    <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-1">
                      Kota / Kabupaten
                    </p>
                    <h2 className="text-5xl font-black text-gray-900">
                      {selectedRegency.name}
                    </h2>
                  </div>
                </>
              )}

              {selectedDistrict && (
                <>
                  <span className="text-2xl text-gray-300">↓</span>
                  <div className="text-center">
                    <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-1">
                      Kecamatan
                    </p>
                    <h3 className="text-4xl font-black text-gray-900">
                      {selectedDistrict.name}
                    </h3>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}