import React from 'react';
import { Input, Button } from 'antd';

const FilterComponent = ({ onFilterChange }) => {
  const [filterValue, setFilterValue] = React.useState("");

  const handleInputChange = (e) => {
    setFilterValue(e.target.value);
  };

  const applyFilter = () => {
    onFilterChange(filterValue); // Передаем значение фильтра в родительский компонент
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <Input 
        placeholder="Введите значение фильтра" 
        value={filterValue} 
        onChange={handleInputChange} 
        style={{ width: 200, marginRight: 10 }}
      />
      <Button onClick={applyFilter}>Применить фильтр</Button>
    </div>
  );
};

export default FilterComponent;
