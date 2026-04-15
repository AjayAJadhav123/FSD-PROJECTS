function PasswordOptions({ options, onChange }) {
  return (
    <div className="options-grid">
      <label>
        Length: {options.length}
        <input
          type="range"
          min="4"
          max="64"
          value={options.length}
          onChange={(event) => onChange("length", Number(event.target.value))}
        />
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={options.includeUppercase}
          onChange={(event) => onChange("includeUppercase", event.target.checked)}
        />
        Include Uppercase
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={options.includeLowercase}
          onChange={(event) => onChange("includeLowercase", event.target.checked)}
        />
        Include Lowercase
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={options.includeNumbers}
          onChange={(event) => onChange("includeNumbers", event.target.checked)}
        />
        Include Numbers
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={options.includeSymbols}
          onChange={(event) => onChange("includeSymbols", event.target.checked)}
        />
        Include Symbols
      </label>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={options.saveToHistory}
          onChange={(event) => onChange("saveToHistory", event.target.checked)}
        />
        Save Generated Password
      </label>
    </div>
  );
}

export default PasswordOptions;
