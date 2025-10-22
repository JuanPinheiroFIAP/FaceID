import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
  ScrollView, // Importado para a Dashboard
  Dimensions, // Importado para o exemplo da Dashboard
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';

// ⚠️ IMPORTANTE: Substitua pelo seu IP local
const API_URL = 'http://SEU_IP_AQUI/api';

const { width } = Dimensions.get('window'); 

const App = () => {
  const [screen, setScreen] = useState('menu');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [apiStatus, setApiStatus] = useState('checking'); 
  const [userData, setUserData] = useState(null); 

  const cameraRef = useRef(null);

  // Testar conexão com API ao iniciar
  React.useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await axios.get(`${API_URL.replace('/api', '')}/api/health`, {
          timeout: 5000
        });
        if (response.data.status === 'online') {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (error) {
        console.error('API não acessível:', error.message);
        setApiStatus('offline');
      }
    };
    checkAPI();
  }, []);

  const captureAndProcess = async (isRegister) => {
    if (!username.trim()) {
      Alert.alert('Atenção', 'Por favor, digite seu nome de usuário');
      return;
    }

    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permissão Negada', 'É necessário permitir o acesso à câmera');
        return;
      }
    }

    setLoading(true);
    setCameraActive(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula um tempo de captura

      if (!cameraRef.current) {
        throw new Error('Câmera não disponível');
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      const endpoint = isRegister ? '/register' : '/login';
      const response = await axios.post(`${API_URL}${endpoint}`, {
        username: username,
        image: `data:image/jpeg;base64,${photo.base64}`,
      }, {
        timeout: 30000,
      });

      setCameraActive(false);
      setLoading(false);

      if (response.data.success) {
        setUserData({
          username: response.data.username || username,
          similarity: response.data.similarity, // Se a API retornar a similaridade
        });

        if (isRegister) {
          // Para cadastro bem-sucedido, exibe tela de sucesso e depois um alerta
          setScreen('success');
          setTimeout(() => {
            Alert.alert(
              'Cadastro Realizado!',
              `Bem-vindo(a), ${response.data.username || username}!\n\nSeu reconhecimento facial foi cadastrado com sucesso.` +
              (response.data.message ? `\n\n${response.data.message}` : ''),
              [{ text: 'Continuar', onPress: () => {
                setScreen('menu');
                setUsername('');
                setUserData(null); // Limpa dados do usuário após o fluxo de cadastro
              }}]
            );
          }, 500);
        } else {
          // Para login bem-sucedido, navega diretamente para a Dashboard
          console.log('Login sucesso! Mudando para dashboard...');
          setScreen('dashboard');
        }
      } else {
        // Se a API retornar success: false, trata o erro
        console.log('API response success: false', response.data);
        Alert.alert('Erro', response.data.message || 'Ocorreu um erro ao processar sua solicitação.');
      }
    } catch (error) {
      setCameraActive(false);
      setLoading(false);

      console.error('Erro completo:', error);

      let message = 'Erro ao processar solicitação';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }

      Alert.alert('Erro', message);
    }
  };

  // Componente de Ondas (Decoração)
  const WaveDecoration = () => (
    <View style={styles.wavesContainer}>
      <View style={[styles.wave, styles.wave1]} />
      <View style={[styles.wave, styles.wave2]} />
      <View style={[styles.wave, styles.wave3]} />
    </View>
  );

  // NOVO: DASHBOARD - Tela de Investimentos
  if (screen === 'dashboard') {
    // Dados de mock para simular um aplicativo de investimentos
    const portfolioValue = 87543.29;
    const dailyChange = 2.34;
    const monthlyReturn = 8.7;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.gradientBackground}>
          <View style={styles.topGradient} />
        </View>

        <ScrollView style={styles.dashboardScroll} showsVerticalScrollIndicator={false}>
          {/* Header do Dashboard */}
          <View style={styles.dashboardHeader}>
            <View>
              <Text style={styles.welcomeText}>Bem-vindo de volta,</Text>
              <Text style={styles.userNameText}>{userData?.username || 'Investidor'}</Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                setScreen('menu');
                setUsername(''); // Limpa o username ao sair
                setUserData(null); // Limpa os dados do usuário ao sair
              }}>
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>

          {/* Card de Saldo Total */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Text style={styles.balanceLabel}>Saldo Total</Text>
              <View style={[styles.badge, dailyChange >= 0 ? styles.badgePositive : styles.badgeNegative]}>
                <Text style={styles.badgeText}>{dailyChange >= 0 ? '↑' : '↓'} {Math.abs(dailyChange)}%</Text>
              </View>
            </View>
            <Text style={styles.balanceValue}>
              R$ {portfolioValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.balanceSubtext}>
              {dailyChange >= 0 ? '+' : '-'}R$ {Math.abs(portfolioValue * dailyChange / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} hoje
            </Text>
          </View>

          {/* Gráfico Simplificado */}
          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Performance (30 dias)</Text>
            <View style={styles.chart}>
              {[65, 72, 68, 75, 82, 78, 85, 88, 92, 87].map((value, index) => (
                <View key={index} style={styles.chartBarContainer}>
                  <View style={[styles.chartBar, { height: `${value}%` }]} />
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <Text style={styles.chartLegendText}>Últimos 10 dias</Text>
              <Text style={[styles.chartLegendValue, monthlyReturn >= 0 && styles.positiveText]}>
                +{monthlyReturn}%
              </Text>
            </View>
          </View>

          {/* Cards de Investimentos */}
          <Text style={styles.sectionTitle}>Seus Investimentos</Text>

          <View style={styles.investmentCard}>
            <View style={styles.investmentIcon}>
              <Text style={styles.investmentEmoji}>📈</Text>
            </View>
            <View style={styles.investmentInfo}>
              <Text style={styles.investmentName}>Ações - IBOV</Text>
              <Text style={styles.investmentDetail}>12 ativos • Diversificado</Text>
            </View>
            <View style={styles.investmentValue}>
              <Text style={styles.investmentAmount}>R$ 42.350</Text>
              <Text style={[styles.investmentChange, styles.positiveText]}>+5.2%</Text>
            </View>
          </View>

          <View style={styles.investmentCard}>
            <View style={styles.investmentIcon}>
              <Text style={styles.investmentEmoji}>💰</Text>
            </View>
            <View style={styles.investmentInfo}>
              <Text style={styles.investmentName}>Renda Fixa</Text>
              <Text style={styles.investmentDetail}>CDB • LCI • Tesouro</Text>
            </View>
            <View style={styles.investmentValue}>
              <Text style={styles.investmentAmount}>R$ 28.120</Text>
              <Text style={[styles.investmentChange, styles.positiveText]}>+1.8%</Text>
            </View>
          </View>

          <View style={styles.investmentCard}>
            <View style={styles.investmentIcon}>
              <Text style={styles.investmentEmoji}>🏢</Text>
            </View>
            <View style={styles.investmentInfo}>
              <Text style={styles.investmentName}>Fundos Imobiliários</Text>
              <Text style={styles.investmentDetail}>8 FIIs • Renda mensal</Text>
            </View>
            <View style={styles.investmentValue}>
              <Text style={styles.investmentAmount}>R$ 17.073</Text>
              <Text style={[styles.investmentChange, styles.positiveText]}>+3.1%</Text>
            </View>
          </View>

          {/* Dicas Rápidas */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsIcon}>💡</Text>
              <Text style={styles.tipsTitle}>Dica do Dia</Text>
            </View>
            <Text style={styles.tipsText}>
              Diversifique seus investimentos em diferentes classes de ativos para reduzir riscos e aumentar oportunidades de retorno.
            </Text>
          </View>

          {/* Branding */}
          <View style={styles.brandingCard}>
            <Text style={styles.brandingIcon}>🌊</Text>
            <Text style={styles.brandingText}>
              Navegando com confiança no mar de investimentos
            </Text>
          </View>

          <View style={{ height: 40 }} /> {/* Espaçador no final da ScrollView */}
        </ScrollView>
      </View>
    );
  }

  // Tela de Menu Principal
  if (screen === 'menu') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        <View style={styles.gradientBackground}>
          <View style={styles.topGradient} />
          <View style={styles.bottomGradient} />
        </View>

        <WaveDecoration />

        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>🌊</Text>
            <Text style={styles.logoText}>THETIS</Text>
          </View>
          <Text style={styles.tagline}>
            Ajudando o investidor a navegar{'\n'}nesse mar de investimentos
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setScreen('register')}
            activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Criar Conta</Text>
            <Text style={styles.buttonSubtext}>Cadastre seu reconhecimento facial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setScreen('login')}
            activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>Acessar Conta</Text>
            <Text style={styles.secondaryButtonSubtext}>Entre com reconhecimento facial</Text>
          </TouchableOpacity>
        </View>

        {/* Indicador de Status da API */}
        <View style={styles.securityBadge}>
          <Text style={styles.securityIcon}>
            {apiStatus === 'online' ? '✓' : apiStatus === 'offline' ? '⚠️' : '⏳'}
          </Text>
          <Text style={styles.securityText}>
            {apiStatus === 'online'
              ? 'API conectada • Seguro'
              : apiStatus === 'offline'
              ? 'API offline • Verifique conexão'
              : 'Verificando conexão...'}
          </Text>
        </View>

        <Text style={styles.debugText}>API: {API_URL}</Text>
      </View>
    );
  }

  // Tela de Sucesso (após Cadastro)
  if (screen === 'success') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.gradientBackground}>
          <View style={styles.topGradient} />
          <View style={styles.bottomGradient} />
        </View>

        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Sucesso!</Text>
          <Text style={styles.successSubtitle}>
            Operação realizada com sucesso.
          </Text>
          <View style={styles.successWave}>
            <Text style={styles.successWaveIcon}>🌊</Text>
          </View>
        </View>
      </View>
    );
  }

  // Telas de Registro e Login (genéricas para o fluxo de câmera)
  const isRegister = screen === 'register';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.gradientBackground}>
        <View style={styles.topGradient} />
      </View>

      {/* Header */}
      <View style={styles.authHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setCameraActive(false);
            setScreen('menu');
            setUsername('');
          }}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <View style={styles.authHeaderContent}>
          <Text style={styles.authTitle}>
            {isRegister ? 'Criar Conta' : 'Acessar Conta'}
          </Text>
          <Text style={styles.authSubtitle}>
            {isRegister
              ? 'Configure seu reconhecimento facial'
              : 'Autentique-se com seu rosto'}
          </Text>
        </View>
      </View>

      <View style={styles.authContent}>
        {/* Input de Username */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nome de usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu usuário"
            placeholderTextColor="#94A3B8"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!loading && !cameraActive}
          />
        </View>

        {/* Área da Câmera */}
        {cameraActive && permission?.granted ? (
          <View style={styles.cameraWrapper}>
            <Text style={styles.cameraLabel}>Reconhecimento Facial</Text>
            <View style={styles.cameraContainer}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="front"
              >
                <View style={styles.cameraOverlay}>
                  <View style={styles.faceScanFrame} />
                  <Text style={styles.cameraText}>
                    {loading ? 'Processando...' : 'Posicione seu rosto no centro'}
                  </Text>
                </View>
              </CameraView>
            </View>
          </View>
        ) : (
          <View style={styles.cameraWrapper}>
            <Text style={styles.cameraLabel}>Reconhecimento Facial</Text>
            <View style={styles.placeholder}>
              <View style={styles.placeholderIcon}>
                <Text style={styles.placeholderIconText}>
                  {permission?.granted ? '📷' : '🔒'}
                </Text>
              </View>
              <Text style={styles.placeholderText}>
                {permission?.granted
                  ? 'Pronto para capturar'
                  : 'Permissão de câmera necessária'}
              </Text>
              {!permission?.granted && (
                <TouchableOpacity
                  style={styles.permButton}
                  onPress={requestPermission}>
                  <Text style={styles.permButtonText}>Permitir Câmera</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Botões de Ação */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0EA5E9" />
            <Text style={styles.loadingText}>Autenticando...</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.captureButton,
              !permission?.granted && styles.captureButtonDisabled
            ]}
            onPress={() => captureAndProcess(isRegister)}
            disabled={!permission?.granted}
            activeOpacity={0.8}>
            <Text style={styles.captureButtonText}>
              {isRegister ? '📸 Cadastrar Rosto' : '🔓 Autenticar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#0EA5E9',
    opacity: 0.15,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#0C4A6E',
    opacity: 0.1,
  },
  wavesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    overflow: 'hidden',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    backgroundColor: '#0EA5E9',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  wave1: {
    opacity: 0.1,
    bottom: 0,
  },
  wave2: {
    opacity: 0.05,
    bottom: 20,
  },
  wave3: {
    opacity: 0.03,
    bottom: 40,
  },

  // Menu Principal
  headerContainer: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 80,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#F0F9FF',
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: -50,
  },
  primaryButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: '#BFDBFE',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '400',
  },
  secondaryButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#334155',
  },
  secondaryButtonText: {
    color: '#F0F9FF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  secondaryButtonSubtext: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '400',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1E293B',
    borderRadius: 100,
    marginBottom: 40,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  debugText: {
    position: 'absolute',
    bottom: 60,
    fontSize: 9,
    color: '#475569',
    textAlign: 'center',
    alignSelf: 'center',
  },

  // Tela de Sucesso
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  successIcon: {
    fontSize: 60,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  successTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F0F9FF',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  successWave: {
    marginTop: 40,
  },
  successWaveIcon: {
    fontSize: 48,
    opacity: 0.5,
  },

  // Telas de Auth
  authHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  authHeaderContent: {
    paddingHorizontal: 10,
  },
  authTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F0F9FF',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 22,
  },
  authContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 8,
    paddingLeft: 4,
  },
  input: {
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#F0F9FF',
  },
  cameraWrapper: {
    marginBottom: 24,
  },
  cameraLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 12,
    paddingLeft: 4,
  },
  cameraContainer: {
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#334155',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceScanFrame: {
    width: 200,
    height: 200,
    borderWidth: 3,
    borderColor: '#0EA5E9',
    borderRadius: 100,
    borderStyle: 'dashed',
  },
  cameraText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  placeholder: {
    height: 400,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#0F172A',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderIconText: {
    fontSize: 40,
  },
  placeholderText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  permButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  captureButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  captureButtonDisabled: {
    backgroundColor: '#334155',
    shadowOpacity: 0,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '600',
  },

  // NOVO: ESTILOS PARA O DASHBOARD
  dashboardScroll: {
    flex: 1,
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F0F9FF',
  },
  logoutButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  logoutText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: '#0EA5E9',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#BFDBFE',
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgePositive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  badgeNegative: {
    backgroundColor: 'rgba(220,38,38,0.3)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  balanceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    color: '#BFDBFE',
  },
  chartCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F9FF',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chartBarContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  chartBar: {
    width: '100%',
    backgroundColor: '#0EA5E9',
    borderRadius: 4,
    minHeight: 20, // Garante que a barra seja visível mesmo com valor pequeno
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  chartLegendText: {
    fontSize: 12,
    color: '#64748B',
  },
  chartLegendValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F9FF',
  },
  positiveText: {
    color: '#22C55E', // Verde para valores positivos
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F0F9FF',
    marginHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  investmentCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  investmentIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  investmentEmoji: {
    fontSize: 24,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F9FF',
    marginBottom: 4,
  },
  investmentDetail: {
    fontSize: 12,
    color: '#64748B',
  },
  investmentValue: {
    alignItems: 'flex-end',
  },
  investmentAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F9FF',
    marginBottom: 4,
  },
  investmentChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F9FF',
  },
  tipsText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  brandingCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  brandingIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  brandingText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default App;

// Registrar o componente principal
import { registerRootComponent } from 'expo';
registerRootComponent(App);