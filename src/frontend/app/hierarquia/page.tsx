"use client";

import resultData from "../../public/result.json";
import { Network, Hospital, MapPin, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

interface HierarchyNode {
  name: string;
  type: string;
  confirmed?: number;
  status?: string;
  children?: HierarchyNode[];
}

const NodeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'sede': return <Network size={18} className="text-blue-600" />;
    case 'region': return <MapPin size={18} className="text-red-600" />;
    case 'ubs': return <Hospital size={18} className="text-green-600" />;
    default: return <ChevronRight size={14} className="text-gray-400" />;
  }
};

const TreeNode = ({ node, depth = 0 }: { node: HierarchyNode, depth?: number }) => {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-4">
      <div 
        className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer hover:bg-gray-50 ${depth === 0 ? 'bg-gray-50 font-bold' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />
        ) : <div className="w-4" />}
        
        <NodeIcon type={node.type} />
        
        <div className="flex-1 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-900">{node.name}</span>
            <span className="ml-2 text-[10px] uppercase font-bold text-gray-400 tracking-widest">{node.type}</span>
          </div>
          {node.confirmed !== undefined && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-700">{node.confirmed} casos</span>
              {node.status && (
                <span className={`w-2 h-2 rounded-full ${node.status === 'critical' ? 'bg-red-500' : 'bg-green-500'}`} />
              )}
            </div>
          )}
        </div>
      </div>
      
      {hasChildren && isOpen && (
        <div className="mt-1 border-l border-gray-100 ml-2">
          {node.children?.map((child, idx) => (
            <TreeNode key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function HierarquiaUBS() {
  const { ubs_hierarchy } = resultData;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Hierarquia de Saúde</h1>
        <p className="text-sm text-gray-500 mt-1">Estrutura organizacional das unidades de saúde e abrangência</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="mb-6 flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4">
          <span>Estrutura de Rede</span>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 rounded" /> Sede</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 rounded" /> Regional</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 rounded" /> UBS</div>
          </div>
        </div>
        
        <div className="space-y-2">
          {ubs_hierarchy.map((root, idx) => (
            <TreeNode key={idx} node={root} />
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Total de Unidades</h3>
          <p className="text-2xl font-semibold text-gray-900">54 UBS</p>
          <p className="text-xs text-gray-500 mt-1">Distribuídas em 6 regiões</p>
        </div>
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Abrangência</h3>
          <p className="text-2xl font-semibold text-gray-900">100%</p>
          <p className="text-xs text-gray-500 mt-1">Cobertura total do município</p>
        </div>
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Sincronização</h3>
          <p className="text-2xl font-semibold text-gray-900">Ativa</p>
          <p className="text-xs text-gray-500 mt-1">Dados atualizados via CNES</p>
        </div>
      </div>
    </div>
  );
}
