const logger = require('../config/logger');

class AlertService {
  constructor() {
    this.thresholds = {
      responseTime: 2000, // ms
      errorRate: 10,      // errores por minuto
      memoryUsage: 80     // porcentaje
    };
    this.errorCount = 0;
    this.lastReset = Date.now();
  }

  checkResponseTime(duration, endpoint) {
    if (duration > this.thresholds.responseTime) {
      this.alert('LENTITUD', `Endpoint ${endpoint} tardó ${duration}ms (umbral: ${this.thresholds.responseTime}ms)`);
    }
  }

  trackError(error) {
    this.errorCount++;
    const elapsed = (Date.now() - this.lastReset) / 60000;
    if (elapsed >= 1) {
      if (this.errorCount > this.thresholds.errorRate) {
        this.alert('ERRORES', `${this.errorCount} errores en el último minuto (umbral: ${this.thresholds.errorRate})`);
      }
      this.errorCount = 0;
      this.lastReset = Date.now();
    }
  }

  alert(type, message) {
    const alert = {
      type,
      message,
      timestamp: new Date().toISOString(),
      severity: type === 'ERRORES' ? 'critical' : 'warning'
    };
    
    logger.warn('ALERTA: ' + type + ' - ' + message);
    
    // Aquí se integraría con Slack, Email, SMS, etc.
    console.log('🚨 ALERTA:', JSON.stringify(alert, null, 2));
  }
}

module.exports = new AlertService();
