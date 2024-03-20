import { request } from '@umijs/max';
import { Select } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { DefaultOptionType } from 'rc-select/lib/Select';
import * as React from 'react';
import { useEffect, useState } from 'react';

type Props = {
  url: string;
  defaultValue: string;
  size?: SizeType;
  onChange?: (value: string, row: any) => void;
  handleException?: (ex: any) => void;
  keyMap?: (row: any) => string;
  labelMap?: (row: any) => string;
  disabled?: boolean;
};

const LoadSelector: React.FC<Props> = ({
  url,
  size = 'large',
  defaultValue,
  onChange,
  handleException,
  keyMap = (row) => row.value,
  labelMap = (row) => row.label,
  disabled = false,
}) => {
  const [value, setValue] = useState<string | undefined>(defaultValue);
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [map, setMap] = useState<{
    [key: string]: any;
  }>({});

  function handleChange(value: string) {
    setValue(value);
    onChange?.(value, map[value]);
  }

  useEffect(() => {
    setLoading(true);
    request<API.ResultWrapper<API.SelectorData<any>>>(url)
      .then(({ data }) => {
        setValue(data.defaultValue);
        const rows = data.options;
        const _options: DefaultOptionType[] = [];
        const _map: {
          [key: string]: any;
        } = {};
        rows.forEach((row) => {
          const key = keyMap(row);
          const label = labelMap(row);
          _map[key] = row;
          _options.push({
            value: key,
            label: label,
          });
        });
        setOptions(_options);
        setMap(_map);
      })
      .catch((ex) => {
        handleException?.(ex);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Select
        size={size}
        value={value}
        options={options}
        loading={loading}
        onChange={handleChange}
        disabled={disabled}
      />
    </>
  );
};

export default LoadSelector;
