/**
 * @file OptionFilterGroup.tsx
 * @description
 * Componente generico e riutilizzabile per renderizzare un gruppo di opzioni di filtro.
 * Può essere configurato per diversi stili di visualizzazione, come "pills" (per i tag)
 * o "checkbox" (per gli stati), rendendolo altamente flessibile.
 */

// Interfaccia per ogni singola opzione
export interface FilterOption {
  value: string;
  label: string;
}

// Interfaccia per le props del componente
interface OptionFilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedOptions: string[];
  onToggleOption: (optionValue: string) => void;
  displayMode: 'pill' | 'checkbox';
}

const OptionFilterGroup = ({ title, options, selectedOptions, onToggleOption, displayMode }: OptionFilterGroupProps) => {

  // --- Funzioni di rendering specifiche per displayMode ---

  const renderAsPills = () => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selectedOptions.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => onToggleOption(option.value)}
            className={`
              px-3 py-1 text-sm rounded-full transition-colors duration-200
              ${isSelected
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
            aria-pressed={isSelected}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );

  const renderAsCheckboxes = () => (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-3 cursor-pointer p-1 rounded-md hover:bg-gray-50">
          <input
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={selectedOptions.includes(option.value)}
            onChange={() => onToggleOption(option.value)}
          />
          <span className="text-gray-800">{option.label}</span>
        </label>
      ))}
    </div>
  );

  // --- Render principale del componente ---
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      {/* Seleziona la funzione di rendering corretta in base alla prop displayMode */}
      {displayMode === 'checkbox' ? renderAsCheckboxes() : renderAsPills()}
    </div>
  );
};

export default OptionFilterGroup;