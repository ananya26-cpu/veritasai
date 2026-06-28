import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const RiskBadge = ({ risk }) => {
  const colors = {
    HIGH: "text-red-500 border-red-500",
    MEDIUM: "text-yellow-500 border-yellow-500",
    LOW: "text-green-400 border-green-400",
  };
  return (
    <span className={`border px-2 py-0.5 text-xs font-mono ${colors[risk] || "text-gray-400 border-gray-400"}`}>
      {risk}
    </span>
  );
};

export default function Home() {
  const [form, setForm] = useState({
    business_name: "",
    ein: "",
    income: "",
    card_type: "Business Gold",
  });
  const [result, setResult] = useState(null);
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analyze");

  const cardTypes = [
    "Business Gold",
    "Business Platinum",
    "Blue Business Cash",
    "Business Green",
  ];

  useEffect(() => {
    fetchRecords();
    fetchSummary();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API}/records`);
      setRecords(res.data);
    } catch (e) {}
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API}/summary`);
      setSummary(res.data);
    } catch (e) {}
  };

  const handleSubmit = async () => {
    if (!form.business_name || !form.ein || !form.income) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API}/analyze`, {
        ...form,
        income: parseFloat(form.income),
      });
      setResult(res.data);
      fetchRecords();
      fetchSummary();
    } catch (e) {
      setResult({ error: "Engine error. Check backend connection." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#E0E0E0] font-mono p-6">
      
      {/* Header */}
      <div className="border-b border-[#2A2A2A] pb-4 mb-6">
        <div className="text-[#00FF41] text-xl font-bold tracking-widest">
          ▸ VERITASAI
        </div>
        <div className="text-[#666666] text-xs mt-1">
          KYC Anomaly Detection & Compliance Monitoring System — v1.0.0
        </div>
      </div>

      {/* Summary Bar */}
      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "TOTAL RECORDS", value: summary.total_records, color: "text-[#E0E0E0]" },
            { label: "HIGH RISK", value: summary.high_risk, color: "text-red-500" },
            { label: "MEDIUM RISK", value: summary.medium_risk, color: "text-yellow-500" },
            { label: "FLAG RATE", value: `${summary.flag_rate}%`, color: "text-[#00FF41]" },
          ].map((s) => (
            <div key={s.label} className="border border-[#2A2A2A] bg-[#1A1A1A] p-4">
              <div className="text-[#666666] text-xs mb-1">{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-6 border-b border-[#2A2A2A] mb-6">
        {["analyze", "records"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm uppercase tracking-widest ${
              activeTab === tab
                ? "text-[#00FF41] border-b-2 border-[#00FF41]"
                : "text-[#666666]"
            }`}
          >
            {tab === "analyze" ? "▸ Analyze Record" : "▸ Audit Log"}
          </button>
        ))}
      </div>

      {/* Analyze Tab */}
      {activeTab === "analyze" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Form */}
          <div className="border border-[#2A2A2A] bg-[#1A1A1A] p-6">
            <div className="text-[#00FF41] text-xs tracking-widest mb-4">
              ▸ INPUT RECORD
            </div>
            <div className="space-y-4">
              {[
                { label: "BUSINESS NAME", key: "business_name", type: "text", placeholder: "e.g. Apex Solutions Ltd" },
                { label: "EIN (9 digits)", key: "ein", type: "text", placeholder: "e.g. 847362910" },
                { label: "ANNUAL INCOME (USD)", key: "income", type: "number", placeholder: "e.g. 250000" },
              ].map((field) => (
                <div key={field.key}>
                  <div className="text-[#666666] text-xs mb-1">{field.label}</div>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-[#E0E0E0] font-mono text-sm p-2 focus:outline-none focus:border-[#00FF41]"
                  />
                </div>
              ))}
              <div>
                <div className="text-[#666666] text-xs mb-1">CARD TYPE</div>
                <select
                  value={form.card_type}
                  onChange={(e) => setForm({ ...form, card_type: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] text-[#E0E0E0] font-mono text-sm p-2 focus:outline-none focus:border-[#00FF41]"
                >
                  {cardTypes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full border border-[#00FF41] text-[#00FF41] py-2 text-sm tracking-widest hover:bg-[#00FF41] hover:text-[#0D0D0D] transition-colors duration-200 disabled:opacity-40"
              >
                {loading ? "▸ ANALYZING..." : "▸ RUN COMPLIANCE CHECK"}
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="border border-[#2A2A2A] bg-[#1A1A1A] p-6">
            <div className="text-[#00FF41] text-xs tracking-widest mb-4">
              ▸ ANALYSIS OUTPUT
            </div>
            {!result && !loading && (
              <div className="text-[#666666] text-sm mt-8 text-center">
                No record analyzed yet.<br />Submit a record to run validation.
              </div>
            )}
            {loading && (
              <div className="text-[#00FF41] text-sm animate-pulse mt-8 text-center">
                ▸ Running KYC validation engine...
              </div>
            )}
            {result && !result.error && (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#666666]">BUSINESS</span>
                  <span className="text-[#E0E0E0]">{result.business_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#666666]">EIN</span>
                  <span className="text-[#E0E0E0]">{result.ein}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#666666]">RISK LEVEL</span>
                  <RiskBadge risk={result.risk_score} />
                </div>
                <div className="border-t border-[#2A2A2A] pt-4">
                  <div className="text-[#666666] text-xs mb-2">FLAGS DETECTED</div>
                  {result.flags.length === 0 ? (
                    <div className="text-[#00FF41] text-xs">✓ No flags detected</div>
                  ) : (
                    <div className="space-y-1">
                      {result.flags.map((f) => (
                        <div key={f} className="text-red-400 text-xs">▸ {f}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-t border-[#2A2A2A] pt-4">
                  <div className="text-[#666666] text-xs mb-2">AI EXPLANATION</div>
                  <div className="text-[#E0E0E0] text-xs leading-relaxed">
                    {result.explanation}
                  </div>
                </div>
              </div>
            )}
            {result?.error && (
              <div className="text-red-400 text-sm mt-4">{result.error}</div>
            )}
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === "records" && (
        <div className="border border-[#2A2A2A] bg-[#1A1A1A]">
          <div className="grid grid-cols-5 text-xs text-[#666666] p-3 border-b border-[#2A2A2A] tracking-widest">
            <span>BUSINESS</span>
            <span>EIN</span>
            <span>INCOME</span>
            <span>RISK</span>
            <span>FLAGS</span>
          </div>
          {records.length === 0 && (
            <div className="text-[#666666] text-sm p-6 text-center">
              No records in audit log yet.
            </div>
          )}
          {records.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-5 text-xs p-3 border-b border-[#2A2A2A] hover:bg-[#0D0D0D] transition-colors"
            >
              <span className="text-[#E0E0E0]">{r.business_name}</span>
              <span className="text-[#E0E0E0]">{r.ein}</span>
              <span className="text-[#E0E0E0]">${Number(r.income).toLocaleString()}</span>
              <RiskBadge risk={r.risk_score} />
              <span className="text-[#666666] truncate">{r.flags}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 border-t border-[#2A2A2A] pt-4 text-[#666666] text-xs">
        VERITASAI — Built by Ananya Gautam • Inspired by AmEx GPO Compliance Framework
      </div>
    </div>
  );
}
