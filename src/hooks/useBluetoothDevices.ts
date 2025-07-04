
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface BluetoothDevice {
  id: string;
  name: string;
  type: 'scale' | 'thermometer' | 'timer';
  connected: boolean;
  batteryLevel?: number;
  lastReading?: {
    value: number;
    unit: string;
    timestamp: number;
  };
}

export const useBluetoothDevices = () => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Simular busca por dispositivos Bluetooth
  const scanForDevices = useCallback(async () => {
    setIsScanning(true);
    
    try {
      // Simular delay de busca
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Dispositivos simulados
      const mockDevices: BluetoothDevice[] = [
        {
          id: 'scale-001',
          name: 'Acaia Pearl S',
          type: 'scale',
          connected: false,
          batteryLevel: 85
        },
        {
          id: 'thermo-001',
          name: 'Thermapen ONE',
          type: 'thermometer',
          connected: false,
          batteryLevel: 92
        },
        {
          id: 'timer-001',
          name: 'Coffee Timer Pro',
          type: 'timer',
          connected: false,
          batteryLevel: 67
        }
      ];
      
      setDevices(mockDevices);
      toast.success(`${mockDevices.length} dispositivos encontrados`);
    } catch (error) {
      console.error('Erro ao buscar dispositivos:', error);
      toast.error('Erro ao buscar dispositivos Bluetooth');
    } finally {
      setIsScanning(false);
    }
  }, []);

  const connectToDevice = useCallback(async (deviceId: string) => {
    setIsConnecting(true);
    
    try {
      // Simular processo de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, connected: true }
          : device
      ));
      
      const device = devices.find(d => d.id === deviceId);
      toast.success(`Conectado ao ${device?.name}`);
      
      // Simular recebimento de dados
      startDataSimulation(deviceId);
    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast.error('Erro ao conectar ao dispositivo');
    } finally {
      setIsConnecting(false);
    }
  }, [devices]);

  const disconnectDevice = useCallback((deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: false, lastReading: undefined }
        : device
    ));
    
    const device = devices.find(d => d.id === deviceId);
    toast.info(`Desconectado do ${device?.name}`);
  }, [devices]);

  // Simular recebimento de dados em tempo real
  const startDataSimulation = useCallback((deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    const interval = setInterval(() => {
      setDevices(prev => prev.map(d => {
        if (d.id === deviceId && d.connected) {
          let value = 0;
          let unit = '';
          
          switch (d.type) {
            case 'scale':
              value = Math.round((Math.random() * 30 + 15) * 10) / 10; // 15-45g
              unit = 'g';
              break;
            case 'thermometer':
              value = Math.round(Math.random() * 15 + 85); // 85-100°C
              unit = '°C';
              break;
            case 'timer':
              value = Math.floor(Math.random() * 300); // 0-300s
              unit = 's';
              break;
          }
          
          return {
            ...d,
            lastReading: {
              value,
              unit,
              timestamp: Date.now()
            }
          };
        }
        return d;
      }));
    }, 1000);

    // Limpar interval após 5 minutos (simulação)
    setTimeout(() => clearInterval(interval), 300000);
  }, [devices]);

  const getDevicesByType = useCallback((type: BluetoothDevice['type']) => {
    return devices.filter(device => device.type === type);
  }, [devices]);

  const getConnectedDevices = useCallback(() => {
    return devices.filter(device => device.connected);
  }, [devices]);

  return {
    devices,
    isScanning,
    isConnecting,
    scanForDevices,
    connectToDevice,
    disconnectDevice,
    getDevicesByType,
    getConnectedDevices
  };
};
