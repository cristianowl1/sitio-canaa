import React, { useState, useEffect } from 'react';
import { MapPin, Camera, Cloud, Navigation, Sun, Eye, Wind, Droplets, Thermometer, Clock } from 'lucide-react';
import './App.css';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Coordenadas do sítio
  const sitioLocation = {
    lat: -23.465673840398047,
    lng: -45.85844728012967
  };

  // Dados das câmeras
  const cameras = [
    {
      name: "Mogilar, km 53",
      url: "https://api.ecorodovias.com.br/anonymous/ecorodovias-portal/ecopistas/boletim/camera/4",
      id: 4
    },
    {
      name: "Pedágio Itaquá km 32", 
      url: "https://api.ecorodovias.com.br/anonymous/ecorodovias-portal/ecopistas/boletim/camera/3",
      id: 3
    },
    {
      name: "Santa Branca, km 83",
      url: "https://api.ecorodovias.com.br/anonymous/ecorodovias-portal/ecopistas/boletim/camera/7",
      id: 7
    }
  ];

  // Buscar dados do clima
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // Usando proxy para evitar problemas de CORS
        const response = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent('http://api.weatherstack.com/current?access_key=e997a6352a042e440be45f51beeb6515&query=Santa Branca, SP')}`
        );
        
        if (!response.ok) {
          throw new Error('Erro ao buscar dados do clima');
        }
        
        const proxyData = await response.json();
        const data = JSON.parse(proxyData.contents);
        
        if (data.error) {
          throw new Error(data.error.info || 'Erro na API do clima');
        }
        
        setWeather(data);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao buscar clima:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Atualizar clima a cada 30 minutos
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Função para abrir Google Maps
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${sitioLocation.lat},${sitioLocation.lng}`;
    window.open(url, '_blank');
  };

  // Função para abrir Waze
  const openWaze = () => {
    const url = `https://waze.com/ul?ll=${sitioLocation.lat}%2C${sitioLocation.lng}&navigate=yes`;
    window.open(url, '_blank');
  };

  // Função para abrir câmera
  const openCamera = (camera) => {
    window.open(camera.url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <MapPin className="h-8 w-8 text-green-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Sítio Canaã</h1>
          </div>
          <p className="text-center text-gray-600 mt-2">
            Estância Nova Campos - Monitoramento e navegação
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Seção de Navegação */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Navigation className="h-6 w-6 mr-2 text-blue-600" />
            Como Chegar
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={openGoogleMaps}
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105"
            >
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">Abrir no Google Maps</span>
            </button>
            <button
              onClick={openWaze}
              className="bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105"
            >
              <Navigation className="h-5 w-5" />
              <span className="font-semibold">Abrir no Waze</span>
            </button>
          </div>
        </div>

        {/* Seção do Clima */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Cloud className="h-6 w-6 mr-2 text-blue-600" />
            Clima Local
          </h2>
          
          {loading ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-300 h-16 w-16"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">Erro ao carregar dados do clima: {error}</p>
              <p className="text-red-500 text-sm mt-2">
                Verifique sua conexão com a internet ou tente novamente mais tarde.
              </p>
            </div>
          ) : weather ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={weather.current.weather_icons[0]} 
                    alt={weather.current.weather_descriptions[0]}
                    className="h-16 w-16"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {weather.location.name}
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {weather.current.temperature}°C
                    </p>
                    <p className="text-gray-600">
                      {weather.current.weather_descriptions[0]}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span>Sensação: {weather.current.feelslike}°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>Umidade: {weather.current.humidity}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span>Vento: {weather.current.wind_speed} km/h</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span>Visibilidade: {weather.current.visibility} km</span>
                  </div>
                </div>
              </div>
              
              {weather.current.astro && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      <span>Nascer: {weather.current.astro.sunrise}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4 text-orange-500" />
                      <span>Pôr: {weather.current.astro.sunset}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Fase da Lua: {weather.current.astro.moon_phase}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">🌙</span>
                      <span>Iluminação: {weather.current.astro.moon_illumination}%</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                Última atualização: {weather.location.localtime}
              </div>
            </div>
          ) : null}
        </div>

        {/* Seção das Câmeras */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Camera className="h-6 w-6 mr-2 text-purple-600" />
            Câmeras da Estrada
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {cameras.map((camera, index) => (
              <button
                key={index}
                onClick={() => openCamera(camera)}
                className="bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300 p-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <div className="flex flex-col items-center space-y-3">
                  <Camera className="h-8 w-8 text-purple-600" />
                  <h3 className="font-semibold text-gray-800 text-center">
                    {camera.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Clique para visualizar
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600 text-center">
            * As câmeras são fornecidas pela EcoRodovias e mostram as condições atuais do tráfego
          </div>
        </div>

        {/* Rodapé com informações */}
        <footer className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-gray-600">
            <p className="mb-2">
              <strong>Sítio Canaã - Estância Nova Campos</strong>
            </p>
            <p className="mb-2">
              <strong>Coordenadas:</strong> {sitioLocation.lat}, {sitioLocation.lng}
            </p>
            <p className="text-sm">
              Dashboard criado para facilitar o acesso e monitoramento do Sítio Canaã
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
