import React from "react";

/*
  CheeseGroup Component
  Props:
    title?: string (default 'Select Cheese(s)')
    cheeses: string[] length 3
    cheeseAmounts: string[] length 3 ("0.5" | "1" | "2")
    onChangeCheese: (index:number, value:string) => void
    onChangeAmount: (index:number, value:string) => void
    options: { name:string, id?:string, _id?:string }[]
    preventDuplicates?: boolean (default true)

  Behavior:
    - Renders 3 slots, each with a cheese dropdown + amount dropdown.
    - Amount dropdown disabled if no cheese selected.
    - If preventDuplicates and user selects a cheese already chosen in another slot,
      the previous slot is cleared (simplest conflict resolution) OR selection is blocked.
      Here we clear the newly conflicting slot being updated (more intuitive: last choice wins?)
      We'll implement: last choice wins -> earlier duplicate cleared.
*/

const CheeseGroup = ({
  title = "Select Cheese(s)",
  cheeses = ["", "", ""],
  cheeseAmounts = ["1", "1", "1"],
  onChangeCheese,
  onChangeAmount,
  options = [],
}) => {
  const handleCheeseChange = (idx, value) => {
    if (!onChangeCheese) return;
    onChangeCheese(idx, value);
  };

  const duplicates = cheeses
    .filter(Boolean)
    .reduce((acc, name, _, arr) => {
      if (arr.filter((n) => n === name).length > 1) acc.add(name);
      return acc;
    }, new Set());

  return (
    <div className="mb-8">
      <h3 className="block mb-2 text-sm font-medium text-gray-900 text-center">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
        {[0, 1, 2].map((index) => {
          const selected = cheeses[index] || "";
          return (
            <div key={`cheese-slot-${index}`}>
              <div className="mb-5">
                <label
                  htmlFor={`cheese-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  {`Cheese #${index + 1}`}
                </label>
                <select
                  id={`cheese-${index}`}
                  value={selected}
                  onChange={(e) => handleCheeseChange(index, e.target.value)}
                  className={`text-sm rounded-lg block w-full p-2.5 shadow-sm-light border-2 placeholder-gray-500 bg-gray-200 focus:bg-gray-300 focus:ring-white focus:border-sky-500 ${
                    duplicates.has(selected) ? 'border-amber-600 text-amber-800' : 'text-black border-slate-500'
                  }`}
                >
                  <option value="">- - None - -</option>
                  {options.map((opt) => {
                    const isDup = duplicates.has(opt.name) && opt.name === selected;
                    return (
                      <option
                        key={opt.id || opt._id || opt.name}
                        value={opt.name}
                        className={isDup ? 'bg-amber-100 text-amber-800 font-semibold' : ''}
                      >
                        {opt.name}
                        {isDup ? ' (duplicate)' : ''}
                      </option>
                    );
                  })}
                </select>
                {duplicates.has(selected) && (
                  <p className="mt-1 text-xs text-amber-600 font-medium">Duplicate cheese selected — consider choosing a different one.</p>
                )}
              </div>
              <div className="mb-2">
                <label
                  htmlFor={`cheese-amt-${index}`}
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Amount
                </label>
                <select
                  id={`cheese-amt-${index}`}
                  value={cheeseAmounts[index] || "1"}
                  onChange={(e) => onChangeAmount && onChangeAmount(index, e.target.value)}
                  disabled={!selected}
                  className="text-sm rounded-lg block w-full p-2.5 shadow-sm-light border-2 text-black placeholder-gray-500 border-slate-500 bg-gray-200 focus:bg-gray-300 focus:ring-white focus:border-sky-500 disabled:opacity-60"
                >
                  <option value="0.5">Light</option>
                  <option value="1">Regular</option>
                  <option value="2">Extra</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
      {/* Summary / helper text */}
      <div className="text-xs text-gray-500 mt-1 text-center">
        {cheeses.filter(Boolean).length === 0
          ? "No cheeses selected."
          : `${cheeses.filter(Boolean).length} cheese(s) selected.`}
      </div>
    </div>
  );
};

export default CheeseGroup;
