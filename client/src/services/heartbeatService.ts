import axios from 'axios';

interface HeartbeatResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  version: string;
}

class HeartbeatService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private apiBaseUrl: string;
  private lastCheckTime = 0;
  private readonly DEBOUNCE_TIME = 5000; // 5 seconds debounce

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  }

  start() {
    if (this.isRunning) {
      console.log('💓 Heartbeat service is already running');
      return;
    }

    // Clear any existing interval first
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('💓 Starting heartbeat service...');
    this.isRunning = true;

    // Initial heartbeat check
    this.checkHeartbeat();

    // Set up interval for every 2 minutes (120000ms)
    this.intervalId = setInterval(() => {
      this.checkHeartbeat();
    }, 120000); // 2 minutes
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('💓 Heartbeat service stopped');
  }

  private async checkHeartbeat() {
    const now = Date.now();
    
    // Debounce: prevent multiple calls within 5 seconds
    if (now - this.lastCheckTime < this.DEBOUNCE_TIME) {
      console.log('💓 Heartbeat debounced - too soon since last check');
      return false;
    }
    
    this.lastCheckTime = now;

    try {
      const response = await axios.get<HeartbeatResponse>(`${this.apiBaseUrl}/heartbeat`, {
        timeout: 5000 // 5 second timeout
      });

      const { status, timestamp, uptime, environment, memory, version } = response.data;
      
      console.log(`💓 Client Heartbeat: ${timestamp} - Server is ${status}`);
      console.log(`   Server uptime: ${Math.floor(uptime / 60)} minutes`);
      console.log(`   Environment: ${environment}`);
      console.log(`   Memory usage: ${Math.round(memory.heapUsed / 1024 / 1024)}MB`);
      console.log(`   Node version: ${version}`);

      return true;
    } catch (error) {
      console.error('💔 Heartbeat failed:', error);
      console.error('   Server may be down or unreachable');
      return false;
    }
  }

  // Manual heartbeat check
  async manualCheck(): Promise<boolean> {
    return await this.checkHeartbeat();
  }

  // Get service status
  getStatus() {
    return {
      isRunning: this.isRunning,
      hasInterval: this.intervalId !== null
    };
  }
}

// Create singleton instance with global flag
let heartbeatServiceInstance: HeartbeatService | null = null;

const getHeartbeatService = (): HeartbeatService => {
  if (!heartbeatServiceInstance) {
    heartbeatServiceInstance = new HeartbeatService();
  }
  return heartbeatServiceInstance;
};

export default getHeartbeatService();
