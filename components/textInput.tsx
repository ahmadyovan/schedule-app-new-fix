import { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string; // Label untuk input
  id: string; // ID unik untuk input
}

const TextInput = ({ label, id, ...props }: TextInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
};

export default TextInput;
