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
  variant = 'neutral'
}) => {
  return (
    <>
      {title && (
        <>
          <h1 className="block mb-2 text-lg font-medium text-gray-900 text-center">{title}</h1>
          <hr className="mb-5" />
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {Array.from({ length: slots }).map((_, index) => (
          <div className="mb-2" key={`${variant}-${index}`}>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              {`${labelPrefix} #${index + 1}`}
            </label>
            <select
              value={values[index] || ''}
              onChange={(e) => onChange(index, e.target.value)}
              className={`text-sm rounded-lg block w-full p-2.5 shadow-sm-light border-2 placeholder-gray-400 ${variantClassMap[variant]}`}
            >
              <option value="">- - None - -</option>
              {options.map(opt => (
                <option key={opt.id || opt._id || opt.name} value={opt.name}>{opt.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </>
  );
};

export default ToppingGroup;
