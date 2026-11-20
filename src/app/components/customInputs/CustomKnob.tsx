import { ParameterObject } from "@/(utils)/synthParameterUtils";
import { ChangeEvent, InputHTMLAttributes } from "react";

interface CustomKnobProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  title?: string;
  parameterTarget: ParameterObject;
  value?: number;
  onChange: (type: ParameterObject, value: number) => void;
}

export default function CustomKnob({ 
  title, 
  parameterTarget,
  value = 0.1,
  onChange,
  ...rest 
}: CustomKnobProps) {

  const numericValue = typeof value === 'number' ? value : Number(parameterTarget.defaultValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onChange(parameterTarget, val);
  };

  const displayValue = parameterTarget.unit === "%" 
    ? Math.round(numericValue * 100) 
    : numericValue.toFixed(parameterTarget.step < 0.01 ? 3 : 2);

  return (
    <div className="flex flex-col gap-2 bg-synth-card p-2">
      {title && (
        <div className="flex justify-between text-xs text-slate-300">
          <span>{title}</span>
          <span>{displayValue}{parameterTarget.unit}</span>
        </div>
      )}
      <input
        type="range"
        min={parameterTarget.minValue}
        max={parameterTarget.maxValue}
        step={parameterTarget.step}
        value={numericValue}
        onChange={handleChange}
        {...rest}
        className="accent-slate-400 cursor-pointer w-full"
      />
    </div>
  );
}