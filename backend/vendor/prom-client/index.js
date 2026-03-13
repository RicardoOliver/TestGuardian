class MetricBase {
  constructor({ name, help, type, registers }) {
    this.name = name;
    this.help = help;
    this.type = type;
    this.value = 0;

    if (registers) {
      for (const register of registers) {
        register.registerMetric(this);
      }
    }
  }

  set(value) {
    this.value = Number(value);
  }

  toPrometheus() {
    return `# HELP ${this.name} ${this.help}\n# TYPE ${this.name} ${this.type}\n${this.name} ${this.value}`;
  }
}

export class Gauge extends MetricBase {
  constructor(config) {
    super({ ...config, type: "gauge" });
  }
}

export class Registry {
  constructor() {
    this.contentType = "text/plain; version=0.0.4; charset=utf-8";
    this.metricsMap = new Map();
  }

  registerMetric(metric) {
    this.metricsMap.set(metric.name, metric);
  }

  async metrics() {
    return [...this.metricsMap.values()].map((metric) => metric.toPrometheus()).join("\n\n") + "\n";
  }
}

export function collectDefaultMetrics({ register }) {
  const cpuMetric = new Gauge({
    name: "process_cpu_seconds_total",
    help: "Total user and system CPU time spent in seconds.",
    registers: [register]
  });

  const memoryMetric = new Gauge({
    name: "process_resident_memory_bytes",
    help: "Resident memory size in bytes.",
    registers: [register]
  });

  const updateMetrics = () => {
    const usage = process.cpuUsage();
    cpuMetric.set((usage.user + usage.system) / 1e6);
    memoryMetric.set(process.memoryUsage().rss);
  };

  updateMetrics();
  setInterval(updateMetrics, 5000).unref();
}
