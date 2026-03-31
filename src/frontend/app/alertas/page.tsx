"use client";

import resultData from "../../public/result.json";
import { AlertTriangle, Bell, Clock, MapPin, ShieldAlert } from "lucide-react";

export default function CentralAlertas() {
  const { alerts } = resultData;

  const getLevelStyle = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-700";
      case "alert":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      default:
        return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  const getIconColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-600";
      case "alert":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Central de Alertas</h1>
          <p className="text-sm text-gray-500 mt-1">Notificações críticas disparadas pelo sistema de monitoramento</p>
        </div>
        <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-100">
          <Bell size={18} className="text-red-600 animate-pulse" />
          <span className="text-sm font-bold text-red-700">{alerts.length} Alertas Ativos</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((alert, idx) => (
          <div 
            key={idx} 
            className={`p-6 rounded-xl border transition-all hover:shadow-md ${getLevelStyle(alert.level)}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full bg-white/50 border border-white/20 ${getIconColor(alert.level)}`}>
                {alert.level === 'critical' ? <ShieldAlert size={24} /> : <AlertTriangle size={24} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/40">
                      {alert.level === 'critical' ? 'Crítico' : 'Alerta'}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold">
                      <MapPin size={14} />
                      Região {alert.region}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs opacity-70">
                    <Clock size={12} />
                    {new Date(alert.triggered_at).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-lg font-medium leading-tight mb-3">{alert.message}</p>
                <div className="flex gap-3">
                  <button className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-white/40 hover:bg-white/60 rounded-lg transition-colors">
                    Ver Detalhes
                  </button>
                  <button className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-white/40 hover:bg-white/60 rounded-lg transition-colors">
                    Marcar como Lido
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Histórico de Alertas Recentes */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Protocolos de Ação</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-red-700 uppercase mb-3">Nível Crítico</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">• Mobilização imediata de agentes de endemias</li>
              <li className="flex items-center gap-2">• Aplicação de fumacê na região afetada</li>
              <li className="flex items-center gap-2">• Notificação prioritária à Secretaria de Saúde</li>
            </ul>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-yellow-700 uppercase mb-3">Nível de Alerta</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">• Intensificação de visitas domiciliares</li>
              <li className="flex items-center gap-2">• Campanhas educativas locais</li>
              <li className="flex items-center gap-2">• Monitoramento diário de novos casos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
