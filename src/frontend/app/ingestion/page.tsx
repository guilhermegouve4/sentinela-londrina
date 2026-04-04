"use client";

import { useState } from "react";
import { Upload, CheckCircle, FileText, AlertTriangle, RefreshCw } from "lucide-react";

type Etapa = "idle" | "reading" | "processing" | "done" | "error";

interface LogLine { tipo: "info" | "ok" | "err"; msg: string; }

export default function Ingestao() {
  const [etapa, setEtapa]     = useState<Etapa>("idle");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [log, setLog]         = useState<LogLine[]>([]);
  const [drag, setDrag]       = useState(false);

  const addLog = (tipo: LogLine["tipo"], msg: string) =>
    setLog(prev => [...prev, { tipo, msg }]);

  const simularProcessamento = async (file: File) => {
    setEtapa("reading");
    setLog([]);
    addLog("info", `Arquivo recebido: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    await new Promise(r => setTimeout(r, 800));
    addLog("info", "Validando formato CSV...");
    await new Promise(r => setTimeout(r, 600));

    // Lê o arquivo para validar de verdade
    const text = await file.text();
    const linhas = text.trim().split("\n");
    const header = linhas[0];

    if (!header.includes("region") || !header.includes("confirmed")) {
      addLog("err", "Formato inválido — o CSV não segue o contrato esperado.");
      setEtapa("error");
      return;
    }

    addLog("ok",   `Header válido: ${linhas.length - 1} registros encontrados`);
    setEtapa("processing");
    await new Promise(r => setTimeout(r, 700));
    addLog("info", "Verificando regiões...");
    await new Promise(r => setTimeout(r, 500));

    const regioes = new Set(linhas.slice(1).filter(Boolean).map(l => l.split(",")[0]));
    regioes.forEach(r => addLog("ok", `Região "${r}" identificada`));
    await new Promise(r => setTimeout(r, 400));
    addLog("ok",   "CSV validado com sucesso");
    addLog("info", "Para processar: mova o arquivo para data/processed/ e rode o backend C++");
    setEtapa("done");
  };

  const onFile = (file: File) => {
    if (!file.name.endsWith(".csv")) {
      addLog("err", "Apenas arquivos .csv são aceitos");
      return;
    }
    setArquivo(file);
    simularProcessamento(file);
  };

  const ETAPA_COR: Record<Etapa, string> = {
    idle:       "bg-gray-50 border-gray-200",
    reading:    "bg-blue-50 border-blue-200",
    processing: "bg-yellow-50 border-yellow-200",
    done:       "bg-green-50 border-green-200",
    error:      "bg-red-50 border-red-200",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Ingestão de Dados</h1>
        <p className="text-sm text-gray-500 mt-1">Valide e processe novos boletins em formato CSV</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Drop zone */}
        <div>
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
            className={`rounded-xl border-2 border-dashed p-12 text-center transition-colors cursor-pointer ${
              drag ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-red-300 hover:bg-red-50"
            }`}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload size={36} className="text-gray-400 mx-auto mb-4" />
            <p className="font-medium text-gray-700 mb-1">Arraste um CSV aqui</p>
            <p className="text-sm text-gray-500">ou clique para selecionar</p>
            <p className="text-xs text-gray-400 mt-3">Formato: contrato-csv.md</p>
            <input
              id="file-input"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }}
            />
          </div>

          {/* Status */}
          {etapa !== "idle" && (
            <div className={`mt-4 rounded-xl border p-4 ${ETAPA_COR[etapa]}`}>
              <div className="flex items-center gap-2 mb-1">
                {etapa === "done"  && <CheckCircle size={16} className="text-green-600" />}
                {etapa === "error" && <AlertTriangle size={16} className="text-red-600" />}
                {(etapa === "reading" || etapa === "processing") && <RefreshCw size={16} className="text-blue-600 animate-spin" />}
                <span className="text-sm font-medium text-gray-700">
                  {{ idle: "", reading: "Lendo arquivo...", processing: "Processando...", done: "Concluído", error: "Erro" }[etapa]}
                </span>
              </div>
              {arquivo && <p className="text-xs text-gray-500 flex items-center gap-1"><FileText size={12} />{arquivo.name}</p>}
            </div>
          )}

          {/* Instrução do pipeline */}
          <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">Pipeline de Ingestão</p>
            {[
              { n: "1", txt: "Prefeitura publica boletim PDF" },
              { n: "2", txt: "download_bulletins.py baixa o PDF" },
              { n: "3", txt: "ai_scan.py processa com Gemini → CSV" },
              { n: "4", txt: "Backend C++ lê CSV → result.json" },
              { n: "5", txt: "Dashboard atualizado automaticamente" },
            ].map(({ n, txt }) => (
              <div key={n} className="flex items-center gap-3 py-1.5">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{n}</span>
                <span className="text-xs text-gray-600">{txt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Log */}
        <div>
          <div className="bg-gray-900 rounded-xl p-4 h-full min-h-64 font-mono">
            <p className="text-xs text-gray-500 mb-3">▶ Log de processamento</p>
            {log.length === 0 ? (
              <p className="text-xs text-gray-600">Aguardando arquivo...</p>
            ) : log.map((l, i) => (
              <div key={i} className="flex items-start gap-2 mb-1">
                <span className={`text-xs ${l.tipo === "ok" ? "text-green-400" : l.tipo === "err" ? "text-red-400" : "text-blue-400"}`}>
                  {l.tipo === "ok" ? "✔" : l.tipo === "err" ? "✘" : "→"}
                </span>
                <span className={`text-xs ${l.tipo === "ok" ? "text-green-300" : l.tipo === "err" ? "text-red-300" : "text-gray-300"}`}>
                  {l.msg}
                </span>
              </div>
            ))}
          </div>

          {etapa === "done" && (
            <button
              onClick={() => { setEtapa("idle"); setLog([]); setArquivo(null); }}
              className="mt-3 w-full py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Processar outro arquivo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}