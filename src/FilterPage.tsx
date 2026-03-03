import {
  useLoaderData,
  useSearchParams,
  useNavigate,
} from 'react-router-dom';
import { BiMap } from 'react-icons/bi';
import { BsBuilding } from 'react-icons/bs';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { TbFilterOff } from 'react-icons/tb';
import { FiGlobe } from 'react-icons/fi';

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

export async function loader() {
  const res = await fetch('/data/indonesia_regions.json');
  if (!res.ok) throw new Error('Gagal memuat data wilayah');
  const data: RegionData = await res.json();
  return data;
}

export default function FilterPage() {
  const { provinces, regencies, districts } = useLoaderData() as RegionData;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // get selected IDs from URL
  const provinceId = searchParams.get('province') ? Number(searchParams.get('province')) : null;
  const regencyId = searchParams.get('regency') ? Number(searchParams.get('regency')) : null;
  const districtId = searchParams.get('district') ? Number(searchParams.get('district')) : null;

  // filter based on selection
  const availableRegencies = provinceId 
    ? regencies.filter(r => r.province_id === provinceId) 
    : [];
  
  const availableDistricts = regencyId 
    ? districts.filter(d => d.regency_id === regencyId) 
    : [];

  // find current selections
  const currentProvince = provinces.find(p => p.id === provinceId);
  const currentRegency = regencies.find(r => r.id === regencyId);
  const currentDistrict = districts.find(d => d.id === districtId);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setSearchParams({ province: value });
    } else {
      setSearchParams({});
    }
  };

  const onRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && provinceId) {
      setSearchParams({ province: String(provinceId), regency: value });
    } else if (provinceId) {
      setSearchParams({ province: String(provinceId) });
    }
  };

  const onDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && provinceId && regencyId) {
      setSearchParams({
        province: String(provinceId),
        regency: String(regencyId),
        district: value
      });
    } else if (provinceId && regencyId) {
      setSearchParams({
        province: String(provinceId),
        regency: String(regencyId)
      });
    }
  };

  const resetFilters = () => {
    navigate('/');
  };

  // build breadcrumb path
  const breadcrumbItems = [{ label: 'Indonesia', active: false }];
  if (currentProvince) {
    breadcrumbItems.push({ 
      label: currentProvince.name, 
      active: !currentRegency 
    });
  }
  if (currentRegency) {
    breadcrumbItems.push({ 
      label: currentRegency.name, 
      active: !currentDistrict 
    });
  }
  if (currentDistrict) {
    breadcrumbItems.push({ 
      label: currentDistrict.name, 
      active: true 
    });
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col p-6 gap-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <FiGlobe className="text-blue-600" size={16} />
          </div>
          <span className="font-bold text-gray-800 text-lg">
            Frontend Assessment
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
            Filter Wilayah
          </p>

          {/* Province dropdown */}
          <div className="mb-4">
            <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">
              Provinsi
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <BiMap size={16} />
              </span>
              <select
                value={provinceId ?? ''}
                onChange={handleProvinceChange}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Pilih Provinsi</option>
                {provinces.map(province => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
            </div>
          </div>

          {/* Regency dropdown */}
          <div className="mb-4">
            <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">
              Kota/Kabupaten
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <BsBuilding size={16} />
              </span>
              <select
                value={regencyId ?? ''}
                onChange={onRegencyChange}
                disabled={!provinceId}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Pilih Kota/Kabupaten</option>
                {availableRegencies.map(regency => (
                  <option key={regency.id} value={regency.id}>
                    {regency.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
            </div>
          </div>

          {/* District dropdown */}
          <div className="mb-6">
            <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1">
              Kecamatan
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <HiOutlineLocationMarker size={16} />
              </span>
              <select
                value={districtId ?? ''}
                onChange={onDistrictChange}
                disabled={!regencyId}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Pilih Kecamatan</option>
                {availableDistricts.map(district => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</span>
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="w-full py-2 border-2 border-blue-500 text-blue-500 rounded-lg text-sm font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <TbFilterOff size={16} />
            RESET
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb */}
        <nav className="px-8 py-4 border-b border-gray-200 bg-white">
          <ol className="breadcrumb flex items-center gap-1 text-sm text-gray-500">
            {breadcrumbItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-1">
                {idx > 0 && <span className="text-gray-400">›</span>}
                <span className={item.active ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
                  {item.label}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        {/* Display area */}
        <main className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
          {!currentProvince ? (
            <p className="text-gray-400 text-lg">Pilih Provinsi untuk memulai</p>
          ) : (
            <>
              <div className="text-center">
                <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-1">
                  Provinsi
                </p>
                <h1 className="text-6xl font-black text-gray-900">
                  {currentProvince.name}
                </h1>
              </div>

              {currentRegency && (
                <>
                  <span className="text-2xl text-gray-300">↓</span>
                  <div className="text-center">
                    <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-1">
                      Kota / Kabupaten
                    </p>
                    <h2 className="text-5xl font-black text-gray-900">
                      {currentRegency.name}
                    </h2>
                  </div>
                </>
              )}

              {currentDistrict && (
                <>
                  <span className="text-2xl text-gray-300">↓</span>
                  <div className="text-center">
                    <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-1">
                      Kecamatan
                    </p>
                    <h3 className="text-4xl font-black text-gray-900">
                      {currentDistrict.name}
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