import React, { useState, useEffect } from 'react';

const App = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);

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

  // Carregar lista de fotos
  useEffect(() => {
    // Lista de fotos que devem estar em public/fotos/
    // Você pode adicionar mais fotos aqui
    const photoList = [
      'foto1.jpg',
      'foto2.jpg', 
      'foto3.jpg',
      'foto4.jpg',
      'foto5.jpg',
      'foto6.jpg',
      'foto7.jpg',
      'foto8.jpg'
      'foto9.jpg'
      // Adicione mais conforme necessário
    ];
    setPhotos(photoList);
  }, []);

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

  // Função para abrir câmera (agora em modal)
  const openCamera = (camera) => {
    setSelectedCamera(camera);
  };

  // Função para fechar modal da câmera
  const closeCameraModal = () => {
    setSelectedCamera(null);
  };

  // Função para abrir galeria de fotos
  const openGallery = () => {
    setShowGallery(true);
  };

  // Função para fechar galeria
  const closeGallery = () => {
    setShowGallery(false);
    setSelectedPhoto(null);
  };

  // Função para selecionar foto
  const selectPhoto = (photo) => {
    setSelectedPhoto(photo);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%)',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        borderBottom: '4px solid #10b981'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '24px 16px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            📍 Sítio Canaã
          </h1>
          <p style={{ 
            color: '#6b7280', 
            margin: 0 
          }}>
            Estância Nova Campos - Monitoramento e navegação
          </p>
        </div>
      </header>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '32px 16px' 
      }}>
        
        {/* Menu de Navegação */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            marginBottom: '24px'
          }}>
            <button
              onClick={openGallery}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              📸 Galeria de Fotos
            </button>
          </div>
        </div>

        {/* Seção de Navegação */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            🧭 Como Chegar
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px' 
          }}>
            <button
              onClick={openGoogleMaps}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              📍 Abrir no Google Maps
            </button>
            <button
              onClick={openWaze}
              style={{
                backgroundColor: '#06b6d4',
                color: 'white',
                padding: '16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0891b2'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#06b6d4'}
            >
              🚗 Abrir no Waze
            </button>
          </div>
        </div>

        {/* Seção do Clima */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            ☁️ Clima Local
          </h2>
          
          {loading ? (
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <p>Carregando dados do clima...</p>
            </div>
          ) : error ? (
            <div style={{ 
              backgroundColor: '#fef2f2', 
              border: '1px solid #fecaca',
              borderRadius: '8px', 
              padding: '24px'
            }}>
              <p style={{ color: '#dc2626' }}>Erro ao carregar dados do clima: {error}</p>
              <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>
                Verifique sua conexão com a internet ou tente novamente mais tarde.
              </p>
            </div>
          ) : weather ? (
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '24px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img 
                    src={weather.current.weather_icons[0]} 
                    alt={weather.current.weather_descriptions[0]}
                    style={{ width: '64px', height: '64px' }}
                  />
                  <div>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '600', 
                      color: '#1f2937',
                      margin: '0 0 4px 0'
                    }}>
                      {weather.location.name}
                    </h3>
                    <p style={{ 
                      fontSize: '2rem', 
                      fontWeight: 'bold', 
                      color: '#2563eb',
                      margin: '0 0 4px 0'
                    }}>
                      {weather.current.temperature}°C
                    </p>
                    <p style={{ 
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {weather.current.weather_descriptions[0]}
                    </p>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '16px',
                  fontSize: '14px'
                }}>
                  <div>🌡️ Sensação: {weather.current.feelslike}°C</div>
                  <div>💧 Umidade: {weather.current.humidity}%</div>
                  <div>💨 Vento: {weather.current.wind_speed} km/h</div>
                  <div>👁️ Visibilidade: {weather.current.visibility} km</div>
                </div>
              </div>
              
              {weather.current.astro && (
                <div style={{ 
                  marginTop: '16px', 
                  paddingTop: '16px', 
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                    gap: '16px',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    <div>🌅 Nascer: {weather.current.astro.sunrise}</div>
                    <div>🌇 Pôr: {weather.current.astro.sunset}</div>
                    <div>🌙 Fase da Lua: {weather.current.astro.moon_phase}</div>
                    <div>🌕 Iluminação: {weather.current.astro.moon_illumination}%</div>
                  </div>
                </div>
              )}
              
              <div style={{ 
                marginTop: '16px', 
                fontSize: '12px', 
                color: '#9ca3af', 
                textAlign: 'center' 
              }}>
                Última atualização: {weather.location.localtime}
              </div>
            </div>
          ) : null}
        </div>

        {/* Seção das Câmeras */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center'
          }}>
            📹 Câmeras da Estrada
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '16px' 
          }}>
            {cameras.map((camera, index) => (
              <button
                key={index}
                onClick={() => openCamera(camera)}
                style={{
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb',
                  padding: '24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f9fafb';
                  e.target.style.borderColor = '#a855f7';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#e5e7eb';
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '12px' 
                }}>
                  <span style={{ fontSize: '32px' }}>📹</span>
                  <h3 style={{ 
                    fontWeight: '600', 
                    color: '#1f2937', 
                    textAlign: 'center',
                    margin: 0
                  }}>
                    {camera.name}
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280',
                    margin: 0
                  }}>
                    Clique para visualizar
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div style={{ 
            marginTop: '16px', 
            fontSize: '14px', 
            color: '#6b7280', 
            textAlign: 'center' 
          }}>
            * As câmeras são fornecidas pela EcoRodovias e mostram as condições atuais do tráfego
          </div>
        </div>

        {/* Rodapé com informações */}
        <footer style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px', 
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ color: '#6b7280' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Sítio Canaã - Estância Nova Campos</strong>
            </p>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Coordenadas:</strong> {sitioLocation.lat}, {sitioLocation.lng}
            </p>
            <p style={{ fontSize: '14px', margin: 0 }}>
              Dashboard criado para facilitar o acesso e monitoramento do Sítio Canaã
            </p>
          </div>
