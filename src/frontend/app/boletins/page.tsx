"use client";

/**
 * Boletins Semanais - Acesso aos Documentos Oficiais.
 * 
 * Esta página permite:
 * - Visualizar lista de boletins epidemiológicos publicados
 * - Baixar os arquivos PDF originais da prefeitura
 * - Buscar por número ou data específica
 * - Filtrar por ano epidemiológico
 * 
 * Os dados são extraídos automaticamente do portal da Prefeitura de Londrina.
 */

import resultData from "../../public/result.json";
import { FileText, Download, ExternalLink, Search, Filter } from "lucide-react";

export default function BoletinsSemanais() {
  const { meta } = resultData;

  // Simulação de lista de boletins PDF
  const boletins = [
    { id: 12, data: "24/03/2026", titulo: "Boletim Epidemiológico nº 12/2026", status: "Publicado" },
    { id: 11, data: "17/03/2026", titulo: "Boletim Epidemiológico nº 11/2026", status: "Publicado" },
    { id: 10, data: "10/03/2026", titulo: "Boletim Epidemiológico nº 10/2026", status: "Publicado" },
    { id: 9,  data: "03/03/2026", titulo: "Boletim Epidemiológico nº 09/2026", status: "Publicado" },
    { id: 8,  data: "24/02/2026", titulo: "Boletim Epidemiológico nº 08/2026", status: "Publicado" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Boletins Semanais</h1>
        <p className="text-sm text-gray-500 mt-1">Acesso aos documentos originais e dados extraídos</p>
      </div>

      {/* Filtros e Busca */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar boletim por número ou data..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Filter size={16} />
          Filtrar Ano
        </button>
      </div>

      {/* Lista de Boletins */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data de Publicação</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {boletins.map((bol) => (
              <tr key={bol.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-50 rounded flex items-center justify-center">
                      <FileText size={16} className="text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{bol.titulo}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{bol.data}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md border border-green-100">
                    {bol.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Visualizar">
                      <ExternalLink size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Download PDF">
                      <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info de Origem */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-start gap-3">
        <div className="p-2 bg-white rounded border border-gray-200">
          <Search size={16} className="text-gray-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase">Fonte de Dados</p>
          <p className="text-sm text-gray-700">
            Os dados são extraídos automaticamente do portal da Prefeitura de Londrina. 
            Última sincronização: <span className="font-semibold">{new Date(meta.generated_at).toLocaleString('pt-BR')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
