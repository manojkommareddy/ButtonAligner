import { useState } from 'react';
import InputField from '../InputField';

export default function InputFieldExample() {
  const [textValue, setTextValue] = useState('Sample text');
  const [numberValue, setNumberValue] = useState(1875);
  const [checkboxValue, setCheckboxValue] = useState(true);
  const [textareaValue, setTextareaValue] = useState('Sample notes...');

  return (
    <div className="p-4 space-y-4 max-w-md">
      <InputField
        label="Text Input"
        value={textValue}
        onChange={(value: string | number | boolean) => setTextValue(value as string)}
        placeholder="Enter text"
        helpText="This is a text input field"
      />
      <InputField
        label="Number Input ($)"
        value={numberValue}
        onChange={(value: string | number | boolean) => setNumberValue(value as number)}
        type="number"
        step="0.01"
        helpText="Enter a monetary value"
      />
      <InputField
        label="Use Terminal Value"
        value={checkboxValue}
        onChange={(value: string | number | boolean) => setCheckboxValue(value as boolean)}
        type="checkbox"
        helpText="Check to include terminal value in NPV calculation"
      />
      <InputField
        label="Notes"
        value={textareaValue}
        onChange={(value: string | number | boolean) => setTextareaValue(value as string)}
        type="textarea"
        placeholder="Add your notes..."
        helpText="Additional comments or assumptions"
      />
    </div>
  );
}