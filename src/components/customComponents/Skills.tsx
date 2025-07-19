import chroma from 'chroma-js';
import Select from 'react-select';
import type { StylesConfig } from 'react-select';
import React from 'react';

export interface options {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export const options: readonly options[] = [
  { value: 'html', label: 'html', color: '#0088D9', isFixed: true },
  { value: 'css', label: 'css', color: '#0052CC' },
  { value: 'java script', label: 'java script', color: '#5243AA' },
  {
    value: 'type script',
    label: 'type script',
    color: '#FF5630',
    isFixed: true,
  },
  { value: 'Docker', label: 'docker', color: '#FF8B00' },
  { value: 'kubernates', label: 'kubernates', color: '#FFC400' },
  { value: 'Node', label: 'Node', color: '#36B37E' },
  { value: 'Express', label: 'Express', color: '#00875A' },
  { value: 'Koajs', label: 'Koajs', color: '#253858' },
  { value: 'Gcp', label: 'Gcp', color: '#666666' },
];

const styles: StylesConfig<options, true> = {
  control: (styles) => ({
    ...styles,
    backgroundColor: 'white',
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : undefined,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : data.color,
      cursor: isDisabled ? 'not-allowed' : 'default',
      ':active': {
        ...styles[':active'],
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : color.alpha(0.3).css(),
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
};

const dark: any = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'hsl(220, 35%, 3%)',
    color: '#fff',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'hsl(220, 35%, 3%)',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#fff',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#555' : 'hsl(220, 35%, 3%)',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#444',
    },
  }),
};

interface SkillsProps {
  value: readonly options[];
  onChange: (selected: readonly options[]) => void;
  handleSkillsDropdownOpen?: () => void;
  handleSkillsDropdownClose?: () => void;
}

const Skills: React.FC<SkillsProps> = ({
  value,
  onChange,
  handleSkillsDropdownOpen,
  handleSkillsDropdownClose,
}) => {
  return (
    <Select
      closeMenuOnSelect={false}
      placeholder="Select Skills"
      defaultValue={value}
      isMulti
      options={options}
      styles={styles}
      onChange={onChange}
      onMenuOpen={handleSkillsDropdownOpen}
      onMenuClose={handleSkillsDropdownClose}
    />
  );
};

export default Skills;
