import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Select } from 'antd';

const { Option } = Select;

/**
 * IndustrialSearchBar - A search bar with industrial theme
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Current search value
 * @param {function} props.onSearch - Callback when search is triggered
 * @param {function} props.onChange - Callback when input changes
 * @param {Array} props.filters - Array of filter configurations [{key, placeholder, options, value, onChange}]
 * @param {string} props.className - Additional CSS classes
 */
export default function IndustrialSearchBar({
    placeholder = "Search...",
    value = '',
    onSearch,
    onChange,
    filters = [],
    className = ''
}) {
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        onChange?.(newValue);
    };

    const handleClear = () => {
        setLocalValue('');
        onChange?.('');
        onSearch?.('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch?.(localValue);
        }
    };

    const handleSearchClick = () => {
        onSearch?.(localValue);
    };

    return (
        <div className={`px-6 py-4 bg-neutral-50 border-b-2 border-neutral-200 ${className}`}>
            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Input */}
                <div className="flex-1 w-full relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Search className="w-5 h-5 text-neutral-400" />
                    </div>
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={localValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="w-full h-12 pl-12 pr-24 bg-white border-2 border-neutral-300 focus:border-black focus:ring-0 font-medium text-black placeholder-neutral-400 transition-colors outline-none"
                    />
                    {localValue && (
                        <button
                            onClick={handleClear}
                            className="absolute inset-y-0 right-14 flex items-center pr-2 text-neutral-400 hover:text-black transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={handleSearchClick}
                        className="absolute inset-y-0 right-0 flex items-center px-5 bg-yellow-400 text-black font-bold uppercase text-sm border-l-2 border-black hover:bg-yellow-500 transition-colors"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>

                {/* Filters */}
                {filters.map((filter) => (
                    <Select
                        key={filter.key}
                        placeholder={filter.placeholder}
                        allowClear={filter.allowClear !== false}
                        value={filter.value}
                        onChange={filter.onChange}
                        size="large"
                        style={{ width: filter.width || 180 }}
                        className="industrial-select"
                    >
                        {filter.options?.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                ))}
            </div>

            {/* Industrial Select Styles */}
            <style>{`
        .industrial-select .ant-select-selector {
          border: 2px solid #000 !important;
          height: 48px !important;
          border-radius: 0 !important;
        }
        .industrial-select .ant-select-selection-item,
        .industrial-select .ant-select-selection-placeholder {
          line-height: 44px !important;
          font-weight: 500 !important;
        }
        .industrial-select:hover .ant-select-selector {
          border-color: #000 !important;
        }
        .industrial-select.ant-select-focused .ant-select-selector {
          border-color: #000 !important;
          box-shadow: none !important;
        }
      `}</style>
        </div>
    );
}
