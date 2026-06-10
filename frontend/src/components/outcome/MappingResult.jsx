import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileDown } from 'lucide-react';
import COPOMatrixResult from './COPOMatrixResult';
import ROUTES from '../../constants/routes';
import { normalizeBloomsLabel, getBloomsColor } from "../../utils/bloomsUtils";

export default function MappingResult({ mapping }) {
  const navigate = useNavigate();
  if (!mapping || !mapping.generatedOutcomes) return null;

  const { courseOutcomes, copoMatrix } = mapping.generatedOutcomes;

  // Determine max PO for the matrix header based on the data
  let maxPo = 0;
  if (copoMatrix) {
    copoMatrix.forEach(row => {
      row.poMappings.forEach(pm => {
        if (pm.poNumber > maxPo) maxPo = pm.poNumber;
      });
    });
  }

  // Fallback to 12 if somehow missing
  const posCount = maxPo > 0 ? maxPo : 12;

  return (
    <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-start justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{mapping.courseName}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {mapping.courseCode} · Source: {mapping.sourceType?.replace('_', ' ')}
          </p>
        </div>
        <button 
          onClick={() => navigate(ROUTES.EXPORT, { state: { selectedSource: 'mapping_' + mapping._id } })}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
        >
          <FileDown className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {courseOutcomes && courseOutcomes.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Course Outcomes</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-16 text-center">CO</th>
                  <th className="px-4 py-3">Statement</th>
                  <th className="px-4 py-3 w-40">Bloom's Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courseOutcomes.map((co) => (
                  <tr key={`co-${co.coNumber}`} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-center font-bold text-gray-700">CO{co.coNumber}</td>
                    <td className="px-4 py-3 text-gray-600 leading-relaxed">{co.statement}</td>
                    <td className="px-4 py-3">
                      {(() => {
                        const label = normalizeBloomsLabel(co.bloomsLevel);
                        const colors = getBloomsColor(label);
                        return (
                          <span style={{
                            background  : colors.bg,
                            color       : colors.text,
                            border      : `1px solid ${colors.border}`,
                            fontSize    : "11px",
                            padding     : "2px 8px",
                            borderRadius: "9999px",
                            fontWeight  : 500
                          }}>
                            {label}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {copoMatrix && copoMatrix.length > 0 && (
        <COPOMatrixResult 
          matrix={copoMatrix} 
          posCount={posCount} 
          saving={false}
          loading={false}
          onSave={() => {}} // Disabled in view mode
        />
      )}
    </div>
  );
}
