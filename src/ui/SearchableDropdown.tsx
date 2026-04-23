import { useEffect, useMemo, useRef, useState } from "react";

type SearchableDropdownProps = {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    name?: string;
    id?: string;
};

export function SearchableDropdown({
                                       options,
                                       value,
                                       onChange,
                                       placeholder = "Kezdj el gépelni...",
                                       required = false,
                                       name,
                                       id,
                                   }: SearchableDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const filteredOptions = useMemo(() => {
        const search = value.trim().toLowerCase();

        if (!search) {
            return options.slice(0, 8);
        }

        return options
            .filter((option) => option.toLowerCase().includes(search))
            .slice(0, 8);
    }, [options, value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleSelect(option: string) {
        onChange(option);
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <input
                id={id}
                name={name}
                type="text"
                value={value}
                required={required}
                placeholder={placeholder}
                onChange={(e) => {
                    onChange(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                className="h-11 w-full rounded-md border border-[#d7dbe2] bg-white px-3 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#6d5dfc] focus:ring-2 focus:ring-[#6d5dfc]/20"
            />

            {isOpen && filteredOptions.length > 0 && (
                <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#d7dbe2] bg-white shadow-lg">
                    {filteredOptions.map((option) => (
                        <button
                            id={"btn-option"}
                            key={option}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className="block w-full px-3 py-2 text-left text-[14px] text-[#1f1f1f] hover:bg-[#f5f3ff]"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}