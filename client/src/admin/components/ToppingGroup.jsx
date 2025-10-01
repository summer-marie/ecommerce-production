import React from 'react';

/*
  ToppingGroup Component
  Props:
    title: Section header text (e.g., "Meat Options")
    labelPrefix: Base label (e.g., "Select Meat" / "Update Veggie")
    values: array of current selected names (strings)
    onChange: (index, newValue) => void
    options: ingredient option objects with at least { name, id? }
    slots: number of dropdowns to render
    variant: 'meat' | 'veggie' | 'neutral' determines styling
    required?: boolean (currently not enforced per slot)
    preventDuplicates?: boolean (default true) - prevents duplicate selections

  Styling matches existing patterns:
    meat: red theme
    veggie: green theme (emerald variant used in update form; kept consistent for simplicity)
    neutral: gray theme (BaseDropdown style)
*/

const variantClassMap = {
  meat: 'border-red-950 bg-red-800 focus:bg-red-950 focus:ring-red-500 focus:border-red-500 text-white',
  veggie: 'border-green-950 bg-green-800 focus:bg-green-950 focus:ring-green-500 focus:border-green-500 text-white',
  neutral: 'text-black placeholder-gray-500 border-slate-500 bg-gray-200 focus:bg-gray-300 focus:ring-white focus:border-sky-500'
};

export const ToppingGroup = ({
  title,
  labelPrefix,
  values = [],
  onChange,
  options = [],
  slots = 0,
  variant = 'neutral',
  preventDuplicates = true
}) => {
  // Detect duplicates when preventDuplicates is enabled
  const duplicates = preventDuplicates ? values
    .filter(Boolean)
    .reduce((acc, name, _, arr) => {
      if (arr.filter((n) => n === name).length > 1) acc.add(name);
      return acc;
    }, new Set()) : new Set();

  return (
    <>
      {title && (
        <>
          <h1 className="block mb-2 text-lg font-medium text-gray-900 text-center">{title}</h1>
          <hr className="mb-5" />
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {Array.from({ length: slots }).map((_, index) => {
          const selected = values[index] || '';
          const isDuplicate = duplicates.has(selected);
          
          return (
            <div className="mb-2" key={`${variant}-${index}`}>
              <label className="block mb-2 text-sm font-medium text-gray-900">
                {`${labelPrefix} #${index + 1}`}
              </label>
              <select
                value={selected}
                onChange={(e) => onChange(index, e.target.value)}
                className={`text-sm rounded-lg block w-full p-2.5 shadow-sm-light border-2 placeholder-gray-400 ${
                  isDuplicate && preventDuplicates 
                    ? 'border-amber-600 text-amber-800 bg-amber-50' 
                    : variantClassMap[variant]
                }`}
              >
                <option value="">- - None - -</option>
                {options.map(opt => {
                  const optIsDup = duplicates.has(opt.name) && opt.name === selected;
                  return (
                    <option
                      key={opt.id || opt._id || opt.name}
                      value={opt.name}
                      className={optIsDup ? 'bg-amber-100 text-amber-800 font-semibold' : ''}
                    >
                      {opt.name}
                      {optIsDup ? ' (duplicate)' : ''}
                    </option>
                  );
                })}
              </select>
              {isDuplicate && preventDuplicates && (
                <p className="mt-1 text-xs text-amber-600 font-medium">
                  Duplicate {variant === 'meat' ? 'meat' : variant === 'veggie' ? 'veggie' : 'item'} selected — consider choosing a different one.
                </p>
              )}
            </div>
          );
        })}
      </div>
      {/* Summary / helper text */}
      <div className="text-xs text-gray-500 mt-1 text-center mb-6">
        {values.filter(Boolean).length === 0
          ? `No ${variant === 'meat' ? 'meats' : variant === 'veggie' ? 'veggies' : 'items'} selected.`
          : `${values.filter(Boolean).length} ${variant === 'meat' ? 'meat(s)' : variant === 'veggie' ? 'veggie(s)' : 'item(s)'} selected.`}
      </div>
    </>
  );
};

export default ToppingGroup;
